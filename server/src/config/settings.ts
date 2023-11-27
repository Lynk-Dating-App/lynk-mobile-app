import { appCommonTypes } from '../@types/app-common';
import AppSettings = appCommonTypes.AppSettings;

export const MANAGE_ALL = 'manage_all';
export const USER_PERMISSION = 'user_permission';

export const FETCH_PERMISSIONS = 'fetch_permissions';

export const CREATE_ADMIN_USER = 'create_admin_user';
export const READ_ADMIN_USER = 'read_admin_user';
export const UPDATE_ADMIN_USER = 'update_admin_user';
export const DELETE_ADMIN_USER = 'delete_admin_user';

export const CREATE_USER = 'create_user';
export const READ_USER = 'read_user';
export const UPDATE_USER = 'update_user';
export const DELETE_USER = 'delete_user';

export const READ_TRANSACTION = 'read_transaction';

export const LOGIN_FAILED_URL = `${process.env.CLIENT_URL}/login-failed`;

export const HOME_URL = `${process.env.CLIENT_URL}/home`;

export const SIGN_IN_SUCCESS_URL = `${process.env.CLIENT_URL}/sign-up-success`;

export const LOGIN_TOKEN = 'token';

const settings: AppSettings = {
  twilio: {
    twilioSid: <string>process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: <string>process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: <string>process.env.TWILIO_PHONE_NUMBER
  },
  paystack: {
    apiKey: <string>process.env.PAYMENT_GW_SECRET_KEY
  },
  nodemailer: {
    email: <string>process.env.NODEMAILER_EMAIL_ADDRESS,
    password: <string>process.env.NODEMAILER_EMAIL_PASSWORD,
    service: <string>process.env.NODEMAILER_SERVICE
  },
  googleOAuth: {
    google_client_id: <string>process.env.GOOGLE_CLIENT_ID,
    google_client_secret: <string>process.env.GOOGLE_CLIENT_SECRET,
    google_callbackURL: <string>process.env.GOOGLE_AUTH_CALLBACKURL
  },
  facebookAuth: {
    client_ID: <string>process.env.FACEBOOK_CLIENT_ID,
    client_secret: <string>process.env.FACEBOOK_CLIENT_SECRET,
    facebook_callbackURL: <string>process.env.FACEBOOK_CALLBACKURL
  },
  instagramAuth: {
    client_ID: <string>process.env.FACEBOOK_CLIENT_ID,
    client_secret: <string>process.env.FACEBOOK_CLIENT_SECRET,
    instagram_callbackURL: <string>process.env.FACEBOOK_CALLBACKURL
  },
  rabbitMq: {
    connection: <string>process.env.AMQP_CONNECT
  },
  permissions: [
    MANAGE_ALL,
    USER_PERMISSION,
    FETCH_PERMISSIONS,

    CREATE_ADMIN_USER,
    READ_ADMIN_USER,
    UPDATE_ADMIN_USER,
    DELETE_ADMIN_USER,

    CREATE_USER,
    READ_USER,
    UPDATE_USER,
    DELETE_USER,

    READ_TRANSACTION
  ],
  roles: [
    'SUPER_ADMIN_ROLE',
    'USER_ROLE'
  ],
  termii: {
    host: <string>process.env.TERMII_HOST,
    key: <string>process.env.TERMII_SECRET,
    from: <string>process.env.TERMII_FROM,
    message: <string>process.env.TERMII_MESSAGE
  },
  queue: {
    development: {
      host: <string>process.env.QUEUE_CONN_URL,
    },
    production: {
      host: <string>process.env.QUEUE_CONN_URL,
    },
    test: {
      host: <string>process.env.QUEUE_CONN_URL,
    },
  },
  jwt: {
    key: <string>process.env.JWT_KEY,
    expiry: <string>process.env.JWT_EXPIRY,
  },
  jwtAccessToken: {
    key: <string>process.env.JWT_ACCESS_KEY,
    expiry: <string>process.env.JWT_ACCESS_EXPIRY,
  },
  jwtRefreshToken: {
    key: <string>process.env.JWT_REFRESH_KEY,
    expiry: <string>process.env.JWT_REFRESH_EXPIRY,
  },
  redis: {
    development: {
      database: <string>process.env.REDIS_DEV_DB_NAME,
      host: <string>process.env.REDIS_HOST,
      username: <string>process.env.REDIS_USERNAME,
      password: <string>process.env.REDIS_PASSWORD,
      port: <string>process.env.REDIS_PORT,
    },
    production: {
      database: <string>process.env.REDIS_PROD_DB_NAME,
      host: <string>process.env.REDIS_HOST,
      username: <string>process.env.REDIS_USERNAME,
      password: <string>process.env.REDIS_PASSWORD,
      port: <string>process.env.REDIS_PORT,
    },
    test: {
      database: <string>process.env.REDIS_TEST_DB_NAME,
      host: <string>process.env.REDIS_HOST,
      username: <string>process.env.REDIS_USERNAME,
      password: <string>process.env.REDIS_PASSWORD,
      port: <string>process.env.REDIS_PORT,
    },
  },
  mongo: {
    development: {
      host: <string>process.env.MONGO_DEV_HOST,
      port: process.env.MONGO_PORT
    },
    production: {
      host: <string>process.env.MONGO_PROD_HOST,
      port: process.env.MONGO_PORT
    },
    test: {
      host: <string>process.env.MONGO_TEST_HOST,
      port: process.env.MONGO_PORT
    },
  },
  service: {
    env: <string>process.env.NODE_ENV,
    port: <string>process.env.PORT,
    apiRoot: <string>process.env.ROOT_API,
  },
};

export default settings;
