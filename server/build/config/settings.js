"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN_TOKEN = exports.SIGN_IN_SUCCESS_URL = exports.HOME_URL = exports.LOGIN_FAILED_URL = exports.READ_TRANSACTION = exports.DELETE_USER = exports.UPDATE_USER = exports.READ_USER = exports.CREATE_USER = exports.DELETE_ADMIN_USER = exports.UPDATE_ADMIN_USER = exports.READ_ADMIN_USER = exports.CREATE_ADMIN_USER = exports.FETCH_PERMISSIONS = exports.USER_PERMISSION = exports.MANAGE_ALL = void 0;
exports.MANAGE_ALL = 'manage_all';
exports.USER_PERMISSION = 'user_permission';
exports.FETCH_PERMISSIONS = 'fetch_permissions';
exports.CREATE_ADMIN_USER = 'create_admin_user';
exports.READ_ADMIN_USER = 'read_admin_user';
exports.UPDATE_ADMIN_USER = 'update_admin_user';
exports.DELETE_ADMIN_USER = 'delete_admin_user';
exports.CREATE_USER = 'create_user';
exports.READ_USER = 'read_user';
exports.UPDATE_USER = 'update_user';
exports.DELETE_USER = 'delete_user';
exports.READ_TRANSACTION = 'read_transaction';
exports.LOGIN_FAILED_URL = `${process.env.CLIENT_URL}/login-failed`;
exports.HOME_URL = `${process.env.CLIENT_URL}/home`;
exports.SIGN_IN_SUCCESS_URL = `${process.env.CLIENT_URL}/sign-up-success`;
exports.LOGIN_TOKEN = 'token';
const settings = {
    twilio: {
        twilioSid: process.env.TWILIO_ACCOUNT_SID,
        twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
    },
    paystack: {
        apiKey: process.env.PAYMENT_GW_SECRET_KEY
    },
    nodemailer: {
        email: process.env.NODEMAILER_EMAIL_ADDRESS,
        password: process.env.NODEMAILER_EMAIL_PASSWORD,
        service: process.env.NODEMAILER_SERVICE
    },
    googleOAuth: {
        google_client_id: process.env.GOOGLE_CLIENT_ID,
        google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
        google_callbackURL: process.env.GOOGLE_AUTH_CALLBACKURL
    },
    facebookAuth: {
        client_ID: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        facebook_callbackURL: process.env.FACEBOOK_CALLBACKURL
    },
    instagramAuth: {
        client_ID: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        instagram_callbackURL: process.env.FACEBOOK_CALLBACKURL
    },
    rabbitMq: {
        connection: process.env.AMQP_CONNECT
    },
    permissions: [
        exports.MANAGE_ALL,
        exports.USER_PERMISSION,
        exports.FETCH_PERMISSIONS,
        exports.CREATE_ADMIN_USER,
        exports.READ_ADMIN_USER,
        exports.UPDATE_ADMIN_USER,
        exports.DELETE_ADMIN_USER,
        exports.CREATE_USER,
        exports.READ_USER,
        exports.UPDATE_USER,
        exports.DELETE_USER,
        exports.READ_TRANSACTION
    ],
    roles: [
        'SUPER_ADMIN_ROLE',
        'USER_ROLE'
    ],
    termii: {
        host: process.env.TERMII_HOST,
        key: process.env.TERMII_SECRET,
        from: process.env.TERMII_FROM,
        message: process.env.TERMII_MESSAGE
    },
    queue: {
        development: {
            host: process.env.QUEUE_CONN_URL,
        },
        production: {
            host: process.env.QUEUE_CONN_URL,
        },
        test: {
            host: process.env.QUEUE_CONN_URL,
        },
    },
    jwt: {
        key: process.env.JWT_KEY,
        expiry: process.env.JWT_EXPIRY,
    },
    jwtAccessToken: {
        key: process.env.JWT_ACCESS_KEY,
        expiry: process.env.JWT_ACCESS_EXPIRY,
    },
    jwtRefreshToken: {
        key: process.env.JWT_REFRESH_KEY,
        expiry: process.env.JWT_REFRESH_EXPIRY,
    },
    redis: {
        development: {
            database: process.env.REDIS_DEV_DB_NAME,
            host: process.env.REDIS_HOST,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            port: process.env.REDIS_PORT,
        },
        production: {
            database: process.env.REDIS_PROD_DB_NAME,
            host: process.env.REDIS_HOST,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            port: process.env.REDIS_PORT,
        },
        test: {
            database: process.env.REDIS_TEST_DB_NAME,
            host: process.env.REDIS_HOST,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            port: process.env.REDIS_PORT,
        },
    },
    mongo: {
        development: {
            host: process.env.MONGO_DEV_HOST,
            port: process.env.MONGO_PORT
        },
        production: {
            host: process.env.MONGO_PROD_HOST,
            port: process.env.MONGO_PORT
        },
        test: {
            host: process.env.MONGO_TEST_HOST,
            port: process.env.MONGO_PORT
        },
    },
    service: {
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        apiRoot: process.env.ROOT_API,
    },
};
exports.default = settings;
