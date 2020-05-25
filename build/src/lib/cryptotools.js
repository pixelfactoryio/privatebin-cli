"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.deriveKey = void 0;
const crypto_1 = require("crypto");
function deriveKey(masterkey, salt, iter) {
    // derive key: 32 byte key length
    return crypto_1.pbkdf2Sync(masterkey, salt, iter, 32, 'sha256');
}
exports.deriveKey = deriveKey;
function encrypt(message, masterkey, spec) {
    const iv = crypto_1.randomBytes(16);
    const salt = crypto_1.randomBytes(8);
    const key = deriveKey(masterkey, salt, spec.iter);
    const adata = [
        [
            iv.toString('base64'),
            salt.toString('base64'),
            spec.iter,
            spec.ks,
            spec.ts,
            spec.algo,
            spec.mode,
            spec.compression,
        ],
        'plaintext',
        spec.opendiscussion,
        spec.burnafterreading,
    ];
    const algorithm = `${spec.algo}-${spec.ks}-${spec.mode}`;
    // AES 256 GCM Mode
    const cipher = crypto_1.createCipheriv(algorithm, key, iv, {
        authTagLength: Math.floor(spec.ts * 0.125),
    });
    cipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));
    const pasteData = {
        ct: Buffer.concat([cipher.update(message), cipher.final(), cipher.getAuthTag()]).toString('base64'),
        adata,
    };
    return pasteData;
}
exports.encrypt = encrypt;
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
    const decipher = crypto_1.createDecipheriv(`${spec[5]}-${spec[3]}-${spec[6]}`, key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));
    // decrypt the given encrypted
    const decrypted = decipher.update(encrypted, 'binary', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted);
}
exports.decrypt = decrypt;
//# sourceMappingURL=cryptotools.js.map