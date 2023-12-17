"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const settings_1 = __importDefault(require("../config/settings"));
class TermiiService {
    Axios;
    constructor() {
        this.Axios = axios_1.default.create({
            baseURL: settings_1.default.termii.host,
            headers: { "Accept-Encoding": "gzip,deflate,compress" },
        });
    }
    async sendOtp(phoneNumber) {
        phoneNumber =
            phoneNumber.charAt(0) == "0"
                ? `234${phoneNumber.substring(1, phoneNumber.length)}`
                : phoneNumber;
        const response = await this.Axios.post("/api/sms/otp/send", {
            api_key: settings_1.default.termii.key,
            message_type: "NUMERIC",
            to: phoneNumber,
            from: settings_1.default.termii.from,
            channel: "dnd",
            pin_attempts: 1,
            pin_time_to_live: 30,
            pin_length: 6,
            pin_placeholder: "< 123456 >",
            message_text: "Your HyveTech code is < 123456 >. It expires in 30 minutes.",
            pin_type: "NUMERIC",
        });
        return response.data;
    }
    async verifyOtp(pinId, pin) {
        const response = await this.Axios.post("/api/sms/otp/verify", {
            api_key: settings_1.default.termii.key,
            pin_id: pinId,
            pin,
        });
        return response.data;
    }
    async sendMessage(payload) {
        try {
            payload.to =
                payload.to.charAt(0) == "0"
                    ? `234${payload.to.substring(1, payload.to.length)}`
                    : payload.to;
            const response = await this.Axios.post("/api/sms/send", {
                ...payload,
                from: settings_1.default.termii.from,
                api_key: settings_1.default.termii.key,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = TermiiService;
