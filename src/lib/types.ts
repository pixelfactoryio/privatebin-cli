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

export type PasteData = {
  v?: 2;
  ct: string; // Cipher Text
  adata: Array<any>; // Additionnal data
  meta?: object;
};

export type Options = {
  url: string;
  expire: '5min' | '10min' | '1hour' | '1day' | '1week' | '1month' | '1year' | 'never';
  burnafterreading: 0 | 1;
  opendiscussion: 0 | 1;
  output: 'text' | 'json' | 'yaml';
  compression: 'none' | 'zlib';
};

export type HandlerFunc = (message: string, options: Options) => void;
