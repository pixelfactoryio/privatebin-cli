import commander from 'commander';
import chalk from 'chalk';
import YAML from 'yaml';
import crypto from 'isomorphic-webcrypto';
import { encode } from 'bs58';

import { readPassword } from './utils';
import { concatUint8Array, stringToUint8Array } from '../lib/crypto';
import { PrivatebinClient } from '../lib/privatebin';
import { PrivatebinResponse, PrivatebinOutput, PrivatebinOptions } from '../lib/types';

export class SendCmd extends commander.Command {
  constructor() {
    super('send');
    this.arguments('send <text>');
    this.description('Send a text to privatebin');

    const options = [
      new commander.Option('-e, --expire <string>', 'paste expire time')
        .default('1week')
        .choices(['5min', '10min', '1hour', '1day', '1week', '1month', '1year', 'never']),
      new commander.Option('--burnafterreading', 'burn after reading').default(false),
      new commander.Option('--opendiscussion', 'open discussion').default(false),
      new commander.Option('--compression <string>', 'use compression').choices(['zlib', 'none']).default('zlib'),
      new commander.Option('--textformat <string>', 'text format')
        .default('plaintext')
        .choices(['plaintext', 'markdown']),
      new commander.Option('-p, --password', 'prompt for password').default(false),
      new commander.Option('-u, --url <string>', 'privateBin host').default('https://privatebin.net'),
      new commander.Option('-o, --output <string>', 'output format').default('text').choices(['text', 'json', 'yaml']),
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
      pasteURL: `${host}${response.url}#${encode(randomKey)}`,
      deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
    };
  };

  public run = async (text: string, args: any): Promise<void> => {
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
        process.stdout.write(chalk`{bold pasteId:} ${paste.pasteId}\n`);
        process.stdout.write(chalk`{bold pasteURL:} {greenBright ${paste.pasteURL}}\n`);
        process.stdout.write(chalk`{bold deleteURL:} {gray ${paste.deleteURL}}\n`);
    }
  };
}
