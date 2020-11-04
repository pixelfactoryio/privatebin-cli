import pako from 'pako';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

import { Api } from './api';
import { PasteData, Paste, Response, Options, Spec, Adata } from './types';
import { decrypt, encrypt } from './crypto';

export function encryptText(text: string, key: Buffer, options: Options): PasteData {
  const { burnafterreading, opendiscussion, compression } = options;
  const spec = getSpec(burnafterreading, opendiscussion, compression);
  const textBuf = textToBuffer(text, compression);

  return encrypt(Buffer.from(textBuf), key, spec);
}

export function decryptText(ct: string, key: Buffer, adata: Adata): Paste {
  const text = decrypt(ct, key, adata);
  if (adata[0][7] === 'zlib') {
    return JSON.parse(pako.inflateRaw(text, { to: 'string' }));
  }

  return JSON.parse(text.toString());
}

export function textToBuffer(text: string, compression?: string): Buffer | Uint8Array {
  const buf = Buffer.from(JSON.stringify({ paste: text }), 'utf8');
  if (compression === 'zlib') {
    return pako.deflateRaw(new Uint8Array(buf));
  } else {
    return buf;
  }
}

export function getSpec(burnafterreading: number, opendiscussion: number, compression: string): Spec {
  return {
    algo: 'aes',
    mode: 'gcm',
    ks: 256,
    ts: 128,
    iter: 100000,
    compression,
    burnafterreading,
    opendiscussion,
  };
}

export class PrivatebinClient extends Api {
  constructor(baseURL = 'https://privatebin.net') {
    const apiConfig: AxiosRequestConfig = {
      baseURL: baseURL,
      headers: {
        common: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'JSONHttpRequest',
        },
      },
    };

    super(apiConfig);
  }

  public async sendText(text: string, key: Buffer, options: Options): Promise<Response> {
    const payload = encryptText(text, key, options);
    return this.postPaste(payload, options);
  }

  public async getText(id: string, key: Buffer): Promise<Paste> {
    const { ct, adata } = await this.getPaste(id);
    return decryptText(ct, key, adata);
  }

  private getPaste(id: string): Promise<PasteData> {
    return this.get<PasteData, AxiosResponse<PasteData>>(`/?pasteid=${id}`).then(this.success);
  }

  private postPaste(pasteData: PasteData, options: Options): Promise<Response> {
    const { expire } = options;
    const { ct, adata } = pasteData;

    return this.post<Response, PasteData, AxiosResponse<Response>>('/', {
      v: 2,
      ct,
      adata,
      meta: { expire },
    }).then(this.success);
  }
}
