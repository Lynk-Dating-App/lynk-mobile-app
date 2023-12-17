"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const CONTENT_TYPE = 'Content-Type';
const ACCEPT = 'Accept';
const APPLICATION_JSON = 'application/json';
axios_1.default.defaults.headers.get[ACCEPT] = APPLICATION_JSON;
axios_1.default.defaults.headers.delete[ACCEPT] = APPLICATION_JSON;
axios_1.default.defaults.headers.post[CONTENT_TYPE] = APPLICATION_JSON;
axios_1.default.defaults.headers.patch[CONTENT_TYPE] = APPLICATION_JSON;
axios_1.default.defaults.headers.put[CONTENT_TYPE] = APPLICATION_JSON;
exports.default = axios_1.default;
