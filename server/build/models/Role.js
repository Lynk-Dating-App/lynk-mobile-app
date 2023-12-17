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
exports.$updateRoleSchema = exports.$saveRoleSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
;
const roleSchema = new mongoose_1.Schema({
    name: { type: String },
    slug: { type: String },
    permissions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Permission' }],
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
});
roleSchema.pre('find', function (next) {
    this.populate('permissions');
    next();
});
const Role = mongoose_1.default.model('Role', roleSchema);
exports.$saveRoleSchema = {
    name: joi_1.default.string().required().label('name'),
    slug: joi_1.default.string().optional().label('slug'),
    permit: joi_1.default.array().required().label('permit'),
    permissions: joi_1.default.array().items(joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/).required()).optional().label('permissions')
};
exports.$updateRoleSchema = {
    // _id: Joi.string().required().label('roleId'),
    permit: joi_1.default.array().required().label('permit'),
    name: joi_1.default.string().required().label('name')
    // permissions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()).required().label('permissions')
};
exports.default = Role;
