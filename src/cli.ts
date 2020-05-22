import program from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import { version } from '../package.json';
import { HandlerFunc } from './common/types';

export function validateOutput(val: string): string {
  if (val.match(/^(json|yaml)$/i)) {
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

export function CLI(process: NodeJS.Process, handler: HandlerFunc): void {
  try {
    program
      .name('privatebin-cli')
      .version(version)
      .usage('[options] <message>')
      .option('-u, --url <string>', 'PrivateBin host', 'https://privatebin.net')
      .option(
        '-e, --expire <string>',
        'Paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]',
        validateExpire,
        '1week',
      )
      .option('-o, --output [type]', 'Output [json, yaml]', validateOutput)
      .option('--burnafterreading', 'Burn after reading', false)
      .option('--opendiscussion', 'Open discussion', false)
      .parse(process.argv);

    if (process.stdin.isTTY) {
      program.parse(process.argv);
    } else {
      const stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
      program.parse(process.argv);
      program.args[0] = stdinBuffer.toString('utf8').trim();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(chalk`{red ERROR:} ${e.message}`);
    program.outputHelp(() => program.help());
    process.exit(1);
  }

  if (program.burnafterreading && program.opendiscussion) {
    // eslint-disable-next-line no-console
    console.error(chalk`{red ERROR:} You can't use --opendisussion with --burnafterreading flag`);
    program.outputHelp(() => program.help());
    process.exit(1);
  }

  handler(program.args, {
    expire: program.expire,
    url: program.url,
    burnafterreading: program.burnafterreading ? 1 : 0,
    opendiscussion: program.opendiscussion ? 1 : 0,
  });
}
