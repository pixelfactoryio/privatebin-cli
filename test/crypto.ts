import tap from 'tap';

import {
  pasteObj, pasteDataBuf, randomKey, spec,
} from './mock';

import { encrypt, decrypt } from '../src/lib/cryptotools';

const { data, adata } = encrypt(pasteDataBuf, randomKey, spec);
const decrypted = decrypt(data, randomKey, adata);

tap.test('Should encrypt/decrypt', (t) => {
  t.same(pasteObj, decrypted);
  t.end();
});
