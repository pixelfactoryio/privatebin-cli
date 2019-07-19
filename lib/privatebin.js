const axios = require('axios');
const Base58 = require('bs58');
const crypto = require('crypto');

const { encrypt } = require('./crypto');

const privatebin = (host, pasteData, password, options) => {
    const randomKey = crypto.randomBytes(32)
    const spec = {
        algo: 'aes',
        mode: 'gcm',
        ks: 256,
        ts: 128,
        iter: 100000,
        compression: 'none'
    }
    const { data, adata } = encrypt(pasteData, randomKey, spec);
    
    const postData = {
        v: 2,
        adata: adata,
        meta: {
            expire: options.expire,
        },
        ct: data
    };

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
            'X-Requested-With': 'JSONHttpRequest'
        }
    };
    
    return axios.post(host, postData, config)
        .then(
            (res) => {
                const id = res.data.id
                const url = `${host}${res.data.url}#${Base58.encode(randomKey)}`
                const deleteUrl = `${host}?pasteid=${res.data.id}&deletetoken=${res.data.deletetoken}`
                return { id, url, deleteUrl }
            }
        )
        .catch((error) => {
            return error;
        });    
}

module.exports = { privatebin };
