"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const colors_1 = __importDefault(require("colors"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const constants_1 = require("../config/constants");
class AppLogger {
    module;
    transports;
    constructor(module) {
        this.transports = this.getTransports();
        this.module = module;
        this.createLogger();
    }
    _logger;
    get logger() {
        return this._logger;
    }
    static init(module) {
        return new AppLogger(module);
    }
    createLogger() {
        const { errors, label, timestamp, combine } = winston_1.format;
        this._logger = (0, winston_1.createLogger)({
            transports: [this.transports],
            exitOnError: false,
            level: 'info',
            format: combine(errors({ stack: true }), label({ label: this.module }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss a' })),
        });
    }
    getTransports() {
        if (process.env.NODE_ENV === 'production') {
            const options = {
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: winston_1.format.printf(({ level, label, timestamp, stack, message }) => {
                    return `[${timestamp}] ${label}.${level}: ${stack ? stack : message}`;
                }),
            };
            return new winston_daily_rotate_file_1.default({
                ...options,
                filename: 'logs/app-%DATE%.log',
            });
        }
        return new winston_1.transports.Console({
            level: 'debug',
            format: winston_1.format.printf(({ level, label, timestamp, stack, message }) => {
                //@ts-ignore
                return colors_1.default[constants_1.LOG_LEVEL_COLORS[level]](`[${timestamp}] ${label}.${level}: ${stack ? stack : message}`);
            }),
        });
    }
}
exports.default = AppLogger;
