"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const settings_1 = __importDefault(require("./settings"));
//@ts-ignore
const config = settings_1.default.redis[settings_1.default.service.env];
const dataStore = {
    init(options) {
        const client = new ioredis_1.default({
            host: `${config.host}`,
            username: `${config.username}`,
            password: config.password,
            db: +config.database,
        });
        if (options?.flush)
            client.flushdb();
        return client;
    },
    async set(key, value) {
        const client = this.init();
        return client.set(key, value);
    },
    async setEx(key, value, options) {
        const client = this.init();
        return client.setex(key, options?.PX, value);
    },
    async get(key) {
        const client = this.init();
        return client.get(key);
    },
    async del(key) {
        const client = this.init();
        return client.del(key);
    },
    client() {
        return this.init();
    },
    async close() {
        return this.init().disconnect();
    },
};
exports.default = dataStore;
