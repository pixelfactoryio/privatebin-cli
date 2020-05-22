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
function validateOutput(val) {
    if (val.match(/^(json|yaml)$/i)) {
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
function CLI(process, handler) {
    try {
        commander_1.default
            .name('privatebin-cli')
            .version(package_json_1.version)
            .usage('[options] <message>')
            .option('-u, --url <string>', 'PrivateBin host', 'https://privatebin.net')
            .option('-e, --expire <string>', 'Paste expire time [5min, 10min, 1hour, 1day, 1week, 1month, 1year, never]', validateExpire, '1week')
            .option('-o, --output [type]', 'Output [json, yaml]', validateOutput)
            .option('--burnafterreading', 'Burn after reading', false)
            .option('--opendiscussion', 'Open discussion', false)
            .parse(process.argv);
        if (process.stdin.isTTY) {
            commander_1.default.parse(process.argv);
        }
        else {
            const stdinBuffer = fs_1.default.readFileSync(0); // STDIN_FILENO = 0
            commander_1.default.parse(process.argv);
            commander_1.default.args[0] = stdinBuffer.toString('utf8').trim();
        }
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error(chalk_1.default `{red ERROR:} ${e.message}`);
        commander_1.default.outputHelp(() => commander_1.default.help());
        process.exit(1);
    }
    if (commander_1.default.burnafterreading && commander_1.default.opendiscussion) {
        // eslint-disable-next-line no-console
        console.error(chalk_1.default `{red ERROR:} You can't use --opendisussion with --burnafterreading flag`);
        commander_1.default.outputHelp(() => commander_1.default.help());
        process.exit(1);
    }
    handler(commander_1.default.args, {
        expire: commander_1.default.expire,
        url: commander_1.default.url,
        burnafterreading: commander_1.default.burnafterreading ? 1 : 0,
        opendiscussion: commander_1.default.opendiscussion ? 1 : 0,
    });
}
exports.CLI = CLI;
//# sourceMappingURL=cli.js.map