# privatebin-cli

![CI](https://github.com/pixelfactoryio/privatebin-cli/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/pixelfactoryio/privatebin-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/pixelfactoryio/privatebin-cli)

Privatebin-cli is Javascript Command Line tool and a Client Library to interact with privatebin (https://privatebin.net)

## Install

```bash
npm install -g @pixelfactory/privatebin
```

## Command Line

### Send command

```bash
$ privatebin send --help
Usage: privatebin send [options] <text>

Send a text to privatebin

Options:
  -e, --expire <string>   paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never] (default: "1week")
  --burnafterreading      burn after reading (default: false)
  --opendiscussion        open discussion (default: false)
  --compression <string>  use compression [zlib, none] (default: "zlib")
  -p, --password          prompt for password (default: false)
  -u, --url <string>      privateBin host (default: "https://privatebin.net")
  -o, --output <string>   output format [text, json, yaml] (default: "text")
  -h, --help              display help for command
```

#### Example

```bash
$ privatebin send -e 5min -o json "Hello World"
{
  "pasteId": "ccd05227e7bab99c",
  "pasteURL": "https://privatebin.net/?ccd05227e7bab99c#GWk29DqQx6NAfMYHgMeDeR76QSyL82fHHg5yGu3U8fft",
  "deleteURL": "https://privatebin.net/?pasteid=ccd05227e7bab99c&deletetoken=62a14a8483452485902b2e86e56f07269dd484f305d7d210d2375397deb79c1b"
}
```

Or use pipe

```bash
$ echo 'Hello World' | privatebin send -e 5min
pasteId: 649aa8c062d4ed4d
pasteURL: https://privatebin.net/?649aa8c062d4ed4d#Gt3NoxrGF8Tck5j9bBrsuFjbEaCyEBfBiGi1g8qCF2kv
deleteURL: https://privatebin.net/?pasteid=649aa8c062d4ed4d&deletetoken=b2dae42a762cf0b5e1dbf1fd5113356ba370218091668950c7f6a2d181a07ac6
```

### Get command

```bash
$ privatebin get --help
Usage: privatebin get [options] <pasteUrl>

get a message from privatebin

Options:
  -h, --help  display help for command
```

#### Example

```bash
$ privatebin get "https://privatebin.net/?ccd05227e7bab99c#GWk29DqQx6NAfMYHgMeDeR76QSyL82fHHg5yGu3U8fft"
Hello World
```

## Library

### Install

```bash
npm install @pixelfactory/privatebin
```

### Usage

```javascript
import { PrivatebinClient } from '@pixelfactory/privatebin';

const privatebin = new PrivatebinClient();
const key = crypto.getRandomValues(new Uint8Array(32));
const msg = 'Hello World!';

const opts = {
  expire: '5min',
  burnafterreading: 0,
  opendiscussion: 0,
  output: 'text',
  compression: 'zlib',
};

const paste = privatebin.sendText(msg, key, opts);
console.log(paste);
```