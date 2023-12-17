"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appEventEmitter = void 0;
const events_1 = __importDefault(require("events"));
events_1.default.setMaxListeners(Infinity);
class AppEventEmitter extends events_1.default {
}
exports.appEventEmitter = new AppEventEmitter();
