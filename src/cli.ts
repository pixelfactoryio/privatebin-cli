import program from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import commander from 'commander';
import { AxiosRequestConfig } from 'axios';

import { version } from '../package.json';
import { HandlerFunc } from './lib/types';
import { Privatebin } from './lib/privatebin';

export function validateOutput(val: string): string {
  if (val.match(/^(text|json|yaml)$/i)) {
    return val;
  }
  throw new Error(`invalid output: ${val}`);
}

export function validateExpire(val: string): string {
  if (val.match(/^(5min|10min|1hour|1day|1week|1month|1year|never)$/i)) {
    return val;
  }
  throw new Error(`invalid expire: ${val}`);
}

function addGlobalOptions(command: commander.Command): void {
  command
    .option('-u, --url <string>', 'PrivateBin host', 'https://privatebin.net')
    .option('-o, --output [type]', 'Output [text, json, yaml]', validateOutput, 'text');
}

export function CLI(process: NodeJS.Process, handler: HandlerFunc): void {
  try {
    program.name('privatebin-cli').version(version);

    const sendCmd = program
      .command('send <message>')
      .description('Post a message to privatebin')
      .option(
        '-e, --expire <string>',
        'Paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]',
        validateExpire,
        '1week',
      )
      .option('--burnafterreading', 'Burn after reading', false)
      .option('--opendiscussion', 'Open discussion', false)
      .option('--compression <string>', 'Use compression [zlib, none]', 'zlib')
      .action(async (message, options) => {
        if (options.burnafterreading && options.opendiscussion) {
          // eslint-disable-next-line no-console
          console.error(chalk`{red ERROR:} You can't use --opendiscussion with --burnafterreading flag`);
          process.exit(1);
        }

        handler(message, {
          expire: options.expire,
          url: options.url,
          burnafterreading: options.burnafterreading ? 1 : 0,
          opendiscussion: options.opendiscussion ? 1 : 0,
          output: options.output,
          compression: options.compression,
        });
      });

    const getCmd = program
      .command('get <pasteUrl>')
      .description('Get a message from privatebin')
      .action(async (pasteUrl) => {
        const u = new URL(pasteUrl);
        const id = u.search.substring(1);
        const randomKey = u.hash.substring(1);

        const apiConfig: AxiosRequestConfig = {
          baseURL: u.origin,
          headers: {
            common: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'JSONHttpRequest',
            },
          },
        };

        const privatebin = new Privatebin(apiConfig);
        console.log(await privatebin.decryptPaste(id, randomKey));
      });

    addGlobalOptions(sendCmd);
    addGlobalOptions(getCmd);

    if (process.stdin.isTTY) {
      program.parse(process.argv);
    } else {
      const stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
      process.argv.push(stdinBuffer.toString('utf8').trim());
      program.parse(process.argv);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(chalk`{red ERROR:} ${e.message}`);
    program.outputHelp(() => program.help());
    process.exit(1);
  }
}
