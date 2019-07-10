const sjcl = require('sjcl');
const Base64 = require('js-base64').Base64;
const RawDeflate = require('./rawdeflate-0.5').RawDeflate;

const compress = (message) => {
    return Base64.toBase64(RawDeflate.deflate(Base64.utob(message)));
}

const cipher = (password, message) => {
    const randomKey = sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 0), 0);

    const options = {
        mode: 'gcm',
        ks: 256,
        ts: 128
    };
    
    if ((password || '').trim().length === 0) {
        cipherData = sjcl.encrypt(randomKey, compress(message), options);
    } else {
        cipherData = sjcl.encrypt(randomKey + sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(password)), compress(message), options);
    }
    
    return {
        cipherData,
        randomKey
    }
}

module.exports = { cipher, compress };
