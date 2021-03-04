import {
  PrivatebinSpec,
  PrivatebinOptions,
  PrivatebinPaste,
  PrivatebinResponse,
  PrivatebinOutput,
  PrivatebinPasteRequest,
} from '../src/lib/types';
import { stringToUint8Array } from '../src/lib/crypto';

export const host = 'https://privatebin.net';

export const msg = 'Hello World';

export const pasteObj: PrivatebinPaste = {
  paste: msg,
};

export const postPasteResponse: PrivatebinResponse = {
  status: 0,
  id: 'cdef294c33ea8003',
  url: '/?cdef294c33ea8003',
  deletetoken: '1df10aabc1b4b8b139adef796827c2994c2c7dad95e300c741dcef238f698ff6',
};

export const getPasteResponseZlib: PrivatebinPasteRequest = {
  status: 0,
  v: 2,
  adata: [['knT4DMZrlyYKv5VPSdYRlg==', '6cVoVXe1R/4=', 100000, 256, 128, 'aes', 'gcm', 'zlib'], 'plaintext', 0, 0],
  ct: 'PWq5P7FeVqBsIRjt8yEX5DpQfnVc63Jboxknh/NLE2sVmftyK99D6pQ=',
  meta: { expire: '5min' },
};

export const getPasteResponse: PrivatebinPasteRequest = {
  status: 0,
  v: 2,
  adata: [['lZl+nQfkQUJbTrrrgcFT9A==', 'WX1e1AU7+EI=', 100000, 256, 128, 'aes', 'gcm', 'none'], 'plaintext', 0, 0],
  ct: 'z4xybqQb8N8UIZo07QVaOobDh379gaZhT9RuazqYNuQLNxQLKYwU',
  meta: { expire: '5min' },
};

export const pasteDataBuf = stringToUint8Array(JSON.stringify(pasteObj));

export const opts: PrivatebinOptions = {
  expire: '5min',
  burnafterreading: 0,
  opendiscussion: 0,
  output: 'text',
  compression: 'zlib',
  textformat: 'plaintext',
};

export const spec: PrivatebinSpec = {
  algo: 'aes',
  mode: 'gcm',
  ks: 256,
  ts: 128,
  iter: 100000,
  compression: 'zlib',
  burnafterreading: 0,
  opendiscussion: 0,
  textformat: 'plaintext',
};

export const key = '5DMz3GsHsNmaQhSaH9ej8nvvpCdxTxpvMtLP7XQLjxns';

export const output: PrivatebinOutput = {
  pasteId: postPasteResponse.id,
  pasteURL: `${host}${postPasteResponse.url}#${key}`,
  deleteURL: `${host}/?pasteid=${postPasteResponse.id}&deletetoken=${postPasteResponse.deletetoken}`,
};
