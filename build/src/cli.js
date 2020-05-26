"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = exports.validateExpire = exports.validateOutput = void 0;
const commander_1 = __importDefault(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const package_json_1 = require("../package.json");
const privatebin_1 = require("./lib/privatebin");
function validateOutput(val) {
    if (val.match(/^(text|json|yaml)$/i)) {
        return val;
    }
    throw new Error(`invalid output: ${val}`);
}
exports.validateOutput = validateOutput;
function validateExpire(val) {
    if (val.match(/^(5min|10min|1hour|1day|1week|1month|1year|never)$/i)) {
        return val;
    }
    throw new Error(`invalid expire: ${val}`);
}
exports.validateExpire = validateExpire;
function addGlobalOptions(command) {
    command
        .option('-u, --url <string>', 'PrivateBin host', 'https://privatebin.net')
        .option('-o, --output [type]', 'Output [text, json, yaml]', validateOutput, 'text');
}
function CLI(process, handler) {
    try {
        commander_1.default.name('privatebin-cli').version(package_json_1.version);
        const sendCmd = commander_1.default
            .command('send <message>')
            .description('Post a message to privatebin')
            .option('-e, --expire <string>', 'Paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]', validateExpire, '1week')
            .option('--burnafterreading', 'Burn after reading', false)
            .option('--opendiscussion', 'Open discussion', false)
            .option('--compression <string>', 'Use compression [zlib, none]', 'zlib')
            .action(async (message, options) => {
            if (options.burnafterreading && options.opendiscussion) {
                // eslint-disable-next-line no-console
                console.error(chalk_1.default `{red ERROR:} You can't use --opendiscussion with --burnafterreading flag`);
                process.exit(1);
            }
            handler(message, {
                expire: options.expire,
                url: options.url,
                burnafterreading: options.burnafterreading ? 1 : 0,
                opendiscussion: options.opendiscussion ? 1 : 0,
                output: options.output,
                compression: options.compression,
            });
        });
        const getCmd = commander_1.default
            .command('get <pasteUrl>')
            .description('Get a message from privatebin')
            .action(async (pasteUrl) => {
            const u = new URL(pasteUrl);
            const id = u.search.substring(1);
            const randomKey = u.hash.substring(1);
            const apiConfig = {
                baseURL: u.origin,
                headers: {
                    common: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'JSONHttpRequest',
                    },
                },
            };
            const privatebin = new privatebin_1.Privatebin(apiConfig);
            console.log(await privatebin.decryptPaste(id, randomKey));
        });
        addGlobalOptions(sendCmd);
        addGlobalOptions(getCmd);
        if (process.stdin.isTTY) {
            commander_1.default.parse(process.argv);
        }
        else {
            const stdinBuffer = fs_1.default.readFileSync(0); // STDIN_FILENO = 0
            process.argv.push(stdinBuffer.toString('utf8').trim());
            commander_1.default.parse(process.argv);
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(chalk_1.default `{red ERROR:} ${e.message}`);
        commander_1.default.outputHelp(() => commander_1.default.help());
        process.exit(1);
    }
}
exports.CLI = CLI;
//# sourceMappingURL=cli.js.map