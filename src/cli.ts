import program from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import { version } from '../package.json';
import { HandlerFunc } from './common/types';
import commander from 'commander';

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

    const encryptCmd = program
      .command('encrypt <message>')
      .description('encrypt a repository into a newly created directory')
      .option(
        '-e, --expire <string>',
        'Paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]',
        validateExpire,
        '1week',
      )
      .option('--burnafterreading', 'Burn after reading', false)
      .option('--opendiscussion', 'Open discussion', false)
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
        });
      });

    const decryptCmd = program
      .command('decrypt <message>')
      .description('decrypt a repository into a newly created directory')
      .action(async (message, options) => {
        console.log(message);
        console.log(options.url);
        console.log(options.expire);
      });

    addGlobalOptions(encryptCmd);
    addGlobalOptions(decryptCmd);

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
