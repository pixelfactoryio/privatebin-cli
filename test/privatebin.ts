import tap from 'tap';
import nock from 'nock';
import { decode } from 'bs58';

import { Privatebin } from '../src/lib';
import { host, config, postPasteResponse, getPasteResponse, key, opts, msg, output, pasteObj } from './mock';

const privatebin = new Privatebin(config);

tap.test('Should return a paste Response', async (t) => {
  nock(host).post('/').reply(200, postPasteResponse);
  t.same(postPasteResponse, await privatebin.encryptPaste(msg, decode(key), opts));
  t.end();
});

tap.test('Should return a paste Output', async (t) => {
  nock(host).get(`/?pasteid=${output.pasteId}`).reply(200, getPasteResponse);
  t.same(pasteObj, await privatebin.decryptPaste(output.pasteId, decode(key)));
  t.end();
});

tap.test('Should reject', async (t) => {
  nock(host).post('/').reply(404, {});
  t.rejects(privatebin.encryptPaste(msg, decode(key), opts));
});
