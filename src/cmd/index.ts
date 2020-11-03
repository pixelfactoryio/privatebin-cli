import commander from 'commander';
import chalk from 'chalk';
import pjson from 'pjson';
import fs from 'fs';

import { NewSendCmd } from './send';
import { NewGetCmd } from './get';

function CLI(process: NodeJS.Process, version: string): Promise<commander.Command> {
  const program = new commander.Command();

  program.name('privatebin').version(version);
  program.addCommand(NewSendCmd());
  program.addCommand(NewGetCmd());

  if (process.stdin.isTTY) {
    return program.parseAsync(process.argv);
  } else {
    const stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
    process.argv.push(stdinBuffer.toString('utf8').trim());
    return program.parseAsync(process.argv);
  }
}

CLI(process, pjson.version).catch((error) => {
  process.stderr.write(chalk`{red ERROR:} ${error.message}\n`);
  process.exit(1);
});
