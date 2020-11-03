import commander from 'commander';
import { decode } from 'bs58';

import { PrivatebinClient } from '../lib';
import { Paste } from '../lib/types';

export async function getCmdAction(pasteUrl: string): Promise<Paste> {
  const u = new URL(pasteUrl);
  const id = u.search.substring(1);
  const key = u.hash.substring(1);

  const privatebin = new PrivatebinClient(u.origin);
  return await privatebin.getText(id, decode(key));
}

export function New(): commander.Command {
  const cmd = commander.command('get <pasteUrl>');

  cmd.description('get a message from privatebin').action(async (pasteUrl) => {
    const paste = await getCmdAction(pasteUrl);
    process.stderr.write(`${paste.paste}\n`);
  });
  return cmd;
}
