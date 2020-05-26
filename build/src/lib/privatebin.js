"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Privatebin = void 0;
const pako_1 = __importDefault(require("pako"));
const bs58_1 = require("bs58");
const api_1 = require("./api");
const cryptotools_1 = require("../lib/cryptotools");
class Privatebin extends api_1.Api {
    getBufferPaste(data, compression) {
        const buf = Buffer.from(JSON.stringify({ paste: data }), 'utf8');
        if (compression === 'zlib') {
            return pako_1.default.deflateRaw(new Uint8Array(buf));
        }
        else {
            return buf;
        }
    }
    getSpec(burnafterreading, opendiscussion, compression) {
        return {
            algo: 'aes',
            mode: 'gcm',
            ks: 256,
            ts: 128,
            iter: 100000,
            compression,
            burnafterreading,
            opendiscussion,
        };
    }
    getPaste(id) {
        return this.get(`/?pasteid=${id}`).then(this.success);
    }
    postPaste(pasteData, options) {
        const { expire } = options;
        const { ct, adata } = pasteData;
        return this.post('/', {
            v: 2,
            ct,
            adata,
            meta: { expire },
        }).then(this.success);
    }
    async decryptPaste(id, randomKey) {
        const response = await this.getPaste(id);
        const paste = cryptotools_1.decrypt(response.ct, bs58_1.decode(randomKey), response.adata);
        if (response.adata[0][7] === 'zlib') {
            return JSON.parse(pako_1.default.inflateRaw(paste, { to: 'string' }));
        }
        return JSON.parse(paste.toString());
    }
    async encryptPaste(message, key, options) {
        const { burnafterreading, opendiscussion, compression } = options;
        const spec = this.getSpec(burnafterreading, opendiscussion, compression);
        const pasteData = this.getBufferPaste(message, compression);
        const chiperPaste = cryptotools_1.encrypt(Buffer.from(pasteData), key, spec);
        return this.postPaste(chiperPaste, options);
    }
}
exports.Privatebin = Privatebin;
//# sourceMappingURL=privatebin.js.map