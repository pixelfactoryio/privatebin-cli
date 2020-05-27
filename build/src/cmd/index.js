"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const commander_1 = __importDefault(require("commander"));
const fs_1 = __importDefault(require("fs"));
const package_json_1 = require("../../package.json");
const send_1 = require("./send");
const get_1 = require("./get");
function CLI(process) {
    const program = new commander_1.default.Command();
    program.name('privatebin').version(package_json_1.version);
    program.addCommand(send_1.New());
    program.addCommand(get_1.New());
    if (process.stdin.isTTY) {
        return program.parseAsync(process.argv);
    }
    else {
        const stdinBuffer = fs_1.default.readFileSync(0); // STDIN_FILENO = 0
        process.argv.push(stdinBuffer.toString('utf8').trim());
        return program.parseAsync(process.argv);
    }
}
exports.CLI = CLI;
//# sourceMappingURL=index.js.map