const axios = require('axios');
const querystring = require('querystring');

const { cipher } = require('./crypto');

const privatebin = (host, text, password, options) => {
    const { cipherData, randomKey } = cipher(password, text);
    const postData = querystring.stringify({
        data: cipherData,
        expire: options.expire,
        formatter: 'plaintext',
        burnafterreading: options.burnafterreading ? 1 : 0,
        opendiscussion: options.opendiscussion ? 1 : 0
    });

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'X-Requested-With': 'JSONHttpRequest'
        }
    };
    
    return axios.post(host, postData, config)
        .then(
            (res) => {
                const id = res.data.id
                const url = `${host}${res.data.url}#${randomKey}`
                const deleteUrl = `${host}?pasteid=${res.data.id}&deletetoken=${res.data.deletetoken}`
                return { id, url, deleteUrl }
            }
        )
        .catch((error) => {
            return error;
        });    
}

module.exports = { privatebin };