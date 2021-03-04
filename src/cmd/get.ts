import commander from 'commander';
import { decode } from 'bs58';

import { PrivatebinClient } from '../lib';
import { PrivatebinPaste } from '../lib';
import { concatUint8Array, stringToUint8Array } from '../lib/crypto';
import { readPassword } from './utils';
export class GetCmd extends commander.Command {
  constructor() {
    super('get');
    this.arguments('<url>');
    this.description('Get a text from privatebin');
    this.option('-p, --password', 'prompt for password', false);
    this.action(this.run);
  }

  private getCmdAction = async (pasteUrl: string, password: string): Promise<PrivatebinPaste> => {
    const u = new URL(pasteUrl);
    const id = u.search.substring(1);
    const key = u.hash.substring(1);
    const passPhrase = concatUint8Array(decode(key), stringToUint8Array(password));
    const privatebin = new PrivatebinClient(u.origin);
    return await privatebin.getText(id, passPhrase);
  };

  private print = (paste: PrivatebinPaste) => {
    process.stderr.write(`${paste.paste}\n`);
  };

  public run = async (url: string, args: any): Promise<void> => {
    let password = '';
    if (args.password) {
      password = await readPassword();
    }

    try {
      this.print(await this.getCmdAction(url, password));
    } catch (err) {
      if (err.message === 'Unsupported state or unable to authenticate data') {
        this.print(await this.getCmdAction(url, await readPassword()));
      } else {
        throw err;
      }
    }
  };
}
