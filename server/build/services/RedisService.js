"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const twilio_1 = __importDefault(require("twilio"));
const crypto_1 = __importDefault(require("crypto"));
const settings_1 = __importDefault(require("../config/settings"));
class RedisService {
    twilioConfig = {
        accountSid: settings_1.default.twilio.twilioSid,
        authToken: settings_1.default.twilio.twilioAuthToken,
        phoneNumber: settings_1.default.twilio.phoneNumber
    };
    redisClient = ioredis_1.default.createClient();
    twilioClient = (0, twilio_1.default)(this.twilioConfig.accountSid, this.twilioConfig.authToken);
    twilioPhoneNumber = this.twilioConfig.phoneNumber;
    generateToken() {
        const letters = '0123456789';
        const letterCount = letters.length;
        const limit = 4;
        const randomBytes = crypto_1.default.randomBytes(limit);
        let token = '';
        for (let i = 0; i < limit; i++) {
            const randomNum = randomBytes[i] % letterCount;
            token += letters[randomNum];
        }
        return token;
    }
    // public saveToken(keys: string, data: any, expire: number): void {
    //   this.redisClient.set(keys, data, 'EX', expire);
    // }
    saveToken(keys, data, expire) {
        if (expire) {
            this.redisClient.set(keys, data, 'EX', expire);
        }
        else {
            this.redisClient.set(keys, data);
        }
    }
    sendNotification(phoneNumber, message) {
        return new Promise((resolve, reject) => {
            this.twilioClient.messages
                .create({
                body: message,
                from: this.twilioPhoneNumber,
                to: phoneNumber
            })
                .then((response) => {
                resolve(response);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
    checkRedisKey(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.exists(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    const result = reply?.toString();
                    resolve(result ?? null);
                }
            });
        });
    }
    ;
    deleteRedisKey(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, (err, reply) => {
                if (err) {
                    reject(err);
                }
                else {
                    const result = reply?.toString();
                    resolve(result ?? null);
                }
            });
        });
    }
    ;
    getToken(token) {
        return new Promise((resolve, reject) => {
            this.redisClient.get(token, (error, reply) => {
                if (error) {
                    reject(error);
                }
                else {
                    const data = reply ? JSON.parse(reply) : null;
                    resolve(data);
                }
            });
        });
    }
    closeConnections() {
        this.redisClient.quit();
    }
}
exports.default = RedisService;
