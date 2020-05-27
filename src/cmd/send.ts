import commander from 'commander';
import chalk from 'chalk';
import YAML from 'yaml';
import { AxiosRequestConfig } from 'axios';
import { randomBytes } from 'crypto';
import { encode } from 'bs58';

import { Privatebin } from '../lib';
import { Response, Output, Options } from '../lib/types';

function formatResponse(response: Response, host: string, randomKey: Buffer): Output {
  return {
    pasteId: response.id,
    pasteURL: `${host}${response.url}#${encode(randomKey)}`,
    deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
  };
}

async function sendCmdAction(message: string, key: Buffer, options: Options): Promise<Response> {
  try {
    const apiConfig: AxiosRequestConfig = {
      baseURL: options.url,
      headers: {
        common: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'JSONHttpRequest',
        },
      },
    };

    const privatebin = new Privatebin(apiConfig);
    return await privatebin.encryptPaste(message, key, options);
  } catch (error) {
    console.error(chalk`{red ERROR:} ${error.message}`);
    return error;
  }
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

export function New(): commander.Command {
  const cmd = commander.command('send <message>');

  cmd
    .description('post a message to privatebin')
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
    .action(async (message, options) => {
      if (options.burnafterreading && options.opendiscussion) {
        // eslint-disable-next-line no-console
        console.error(chalk`{red ERROR:} You can't use --opendiscussion with --burnafterreading flag`);
        process.exit(1);
      }

      const key = randomBytes(32);

      const response = await sendCmdAction(message, key, {
        expire: options.expire,
        url: options.url,
        burnafterreading: options.burnafterreading ? 1 : 0,
        opendiscussion: options.opendiscussion ? 1 : 0,
        output: options.output,
        compression: options.compression,
      });

      const paste = formatResponse(response, options.url, key);

      switch (options.output) {
        case 'json':
          console.log(JSON.stringify(paste, null, 4));
          break;
        case 'yaml':
          console.log(YAML.stringify(paste));
          break;
        default:
          console.log(chalk`{bold pasteId:} ${paste.pasteId}`);
          console.log(chalk`{bold pasteURL:} {greenBright ${paste.pasteURL}}`);
          console.log(chalk`{bold deleteURL:} {gray ${paste.deleteURL}}`);
      }
    });

  return cmd;
}
