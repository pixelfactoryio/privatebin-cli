import tap from 'tap';
import { PrivatebinClient, encryptText, decryptText } from './dist/module/index.mjs';

tap.test('ESM import should be successful', async (t) => {
  const client = new PrivatebinClient();
  t.ok(client instanceof PrivatebinClient);
  t.ok(encryptText instanceof Function);
  t.ok(decryptText instanceof Function);
});
