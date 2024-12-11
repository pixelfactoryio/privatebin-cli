import tap from 'tap';
import nock from 'nock';
import bs58 from 'bs58';

import { PrivatebinClient } from '../src/lib';
import {
  host,
  postPasteResponse,
  getPasteResponseZlib,
  getPasteResponse,
  key,
  opts,
  msg,
  output,
  pasteObj,
} from './mock';

const privatebin = new PrivatebinClient();

tap.test('Should return a paste Response (compression: zlib)', async (t) => {
  nock(host).post('/').reply(200, postPasteResponse);
  const response = await privatebin.sendText(msg, bs58.decode(key), opts);
  t.same(postPasteResponse, response);
  t.end();
});

tap.test('Should return a paste Response (compression: none)', async (t) => {
  nock(host).post('/').reply(200, postPasteResponse);
  opts.compression = 'none';
  const response = await privatebin.sendText(msg, bs58.decode(key), opts);
  t.same(postPasteResponse, response);
  t.end();
});

tap.test('Should return a paste Output (compression: zlib)', async (t) => {
  nock(host).get(`/?pasteid=${output.pasteId}`).reply(200, getPasteResponseZlib);
  const response = await privatebin.getText(output.pasteId, bs58.decode(key));
  t.same(pasteObj, response);
  t.end();
});

tap.test('Should return a paste Output (compression: none)', async (t) => {
  nock(host).get(`/?pasteid=${output.pasteId}`).reply(200, getPasteResponse);
  const response = await privatebin.getText(output.pasteId, bs58.decode(key));
  t.same(pasteObj, response);
  t.end();
});

tap.test('Should reject', async (t) => {
  nock(host).post('/').reply(404, {});
  t.rejects(privatebin.sendText(msg, bs58.decode(key), opts));
});

tap.test('Should reject', async (t) => {
  nock(host).get('/').reply(404, {});
  t.rejects(privatebin.getText('123', bs58.decode(key)));
});

tap.test('Should reject', async (t) => {
  nock(host).get('/?pasteid=123').reply(200, { status: 1, message: 'Invalid paste ID.' });
  t.rejects(privatebin.getText('123', bs58.decode(key)));
});
