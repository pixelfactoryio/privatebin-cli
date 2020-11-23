export type PrivatebinPaste = {
  paste: string;
};

export type PrivatebinResponse = {
  status: number;
  id: string;
  url: string;
  deletetoken: string;
};

export type PrivatebinOutput = {
  pasteId: string;
  pasteURL: string;
  deleteURL: string;
};

export type PrivatebinSpec = {
  algo: string;
  mode: string;
  ks: number;
  ts: number;
  iter: number;
  compression: string;
  burnafterreading: number;
  opendiscussion: number;
};

export type PrivatebinAdata = [
  [string, string, number, number, number, string, string, string],
  string,
  number,
  number,
];

export type PrivatebinMeta = {
  expire: string;
};

export type PrivatebinPasteRequest = {
  status?: number;
  message?: string;
  v?: 2;
  ct: string; // Cipher Text
  adata: PrivatebinAdata; // Additional data
  meta?: PrivatebinMeta;
};

export type PrivatebinOptions = {
  expire: '5min' | '10min' | '1hour' | '1day' | '1week' | '1month' | '1year' | 'never';
  burnafterreading: 0 | 1;
  opendiscussion: 0 | 1;
  output: 'text' | 'json' | 'yaml';
  compression: 'none' | 'zlib';
};
