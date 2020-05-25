import tap from 'tap';

import { pasteObj, pasteDataBuf, randomKey, spec } from './mock';

import { encrypt, decrypt } from '../src/lib/cryptotools';

const { ct, adata } = encrypt(pasteDataBuf, randomKey, spec);
const decrypted = decrypt(ct, randomKey, adata);

tap.test('Should encrypt/decrypt', (t) => {
  t.same(pasteObj, decrypted);
  t.end();
});
