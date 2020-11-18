import crypto from 'isomorphic-webcrypto';
import { bytesToBase64, base64ToBytes } from 'byte-base64';

import { PrivatebinSpec, PrivatebinPasteRequest, PrivatebinAdata } from './types';

export function importKey(key: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', key, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
}

export function deriveKey(key: CryptoKey, salt: Uint8Array, iterations: number, keyLength: number): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    { name: 'AES-GCM', length: keyLength },
    false,
    ['encrypt', 'decrypt'],
  );
}

export function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function uint8ArrayToString(buf: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(buf);
}

export function concatUint8Array(arr1: Uint8Array, arr2: Uint8Array): Uint8Array {
  const result = new Uint8Array(arr1.length + arr2.length);
  result.set(arr1);
  result.set(arr2, arr1.length);
  return result;
}

export async function encrypt(
  message: Uint8Array,
  masterkey: Uint8Array,
  spec: PrivatebinSpec,
): Promise<PrivatebinPasteRequest> {
  const key = await importKey(masterkey);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const salt = crypto.getRandomValues(new Uint8Array(8));
  const derivedKey = await deriveKey(key, salt, spec.iter, spec.ks);

  const adata: PrivatebinAdata = [
    [bytesToBase64(iv), bytesToBase64(salt), spec.iter, spec.ks, spec.ts, spec.algo, spec.mode, spec.compression],
    'plaintext',
    spec.opendiscussion,
    spec.burnafterreading,
  ];

  const encData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: stringToUint8Array(JSON.stringify(adata)), tagLength: spec.ts },
    derivedKey,
    message,
  );

  return {
    ct: bytesToBase64(new Uint8Array(encData)),
    adata,
  };
}

export async function decrypt(data: string, masterkey: Uint8Array, adata: PrivatebinAdata): Promise<Uint8Array> {
  const bData = base64ToBytes(data);
  const spec = adata[0];
  const iv = base64ToBytes(spec[0]);
  const salt = base64ToBytes(spec[1]);
  const iterations = spec[2];
  const ts = spec[4];

  const key = await importKey(masterkey);
  const derivedKey = await deriveKey(key, salt, iterations, 256);

  const clearData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, additionalData: stringToUint8Array(JSON.stringify(adata)), tagLength: ts },
    derivedKey,
    bData,
  );

  return new Uint8Array(clearData);
}
