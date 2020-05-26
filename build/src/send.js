"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
const commander_1 = __importDefault(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
const crypto_1 = require("crypto");
const lib_1 = require("./lib");
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
        .description('Post a message to privatebin')
        .option('-e, --expire <string>', 'Paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]', validateExpire, '1week')
        .option('--burnafterreading', 'Burn after reading', false)
        .option('--opendiscussion', 'Open discussion', false)
        .option('--compression <string>', 'Use compression [zlib, none]', 'zlib')
        .option('-u, --url <string>', 'PrivateBin host', 'https://privatebin.net')
        .option('-o, --output [type]', 'Output [text, json, yaml]', validateOutput, 'text')
        .action(async (message, options) => {
        if (options.burnafterreading && options.opendiscussion) {
            // eslint-disable-next-line no-console
            console.error(chalk_1.default `{red ERROR:} You can't use --opendiscussion with --burnafterreading flag`);
            process.exit(1);
        }
        await sendCmdAction(message, {
            expire: options.expire,
            url: options.url,
            burnafterreading: options.burnafterreading ? 1 : 0,
            opendiscussion: options.opendiscussion ? 1 : 0,
            output: options.output,
            compression: options.compression,
        });
    });
    return cmd;
}
exports.New = New;
//# sourceMappingURL=send.js.map