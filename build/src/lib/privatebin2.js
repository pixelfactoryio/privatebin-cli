"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaste = exports.getSpec = exports.getBufferPaste = void 0;
const pako_1 = __importDefault(require("pako"));
const axios_1 = __importDefault(require("axios"));
const bs58_1 = require("bs58");
const cryptotools_1 = require("./cryptotools");
function getBufferPaste(data, compression) {
    const buf = Buffer.from(JSON.stringify({ paste: data }), 'utf8');
    if (compression === 'zlib') {
        return pako_1.default.deflateRaw(new Uint8Array(buf));
    }
    else {
        return buf;
    }
}
exports.getBufferPaste = getBufferPaste;
function getSpec(burnafterreading, opendiscussion, compression) {
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
exports.getSpec = getSpec;
function getPaste(pasteUrl) {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'JSONHttpRequest',
        },
    };
    return axios_1.default.get(pasteUrl, config);
}
exports.getPaste = getPaste;
function sendPaste(paste, host, expire) {
    const { ct, adata } = paste;
    const postData = {
        v: 2,
        ct,
        adata,
        meta: { expire },
    };
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
            'X-Requested-With': 'JSONHttpRequest',
        },
    };
    return axios_1.default.post(host, postData, config);
}
function parseResponse(response, host, randomKey) {
    return {
        status: response.data.status,
        id: response.data.id,
        url: `${host}${response.data.url}#${bs58_1.encode(randomKey)}`,
        deleteUrl: `${host}/?pasteid=${response.data.id}&deletetoken=${response.data.deletetoken}`,
    };
}
async function privatebin(host, pasteData, randomKey, options) {
    const { burnafterreading, opendiscussion, expire, compression } = options;
    const spec = getSpec(burnafterreading, opendiscussion, compression);
    // let compressed: string;
    // if (compression == 'zlib') {
    const compressed = pako_1.default.deflateRaw(new Uint8Array(pasteData));
    // }
    const chiperPaste = cryptotools_1.encrypt(Buffer.from(compressed), randomKey, spec);
    console.log(chiperPaste);
    const response = await sendPaste(chiperPaste, host, expire);
    return parseResponse(response, host, randomKey);
}
exports.default = privatebin;
//# sourceMappingURL=privatebin2.js.map