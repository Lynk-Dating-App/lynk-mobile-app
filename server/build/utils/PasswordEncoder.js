"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
class PasswordEncoder {
    saltRounds = 12;
    constructor() {
        if (process.env.BCRYPT_SALT)
            this.saltRounds = +process.env.BCRYPT_SALT;
    }
    async encode(rawPassword) {
        const salt = await (0, bcryptjs_1.genSalt)(this.saltRounds);
        return (0, bcryptjs_1.hash)(rawPassword, salt);
    }
    match(rawPassword, hash) {
        return (0, bcryptjs_1.compare)(rawPassword, hash);
    }
}
exports.default = PasswordEncoder;
