"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_endpoints_1 = __importDefault(require("./auth.endpoints"));
const role_endpoints_1 = __importDefault(require("./role.endpoints"));
const subscription_endpoint_1 = __importDefault(require("./subscription.endpoint"));
const admin_endpoints_1 = __importDefault(require("./admin.endpoints"));
const user_endpoints_1 = __importDefault(require("./user.endpoints"));
const endpoints = admin_endpoints_1.default
    .concat(role_endpoints_1.default)
    .concat(auth_endpoints_1.default)
    .concat(user_endpoints_1.default)
    .concat(subscription_endpoint_1.default);
exports.default = endpoints;
