import commander from 'commander';
import fs from 'fs';

import { New as NewSendCmd } from './send';
import { New as NewGetCmd } from './get';

export function CLI(process: NodeJS.Process, version: string): Promise<commander.Command> {
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
