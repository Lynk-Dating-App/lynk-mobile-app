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
exports.$loginSchema = exports.$updateJobDescription = exports.$updateUserSchema = exports.$saveUserSchema = exports.$savePassword = exports.$savePasswordAfterReset = exports.$resetPassword = exports.$changePassword = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, allowNull: true },
    email: { type: String, allowNull: true },
    address: { type: String, allowNull: true },
    phone: { type: String },
    gender: { type: String },
    profileImageUrl: { type: String, allowNull: true },
    active: { type: Boolean, allowNull: true },
    loginToken: { type: String, allowNull: true },
    loginDate: { type: Date, allowNull: true },
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Role' },
    passwordResetCode: { type: String, allowNull: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    googleId: { type: String, allowNull: true },
    instagramId: { type: String, allowNull: true },
    facebookId: { type: String, allowNull: true },
    verify: { type: String },
    profileVisibility: { type: Boolean, default: true },
    planType: { type: String },
    isExpired: { type: Boolean, default: false },
    subscription: {
        plan: { type: String, allowNull: true },
        startDate: { type: Date, allowNull: true },
        endDate: { type: Date, allowNull: true }
    },
    jobType: { type: String },
    jobDescription: { type: String },
    about: { type: String, allowNull: true },
    height: { type: String, allowNull: true },
    age: { type: String },
    state: { type: String },
    preference: {
        pAbout: { type: String, allowNull: true },
        pMinAge: { type: String, allowNull: true },
        pMaxAge: { type: String, allowNull: true },
        // pState: { type: String, allowNull: true },
        pMinHeight: { type: String, allowNull: true },
        pMaxHeight: { type: String, allowNull: true },
        pGender: { type: String, allowNull: true }
    },
    level: { type: Number, default: 0 },
    videoUrl: { type: String, allowNull: true },
    videoUploadedAt: { type: Date, allowNull: true },
    likedUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    likedByUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    favourites: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    unLikedUsers: [{ date: { type: Date }, user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' } }],
    location: {
        type: {
            type: String,
            enum: ['Point'], // Only allow 'Point' as the type
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [-1, -1]
        }
    },
    gallery: [{ type: String }],
    interests: [{ type: String, allowNull: true }],
    build: { type: String, allowNull: true },
    dob: { type: Date },
    publicKey: { type: String, allowNull: true },
    education: { type: String, allowNull: true },
    religion: { type: String, allowNull: true },
    religiousInvolvement: { type: String, allowNull: true },
    relationshipPreference: { type: String, allowNull: true },
    personalityTemperament: { type: String, allowNull: true },
    officeName: { type: String, allowNull: true },
    officeAddress: { type: String, allowNull: true },
    socialHandles: [{
            handle: { type: String, allowNull: true },
            social: { type: String, allowNull: true }
        }],
    sexualPreference: { type: String, allowNull: true }
});
userSchema.index({ location: '2dsphere' });
const User = mongoose_1.default.model('User', userSchema);
exports.$changePassword = {
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password'),
    confirmPassword: joi_1.default.ref("password"),
    currentPassword: joi_1.default.string().required().label('previous password')
};
exports.$resetPassword = {
    phone: joi_1.default.string().required().label('phone')
};
exports.$savePasswordAfterReset = {
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password'),
    confirmPassword: joi_1.default.ref("password"),
    phone: joi_1.default.string().required().label('phone')
};
exports.$savePassword = {
    email: joi_1.default.string().required().label('email'),
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password'),
    confirmPassword: joi_1.default.ref("password"),
    token: joi_1.default.string().required().label("token")
};
exports.$saveUserSchema = {
    // firstName: Joi.string().required().label('first name'),
    // lastName: Joi.string().required().label('last name'),
    email: joi_1.default.string().required().label('email'),
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password'),
    confirmPassword: joi_1.default.ref('password'),
    // gender: Joi.string().required().label('gender'),
    phone: joi_1.default.string().required().label('phone Number'),
    // profileImageUrl: Joi.string().optional().label("profile image")
};
exports.$updateUserSchema = {
    firstName: joi_1.default.string().label('first name'),
    lastName: joi_1.default.string().label('last name'),
    about: joi_1.default.string().label('about'),
    height: joi_1.default.string().label('height'),
    state: joi_1.default.string().label('state'),
    age: joi_1.default.string().label('age'),
    address: joi_1.default.string().label('address'),
    officeName: joi_1.default.string().label('officeName'),
    officeAddress: joi_1.default.string().label('officeAddress'),
    religion: joi_1.default.string().label('religion'),
    religiousInvolvement: joi_1.default.string().label('religiousInvolvement'),
    interests: joi_1.default.any().label('interests'),
    sexualPreference: joi_1.default.string().label('sexualPreference'),
    relationshipPreference: joi_1.default.string().label('relationshipPreference'),
    personalityTemperament: joi_1.default.string().label('personalityTemperament'),
    education: joi_1.default.string().label('education'),
    email: joi_1.default.string().label('email'),
    phone: joi_1.default.string().label('phone')
};
exports.$updateJobDescription = {
    jobType: joi_1.default.string().required().label('job type'),
    jobDescription: joi_1.default.string().required().label('job description')
};
exports.$loginSchema = {
    emailOrPhone: joi_1.default.string().required().label('email or phone'),
    password: joi_1.default.string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
        .messages({
        'string.pattern.base': `Password does not meet requirements.`,
    })
        .required()
        .label('password'),
};
exports.default = User;
