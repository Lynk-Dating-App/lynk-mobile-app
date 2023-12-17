"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = __importDefault(require("../config/endpoints"));
const express_1 = require("express");
const asyncErrorWrapper_1 = __importDefault(require("../middleware/asyncErrorWrapper"));
const router = (0, express_1.Router)();
endpoints_1.default.forEach(value => {
    const method = value.method;
    router[method](value.path, (0, asyncErrorWrapper_1.default)(value.handler));
});
exports.default = router;
