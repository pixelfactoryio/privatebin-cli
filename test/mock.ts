import { AxiosRequestConfig } from 'axios';

import { Spec, Options, Paste, Response, Output, PasteData } from '../src/lib/types';

export const host = 'https://privatebin.dev.local';

export const config: AxiosRequestConfig = {
  baseURL: host,
  headers: {
    common: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'JSONHttpRequest',
    },
  },
};

export const msg = 'Hello World';

export const pasteObj = {
  paste: msg,
} as Paste;

export const postPasteResponse = {
  status: 0,
  id: 'cdef294c33ea8003',
  url: '/?cdef294c33ea8003',
  deletetoken: '1df10aabc1b4b8b139adef796827c2994c2c7dad95e300c741dcef238f698ff6',
} as Response;

export const getPasteResponseZlib = {
  status: 0,
  id: 'cdef294c33ea8003',
  url: '/?cdef294c33ea8003',
  adata: [['knT4DMZrlyYKv5VPSdYRlg==', '6cVoVXe1R/4=', 100000, 256, 128, 'aes', 'gcm', 'zlib'], 'plaintext', 0, 0],
  v: 2,
  ct: 'PWq5P7FeVqBsIRjt8yEX5DpQfnVc63Jboxknh/NLE2sVmftyK99D6pQ=',
} as PasteData;

export const getPasteResponse = {
  status: 0,
  id: 'cdef294c33ea8003',
  url: '/?cdef294c33ea8003',
  adata: [['lZl+nQfkQUJbTrrrgcFT9A==', 'WX1e1AU7+EI=', 100000, 256, 128, 'aes', 'gcm', 'none'], 'plaintext', 0, 0],
  v: 2,
  ct: 'z4xybqQb8N8UIZo07QVaOobDh379gaZhT9RuazqYNuQLNxQLKYwU',
} as PasteData;

export const pasteDataBuf = Buffer.from(JSON.stringify(pasteObj), 'utf8');

export const opts = {
  url: 'https://privatebin.dev.local',
  expire: '5min',
  burnafterreading: 0,
  opendiscussion: 0,
  output: 'text',
  compression: 'zlib',
} as Options;

export const spec = {
  algo: 'aes',
  mode: 'gcm',
  ks: 256,
  ts: 128,
  iter: 100000,
  compression: 'zlib',
  burnafterreading: 0,
  opendiscussion: 0,
} as Spec;

export const key = '5DMz3GsHsNmaQhSaH9ej8nvvpCdxTxpvMtLP7XQLjxns';

export const output = {
  pasteId: postPasteResponse.id,
  pasteURL: `${host}${postPasteResponse.url}#${key}`,
  deleteURL: `${host}/?pasteid=${postPasteResponse.id}&deletetoken=${postPasteResponse.deletetoken}`,
} as Output;
