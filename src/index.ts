import program from 'commander';
import chalk from 'chalk';
import { dump } from 'js-yaml';
import { randomBytes } from 'crypto';

import privatebin, { getBufferPaste } from './lib/privatebin';
import { CLI } from './cli';

CLI(process, async (args, options) => {
  const pasteData = getBufferPaste(args[0]);

  try {
    const paste = await privatebin(options.url, pasteData, randomBytes(32), {
      expire: options.expire,
      burnafterreading: options.burnafterreading ? 1 : 0,
      opendiscussion: options.opendiscussion ? 1 : 0,
    });
    switch (program.output) {
      case 'json':
        console.log(JSON.stringify(paste, null, 4));
        break;
      case 'yaml':
        console.log(dump(paste));
        break;
      default:
        console.log(chalk`{bold pasteId:} ${paste.id}`);
        console.log(chalk`{bold pasteURL:} {greenBright ${paste.url}}`);
        console.log(chalk`{bold deleteURL:} {gray ${paste.deleteUrl}}`);
    }
    return paste;
  } catch (error) {
    console.error(chalk`{red ERROR:} ${error.message}`);
    return error;
  }
});
