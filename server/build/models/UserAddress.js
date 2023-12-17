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
exports.$updateUserAddress = exports.$saveUserAddress = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const userAddressSchema = new mongoose_1.Schema({
    // address_type: { type: String },
    address: { type: String },
    street: { type: String, allowNull: true },
    country: { type: String },
    state: { type: String },
    district: { type: String },
    favorite: { type: Boolean },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
userAddressSchema.pre('findOne', function (next) {
    this.populate('user');
    next();
});
const UserAddress = mongoose_1.default.model('UserAddress', userAddressSchema);
exports.$saveUserAddress = {
    address: joi_1.default.string().required().label('address'),
    street: joi_1.default.string().required().label('street'),
    country: joi_1.default.string().required().label('country'),
    state: joi_1.default.string().required().label('state'),
    district: joi_1.default.string().required().label('district'),
};
exports.$updateUserAddress = {
    // address_type: Joi.string().label('address type'),
    address: joi_1.default.string().label('address'),
    street: joi_1.default.string().label('street'),
    country: joi_1.default.string().label('country'),
    state: joi_1.default.string().label('state'),
    district: joi_1.default.string().label('district'),
};
exports.default = UserAddress;
