import {
    // facebookOAutCallbackhHandler,
    // facebookOAuthHandler,
    googleOAutCallbackhHandler,
    loginFailedHandler,
    googleOAuthHandler,
    signInHandler_Admin,
    signInHandler_User,
    signupUserBlackHandler,
    facebookOAuthHandler,
    facebookOAutCallbackhHandler,
    instagramOAuthHandler,
    instagramOAutCallbackhHandler,
    signupUserRedHandler,
    signupUserPurpleHandler,
    signIWithBiometricHandler,
} from '../../routes/authRoute';

import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoint = appCommonTypes.RouteEndpoints;

const authEndpoints: RouteEndpoint  = [
    {
        name: 'signIn-admin',
        method: 'post',
        path: '/sign-in-admin',
        handler: signInHandler_Admin
    },
    {
        name: 'signIn user',
        method: 'post',
        path: '/sign-in-user',
        handler: signInHandler_User
    },
    {
        name: 'signIn user with biometric',
        method: 'post',
        path: '/sign-in-user-with-biometric',
        handler: signIWithBiometricHandler
    },
    {
        name: 'sign-up-user-black',
        method: 'post',
        path: '/sign-up-user-black',
        handler: signupUserBlackHandler
    },
    {
        name: 'sign-up-user-red',
        method: 'post',
        path: '/sign-up-user-red/:planId',
        handler: signupUserRedHandler
    },
    {
        name: 'sign-up-user-purple',
        method: 'post',
        path: '/sign-up-user-purple/:planId',
        handler: signupUserPurpleHandler
    },
    {
        name: 'google OAuth',
        method: 'get',
        path: '/google',
        handler: googleOAuthHandler
    },
    {
        name: 'google OAuth callback',
        method: 'get',
        path: '/google/callback',
        handler: googleOAutCallbackhHandler
    },
    {
        name: 'facebook OAuth',
        method: 'get',
        path: '/facebook',
        handler: facebookOAuthHandler
    },
    {
        name: 'facebook OAuth callback',
        method: 'get',
        path: '/facebook/callback',
        handler: facebookOAutCallbackhHandler
    },
    {
        name: 'instagram OAuth',
        method: 'get',
        path: '/instagram',
        handler: instagramOAuthHandler
    },
    {
        name: 'instagram OAuth callback',
        method: 'get',
        path: '/instagram/callback',
        handler: instagramOAutCallbackhHandler
    },
    {
        name: 'login failed',
        method: 'get',
        path: '/google/failed',
        handler: loginFailedHandler
    }
]

export default authEndpoints;