"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axios = void 0;
const axios_1 = __importDefault(require("axios"));
class Axios {
    constructor(config) {
        return axios_1.default.create(config);
    }
}
exports.Axios = Axios;
//# sourceMappingURL=axios.js.map