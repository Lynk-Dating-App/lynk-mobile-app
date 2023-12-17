"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = __importDefault(require("../config/settings"));
class SendMailService {
    nodemailerConfig = {
        service: settings_1.default.nodemailer.service,
        user: settings_1.default.nodemailer.email,
        pass: settings_1.default.nodemailer.password
    };
    transporter = nodemailer_1.default.createTransport({
        service: this.nodemailerConfig.service,
        auth: {
            user: this.nodemailerConfig.user,
            pass: this.nodemailerConfig.pass
        }
    });
    sendMail(data) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(data, (error, info) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(info);
                }
            });
        });
    }
}
;
exports.default = SendMailService;
