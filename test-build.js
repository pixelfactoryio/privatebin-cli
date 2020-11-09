/* eslint-disable @typescript-eslint/no-var-requires */
const tap = require('tap');
const privatebin = require('./dist/lib');

tap.test('Build should be successful', async (t) => {
  const client = new privatebin.PrivatebinClient();
  t.ok(client instanceof privatebin.PrivatebinClient);
  t.ok(privatebin.encryptText instanceof Function);
  t.ok(privatebin.decryptText instanceof Function);
});
