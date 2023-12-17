"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$changePassword = exports.$loginSchema = exports.$updateAdminSchema = exports.$saveAdminSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const adminSchema = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    active: { type: Boolean, allowNull: true },
    loginToken: { type: String, allowNull: true },
    loginDate: { type: Date, allowNull: true },
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role' },
    // slug: { type: String, allowNull: true }
});
adminSchema.pre('find', function (next) {
    this.populate({
        path: 'role',
        select: '_id name slug permissions'
    });
    next();
});
const Admin = mongoose_1.default.model('Admin', adminSchema);
exports.$saveAdminSchema = {
    firstName: joi_1.default.string().required().label('firstName'),
    lastName: joi_1.default.string().required().label('lastName'),
    email: joi_1.default.string().required().label('email'),
    phone: joi_1.default.string().required().label('phone'),
    password: joi_1.default.string()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=\S+$)[A-Za-z\d]{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password'),
    confirmPassword: joi_1.default.ref('password'),
    roleName: joi_1.default.string().required().label('role name'),
};
exports.$updateAdminSchema = {
    firstName: joi_1.default.string().label('firstName'),
    lastName: joi_1.default.string().label('lastName'),
    email: joi_1.default.string().label('email'),
    gender: joi_1.default.string().label('gender'),
    phone: joi_1.default.string().label('phone'),
};
exports.$loginSchema = {
    email: joi_1.default.string().required().label('email'),
    password: joi_1.default.string()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=\S+$)[A-Za-z\d]{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password')
};
exports.$changePassword = {
    password: joi_1.default.string()
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=\S+$)[A-Za-z\d]{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password'),
    confirmPassword: joi_1.default.ref("password"),
    previousPassword: joi_1.default.string().required().label('previous password')
};
exports.default = Admin;
