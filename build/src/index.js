"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const yaml_1 = __importDefault(require("yaml"));
const crypto_1 = require("crypto");
const bs58_1 = require("bs58");
const privatebin_1 = require("./lib/privatebin");
const cli_1 = require("./cli");
function formatResponse(response, host, randomKey) {
    return {
        pasteId: response.id,
        pasteURL: `${host}${response.url}#${bs58_1.encode(randomKey)}`,
        deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
    };
}
cli_1.CLI(process, async (message, options) => {
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
        const privatebin = new privatebin_1.Privatebin(apiConfig);
        const key = crypto_1.randomBytes(32);
        const paste = formatResponse(await privatebin.encryptPaste(message, key, options), options.url, key);
        switch (options.output) {
            case 'json':
                console.log(JSON.stringify(paste, null, 4));
                break;
            case 'yaml':
                console.log(yaml_1.default.stringify(paste));
                break;
            default:
                console.log(chalk_1.default `{bold pasteId:} ${paste.pasteId}`);
                console.log(chalk_1.default `{bold pasteURL:} {greenBright ${paste.pasteURL}}`);
                console.log(chalk_1.default `{bold deleteURL:} {gray ${paste.deleteURL}}`);
        }
        return paste;
    }
    catch (error) {
        console.error(chalk_1.default `{red ERROR:} ${error.message}`);
        return error;
    }
});
//# sourceMappingURL=index.js.map