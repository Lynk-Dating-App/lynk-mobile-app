"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
const axios_1 = require("axios");
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const logger = AppLogger_1.default.init(globalExceptionHandler.name).logger;
function globalExceptionHandler(err, req, res, next) {
    if (res.headersSent)
        return next(err);
    const response = {
        code: HttpStatus_1.default.INTERNAL_SERVER_ERROR.code,
        message: constants_1.MESSAGES.http['500'],
    };
    if (err instanceof CustomAPIError_1.default) {
        logger.error(err.message);
        logger.error(err.stack);
        response.code = err.code;
        response.message = err.message;
        return res.status(err.code).json(response);
    }
    if (err instanceof axios_1.AxiosError) {
        if (err.response) {
            logger.error(err.message);
            logger.error(err.response.data);
            response.code = err.response.status;
            response.message = err.message;
            return res.status(response.code).json(response);
        }
        if (err.request) {
            logger.error(err.message);
            logger.error(err.request);
            response.message = err.message;
            return res.status(response.code).json(response);
        }
        console.log('out of here');
        return res.status(response.code).json(response);
    }
    process.on('uncaughtException', error => {
        logger.error(error.message);
        logger.error(error.stack);
        response.message = error.message;
        return res.status(response.code).json(response);
    });
    process.on('unhandledRejection', reason => {
        logger.error(reason);
        response.message = reason;
        return res.status(response.code).json(response);
    });
    logger.error(err.message);
    logger.error(err.stack);
    response.message = err.message || `${err}`;
    return res.status(response.code).json(response);
}
exports.default = globalExceptionHandler;
