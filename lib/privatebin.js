import axios from 'axios';
import Base58 from 'bs58';
import crypto from 'crypto';

import { encrypt } from './crypto';

async function privatebin(host, pasteData, password, options) {
    const { burnafterreading, opendiscussion, expire } = options
    const randomKey = crypto.randomBytes(32)
    const spec = {
        algo: 'aes',
        mode: 'gcm',
        ks: 256,
        ts: 128,
        iter: 100000,
        compression: 'none',
        burnafterreading,
        opendiscussion,
    }
    const { data, adata } = encrypt(pasteData, randomKey, spec);
    
    const postData = {
        v: 2,
        adata: adata,
        meta: { expire },
        ct: data
    };

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(JSON.stringify(postData)),
            'X-Requested-With': 'JSONHttpRequest'
        }
    };
    
    try {
        const res = await axios.post(host, postData, config);
        const id = res.data.id;
        const url = `${host}${res.data.url}#${Base58.encode(randomKey)}`;
        const deleteUrl = `${host}?pasteid=${res.data.id}&deletetoken=${res.data.deletetoken}`;
        return { id, url, deleteUrl };
    }
    catch (error) {
        return error;
    }    
}

export { privatebin };
