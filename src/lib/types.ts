export type Paste = {
  paste: string;
};

export type Response = {
  status: number;
  id: string;
  url: string;
  deletetoken: string;
};

export type Output = {
  pasteId: string;
  pasteURL: string;
  deleteURL: string;
};

export type Spec = {
  algo: string;
  mode: string;
  ks: number;
  ts: number;
  iter: number;
  compression: string;
  burnafterreading: number;
  opendiscussion: number;
};

export type Adata = [[string, string, number, number, number, string, string, string], string, number, number];

export type Meta = {
  expire: string;
};

export type PasteData = {
  v?: 2;
  ct: string; // Cipher Text
  adata: Adata; // Additional data
  meta?: Meta;
};

export type Options = {
  url: string;
  expire: '5min' | '10min' | '1hour' | '1day' | '1week' | '1month' | '1year' | 'never';
  burnafterreading: 0 | 1;
  opendiscussion: 0 | 1;
  output: 'text' | 'json' | 'yaml';
  compression: 'none' | 'zlib';
};
