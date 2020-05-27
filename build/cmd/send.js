"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
const commander_1 = __importDefault(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
const yaml_1 = __importDefault(require("yaml"));
const crypto_1 = require("crypto");
const bs58_1 = require("bs58");
const lib_1 = require("../lib");
function formatResponse(response, host, randomKey) {
    return {
        pasteId: response.id,
        pasteURL: `${host}${response.url}#${bs58_1.encode(randomKey)}`,
        deleteURL: `${host}/?pasteid=${response.id}&deletetoken=${response.deletetoken}`,
    };
}
async function sendCmdAction(message, key, options) {
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
    return await privatebin.encryptPaste(message, key, options);
}
function validateExpire(val) {
    if (val.match(/^(5min|10min|1hour|1day|1week|1month|1year|never)$/i)) {
        return val;
    }
    throw new Error(`invalid expire: ${val}`);
}
function validateOutput(val) {
    if (val.match(/^(text|json|yaml)$/i)) {
        return val;
    }
    throw new Error(`invalid output: ${val}`);
}
function New() {
    const cmd = commander_1.default.command('send <message>');
    cmd
        .description('post a message to privatebin')
        .option('-e, --expire <string>', 'paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]', validateExpire, '1week')
        .option('--burnafterreading', 'burn after reading', false)
        .option('--opendiscussion', 'open discussion', false)
        .option('--compression <string>', 'use compression [zlib, none]', 'zlib')
        .option('-u, --url <string>', 'privateBin host', 'https://privatebin.net')
        .option('-o, --output [type]', 'output format [text, json, yaml]', validateOutput, 'text')
        .action(async (message, options) => {
        if (options.burnafterreading && options.opendiscussion) {
            throw new Error("You can't use --opendiscussion with --burnafterreading flag");
        }
        const key = crypto_1.randomBytes(32);
        const response = await sendCmdAction(message, key, {
            expire: options.expire,
            url: options.url,
            burnafterreading: options.burnafterreading ? 1 : 0,
            opendiscussion: options.opendiscussion ? 1 : 0,
            output: options.output,
            compression: options.compression,
        });
        const paste = formatResponse(response, options.url, key);
        switch (options.output) {
            case 'json':
                process.stdout.write(`${JSON.stringify(paste, null, 2)}\n`);
                break;
            case 'yaml':
                process.stdout.write(`${yaml_1.default.stringify(paste)}\n`);
                break;
            default:
                process.stdout.write(chalk_1.default `{bold pasteId:} ${paste.pasteId}\n`);
                process.stdout.write(chalk_1.default `{bold pasteURL:} {greenBright ${paste.pasteURL}}\n`);
                process.stdout.write(chalk_1.default `{bold deleteURL:} {gray ${paste.deleteURL}}\n`);
        }
    });
    return cmd;
}
exports.New = New;
//# sourceMappingURL=send.js.map