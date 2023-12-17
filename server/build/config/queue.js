"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = require("amqplib");
const settings_1 = __importDefault(require("./settings"));
// @ts-ignore
const config = settings_1.default.queue[settings_1.default.service.env];
exports.default = {
    client: async () => (0, amqplib_1.connect)(config.host),
};
