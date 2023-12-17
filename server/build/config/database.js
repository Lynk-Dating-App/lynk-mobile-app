"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoUrl = void 0;
const settings_1 = __importDefault(require("./settings"));
const mongoose_1 = __importDefault(require("mongoose"));
const env = process.env.NODE_ENV;
exports.mongoUrl = settings_1.default.mongo[env].host;
const database = {
    mongodb: async () => {
        mongoose_1.default.set('strictQuery', true);
        return mongoose_1.default.connect(exports.mongoUrl);
    },
    mongoUrl: exports.mongoUrl
};
exports.default = database;
