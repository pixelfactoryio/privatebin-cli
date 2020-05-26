"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = exports.getCmdAction = void 0;
const commander_1 = __importDefault(require("commander"));
const chalk_1 = __importDefault(require("chalk"));
const bs58_1 = require("bs58");
const lib_1 = require("../lib");
async function getCmdAction(pasteUrl) {
    try {
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
    catch (error) {
        console.error(chalk_1.default `{red ERROR:} ${error.message}`);
        return error;
    }
}
exports.getCmdAction = getCmdAction;
function New() {
    const cmd = commander_1.default.command('get <pasteUrl>');
    cmd.description('Get a message from privatebin').action(async (pasteUrl) => {
        const paste = await getCmdAction(pasteUrl);
        console.log(paste.paste);
    });
    return cmd;
}
exports.New = New;
//# sourceMappingURL=get.js.map