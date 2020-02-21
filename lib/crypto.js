import crypto from 'crypto';

function deriveKey(masterkey, salt, iter) {
    // derive key: 32 byte key length
    return crypto.pbkdf2Sync(masterkey, salt, iter, 32, 'sha256');
}

function encrypt(message, masterkey, spec) {
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(8);
    const key = deriveKey(masterkey, salt, spec.iter);
    const adata = [
        [iv.toString('base64'), salt.toString('base64'), spec.iter, spec.ks, spec.ts, spec.algo, spec.mode, spec.compression], 'plaintext', 1, 0
    ];
    // AES 256 GCM Mode
    const cipher = crypto.createCipheriv(`${spec.algo}-${spec.ks}-${spec.mode}`, key, iv, {
        authTagLength: Math.floor(spec.ts * 0.125)
    });
    cipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));

    return {
        data: Buffer.concat([cipher.update(message), cipher.final(), cipher.getAuthTag()]).toString('base64'),
        adata
    }
}

function decrypt(data, masterkey, adata) {
    const bData = Buffer.from(data, 'base64');
    const spec = adata[0];
    const iv = Buffer.from(spec[0], 'base64');
    const salt = Buffer.from(spec[1], 'base64');
    const iter = spec[2];
    const ts = Math.floor(spec[4] * 0.125); // Tag size
    const ms = bData.length - ts; // Message size
    const key = deriveKey(masterkey, salt, iter);

    // convert data to buffers
    const encrypted = bData.slice(0, ms);
    const tag = bData.slice(ms, bData.length);

    // AES 256 GCM Mode
    const decipher = crypto.createDecipheriv(`${spec.algo}-${spec.ks}-${spec.mode}`, key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));

    // decrypt the given encrypted
    const decrypted = decipher.update(encrypted, 'binary', 'utf8') + decipher.final('utf8');

    return decrypted;
}

export {
    encrypt,
    decrypt
};
