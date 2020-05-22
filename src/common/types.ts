export type PrivatebinOptions = {
  burnafterreading: number;
  opendiscussion: number;
  expire: string;
};

export type Paste = {
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
  data: string;
  adata: Array<any>;
};

export type HandlerOptions = {
  url: string;
  expire: '5min' | '10min' | '1hour' | '1day' | '1week' | '1month' | '1year' | 'never';
  burnafterreading: 0 | 1;
  opendiscussion: 0 | 1;
};

export type HandlerFunc = (args: string[], options: HandlerOptions) => void;
