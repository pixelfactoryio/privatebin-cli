# privatebin-cli

## Install

```bash
npm install -g https://github.com/amine7536/privatebin-cli
```

## Usage

```bash
$ privatebin --help
Options:
  --version           Show version number                              [boolean]
  --url, -u           PrivateBin host        [default: "https://privatebin.net"]
  --text, -t          Paste text
  --expire, -e        Paste expire time ["5min", "10min", "1hour", "1day",
                      "1week", "1month", "1year", "never"]    [default: "1week"]
  --burnafterreading  Enable Burn After Reading                 [default: false]
  --opendiscussion    Enable Discussion                         [default: false]
  --help              Show help                                        [boolean]
```

## Example

```bash
$ privatebin -u https://privatebin.myexample.com -t 'Hello World !'
{
  id: '7d632d00023a2ce3',
  url: 'https://https://privatebin.myexample.com/?7d632d00023a2ce3#+ySxXqiXa74yG8fXidwUWIWxTNO0nEufsyJ0hb1RdV0=',
  deleteUrl: 'https://https://privatebin.myexample.com?pasteid=7d632d00023a2ce3&deletetoken=896b7e11d8155308071352f66c176bc593d832b5e08ee6b99fff9b496775c6fa'
}
```
