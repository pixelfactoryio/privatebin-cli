import tap from 'tap';
import { decode } from 'bs58';

import { pasteObj, pasteDataBuf, key, spec } from './mock';
import { encrypt, decrypt, uint8ArrayToString, concatUint8Array, stringToUint8Array } from '../src/lib/crypto';

tap.test('Should encrypt/decrypt (compression: zlib)', async (t) => {
  const { ct, adata } = await encrypt(pasteDataBuf, decode(key), spec);
  const decrypted = await decrypt(ct, decode(key), adata);

  t.equal(JSON.stringify(pasteObj), uint8ArrayToString(decrypted));
  t.end();
});

tap.test('Should encrypt/decrypt (compression: none)', async (t) => {
  spec.compression = 'none';
  const { ct, adata } = await encrypt(pasteDataBuf, decode(key), spec);
  const decrypted = await decrypt(ct, decode(key), adata);

  t.equal(JSON.stringify(pasteObj), uint8ArrayToString(decrypted));
  t.end();
});

tap.test('Should encrypt/decrypt (compression: zlib, password: qwerty)', async (t) => {
  const passPhrase = concatUint8Array(decode(key), stringToUint8Array('qwerty'));
  const { ct, adata } = await encrypt(pasteDataBuf, passPhrase, spec);
  const decrypted = await decrypt(ct, passPhrase, adata);

  t.equal(JSON.stringify(pasteObj), uint8ArrayToString(decrypted));
  t.end();
});
