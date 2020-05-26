"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const commander_1 = __importDefault(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const package_json_1 = require("../package.json");
const send_1 = require("./send");
const get_1 = require("./get");
function CLI(process) {
    try {
        const program = new commander_1.default.Command();
        program.name('privatebin-cli').version(package_json_1.version);
        program.addCommand(send_1.New());
        program.addCommand(get_1.New());
        if (process.stdin.isTTY) {
            program.parse(process.argv);
        }
        else {
            const stdinBuffer = fs_1.default.readFileSync(0); // STDIN_FILENO = 0
            process.argv.push(stdinBuffer.toString('utf8').trim());
            program.parse(process.argv);
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