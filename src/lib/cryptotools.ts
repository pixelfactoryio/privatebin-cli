import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv, CipherGCMTypes } from 'crypto';

import { Spec, PasteData } from './types';

export function deriveKey(masterkey: Buffer, salt: Buffer, iter: number): Buffer {
  // derive key: 32 byte key length
  return pbkdf2Sync(masterkey, salt, iter, 32, 'sha256');
}

export function encrypt(message: Buffer, masterkey: Buffer, spec: Spec): PasteData {
  const iv = randomBytes(16);
  const salt = randomBytes(8);
  const key = deriveKey(masterkey, salt, spec.iter);
  const adata = [
    [
      iv.toString('base64'),
      salt.toString('base64'),
      spec.iter,
      spec.ks,
      spec.ts,
      spec.algo,
      spec.mode,
      spec.compression,
    ],
    'plaintext',
    spec.opendiscussion,
    spec.burnafterreading,
  ];

  const algorithm = `${spec.algo}-${spec.ks}-${spec.mode}` as CipherGCMTypes;

  // AES 256 GCM Mode
  const cipher = createCipheriv(algorithm, key, iv, {
    authTagLength: Math.floor(spec.ts * 0.125),
  });
  cipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));

  const pasteData = {
    ct: Buffer.concat([cipher.update(message), cipher.final(), cipher.getAuthTag()]).toString('base64'),
    adata,
  };

  return pasteData;
}

export function decrypt(data: string, masterkey: Buffer, adata: Array<any>): Buffer {
  const bData = Buffer.from(data, 'base64');
  const spec = adata[0];
  const iv = Buffer.from(spec[0], 'base64');
  const salt = Buffer.from(spec[1], 'base64');
  const iter = spec[2];
  const ts = Math.floor(spec[4] * 0.125); // Tag size
  const ms = bData.length - ts; // Message size
  const key = deriveKey(masterkey, salt, iter);

  // convert data to buffers
  const encrypted = bData.slice(0, ms);
  const tag = bData.slice(ms, bData.length);

  // AES 256 GCM Mode
  const decipher = createDecipheriv(`${spec[5]}-${spec[3]}-${spec[6]}` as CipherGCMTypes, key, iv);
  decipher.setAuthTag(tag);
  decipher.setAAD(Buffer.from(JSON.stringify(adata), 'utf8'));

  // decrypt the given encrypted
  const decrypted = Buffer.concat([decipher.update(new Uint8Array(encrypted)), decipher.final()]);

  return decrypted;
}
