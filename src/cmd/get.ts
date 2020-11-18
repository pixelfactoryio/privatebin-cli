import commander from 'commander';
import { decode } from 'bs58';

import { PrivatebinClient } from '../lib';
import { PrivatebinPaste } from '../lib';
import { concatUint8Array, stringToUint8Array } from '../lib/crypto';
import { readPassword } from './utils';

export async function getCmdAction(pasteUrl: string, password: string): Promise<PrivatebinPaste> {
  const u = new URL(pasteUrl);
  const id = u.search.substring(1);
  const key = u.hash.substring(1);
  const passPhrase = concatUint8Array(decode(key), stringToUint8Array(password));
  const privatebin = new PrivatebinClient(u.origin);
  return await privatebin.getText(id, passPhrase);
}

export function NewGetCmd(): commander.Command {
  const cmd = commander.command('get <url>');
  cmd.option('-p, --password', 'prompt for password', false);

  cmd.description('Get a text from privatebin').action(async (url, args) => {
    let paste: PrivatebinPaste = { paste: '' };
    let password = '';

    if (args.password) {
      password = await readPassword();
    }

    try {
      paste = await getCmdAction(url, password);
    } catch (err) {
      if (err.message === 'Unsupported state or unable to authenticate data') {
        password = await readPassword();
        paste = await getCmdAction(url, password);
      } else {
        throw err;
      }
    }
    process.stderr.write(`${paste.paste}\n`);
  });
  return cmd;
}
