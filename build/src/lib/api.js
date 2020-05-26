"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const axios_1 = __importDefault(require("axios"));
class Api {
    constructor(config) {
        this.axios = axios_1.default.create(config);
    }
    request(config) {
        return this.request(config);
    }
    get(url, config) {
        return this.axios.get(url, config);
    }
    post(url, data, config) {
        return this.axios.post(url, data, config);
    }
    put(url, data, config) {
        return this.axios.put(url, data, config);
    }
    success(response) {
        return response.data;
    }
    error(error) {
        throw error;
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map