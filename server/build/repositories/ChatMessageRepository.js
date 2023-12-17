"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatMessages_1 = __importDefault(require("../models/ChatMessages"));
const CrudRepository_1 = __importDefault(require("../helpers/CrudRepository"));
class ChatMessageRepository extends CrudRepository_1.default {
    constructor() {
        super(ChatMessages_1.default);
    }
}
exports.default = ChatMessageRepository;
