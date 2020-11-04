import commander from 'commander';
import { decode } from 'bs58';

import { PrivatebinClient } from '../lib';
import { PrivatebinPaste } from '../lib';

export async function getCmdAction(pasteUrl: string): Promise<PrivatebinPaste> {
  const u = new URL(pasteUrl);
  const id = u.search.substring(1);
  const key = u.hash.substring(1);

  const privatebin = new PrivatebinClient(u.origin);
  return await privatebin.getText(id, decode(key));
}

export function NewGetCmd(): commander.Command {
  const cmd = commander.command('get <url>');

  cmd.description('Get a text from privatebin').action(async (url) => {
    const paste = await getCmdAction(url);
    process.stderr.write(`${paste.paste}\n`);
  });
  return cmd;
}
