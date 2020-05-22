import Base58 from "bs58";
import crypto from "crypto";
import { Spec, HandlerOptions, Paste } from "../src/common/types";

export const host = "https://privatebin.dev.local";

export const response = {
  status: 0,
  id: "c90e56c1f4ce9500",
  url: "/?c90e56c1f4ce9500",
  deletetoken:
    "389e551bc2bbe83d88e72987bcdd434e38298d40a8cd67d57748684749b8156d",
};

export const msg = "Hello World !";

export const pasteObj = {
  paste: msg,
};

export const pasteDataBuf = Buffer.from(JSON.stringify(pasteObj), "utf8");

export const opts = {
  expire: "5min",
  burnafterreading: 0,
  opendiscussion: 0,
} as HandlerOptions;

export const spec = {
  algo: "aes",
  mode: "gcm",
  ks: 256,
  ts: 128,
  iter: 100000,
  compression: "none",
  burnafterreading: 0,
  opendiscussion: 0,
} as Spec;

export const randomKey = crypto.randomBytes(32);

export const paste = {
  id: response.id,
  url: `${host}${response.url}#${Base58.encode(randomKey)}`,
  deleteUrl: `${host}?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
} as Paste;
