import { Command, Option } from 'commander';
import chalk from 'chalk';
import YAML from 'yaml';
import crypto from 'isomorphic-webcrypto';
import bs58 from 'bs58';

import { readPassword } from './utils';
import { concatUint8Array, stringToUint8Array } from '../lib/crypto';
import { PrivatebinClient } from '../lib/privatebin';
import { PrivatebinResponse, PrivatebinOutput, PrivatebinOptions } from '../lib/types';

export class SendCmd extends Command {
  constructor() {
    super('send');
    this.arguments('<text>');
    this.description('Send a text to privatebin');

    const options = [
      new Option('-e, --expire <string>', 'paste expire time')
        .default('1week')
        .choices(['5min', '10min', '1hour', '1day', '1week', '1month', '1year', 'never']),
      new Option('--burnafterreading', 'burn after reading').default(false),
      new Option('--opendiscussion', 'open discussion').default(false),
      new Option('--compression <string>', 'use compression').choices(['zlib', 'none']).default('zlib'),
      new Option('--textformat <string>', 'text format').default('plaintext').choices(['plaintext', 'markdown']),
      new Option('-p, --password', 'prompt for password').default(false),
      new Option('-u, --url <string>', 'privateBin host').default('https://privatebin.net'),
      new Option('-o, --output <string>', 'output format').default('text').choices(['text', 'json', 'yaml']),
    ];

    options.forEach((option) => this.addOption(option));
    this.action(this.run);
  }

  private sendPaste = async (
    text: string,
    key: Uint8Array,
    url: string,
    options: PrivatebinOptions,
  ): Promise<PrivatebinResponse> => {
    const privatebin = new PrivatebinClient(url);
    return await privatebin.sendText(text, key, options);
  };

  private formatResponse = (response: PrivatebinResponse, host: string, randomKey: Uint8Array): PrivatebinOutput => {
    return {
      pasteId: response.id,
      pasteURL: `${host}${response.url}#${bs58.encode(randomKey)}`,
      deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
    };
  };

  public run = async (
    text: string,
    args: {
      password: boolean;
      burnafterreading: boolean;
      opendiscussion: boolean;
      expire: '5min' | '10min' | '1hour' | '1day' | '1week' | '1month' | '1year' | 'never';
      compression: 'zlib' | 'none';
      textformat: 'plaintext' | 'markdown';
      output: 'text' | 'json' | 'yaml';
      url: string;
    },
  ): Promise<void> => {
    if (args.burnafterreading && args.opendiscussion) {
      throw new Error("You can't use --opendiscussion with --burnafterreading flag");
    }

    let password = '';
    if (args.password) {
      password = await readPassword();
    }

    const randomKey = crypto.getRandomValues(new Uint8Array(32));
    const passPhrase = concatUint8Array(randomKey, stringToUint8Array(password));

    const response = await this.sendPaste(text, passPhrase, args.url, {
      expire: args.expire,
      burnafterreading: args.burnafterreading ? 1 : 0,
      opendiscussion: args.opendiscussion ? 1 : 0,
      output: args.output,
      textformat: args.textformat,
      compression: args.compression,
    });

    const paste = this.formatResponse(response, args.url, randomKey);

    switch (args.output) {
      case 'json':
        process.stdout.write(`${JSON.stringify(paste, null, 2)}\n`);
        break;
      case 'yaml':
        process.stdout.write(`${YAML.stringify(paste)}\n`);
        break;
      default:
        process.stdout.write(chalk.bold(`pasteId: ${paste.pasteId}\n`));
        process.stdout.write(chalk.bold(`pasteURL: ${chalk.green(paste.pasteURL)}\n`));
        process.stdout.write(chalk.bold(`deleteURL: ${chalk.gray(paste.deleteURL)}\n`));
    }
  };
}
