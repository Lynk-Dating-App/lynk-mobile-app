"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_facebook_1 = require("passport-facebook");
const passport_instagram_1 = require("passport-instagram");
const settings_1 = __importDefault(require("../config/settings"));
const dao_1 = __importDefault(require("./dao"));
const User_1 = __importDefault(require("../models/User"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const constants_1 = require("../config/constants");
//Google Strategy
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: settings_1.default.googleOAuth.google_client_id,
    clientSecret: settings_1.default.googleOAuth.google_client_secret,
    callbackURL: settings_1.default.googleOAuth.google_callbackURL,
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, cb) {
    dao_1.default.userDAOService.findByAny({ googleId: profile.id })
        .then(async (user) => {
        if (user) {
            const role = await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
            if (!role) {
                return cb(null, false, { message: 'Role is not found.' });
            }
            return cb(null, user._id, { newReg: false });
        }
        else {
            // User does not exist, create a new user
            const role = await dao_1.default.roleDAOService.findByAnyPopulatePermissions({
                slug: settings_1.default.roles[1]
            });
            if (!role) {
                return cb(null, false, { message: 'Role is not found.' });
            }
            ;
            // const _user = await datasources.userDAOService.findByAny({email: profile.email})
            // if (_user) {
            //     return cb(null, false, {
            //         message: 'A user with the email already exists. Please use a different email.'
            //     });
            // };
            const sub = await dao_1.default.subscriptionDAOService.findByAny({ name: constants_1.BLACK_PLAN });
            if (!sub) {
                return Promise.reject(CustomAPIError_1.default.response('Subscription not found', HttpStatus_1.default.BAD_REQUEST.code));
            }
            const userValues = {
                googleId: profile.id,
                firstName: profile.given_name,
                lastName: profile.family_name,
                role: role._id,
                active: true,
                email: profile.email,
                subscription: {
                    plan: sub?.name,
                    startDate: null,
                    endDate: null
                }
            };
            const user = await dao_1.default.userDAOService.create(userValues);
            role.users.push(user._id);
            await role.save();
            return cb(null, user._id, { newReg: true });
        }
    })
        .catch((error) => {
        return cb(error.message);
    });
}));
// Facebook Strategy
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: settings_1.default.facebookAuth.client_ID,
    clientSecret: settings_1.default.facebookAuth.client_secret,
    callbackURL: settings_1.default.facebookAuth.facebook_callbackURL,
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, cb) {
    dao_1.default.userDAOService.findByAny({ facebookId: profile.id })
        .then(async (user) => {
        if (user) {
            const role = await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
            if (!role) {
                return cb(null, false, { message: 'Role is not found.' });
            }
            return cb(null, user._id, { newReg: false });
        }
        else {
            // User does not exist, create a new user
            const role = await dao_1.default.roleDAOService.findByAnyPopulatePermissions({
                slug: settings_1.default.roles[1]
            });
            if (!role) {
                return cb(null, false, { message: 'Role is not found.' });
            }
            ;
            const sub = await dao_1.default.subscriptionDAOService.findByAny({ name: constants_1.BLACK_PLAN });
            if (!sub) {
                return Promise.reject(CustomAPIError_1.default.response('Subscription not found', HttpStatus_1.default.BAD_REQUEST.code));
            }
            const userValues = {
                googleId: profile.id,
                firstName: profile.given_name,
                lastName: profile.family_name,
                role: role._id,
                active: true,
                email: profile.email ? profile.email : '',
                subscription: {
                    plan: sub?.name,
                    startDate: null,
                    endDate: null
                }
            };
            const user = await dao_1.default.userDAOService.create(userValues);
            role.users.push(user._id);
            await role.save();
            return cb(null, user._id, { newReg: true });
        }
    })
        .catch((error) => {
        return cb(error.message);
    });
}));
// Instagram Strategy
passport_1.default.use(new passport_instagram_1.Strategy({
    clientID: settings_1.default.instagramAuth.client_ID,
    clientSecret: settings_1.default.instagramAuth.client_secret,
    callbackURL: settings_1.default.instagramAuth.instagram_callbackURL,
    passReqToCallback: true,
}, function (request, accessToken, refreshToken, profile, cb) {
    dao_1.default.userDAOService.findByAny({ instagramId: profile.id })
        .then(async (user) => {
        if (user) {
            const role = await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
            if (!role) {
                return cb(null, false, { message: 'Role is not found.' });
            }
            return cb(null, user._id, { newReg: false });
        }
        else {
            // User does not exist, create a new user
            const role = await dao_1.default.roleDAOService.findByAnyPopulatePermissions({
                slug: settings_1.default.roles[1]
            });
            if (!role) {
                return cb(null, false, { message: 'Role is not found.' });
            }
            ;
            const sub = await dao_1.default.subscriptionDAOService.findByAny({ name: constants_1.BLACK_PLAN });
            if (!sub) {
                return Promise.reject(CustomAPIError_1.default.response('Subscription not found', HttpStatus_1.default.BAD_REQUEST.code));
            }
            const userValues = {
                googleId: profile.id,
                firstName: profile.given_name,
                lastName: profile.family_name,
                role: role._id,
                active: true,
                email: profile.email ? profile.email : '',
                subscription: {
                    plan: sub?.name,
                    startDate: null,
                    endDate: null
                }
            };
            const user = await dao_1.default.userDAOService.create(userValues);
            role.users.push(user._id);
            await role.save();
            return cb(null, user._id, { newReg: true });
        }
    })
        .catch((error) => {
        return cb(error.message);
    });
}));
passport_1.default.serializeUser(function (userId, done) {
    done(null, userId);
});
passport_1.default.deserializeUser((userId, done) => {
    User_1.default.findById(userId)
        .then((response) => {
        if (response) {
            done(null, response);
        }
        else {
            done(new Error('User not found'), null);
        }
    })
        .catch((err) => {
        done(err, null);
    });
});
