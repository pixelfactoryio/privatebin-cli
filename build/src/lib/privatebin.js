"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBufferPaste = void 0;
const axios_1 = __importDefault(require("axios"));
const bs58_1 = require("bs58");
const cryptotools_1 = require("./cryptotools");
function getBufferPaste(data) {
    return Buffer.from(JSON.stringify({
        paste: data,
    }), 'utf8');
}
exports.getBufferPaste = getBufferPaste;
function getSpec(burnafterreading, opendiscussion) {
    return {
        algo: 'aes',
        mode: 'gcm',
        ks: 256,
        ts: 128,
        iter: 100000,
        compression: 'none',
        burnafterreading,
        opendiscussion,
    };
}
function sendPaste(paste, host, expire) {
    const { data, adata } = paste;
    const postData = {
        v: 2,
        adata,
        meta: { expire },
        ct: data,
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
        id: response.data.id,
        url: `${host}${response.data.url}#${bs58_1.encode(randomKey)}`,
        deleteUrl: `${host}?pasteid=${response.data.id}&deletetoken=${response.data.deletetoken}`,
    };
}
async function privatebin(host, pasteData, randomKey, options) {
    const { burnafterreading, opendiscussion, expire } = options;
    const spec = getSpec(burnafterreading, opendiscussion);
    const response = await sendPaste(cryptotools_1.encrypt(pasteData, randomKey, spec), host, expire);
    return parseResponse(response, host, randomKey);
}
exports.default = privatebin;
//# sourceMappingURL=privatebin.js.map