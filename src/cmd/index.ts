import commander from 'commander';
import chalk from 'chalk';
import fs from 'fs';

import { version } from '../../package.json';
import { New as NewSendCmd } from './send';
import { New as NewGetCmd } from './get';

export function CLI(process: NodeJS.Process): void {
  try {
    const program = new commander.Command();

    program.name('privatebin').version(version);
    program.addCommand(NewSendCmd());
    program.addCommand(NewGetCmd());

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
    commander.outputHelp(() => commander.help());
    process.exit(1);
  }
}
