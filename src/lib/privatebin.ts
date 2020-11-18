import pako from 'pako';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

import {
  PrivatebinPasteRequest,
  PrivatebinPaste,
  PrivatebinResponse,
  PrivatebinOptions,
  PrivatebinAdata,
} from './types';
import { Api } from './api';
import { decrypt, encrypt, stringToUint8Array, uint8ArrayToString } from './crypto';

export async function encryptText(
  text: string,
  key: Uint8Array,
  options: PrivatebinOptions,
): Promise<PrivatebinPasteRequest> {
  const { burnafterreading, opendiscussion, compression } = options;
  const spec = {
    algo: 'aes',
    mode: 'gcm',
    ks: 256,
    ts: 128,
    iter: 100000,
    compression,
    burnafterreading,
    opendiscussion,
  };

  let buf = stringToUint8Array(JSON.stringify({ paste: text }));
  if (compression === 'zlib') {
    buf = pako.deflateRaw(buf);
  }

  return encrypt(buf, key, spec);
}

export async function decryptText(ct: string, key: Uint8Array, adata: PrivatebinAdata): Promise<PrivatebinPaste> {
  const buf = await decrypt(ct, key, adata);
  if (adata[0][7] === 'zlib') {
    return JSON.parse(pako.inflateRaw(buf, { to: 'string' }));
  }

  return JSON.parse(uint8ArrayToString(buf));
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

  public async sendText(text: string, key: Uint8Array, options: PrivatebinOptions): Promise<PrivatebinResponse> {
    const payload = await encryptText(text, key, options);
    return this.postPaste(payload, options);
  }

  public async getText(id: string, key: Uint8Array): Promise<PrivatebinPaste> {
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
