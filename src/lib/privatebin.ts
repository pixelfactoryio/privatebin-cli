import pako from 'pako';
import { AxiosResponse } from 'axios';
import { decode } from 'bs58';

import { Api } from './api';
import { PasteData, Paste, Response, Options, Spec } from './types';
import { decrypt, encrypt } from '../lib/cryptotools';

export class Privatebin extends Api {
  getBufferPaste(data: string, compression?: string): Buffer | Uint8Array {
    const buf = Buffer.from(JSON.stringify({ paste: data }), 'utf8');
    if (compression === 'zlib') {
      return pako.deflateRaw(new Uint8Array(buf));
    } else {
      return buf;
    }
  }

  getSpec(burnafterreading: number, opendiscussion: number, compression: string): Spec {
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

  public getPaste(id: string): Promise<PasteData> {
    return this.get<PasteData, AxiosResponse<PasteData>>(`/?pasteid=${id}`).then(this.success);
  }

  public postPaste(pasteData: PasteData, options: Options): Promise<Response> {
    const { expire } = options;
    const { ct, adata } = pasteData;

    return this.post<Response, PasteData, AxiosResponse<Response>>('/', {
      v: 2,
      ct,
      adata,
      meta: { expire },
    }).then(this.success);
  }

  public async decryptPaste(id: string, randomKey: string): Promise<Paste> {
    const response = await this.getPaste(id);
    const paste = decrypt(response.ct, decode(randomKey), response.adata);

    if (response.adata[0][7] === 'zlib') {
      return JSON.parse(pako.inflateRaw(paste, { to: 'string' }));
    }

    return JSON.parse(paste.toString());
  }

  public async encryptPaste(message: string, key: Buffer, options: Options): Promise<Response> {
    const { burnafterreading, opendiscussion, compression } = options;
    const spec = this.getSpec(burnafterreading, opendiscussion, compression);
    const pasteData = this.getBufferPaste(message, compression);
    const chiperPaste = encrypt(Buffer.from(pasteData), key, spec);

    return this.postPaste(chiperPaste, options);
  }
}
