#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import pjson from 'pjson';
import fs from 'fs';

import { NewSendCmd } from './send';
import { NewGetCmd } from './get';

class CLI extends Command {
  constructor() {
    super('privatebin');
    this.version(pjson.version);
    this.addCommand(NewSendCmd());
    this.addCommand(NewGetCmd());
  }

  public run = async () => {
    if (process.stdin.isTTY) {
      return this.parseAsync(process.argv);
    } else {
      const stdinBuf = fs.readFileSync(0); // STDIN_FILENO = 0
      process.argv.push(stdinBuf.toString('utf8').trim());
      return this.parseAsync(process.argv);
    }
  };
}

(async () => {
  const c = new CLI();
  try {
    c.run();
  } catch (e) {
    process.stderr.write(chalk`{red ERROR:} ${e.message}\n`);
    process.exit(1);
  }
})();
