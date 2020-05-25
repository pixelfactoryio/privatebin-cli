export type Paste = {
  paste: string;
};

export type PrivatebinOptions = {
  burnafterreading: number;
  opendiscussion: number;
  expire: string;
};

export type Privatebin = {
  id: string;
  url: string;
  deleteUrl: string;
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
  ct: string; // Cipher Text
  adata: Array<any>; // Additionnal data
};

export type HandlerOptions = {
  url: string;
  expire: '5min' | '10min' | '1hour' | '1day' | '1week' | '1month' | '1year' | 'never';
  burnafterreading: 0 | 1;
  opendiscussion: 0 | 1;
  output: 'text' | 'json' | 'yaml';
};

export type HandlerFunc = (message: string, options: HandlerOptions) => void;
