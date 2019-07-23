# privatebin-cli

## Install

```bash
npm install -g https://github.com/amine7536/privatebin-cli
```

## Usage

```bash
$ privatebin --help
Usage: privatebin [options] <message>

Options:
  -V, --version          output the version number
  -u, --url <string>     PrivateBin host (default: "https://privatebin.net")
  -e, --expire <string>  Paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never] (default: "1week")
  -o, --output [type]    Output [json, yaml]
  --burnafterreading     Burn after reading
  --opendiscussion       Open discussion
  -h, --help             output usage information
```

## Example

```bash
$ privatebin --url https://privatebin.net --expire 5min --output json 'Hello World !'
{
    "id": "090c6a3af1f1aac0",
    "url": "https://privatebin.net/?090c6a3af1f1aac0#FKic58C2S52w28R1HCPwGyNUSRC3zHPpBcNy6MWrbfBo",
    "deleteUrl": "https://privatebin.net?pasteid=090c6a3af1f1aac0&deletetoken=5059c33f9077c27eab2658b4d8daf581f7820285a2bf1f53f98161f24efc5c48"
}
```

Or

```bash
$ echo 'Hello World !' | privatebin --url https://privatebin.net --expire 5min --output yaml
id: fb9365022bbd33b1
url: >-
  https://privatebin.net/?fb9365022bbd33b1#9wRmzD3RGgu8DrgKt2dzncokwN1n76ytC4ycRfVQgxv4
deleteUrl: >-
  https://privatebin.net?pasteid=fb9365022bbd33b1&deletetoken=9de1b24106e6fb3ce6d950471937caa2f64cd08ff69664f06252b1292a5b6f50
```
