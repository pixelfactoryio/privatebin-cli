import pako from 'pako';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

import { Api } from './api';
import {
  PrivatebinPasteRequest,
  PrivatebinPaste,
  PrivatebinResponse,
  PrivatebinOptions,
  PrivatebinSpec,
  PrivatebinAdata,
} from './types';
import { decrypt, encrypt } from './crypto';

export function encryptText(text: string, key: Buffer, options: PrivatebinOptions): PrivatebinPasteRequest {
  const { burnafterreading, opendiscussion, compression } = options;
  const spec = getSpec(burnafterreading, opendiscussion, compression);
  const textBuf = textToBuffer(text, compression);

  return encrypt(Buffer.from(textBuf), key, spec);
}

export function decryptText(ct: string, key: Buffer, adata: PrivatebinAdata): PrivatebinPaste {
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

export function getSpec(burnafterreading: number, opendiscussion: number, compression: string): PrivatebinSpec {
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

  public async sendText(text: string, key: Buffer, options: PrivatebinOptions): Promise<PrivatebinResponse> {
    const payload = encryptText(text, key, options);
    return this.postPaste(payload, options);
  }

  public async getText(id: string, key: Buffer): Promise<PrivatebinPaste> {
    const { ct, adata } = await this.getPaste(id);
    return decryptText(ct, key, adata);
  }

  private getPaste(id: string): Promise<PrivatebinPasteRequest> {
    return this.get<PrivatebinPasteRequest, AxiosResponse<PrivatebinPasteRequest>>(`/?pasteid=${id}`).then(
      this.success,
    );
  }

  private postPaste(
    PrivatebinPasteRequest: PrivatebinPasteRequest,
    options: PrivatebinOptions,
  ): Promise<PrivatebinResponse> {
    const { expire } = options;
    const { ct, adata } = PrivatebinPasteRequest;

    return this.post<PrivatebinResponse, PrivatebinPasteRequest, AxiosResponse<PrivatebinResponse>>('/', {
      v: 2,
      ct,
      adata,
      meta: { expire },
    }).then(this.success);
  }
}
