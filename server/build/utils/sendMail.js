"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const sendMail = async (data) => {
    // 
    const transporter = nodemailer_1.default.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL_ADDRESS,
            pass: process.env.NODEMAILER_EMAIL_PASSWORD
        },
    });
    // let mailOptions = {
    //   from: 'your-email@your-domain.com',
    //   to: 'recipient-email@example.com',
    //   subject: 'Test Email',
    //   text: 'Hello, this is a test email sent from Node.js using my own SMTP server!',
    // };
    // // Send the email
    // let info = await transporter.sendMail(mailOptions);
    // send mail with defined transport object
    const info = await transporter.sendMail(data);
    console.log(info, "info");
};
exports.sendMail = sendMail;
