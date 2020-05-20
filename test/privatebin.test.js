import tap from 'tap';
import nock from 'nock';
import Base58 from 'bs58';
import crypto from 'crypto';

import privatebin from '../lib/privatebin';

const response = {
  status: 0,
  id: 'c90e56c1f4ce9500',
  url: '/?c90e56c1f4ce9500',
  deletetoken: '389e551bc2bbe83d88e72987bcdd434e38298d40a8cd67d57748684749b8156d',
};

const host = 'https://privatebin.dev.local';

const main = async () => {
  nock(host).post('/').reply(200, response);

  const pasteData = Buffer.from(JSON.stringify({
    paste: 'Hello World !',
  }), 'utf8');

  const randomKey = crypto.randomBytes(32);
  const paste = await privatebin(host, pasteData, randomKey, {
    expire: '5min',
    burnafterreading: 0,
    opendiscussion: 0,
  });

  const { id } = response;
  const url = `${host}${response.url}#${Base58.encode(randomKey)}`;
  const deleteUrl = `${host}?pasteid=${response.id}&deletetoken=${response.deletetoken}`;

  tap.equal(id, paste.id);
  tap.equal(url, paste.url);
  tap.equal(deleteUrl, paste.deleteUrl);
};

main();
