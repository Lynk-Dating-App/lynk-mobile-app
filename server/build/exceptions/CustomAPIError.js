"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomAPIError extends Error {
    _code;
    constructor(message, code) {
        super(message);
        this._code = code;
    }
    get code() {
        return this._code;
    }
    static response(message, code) {
        return new CustomAPIError(message, code);
    }
}
exports.default = CustomAPIError;
