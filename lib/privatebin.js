const axios = require('axios');
const Base58 = require('bs58');
const crypto = require('crypto');

const { encrypt, decrypt } = require('./crypto');

const privatebin = (host, text, password, options) => {
    const randomKey = crypto.randomBytes(32)
    const randomInt = Base58.encode(randomKey);

    const { data, adata } = encrypt(text, randomKey);
    
    // plainText = decrypt(data, adata, randomKey);
    // console.log(plainText)
    // console.log(randomKey.toString('base64'))
    // console.log(randomInt)
    // console.log(Base58.decode(randomInt).toString('base64'))

    const postData = {
        v: 2,
        adata: adata,
        meta: {
            expire: options.expire,
        },
        ct: data
    };
    // console.log(JSON.stringify(postData))
    // process.exit(1)

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
