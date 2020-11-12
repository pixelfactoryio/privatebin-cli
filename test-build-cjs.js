/* eslint-disable @typescript-eslint/no-var-requires */
const tap = require('tap');
const privatebin = require('./dist/main');

tap.test('CommonJS require should be successful', async (t) => {
  const client = new privatebin.PrivatebinClient();
  t.ok(client instanceof privatebin.PrivatebinClient);
  t.ok(privatebin.encryptText instanceof Function);
  t.ok(privatebin.decryptText instanceof Function);
});
