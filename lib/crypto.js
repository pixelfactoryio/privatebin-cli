const crypto = require('crypto');
const zlib = require('zlib');

const deriveKey = (masterkey, salt, iter) => {
    // derive key: 32 byte key length
    return crypto.pbkdf2Sync(masterkey, salt, iter, 32, 'sha256');
}

const encrypt = (text, masterkey) => {

    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(8);
    const key = deriveKey(masterkey, salt, 100000);

    // AES 256 GCM Mode
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const adata = [
        [iv.toString('base64'), salt.toString('base64'), 100000, 256, 128, 'aes', 'gcm', 'none'], 'plaintext', 0, 0
    ];

    cipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));
    // cipher.setAAD(Buffer.from(adata));

    // encrypt the given text
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    // extract the auth tag
    const tag = cipher.getAuthTag();

    // console.log("+-------------------------");
    // console.log("salt=", salt.toString('base64'));
    // console.log("iv=", iv.toString('base64'));
    // console.log("tag=",tag.toString('base64'));
    // console.log("encrypted=", encrypted.toString('base64'));

    return {
        data: Buffer.concat([salt, iv, tag, encrypted]).toString('base64'),
        adata
    }
}

const decrypt = (data, adata, masterkey) => {
    // base64 decoding
    var bData = Buffer.from(data, 'base64');

    // convert data to buffers
    let salt = bData.slice(0, 8);
    let iv = bData.slice(8, 24);
    let tag = bData.slice(24, 40);
    let encrypted = bData.slice(40);

    // console.log("+-------------------------");
    // console.log("salt=", salt.toString('base64'));
    // console.log("iv=", iv.toString('base64'));
    // console.log("tag=",tag.toString('base64'));
    // console.log("encrypted=", encrypted.toString('base64'));

    // derive key using; 32 byte key length
    const key = deriveKey(masterkey, salt, 100000);

    // AES 256 GCM Mode
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));
    // decipher.setAAD(Buffer.from(adata));

    // decrypt the given encrypted
    const decrypted = decipher.update(encrypted, 'binary', 'utf8') + decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};