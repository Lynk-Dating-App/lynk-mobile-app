"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_1 = __importDefault(require("../models/Notification"));
const CrudRepository_1 = __importDefault(require("../helpers/CrudRepository"));
class NotificationRepository extends CrudRepository_1.default {
    constructor() {
        super(Notification_1.default);
    }
}
exports.default = NotificationRepository;
