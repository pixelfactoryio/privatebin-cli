import chalk from 'chalk';
import YAML from 'yaml';
import { encode, decode } from 'bs58';
import { randomBytes } from 'crypto';
import { AxiosRequestConfig } from 'axios';

import { Privatebin } from './lib';
import { Response, Output, Options, Paste } from './lib/types';

export async function getCmdAction(pasteUrl: string): Promise<Paste> {
  const u = new URL(pasteUrl);
  const id = u.search.substring(1);
  const key = u.hash.substring(1);

  const apiConfig: AxiosRequestConfig = {
    baseURL: u.origin,
    headers: {
      common: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'JSONHttpRequest',
      },
    },
  };

  const privatebin = new Privatebin(apiConfig);
  return await privatebin.decryptPaste(id, decode(key));
}

// function formatResponse(response: Response, host: string, randomKey: Buffer): Output {
//   switch (options.output) {
//     case 'json':
//       console.log(JSON.stringify(paste, null, 4));
//       break;
//     case 'yaml':
//       console.log(YAML.stringify(paste));
//       break;
//     default:
//       console.log(chalk`{bold pasteId:} ${paste.pasteId}`);
//       console.log(chalk`{bold pasteURL:} {greenBright ${paste.pasteURL}}`);
//       console.log(chalk`{bold deleteURL:} {gray ${paste.deleteURL}}`);
//   }

//   return {
//     pasteId: response.id,
//     pasteURL: `${host}${response.url}#${encode(randomKey)}`,
//     deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
//   };
// }

export async function sendCmdAction(message: string, options: Options): Promise<Response> {
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
    return await privatebin.encryptPaste(message, key, options);
  } catch (error) {
    console.error(chalk`{red ERROR:} ${error.message}`);
    return error;
  }
}
