"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_CHANNELS = exports.ALLOWED_FILE_TYPES_VID = exports.MAX_SIZE_IN_BYTE_VID = exports.ALLOWED_FILE_TYPES = exports.MAX_SIZE_IN_BYTE = exports.ACTIVE_VERIFICATION = exports.PENDING_VERIFICATION = exports.PREMIUM_PURPLE_PLAN = exports.PURPLE_PLAN = exports.RED_PLAN = exports.BLACK_PLAN = exports.OFFICE_ADDRESS = exports.HOME_ADDRESS = exports.UPLOAD_BASE_PATH = exports.AGENDA_COLLECTION_NAME = exports.QUEUE_EVENTS = exports.LOG_LEVEL_COLORS = exports.PACKAGE_REQUEST_INFO = exports.PACKAGE_REQUEST = exports.MESSAGES = void 0;
exports.MESSAGES = {
    http: {
        200: 'Ok',
        201: 'Accepted',
        202: 'Created',
        400: 'Bad Request. Please Contact Support.',
        401: 'You Are Not Authenticated. Please Contact Support.',
        403: 'You Are Forbidden From Accessing This Resource.',
        404: 'Not Found. Please Contact Support.',
        500: 'Something Went Wrong. Please Contact Support.',
    },
    image_size_error: 'Image size exceeds the allowed limit',
    image_type_error: 'Invalid image format. Only JPEG, PNG, and JPG images are allowed',
    vid_size_error: 'Video file size exceeds the allowed limit',
    vid_type_error: 'Invalid video format. Only Mp4, WebM, MKV and FLV video formats are allowed'
};
exports.PACKAGE_REQUEST = 'package_requests';
exports.PACKAGE_REQUEST_INFO = 'package_request_info';
exports.LOG_LEVEL_COLORS = {
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
};
exports.QUEUE_EVENTS = {
    name: 'DEFAULT',
};
exports.AGENDA_COLLECTION_NAME = 'plan_expire';
exports.UPLOAD_BASE_PATH = 'uploads';
exports.HOME_ADDRESS = 'HOME';
exports.OFFICE_ADDRESS = 'OFFICE';
exports.BLACK_PLAN = 'black';
exports.RED_PLAN = 'red';
exports.PURPLE_PLAN = 'purple';
exports.PREMIUM_PURPLE_PLAN = 'premium_purple';
exports.PENDING_VERIFICATION = 'pending';
exports.ACTIVE_VERIFICATION = 'active';
exports.MAX_SIZE_IN_BYTE = 10000 * 1024; // 10MB
exports.ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
exports.MAX_SIZE_IN_BYTE_VID = 200 * 1024 * 1024; // 200MB
exports.ALLOWED_FILE_TYPES_VID = ['video/mp4', 'video/mkv', 'video/flv', 'video/webm'];
exports.PAYMENT_CHANNELS = ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer', 'eft'];
