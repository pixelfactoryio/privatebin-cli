import commander from 'commander';
import chalk from 'chalk';
import YAML from 'yaml';
import crypto from 'isomorphic-webcrypto';
import { encode } from 'bs58';

import { readPassword } from './utils';
import { concatUint8Array, stringToUint8Array } from '../lib/crypto';
import { PrivatebinClient } from '../lib/privatebin';
import { PrivatebinResponse, PrivatebinOutput, PrivatebinOptions } from '../lib/types';

function formatResponse(response: PrivatebinResponse, host: string, randomKey: Uint8Array): PrivatebinOutput {
  return {
    pasteId: response.id,
    pasteURL: `${host}${response.url}#${encode(randomKey)}`,
    deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
  };
}

async function sendCmdAction(
  text: string,
  key: Uint8Array,
  url: string,
  options: PrivatebinOptions,
): Promise<PrivatebinResponse> {
  const privatebin = new PrivatebinClient(url);
  return await privatebin.sendText(text, key, options);
}

function validateExpire(val: string): string {
  if (val.match(/^(5min|10min|1hour|1day|1week|1month|1year|never)$/i)) {
    return val;
  }
  throw new Error(`invalid expire: ${val}`);
}

function validateOutput(val: string): string {
  if (val.match(/^(text|json|yaml)$/i)) {
    return val;
  }
  throw new Error(`invalid output: ${val}`);
}

export function NewSendCmd(): commander.Command {
  const cmd = commander.command('send <text>');

  cmd
    .description('Send a text to privatebin')
    .option(
      '-e, --expire <string>',
      'paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]',
      validateExpire,
      '1week',
    )
    .option('--burnafterreading', 'burn after reading', false)
    .option('--opendiscussion', 'open discussion', false)
    .option('--compression <string>', 'use compression [zlib, none]', 'zlib')
    .option('-p, --password', 'prompt for password', false)
    .option('-u, --url <string>', 'privateBin host', 'https://privatebin.net')
    .option('-o, --output <string>', 'output format [text, json, yaml]', validateOutput, 'text')
    .action(async (text, args) => {
      if (args.burnafterreading && args.opendiscussion) {
        throw new Error("You can't use --opendiscussion with --burnafterreading flag");
      }

      let password = '';
      if (args.password) {
        password = await readPassword();
      }

      const randomKey = crypto.getRandomValues(new Uint8Array(32));
      const passPhrase = concatUint8Array(randomKey, stringToUint8Array(password));

      const response = await sendCmdAction(text, passPhrase, args.url, {
        expire: args.expire,
        burnafterreading: args.burnafterreading ? 1 : 0,
        opendiscussion: args.opendiscussion ? 1 : 0,
        output: args.output,
        compression: args.compression,
      });

      const paste = formatResponse(response, args.url, randomKey);

      switch (args.output) {
        case 'json':
          process.stdout.write(`${JSON.stringify(paste, null, 2)}\n`);
          break;
        case 'yaml':
          process.stdout.write(`${YAML.stringify(paste)}\n`);
          break;
        default:
          process.stdout.write(chalk`{bold pasteId:} ${paste.pasteId}\n`);
          process.stdout.write(chalk`{bold pasteURL:} {greenBright ${paste.pasteURL}}\n`);
          process.stdout.write(chalk`{bold deleteURL:} {gray ${paste.deleteURL}}\n`);
      }
    });

  return cmd;
}
