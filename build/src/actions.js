"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCmdAction = exports.getCmdAction = void 0;
const chalk_1 = __importDefault(require("chalk"));
const bs58_1 = require("bs58");
const crypto_1 = require("crypto");
const lib_1 = require("./lib");
async function getCmdAction(pasteUrl) {
    const u = new URL(pasteUrl);
    const id = u.search.substring(1);
    const key = u.hash.substring(1);
    const apiConfig = {
        baseURL: u.origin,
        headers: {
            common: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'JSONHttpRequest',
            },
        },
    };
    const privatebin = new lib_1.Privatebin(apiConfig);
    return await privatebin.decryptPaste(id, bs58_1.decode(key));
}
exports.getCmdAction = getCmdAction;
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
async function sendCmdAction(message, options) {
    try {
        const apiConfig = {
            baseURL: options.url,
            headers: {
                common: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'JSONHttpRequest',
                },
            },
        };
        const privatebin = new lib_1.Privatebin(apiConfig);
        const key = crypto_1.randomBytes(32);
        return await privatebin.encryptPaste(message, key, options);
    }
    catch (error) {
        console.error(chalk_1.default `{red ERROR:} ${error.message}`);
        return error;
    }
}
exports.sendCmdAction = sendCmdAction;
//# sourceMappingURL=actions.js.map