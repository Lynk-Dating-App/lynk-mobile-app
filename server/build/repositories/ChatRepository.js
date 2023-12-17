"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatModel_1 = __importDefault(require("../models/ChatModel"));
const CrudRepository_1 = __importDefault(require("../helpers/CrudRepository"));
class ChatRepository extends CrudRepository_1.default {
    constructor() {
        super(ChatModel_1.default);
    }
}
exports.default = ChatRepository;
