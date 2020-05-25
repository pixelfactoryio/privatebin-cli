"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const js_yaml_1 = require("js-yaml");
const crypto_1 = require("crypto");
const privatebin_1 = __importStar(require("./lib/privatebin"));
const cli_1 = require("./cli");
cli_1.CLI(process, async (message, options) => {
    const pasteData = privatebin_1.getBufferPaste(message);
    try {
        const paste = await privatebin_1.default(options.url, pasteData, crypto_1.randomBytes(32), {
            expire: options.expire,
            burnafterreading: options.burnafterreading ? 1 : 0,
            opendiscussion: options.opendiscussion ? 1 : 0,
        });
        switch (options.output) {
            case 'json':
                console.log(JSON.stringify(paste, null, 4));
                break;
            case 'yaml':
                console.log(js_yaml_1.dump(paste));
                break;
            default:
                console.log(chalk_1.default `{bold pasteId:} ${paste.id}`);
                console.log(chalk_1.default `{bold pasteURL:} {greenBright ${paste.url}}`);
                console.log(chalk_1.default `{bold deleteURL:} {gray ${paste.deleteUrl}}`);
        }
        return paste;
    }
    catch (error) {
        console.error(chalk_1.default `{red ERROR:} ${error.message}`);
        return error;
    }
});
//# sourceMappingURL=index.js.map