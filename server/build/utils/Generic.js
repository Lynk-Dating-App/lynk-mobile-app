"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const camelcase_1 = __importDefault(require("camelcase"));
const jsonwebtoken_1 = require("jsonwebtoken");
const settings_1 = __importDefault(require("../config/settings"));
const crypto_1 = __importDefault(require("crypto"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const UserToken_1 = __importDefault(require("../models/UserToken"));
class Generic {
    static functionIntervalCaller(config) {
        const start = config.interval;
        const stop = config.attempts * start;
        const cycle = stop / start;
        let count = 0;
        const run = () => {
            const interval = setInterval(() => {
                if (config.reset) {
                    clearInterval(interval);
                    run();
                }
                count++;
                if (config.stop)
                    clearInterval(interval);
                if (count >= cycle)
                    clearInterval(interval);
                config.onTick(config);
                if (config.log)
                    config.log({ count, options: config });
            }, start);
        };
        run();
    }
    static async fileExist(path) {
        try {
            await promises_1.default.access(path);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    static capitalizeFirstLetter(string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
    }
    static capitalizeWord(sentence) {
        const words = sentence?.split(' ');
        const capitalizedWords = words?.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords?.join(' ');
    }
    static async getImagePath(params) {
        const exists = await this.fileExist(params.basePath);
        if (!exists)
            await promises_1.default.mkdir(params.basePath);
        const newFileName = `${(0, uuid_1.v4)()}${node_path_1.default.extname(params.filename)}`;
        const newPath = `${params.basePath}/${newFileName}`;
        await promises_1.default.rename(params.tempPath, newPath);
        return newPath;
    }
    /**
     * @name generateJwt
     * @param payload
     * @desc
     * Generate jsonwebtoken.
     */
    static generateJwt(payload) {
        const key = settings_1.default.jwt.key;
        return (0, jsonwebtoken_1.sign)(payload, key);
    }
    static async generateJWT(payload) {
        try {
            // Create the access token
            const accessToken = (0, jsonwebtoken_1.sign)(payload, settings_1.default.jwtAccessToken.key, { expiresIn: settings_1.default.jwtAccessToken.expiry });
            // Create the refresh token
            const refreshToken = (0, jsonwebtoken_1.sign)(payload, settings_1.default.jwtRefreshToken.key, { expiresIn: settings_1.default.jwtRefreshToken.expiry });
            // Delete any existing user tokens
            await UserToken_1.default.deleteOne({ userId: payload.userId });
            // Calculate the refresh token expiration date (e.g., 7 days from now)
            const refreshTokenExpiry = new Date();
            refreshTokenExpiry.setHours(refreshTokenExpiry.getHours() + 24);
            // Create a new user token
            await UserToken_1.default.create({
                userId: payload.userId,
                token: refreshToken,
                expired_at: refreshTokenExpiry,
            });
            return { accessToken, refreshToken };
        }
        catch (err) {
            return Promise.reject((CustomAPIError_1.default.response(err, HttpStatus_1.default.BAD_REQUEST.code)));
        }
    }
    ;
    static async refreshToken(refreshToken, req, next) {
        try {
            if (!refreshToken) {
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
            }
            // Check if the refresh token exists in the database
            const userToken = await UserToken_1.default.findOne({ token: refreshToken });
            if (!userToken) {
                // throw new AppError('Invalid refresh token', BAD_REQUEST);
                return Promise.reject(CustomAPIError_1.default.response('Invalid refresh token', HttpStatus_1.default.BAD_REQUEST.code));
            }
            // Verify the refresh token and get the payload
            const data = (0, jsonwebtoken_1.verify)(refreshToken, settings_1.default.jwtRefreshToken.key);
            // Check if there is a valid user token in the database
            const dbToken = await UserToken_1.default.findOne({
                userId: data.userId,
                expired_at: { $gte: new Date() }
            });
            if (!dbToken) {
                // throw new AppError('Invalid refresh token', BAD_REQUEST);
                return Promise.reject(CustomAPIError_1.default.response('Invalid refresh token', HttpStatus_1.default.BAD_REQUEST.code));
            }
            // Attach the payload to the request object
            req.data = data;
            next();
        }
        catch (error) {
            next(Promise.reject(CustomAPIError_1.default.response(error, HttpStatus_1.default.BAD_REQUEST.code)));
        }
    }
    static generateRandomString(limit) {
        const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz@#!$%^&+=';
        let randomString = '';
        for (let i = 0; i < limit; i++) {
            const randomNum = Math.floor(Math.random() * letters.length);
            randomString += letters.substring(randomNum, randomNum + 1);
        }
        return randomString;
    }
    static generatePasswordResetCode(limit) {
        const letters = '0123456789';
        const letterCount = letters.length;
        const randomBytes = crypto_1.default.randomBytes(limit);
        let randomString = '';
        for (let i = 0; i < limit; i++) {
            const randomNum = randomBytes[i] % letterCount;
            randomString += letters[randomNum];
        }
        return randomString;
    }
    // THIS HAS LESS CHANCE OF DUPLICATE VALUE
    // public static generateRandomStringCrypto(limit: number) {
    //   const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz@#!$%^&+=';
    //   const letterCount = letters.length;
    //   const randomBytes = crypto.randomBytes(limit);
    //   let randomString = '';
    //   for (let i = 0; i < limit; i++) {
    //     const randomNum = randomBytes[i] % letterCount;
    //     randomString += letters[randomNum];
    //   }
    //   return randomString;
    // }
    /**
     * @name randomize
     * @description generate random chars (string,numbers,special characters, or mixed)
     * @description default count is 10 and result is numbers if no options are passed
     * @param options
     */
    static randomize(options) {
        const numbers = '01234567890123456789012345678901234567890123456789';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        const specialChars = '@#!$%^&+=*()<>_-?|.';
        let text = numbers;
        let count = 10;
        let result = '';
        if (options?.count)
            count = options.count;
        if (options?.number)
            text = numbers;
        if (options?.string)
            text = letters;
        if (options?.mixed)
            text = numbers + letters + specialChars;
        if (options?.alphanumeric)
            text = letters + numbers;
        for (let i = 0; i < count; i++) {
            const randomNum = Math.floor(Math.random() * text.length);
            result += text.substring(randomNum, randomNum + 1);
        }
        return result;
    }
    static generateCode(data, prefix, id) {
        let count = data.length + 1;
        let code;
        do {
            code = `${prefix}-${id}${count.toString().padStart(4, '0')}`;
            count++;
        } while (data.some((expense) => expense.code === code));
        return code;
    }
    static convertTextToCamelcase(text) {
        text = text.replace(/[^a-zA-Z0-9 ]/g, '');
        return (0, camelcase_1.default)(text);
    }
    static formatNumberToIntl(number) {
        return new Intl.NumberFormat('en-GB', {
            minimumFractionDigits: 2,
        }).format(number);
    }
    static generateSlug(text) {
        text = text.trim();
        if (text.search(/\s/g) !== -1) {
            return text.toUpperCase().replace(/\s/g, '_');
        }
        return text.toUpperCase();
    }
    static calculateDiscount(principal, discount) {
        return principal - principal * (discount / 100);
    }
    static getMonths() {
        return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
    }
    static location_km(userALat, userALon, userBLat, userBLon) {
        const earthRadius = 6371;
        // Convert latitude and longitude to radians
        const userALatRadians = this.toRadians(userALat);
        const userALonRadians = this.toRadians(userALon);
        const userBLatRadians = this.toRadians(userBLat);
        const userBLonRadians = this.toRadians(userBLon);
        // Calculate the differences between the latitudes and longitudes
        const latDiff = userBLatRadians - userALatRadians;
        const lonDiff = userBLonRadians - userALonRadians;
        // Apply the Haversine formula
        const a = Math.sin(latDiff / 2) ** 2 +
            Math.cos(userALatRadians) * Math.cos(userBLatRadians) * Math.sin(lonDiff / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // Calculate the distance
        const distance = earthRadius * c;
        return distance;
    }
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    static dateDifference(date) {
        const targetDate = (0, moment_1.default)(date);
        const currentDate = (0, moment_1.default)();
        const minutesDifference = currentDate.diff(targetDate, 'minutes');
        let result;
        if (minutesDifference < 60) {
            result = `${minutesDifference} min`;
        }
        else if (minutesDifference < 24 * 60) {
            const hoursDifference = Math.floor(minutesDifference / 60);
            result = hoursDifference === 1 ? `${hoursDifference} hour` : `${hoursDifference} hours`;
        }
        else if (minutesDifference < 48 * 60) {
            result = 'Yesterday';
        }
        else {
            result = targetDate.format('DD/MM/YYYY');
        }
        return result;
    }
}
exports.default = Generic;
