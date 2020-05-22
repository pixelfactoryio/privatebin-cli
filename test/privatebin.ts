import tap from 'tap';
import nock from 'nock';
import {
  host, spec, response, pasteDataBuf, randomKey, opts, paste,
} from './mock';

import privatebin from '../src/lib/privatebin';

tap.test('Should return a paste object', async (t) => {
  nock(host).post('/').reply(200, response);
  t.same(paste, await privatebin(host, pasteDataBuf, randomKey, opts));
});


tap.test('Should reject', async (t) => {
  nock(host).post('/').reply(404, {});
  t.rejects(privatebin(host, pasteDataBuf, randomKey, opts));
});
