import tap from 'tap';
import { decode } from 'bs58';

import { pasteObj, pasteDataBuf, key, spec } from './mock';

import { encrypt, decrypt } from '../src/lib/cryptotools';

const { ct, adata } = encrypt(pasteDataBuf, decode(key), spec);
const decrypted = decrypt(ct, decode(key), adata);

tap.test('Should encrypt/decrypt (compression: zlib)', (t) => {
  t.equal(JSON.stringify(pasteObj), decrypted.toString());
  t.end();
});

tap.test('Should encrypt/decrypt (compression: none)', (t) => {
  spec.compression = 'none';
  const { ct, adata } = encrypt(pasteDataBuf, decode(key), spec);
  const decrypted = decrypt(ct, decode(key), adata);
  t.equal(JSON.stringify(pasteObj), decrypted.toString());
  t.end();
});
