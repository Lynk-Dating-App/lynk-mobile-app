"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
const settings_1 = __importDefault(require("../config/settings"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const AdminRepository_1 = __importDefault(require("../repositories/AdminRepository"));
const vendorRepository = new UserRepository_1.default();
const userRepository = new AdminRepository_1.default();
const logger = AppLogger_1.default.init(authenticateRouteWrapper.name).logger;
function authenticateRouteWrapper(handler) {
    return async function (req, res, next) {
        const headers = req.headers;
        const authorization = headers.authorization;
        const key = settings_1.default.jwt.key;
        if (authorization) {
            if (!authorization.startsWith('Bearer')) {
                logger.error(`malformed authorization: 'Bearer' missing`);
                return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            }
            const jwt = authorization.split(' ')[1].trim();
            const payload = (0, jsonwebtoken_1.verify)(jwt, key);
            req.permissions = payload.permissions;
            req.subscription = payload.subscription;
            req.jwt = jwt;
            if (payload.userId) {
                const { userId } = payload;
                const user = await userRepository.findById(userId);
                if (user) {
                    req.user = user;
                    return await handler(req, res, next);
                }
                const vendor = await vendorRepository.findById(userId);
                if (vendor) {
                    req.user = vendor;
                    return await handler(req, res, next);
                }
            }
        }
        return next(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
    };
}
exports.default = authenticateRouteWrapper;
