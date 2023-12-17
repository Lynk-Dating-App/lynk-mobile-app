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
exports.loginFailedHandler = exports.instagramOAutCallbackhHandler = exports.instagramOAuthHandler = exports.facebookOAutCallbackhHandler = exports.facebookOAuthHandler = exports.googleOAutCallbackhHandler = exports.googleOAuthHandler = exports.signIWithBiometricHandler = exports.signInHandler_User = exports.signInHandler_Admin = exports.signupUserPurpleHandler = exports.signupUserRedHandler = exports.signupUserBlackHandler = void 0;
const AuthenticationController_1 = __importDefault(require("../controller/AuthenticationController"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const passport_1 = __importDefault(require("passport"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const dao_1 = __importDefault(require("../services/dao"));
const settings_1 = __importStar(require("../config/settings"));
const passwordEncoder = new PasswordEncoder_1.default();
const authController = new AuthenticationController_1.default(passwordEncoder);
const signupUserBlackHandler = async (req, res) => {
    const response = await authController.signupUser_black(req);
    res.status(response.code).json(response);
};
exports.signupUserBlackHandler = signupUserBlackHandler;
const signupUserRedHandler = async (req, res) => {
    const response = await authController.subscribeAndSignUp_red(req);
    res.status(response.code).json(response);
};
exports.signupUserRedHandler = signupUserRedHandler;
const signupUserPurpleHandler = async (req, res) => {
    const response = await authController.subscribeAndSignUp_purple(req);
    res.status(response.code).json(response);
};
exports.signupUserPurpleHandler = signupUserPurpleHandler;
const signInHandler_Admin = async (req, res) => {
    const response = await authController.admin_login(req);
    res.status(response.code).json(response);
};
exports.signInHandler_Admin = signInHandler_Admin;
const signInHandler_User = async (req, res) => {
    const response = await authController.sign_in_user(req);
    res.status(response.code).json(response);
};
exports.signInHandler_User = signInHandler_User;
const signIWithBiometricHandler = async (req, res) => {
    const response = await authController.sign_in_with_biometric(req);
    res.status(response.code).json(response);
};
exports.signIWithBiometricHandler = signIWithBiometricHandler;
exports.googleOAuthHandler = (passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
const googleOAutCallbackhHandler = (req, res, next) => {
    passport_1.default.authenticate('google', { failureRedirect: 'http://localhost:5173/error' }, async (err, userId, newReg) => {
        if (err) {
            const error = 'An error occurred. Please try again';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        if (!userId) {
            const error = 'User not authenticated. Please try again';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user?.active) {
            const error = 'Account is disabled. Please contact the administrator.';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        const role = newReg.newReg
            ? await dao_1.default.roleDAOService.findByAnyPopulatePermissions({
                slug: settings_1.default.roles[1],
            })
            : await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
        if (user) {
            //generate JWT
            const _jwt = Generic_1.default.generateJwt({
                userId: user._id,
                isExpired: user.isExpired,
                permissions: role?.permissions,
                subscription: {
                    plan: user.subscription.plan,
                    startDate: user.subscription.startDate,
                    endDate: user.subscription.endDate
                }
            });
            res.cookie(settings_1.LOGIN_TOKEN, _jwt);
            const updateValues = {
                loginDate: new Date(),
                loginToken: _jwt
            };
            await dao_1.default.userDAOService.update({ _id: user._id }, updateValues);
        }
        ;
        return res.redirect(newReg.newReg === false ? settings_1.HOME_URL : settings_1.SIGN_IN_SUCCESS_URL);
    })(req, res, next);
};
exports.googleOAutCallbackhHandler = googleOAutCallbackhHandler;
exports.facebookOAuthHandler = (passport_1.default.authenticate("facebook", { scope: ["profile"] }));
const facebookOAutCallbackhHandler = (req, res, next) => {
    passport_1.default.authenticate('google', { failureRedirect: 'http://localhost:5173/error' }, async (err, userId, newReg) => {
        if (err) {
            const error = 'An error occurred. Please try again';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        if (!userId) {
            const error = 'User not authenticated. Please try again';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user?.active) {
            const error = 'Account is disabled. Please contact the administrator.';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        const role = newReg.newReg
            ? await dao_1.default.roleDAOService.findByAnyPopulatePermissions({
                slug: settings_1.default.roles[1],
            })
            : await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
        if (user) {
            //generate JWT
            const _jwt = Generic_1.default.generateJwt({
                userId: user._id,
                isExpired: user.isExpired,
                permissions: role?.permissions,
                subscription: {
                    plan: user.subscription.plan,
                    startDate: user.subscription.startDate,
                    endDate: user.subscription.endDate
                }
            });
            res.cookie(settings_1.LOGIN_TOKEN, _jwt);
            const updateValues = {
                loginDate: new Date(),
                loginToken: _jwt
            };
            await dao_1.default.userDAOService.update({ _id: user._id }, updateValues);
        }
        ;
        return res.redirect(newReg.newReg === false ? settings_1.HOME_URL : settings_1.SIGN_IN_SUCCESS_URL);
    })(req, res, next);
};
exports.facebookOAutCallbackhHandler = facebookOAutCallbackhHandler;
exports.instagramOAuthHandler = (passport_1.default.authenticate("instagram", { scope: ["profile"] }));
const instagramOAutCallbackhHandler = (req, res, next) => {
    passport_1.default.authenticate('google', { failureRedirect: 'http://localhost:5173/error' }, async (err, userId, newReg) => {
        if (err) {
            const error = 'An error occurred. Please try again';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        if (!userId) {
            const error = 'User not authenticated. Please try again';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user?.active) {
            const error = 'Account is disabled. Please contact the administrator.';
            res.cookie('loginError', error);
            return res.redirect(settings_1.LOGIN_FAILED_URL);
        }
        const role = newReg.newReg
            ? await dao_1.default.roleDAOService.findByAnyPopulatePermissions({
                slug: settings_1.default.roles[1],
            })
            : await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
        if (user) {
            //generate JWT
            const _jwt = Generic_1.default.generateJwt({
                userId: user._id,
                isExpired: user.isExpired,
                permissions: role?.permissions,
                subscription: {
                    plan: user.subscription.plan,
                    startDate: user.subscription.startDate,
                    endDate: user.subscription.endDate
                }
            });
            res.cookie(settings_1.LOGIN_TOKEN, _jwt);
            const updateValues = {
                loginDate: new Date(),
                loginToken: _jwt
            };
            await dao_1.default.userDAOService.update({ _id: user._id }, updateValues);
        }
        ;
        return res.redirect(newReg.newReg === false ? settings_1.HOME_URL : settings_1.SIGN_IN_SUCCESS_URL);
    })(req, res, next);
};
exports.instagramOAutCallbackhHandler = instagramOAutCallbackhHandler;
const loginFailedHandler = async (req, res) => {
    const response = await authController.loginFailed(req, res);
    res.status(response.code).json(response);
};
exports.loginFailedHandler = loginFailedHandler;
