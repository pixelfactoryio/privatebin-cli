import pako from 'pako';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

import { Api } from './api';
import { PasteData, Paste, Response, Options, Spec, Adata } from './types';
import { decrypt, encrypt } from './crypto';

export function encryptMessage(message: Buffer, key: Buffer, spec: Spec): PasteData {
  return encrypt(message, key, spec);
}

export function decryptMessage(message: string, key: Buffer, adata: Adata): Buffer {
  return decrypt(message, key, adata);
}

export function getBufferPaste(data: string, compression?: string): Buffer | Uint8Array {
  const buf = Buffer.from(JSON.stringify({ paste: data }), 'utf8');
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

  public async encryptPaste(message: string, key: Buffer, options: Options): Promise<Response> {
    const { burnafterreading, opendiscussion, compression } = options;
    const spec = getSpec(burnafterreading, opendiscussion, compression);
    const pasteData = getBufferPaste(message, compression);
    const chiperPaste = encryptMessage(Buffer.from(pasteData), key, spec);

    return this.postPaste(chiperPaste, options);
  }

  public async decryptPaste(id: string, key: Buffer): Promise<Paste> {
    const response = await this.getPaste(id);
    const paste = decryptMessage(response.ct, key, response.adata);

    if (response.adata[0][7] === 'zlib') {
      return JSON.parse(pako.inflateRaw(paste, { to: 'string' }));
    }

    return JSON.parse(paste.toString());
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
