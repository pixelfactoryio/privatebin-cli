import chalk from 'chalk';
import YAML from 'yaml';
import { randomBytes } from 'crypto';
import { AxiosRequestConfig } from 'axios';
import { encode } from 'bs58';

import { Privatebin } from './lib/privatebin';
import { CLI } from './cli';
import { Response, Output } from './lib/types';

function formatResponse(response: Response, host: string, randomKey: Buffer): Output {
  return {
    pasteId: response.id,
    pasteURL: `${host}${response.url}#${encode(randomKey)}`,
    deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
  };
}

CLI(process, async (message, options) => {
  try {
    const apiConfig: AxiosRequestConfig = {
      baseURL: options.url,
      headers: {
        common: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'JSONHttpRequest',
        },
      },
    };

    const privatebin = new Privatebin(apiConfig);
    const key = randomBytes(32);
    const paste = formatResponse(await privatebin.encryptPaste(message, key, options), options.url, key);

    switch (options.output) {
      case 'json':
        console.log(JSON.stringify(paste, null, 4));
        break;
      case 'yaml':
        console.log(YAML.stringify(paste));
        break;
      default:
        console.log(chalk`{bold pasteId:} ${paste.pasteId}`);
        console.log(chalk`{bold pasteURL:} {greenBright ${paste.pasteURL}}`);
        console.log(chalk`{bold deleteURL:} {gray ${paste.deleteURL}}`);
    }
    return paste;
  } catch (error) {
    console.error(chalk`{red ERROR:} ${error.message}`);
    return error;
  }
});
