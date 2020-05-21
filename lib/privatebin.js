import axios from 'axios';
import Base58 from 'bs58';

import { encrypt } from './crypto';

export default async function privatebin(host, pasteData, randomKey, options) {
  const { burnafterreading, opendiscussion, expire } = options;
  const spec = {
    algo: 'aes',
    mode: 'gcm',
    ks: 256,
    ts: 128,
    iter: 100000,
    compression: 'none',
    burnafterreading,
    opendiscussion,
  };

  const { data, adata } = encrypt(pasteData, randomKey, spec);

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

  const res = await axios.post(host, postData, config);
  const { id } = res.data;
  const url = `${host}${res.data.url}#${Base58.encode(randomKey)}`;
  const deleteUrl = `${host}?pasteid=${res.data.id}&deletetoken=${res.data.deletetoken}`;
  return { id, url, deleteUrl };
}
