import tap from 'tap';
import crypto from 'crypto';

import { encrypt, decrypt } from '../lib/crypto';

const pasteData = JSON.stringify({
  paste: 'Hello World !',
});

const spec = {
  algo: 'aes',
  mode: 'gcm',
  ks: 256,
  ts: 128,
  iter: 100000,
  compression: 'none',
  burnafterreading: 0,
  opendiscussion: 0,
};

const randomKey = crypto.randomBytes(32);

const { data, adata } = encrypt(Buffer.from(pasteData, 'utf8'), randomKey, spec);

const decrypted = decrypt(data, randomKey, adata);

tap.equal(pasteData, decrypted);
