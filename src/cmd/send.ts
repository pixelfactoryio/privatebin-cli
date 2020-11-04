import commander from 'commander';
import chalk from 'chalk';
import YAML from 'yaml';
import { randomBytes } from 'crypto';
import { encode } from 'bs58';

import { PrivatebinClient } from '../lib';
import { PrivatebinResponse, PrivatebinOutput, PrivatebinOptions } from '../lib';

function formatResponse(response: PrivatebinResponse, host: string, randomKey: Buffer): PrivatebinOutput {
  return {
    pasteId: response.id,
    pasteURL: `${host}${response.url}#${encode(randomKey)}`,
    deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
  };
}

async function sendCmdAction(
  text: string,
  key: Buffer,
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
    .option('-u, --url <string>', 'privateBin host', 'https://privatebin.net')
    .option('-o, --output [type]', 'output format [text, json, yaml]', validateOutput, 'text')
    .action(async (text, args) => {
      if (args.burnafterreading && args.opendiscussion) {
        throw new Error("You can't use --opendiscussion with --burnafterreading flag");
      }

      const key = randomBytes(32);

      const response = await sendCmdAction(text, key, args.url, {
        expire: args.expire,
        burnafterreading: args.burnafterreading ? 1 : 0,
        opendiscussion: args.opendiscussion ? 1 : 0,
        output: args.output,
        compression: args.compression,
      });

      const paste = formatResponse(response, args.url, key);

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
