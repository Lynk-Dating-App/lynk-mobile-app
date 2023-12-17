"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
class HttpStatus {
    static OK = new HttpStatus(constants_1.MESSAGES.http['200'], 200);
    static ACCEPTED = new HttpStatus(constants_1.MESSAGES.http['201'], 201);
    static CREATED = new HttpStatus(constants_1.MESSAGES.http['202'], 202);
    static BAD_REQUEST = new HttpStatus(constants_1.MESSAGES.http['400'], 400);
    static NOT_FOUND = new HttpStatus(constants_1.MESSAGES.http['404'], 404);
    static UNAUTHORIZED = new HttpStatus(constants_1.MESSAGES.http['401'], 401);
    static FORBIDDEN = new HttpStatus(constants_1.MESSAGES.http['403'], 403);
    static INTERNAL_SERVER_ERROR = new HttpStatus(constants_1.MESSAGES.http['500'], 500);
    _value;
    _code;
    constructor(value, code) {
        this._value = value;
        this._code = code;
    }
    get value() {
        return this._value;
    }
    get code() {
        return this._code;
    }
}
exports.default = HttpStatus;
