"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authRoute_1 = require("../../routes/authRoute");
const authEndpoints = [
    {
        name: 'signIn-admin',
        method: 'post',
        path: '/sign-in-admin',
        handler: authRoute_1.signInHandler_Admin
    },
    {
        name: 'signIn user',
        method: 'post',
        path: '/sign-in-user',
        handler: authRoute_1.signInHandler_User
    },
    {
        name: 'signIn user with biometric',
        method: 'post',
        path: '/sign-in-user-with-biometric',
        handler: authRoute_1.signIWithBiometricHandler
    },
    {
        name: 'sign-up-user-black',
        method: 'post',
        path: '/sign-up-user-black',
        handler: authRoute_1.signupUserBlackHandler
    },
    {
        name: 'sign-up-user-red',
        method: 'post',
        path: '/sign-up-user-red/:planId',
        handler: authRoute_1.signupUserRedHandler
    },
    {
        name: 'sign-up-user-purple',
        method: 'post',
        path: '/sign-up-user-purple/:planId',
        handler: authRoute_1.signupUserPurpleHandler
    },
    {
        name: 'google OAuth',
        method: 'get',
        path: '/google',
        handler: authRoute_1.googleOAuthHandler
    },
    {
        name: 'google OAuth callback',
        method: 'get',
        path: '/google/callback',
        handler: authRoute_1.googleOAutCallbackhHandler
    },
    {
        name: 'facebook OAuth',
        method: 'get',
        path: '/facebook',
        handler: authRoute_1.facebookOAuthHandler
    },
    {
        name: 'facebook OAuth callback',
        method: 'get',
        path: '/facebook/callback',
        handler: authRoute_1.facebookOAutCallbackhHandler
    },
    {
        name: 'instagram OAuth',
        method: 'get',
        path: '/instagram',
        handler: authRoute_1.instagramOAuthHandler
    },
    {
        name: 'instagram OAuth callback',
        method: 'get',
        path: '/instagram/callback',
        handler: authRoute_1.instagramOAutCallbackhHandler
    },
    {
        name: 'login failed',
        method: 'get',
        path: '/google/failed',
        handler: authRoute_1.loginFailedHandler
    }
];
exports.default = authEndpoints;
