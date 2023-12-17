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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const dao_1 = __importDefault(require("../services/dao"));
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../config/constants");
const settings_1 = require("../config/settings");
const RedisService_1 = __importDefault(require("../services/RedisService"));
const SendMailService_1 = __importDefault(require("../services/SendMailService"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const formidable_1 = __importDefault(require("formidable"));
const UserAddress_1 = require("../models/UserAddress");
const User_1 = __importStar(require("../models/User"));
const axiosClient_1 = __importDefault(require("../services/api/axiosClient"));
const fs_1 = __importDefault(require("fs"));
const FindMatchService_1 = __importDefault(require("../services/FindMatchService"));
const ChatMessages_1 = __importDefault(require("../models/ChatMessages"));
const moment = require("moment");
const mongoose_1 = require("mongoose");
// import RabbitMqService from "../services/RabbitMqService";
const redisService = new RedisService_1.default();
// const rabbitMqService = new RabbitMqService();
const sendMailService = new SendMailService_1.default();
const form = (0, formidable_1.default)({ uploadDir: constants_1.UPLOAD_BASE_PATH });
class UserController {
    passwordEncoder;
    io;
    constructor(passwordEncoder) {
        this.passwordEncoder = passwordEncoder,
            this.io = null;
    }
    async setIO(socketIO) {
        this.io = socketIO;
    }
    /**
     * @name updateCustomer
     * @param req
     * @desc Updates the user
     * only users with user or update_user permission
     * can do this
     */
    async updateUserDetails(req) {
        const user = await this.doUpdateUserProfileDetails(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated',
            result: user
        };
        return Promise.resolve(response);
    }
    ;
    async updateUserProfileImage(req) {
        const user = await this.doUpdateUserProfileImage(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated',
            result: user
        };
        return Promise.resolve(response);
    }
    ;
    async updateUser(req) {
        const user = await this.doUpdateUser(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated',
            result: user
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name updateCustomerStatus
     * @param req
     * @desc Updates the user status
     * only user with super admin manage all and update user
     * permission can do this
     */
    async updateUserStatus(req) {
        await this.doUpdateUserStatus(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated status'
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name deleteCustomer
     * @param req
     * @desc deletes the user
     * only user with super admin manage all and delete user
     * permission can do this
     */
    async deleteUser(req) {
        await this.doDeleteUser(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully deleted'
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name user
     * @param req
     * @desc Gets a single user
     * only user with super admin manage all and read user
     * permission can do this
     */
    async user(req) {
        const userId = req.params.userId;
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response(`User with Id: ${userId} does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: user,
        };
        return Promise.resolve(response);
    }
    ;
    async loggedInUser(req) {
        //@ts-ignore
        const userId = req.user._id;
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response(`User does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: user
        };
        return Promise.resolve(response);
    }
    ;
    async viewUserProfile(req) {
        const { error, value } = joi_1.default.object({
            loggedInUserId: joi_1.default.string().required().label("logged in user id"),
            userId: joi_1.default.string().required().label("user id")
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(value.loggedInUserId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response(`User does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
        const _user = await dao_1.default.userDAOService.findById(value.userId);
        if (!_user)
            return Promise.reject(CustomAPIError_1.default.response(`User does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
        let result;
        if (user.planType === constants_1.BLACK_PLAN) {
            if (_user.planType === constants_1.BLACK_PLAN || (_user.planType === constants_1.RED_PLAN && _user.profileVisibility === true)) {
                result = _user;
            }
            else if (_user.planType === constants_1.RED_PLAN && _user.profileVisibility === false) {
                return Promise.reject(CustomAPIError_1.default.response("The user's visibility is off.", HttpStatus_1.default.BAD_REQUEST.code));
            }
            else if (_user.planType === constants_1.PURPLE_PLAN) {
                return Promise.reject(CustomAPIError_1.default.response("You do not have the priviledge to view this user's profile, please upgrade your current plan.", HttpStatus_1.default.BAD_REQUEST.code));
            }
        }
        ;
        if (user.planType === constants_1.RED_PLAN || user.planType === constants_1.PURPLE_PLAN) {
            if (_user.planType === constants_1.BLACK_PLAN
                || (_user.planType === constants_1.RED_PLAN && _user.profileVisibility === true)
                || (_user.planType === constants_1.PURPLE_PLAN && _user.profileVisibility === true)) {
                result = _user;
            }
            else if ((_user.planType === constants_1.RED_PLAN && _user.profileVisibility === false)
                || (_user.planType === constants_1.PURPLE_PLAN && _user.profileVisibility === false)) {
                return Promise.reject(CustomAPIError_1.default.response("The user's visibility is off.", HttpStatus_1.default.BAD_REQUEST.code));
            }
        }
        ;
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name users
     * @param req
     * @desc Gets all users, its also search and retrieves
     * users according to user first name, last name and status
     * only users with super admin manage all and read user
     * permission can do this
     */
    async users(req) {
        let activeFilter = false;
        let _filter = '';
        if (req.query.active === 'true') {
            activeFilter = true;
            _filter = 't';
        }
        else if (req.query.active === 'false') {
            activeFilter = false;
            _filter = 't';
        }
        const filter = _filter === ''
            ? {}
            : activeFilter ? { active: true } : { active: false };
        const options = {
            search: req.query.search,
            searchFields: ['firstName', 'lastName', 'gender']
        };
        const users = await dao_1.default.userDAOService.findAll(filter, options);
        if (!users)
            return Promise.reject(CustomAPIError_1.default.response('No user is available at this time', HttpStatus_1.default.BAD_REQUEST.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: users,
        };
        return Promise.resolve(response);
    }
    ;
    /**
     *
     * @param req array of user's ids
     *
     * @returns this returns users who's id's are provided in the
     * request array.
     */
    async usersWithIds(req) {
        const { userIds } = req.body;
        //@ts-ignore
        const signedInUserId = req.user._id;
        // .exec();
        const chatUsers = await ChatMessages_1.default.find({
            $or: [
                { senderId: { $in: userIds } },
                { receiverId: { $in: userIds } }
            ]
        })
            .populate('senderId', 'firstName profileImageUrl _id')
            .populate('receiverId', 'firstName profileImageUrl _id')
            .exec();
        const _users = chatUsers.map((user) => {
            let count = 0;
            let content = '';
            if (user.senderId &&
                user.senderId === signedInUserId.toString() &&
                user.receiverStatus === 'delivered') {
                count += 1;
                content = user.message;
            }
            const result = {
                //@ts-ignore
                ...user._doc,
                postedAt: Generic_1.default.dateDifference(new Date()),
                unread: count,
                lastUnreadMessage: content
            };
            return result;
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: _users,
        };
        return Promise.resolve(response);
    }
    ;
    async matchedAndLikedByUsers(req) {
        const userId = req.params.userId;
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        let ids = [];
        user.likedUsers.map(id => {
            if (user.likedByUsers.includes(id)) {
                ids.push(id);
            }
        });
        const matchingUsers = await User_1.default.find({
            _id: { $in: ids }
        }).select('firstName profileImageUrl age likedUsers _id profileVisibility');
        const likedByUsers = await User_1.default.find({
            _id: { $in: user.likedByUsers }
        }).select('firstName profileImageUrl age likedUsers _id profileVisibility');
        // Function to filter out users present in both arrays
        const filterMatchingUsers = (user) => {
            return !matchingUsers.some((matchingUser) => matchingUser._id.equals(user._id));
        };
        const matched_users = matchingUsers.map(user => ({ ...user.toObject(), isMatch: true }));
        const uniqueLikedByUsers = likedByUsers.filter(filterMatchingUsers);
        const users = [...matched_users, ...uniqueLikedByUsers];
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: users,
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name changePassword
     * @param req
     * @desc Changes user password
     * only users with user permission and update user
     * permission can do this
     */
    async changePassword(req) {
        const user = await this.doChangePassword(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: "Successfully changed password",
            result: user,
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name resetPassword
     * @param req
     * @desc
     * Sends password reset link to user email
     * and also cached the reset token, email and
     * user id
     * to redis for 3 minutes
     *
     */
    async resetPassword(req) {
        try {
            const { error, value } = joi_1.default.object(User_1.$resetPassword).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const phone = value.phone.replace(/(^\+?(234)?0?)/, '234');
            const user = await dao_1.default.userDAOService.findByAny({
                phone
            });
            if (!user)
                return Promise.reject(CustomAPIError_1.default.response("No user found with this provided phone number.", HttpStatus_1.default.BAD_REQUEST.code));
            const token = Generic_1.default.generatePasswordResetCode(4);
            // const data = {
            //     token: token
            // };
            // const actualData = JSON.stringify(data);
            // redisService.saveToken(`lynk_app_${value.email}`, actualData, 120);
            await dao_1.default.userDAOService.update({ _id: user._id }, { passwordResetCode: token });
            console.log(token, 'phone number');
            // const split_phone = value.phone.split('234')[1];
            // const phoneNum = split_phone.startsWith('0') ? split_phone.replace('0', '') : split_phone
            // await datasources.termiiService
            //     .sendMessage({
            //         to: phoneNum,
            //         sms: `${settings.termii.message} ${token}`,
            //         channel: "generic",
            //         type: "plain",
            //     })
            //     .then(() => {
            //         console.log("message sent successfully>");
            //     return -1;
            //     })
            //     .catch((error: any) => {
            //         console.log("Failed to send message? ", error);
            //     });
            // sendMailService.sendMail({
            //     from: settings.nodemailer.email,
            //     to: value.email,
            //     subject: 'Password Reset',
            //     text: `Your password reset code is: ${token}`,
            // });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: `If your email is registered with us, you will receive a password reset code.`
            };
            return Promise.resolve(response);
        }
        catch (error) {
            console.error(error, 'token error when setting');
            Promise.reject(CustomAPIError_1.default.response('Failed to send the password reset token. Please try again later.', HttpStatus_1.default.BAD_REQUEST.code));
        }
    }
    ;
    async enterPasswordResetCode(req) {
        const { phone, passwordResetCode } = req.body;
        const _phone = phone.replace(/(^\+?(234)?0?)/, '234');
        const user = await dao_1.default.userDAOService.findByAny({
            phone: _phone
        });
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response('User not found, restart the password reset process.', HttpStatus_1.default.BAD_REQUEST.code));
        if (user.passwordResetCode !== passwordResetCode)
            return Promise.reject(CustomAPIError_1.default.response('Password reset code do not match.', HttpStatus_1.default.BAD_REQUEST.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Password reset successful.'
        };
        return Promise.resolve(response);
    }
    async validateSignUpToken(req) {
        try {
            const redisData = await redisService.getToken('lynk_app');
            if (redisData) {
                const { token } = redisData;
                if (token !== req.body.token)
                    return Promise.reject(CustomAPIError_1.default.response("Token don't match.", HttpStatus_1.default.BAD_REQUEST.code));
                const response = {
                    code: HttpStatus_1.default.OK.code,
                    message: 'Successful.',
                };
                redisService.deleteRedisKey('lynk_app');
                return Promise.resolve(response);
            }
            else {
                // Token not found in Redis
                return Promise.reject(CustomAPIError_1.default.response('Token has expired', HttpStatus_1.default.BAD_REQUEST.code));
            }
        }
        catch (error) {
            console.error(error, 'token error when getting');
            return Promise.reject(CustomAPIError_1.default.response('Failed to retrieve token please try again later', HttpStatus_1.default.BAD_REQUEST.code));
        }
    }
    async checkUser(req) {
        const { error, value } = joi_1.default.object({
            email: joi_1.default.string().required().label('Phone number')
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findByAny({
            email: value.email
        });
        if (user)
            return Promise.reject(CustomAPIError_1.default.response("User with this email already exist.", HttpStatus_1.default.BAD_REQUEST.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successful.`
        };
        return Promise.resolve(response);
    }
    async sendSignUpToken(req) {
        const { error, value } = joi_1.default.object({
            phone: joi_1.default.string().required().label('Phone number')
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const phone = value.phone.replace(/(^\+?(234)?0?)/, '234');
        const user = await dao_1.default.userDAOService.findByAny({
            phone
        });
        if (user)
            return Promise.reject(CustomAPIError_1.default.response("User with phone already exist", HttpStatus_1.default.BAD_REQUEST.code));
        if (phone.length !== 13)
            return Promise.reject(CustomAPIError_1.default.response("Invalid Phone number.", HttpStatus_1.default.BAD_REQUEST.code));
        const token = Generic_1.default.generatePasswordResetCode(4);
        const data = {
            token: token
        };
        const actualData = JSON.stringify(data);
        redisService.saveToken(`lynk_app`, actualData, 120);
        console.log(token, 'phone number');
        // const split_phone = value.phone.split('234')[1];
        // const phone = split_phone.startsWith('0') ? split_phone.replace('0', '') : split_phone
        // await datasources.termiiService
        //     .sendMessage({
        //         to: phone,
        //         sms: `${settings.termii.message} ${token}`,
        //         channel: "generic",
        //         type: "plain",
        //     })
        //     .then(() => {
        //         console.log("message sent successfully>");
        //     return -1;
        //     })
        //     .catch((error: any) => {
        //         console.log("Failed to send message? ", error);
        //     });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `A token has been sent to your phone. ${token}`
        };
        return Promise.resolve(response);
    }
    /**
     * @name savePassword
     * @param req
     * @desc
     * checks if data exist with the provided key in redis
     * fetch the token in redis and compare with
     * the token user id and the req.params if true it
     * Saves the new password for the user
     * else it returns an error
     */
    async savePassword(req) {
        try {
            const { error, value } = joi_1.default.object(User_1.$savePasswordAfterReset).validate(req.body);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const phone = value.phone.replace(/(^\+?(234)?0?)/, '234');
            const user = await dao_1.default.userDAOService.findByAny({
                phone
            });
            if (!user)
                return Promise.reject(CustomAPIError_1.default.response('User not found.', HttpStatus_1.default.BAD_REQUEST.code));
            const _password = await this.passwordEncoder?.encode(value.password);
            const userValues = {
                password: _password,
                passwordResetCode: ''
            };
            await dao_1.default.userDAOService.updateByAny({ _id: user._id }, userValues);
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: `Password reset is successful, login with your new password.`
            };
            return Promise.resolve(response);
        }
        catch (error) {
            console.error(error, 'token error when getting');
            return Promise.reject(CustomAPIError_1.default.response('Failed to retrieve token please try again later', HttpStatus_1.default.BAD_REQUEST.code));
        }
    }
    /***
     * @name checkRedisKey
     * checks if key is available in redis
     */
    async checkRedisKey(req) {
        const userId = req.params.userId;
        const user = await dao_1.default.userDAOService.findById(userId);
        const keys = `zues_webapp_${user?.email}`;
        const redis = await redisService.checkRedisKey(keys);
        if (redis === '1') {
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: 'Redis data is available.'
            };
            return Promise.resolve(response);
        }
        else {
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: 'No redis data is available.',
            };
            return Promise.resolve(response);
        }
    }
    ;
    async saveUserAddress(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object(UserAddress_1.$saveUserAddress).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.NOT_FOUND.code));
        const userAddress = await dao_1.default.userAddressDAOService.findByAny({ user: userId });
        if (userAddress)
            return Promise.reject(CustomAPIError_1.default.response('Address already exists for this user', HttpStatus_1.default.NOT_FOUND.code));
        // //find address with type home
        // const homeAddress = await datasources.userAddressDAOService.findByAny(
        //     {address_type: HOME_ADDRESS}
        // )
        // if(homeAddress && value.address_type === HOME_ADDRESS)
        //     return Promise.reject(CustomAPIError.response('Address of type home already exist', HttpStatus.BAD_REQUEST.code));
        // //find address with type office
        // const officeAddress = await datasources.userAddressDAOService.findByAny(
        //     {address_type: OFFICE_ADDRESS}
        // )
        // if(officeAddress && value.address_type === OFFICE_ADDRESS)
        //     return Promise.reject(CustomAPIError.response('Address of type office already exist', HttpStatus.BAD_REQUEST.code));
        const addressValues = {
            ...value,
            user: userId
        };
        const address = await dao_1.default.userAddressDAOService.create(addressValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Address created successfully',
            result: address
        };
        return Promise.resolve(response);
    }
    ;
    async getSingleAddress(req) {
        const userAddressId = req.params.userAddressId;
        const address = await dao_1.default.userAddressDAOService.findById(userAddressId);
        if (!address)
            return Promise.reject(CustomAPIError_1.default.response('Address not found', HttpStatus_1.default.NOT_FOUND.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful',
            result: address
        };
        return Promise.resolve(response);
    }
    ;
    async updateAddress(req) {
        const userAddressId = req.params.userAddressId;
        const { error, value } = joi_1.default.object(UserAddress_1.$updateUserAddress).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const address = await dao_1.default.userAddressDAOService.findById(userAddressId);
        if (!address)
            return Promise.reject(CustomAPIError_1.default.response('Address not found', HttpStatus_1.default.NOT_FOUND.code));
        const values = {
            ...value,
            address: value.address
        };
        await dao_1.default.userAddressDAOService.update({ _id: userAddressId }, values);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated'
        };
        return Promise.resolve(response);
    }
    ;
    async deleteAddress(req) {
        const userAddressId = req.params.userAddressId;
        const address = await dao_1.default.userAddressDAOService.findById(userAddressId);
        if (!address)
            return Promise.reject(CustomAPIError_1.default.response('Address not found', HttpStatus_1.default.NOT_FOUND.code));
        await dao_1.default.userAddressDAOService.deleteById(address._id);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully deleted'
        };
        return Promise.resolve(response);
    }
    ;
    async upgradePlan(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object({
            planType: joi_1.default.string().required().label("plan type")
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        if (user.planType === constants_1.PURPLE_PLAN)
            return Promise.reject(CustomAPIError_1.default.response("You are currently on the highest plan", HttpStatus_1.default.BAD_REQUEST.code));
        const plan = await dao_1.default.subscriptionDAOService.findByAny({ name: value.planType });
        if (!plan)
            return Promise.reject(CustomAPIError_1.default.response("Plan not found", HttpStatus_1.default.NOT_FOUND.code));
        //initialize payment
        const metadata = {
            cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
        };
        axiosClient_1.default.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;
        let endpoint = '/balance';
        const balanceResponse = await axiosClient_1.default.get(endpoint);
        if (balanceResponse.data.data.balance === 0)
            return Promise.reject(CustomAPIError_1.default.response('Insufficient Balance. Please contact support.', HttpStatus_1.default.BAD_REQUEST.code));
        endpoint = '/transaction/initialize';
        const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}/`;
        const amount = +plan.price;
        let serviceCharge = 0.015 * amount;
        if (amount >= 2500) {
            serviceCharge = 0.015 * amount + 100;
        }
        if (serviceCharge >= 2000)
            serviceCharge = 2000;
        const _amount = Math.round((serviceCharge + amount) * 100);
        const initResponse = await axiosClient_1.default.post(`${endpoint}`, {
            // email: user.email,
            amount: _amount,
            callback_url: callbackUrl,
            metadata,
            channels: constants_1.PAYMENT_CHANNELS,
        });
        const data = initResponse.data.data;
        if (data) {
            await dao_1.default.userDAOService.update({ _id: userId }, {
                planType: plan.name,
                verify: constants_1.PENDING_VERIFICATION,
            });
        }
        const txnValues = {
            reference: data.reference,
            // authorizationUrl: data.authorization_url,
            // type: 'Payment',
            status: initResponse.data.message,
            amount: plan.price,
            user: user._id
        };
        const transaction = await dao_1.default.transactionDAOService.create(txnValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful',
            result: transaction
        };
        return Promise.resolve(response);
    }
    async serviceChargePayment(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object({
            planType: joi_1.default.string().required().label("plan type")
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        if (user.planType !== constants_1.PURPLE_PLAN)
            return Promise.reject(CustomAPIError_1.default.response("You are not allowed to do this.", HttpStatus_1.default.BAD_REQUEST.code));
        const plan = await dao_1.default.subscriptionDAOService.findByAny({ name: value.planType });
        if (!plan)
            return Promise.reject(CustomAPIError_1.default.response("Plan not found", HttpStatus_1.default.NOT_FOUND.code));
        //initialize payment
        const metadata = {
            cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
        };
        axiosClient_1.default.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;
        let endpoint = '/balance';
        const balanceResponse = await axiosClient_1.default.get(endpoint);
        if (balanceResponse.data.data.balance === 0)
            return Promise.reject(CustomAPIError_1.default.response('Insufficient Balance. Please contact support.', HttpStatus_1.default.BAD_REQUEST.code));
        endpoint = '/transaction/initialize';
        const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}/`;
        const amount = +plan.price;
        let serviceCharge = 0.015 * amount;
        if (amount >= 2500) {
            serviceCharge = 0.015 * amount + 100;
        }
        if (serviceCharge >= 2000)
            serviceCharge = 2000;
        const _amount = Math.round((serviceCharge + amount) * 100);
        const initResponse = await axiosClient_1.default.post(`${endpoint}`, {
            // email: user.email,
            amount: _amount,
            callback_url: callbackUrl,
            metadata,
            channels: constants_1.PAYMENT_CHANNELS,
        });
        const data = initResponse.data.data;
        const date = new Date();
        const duration = plan.duration;
        date.setMonth(date.getMonth() + duration);
        if (data) {
            await dao_1.default.userDAOService.update({ _id: userId }, {
                isExpired: false,
                subscription: {
                    startDate: new Date(),
                    endDate: date
                }
            });
        }
        const txnValues = {
            reference: data.reference,
            // authorizationUrl: data.authorization_url,
            type: 'Payment',
            status: initResponse.data.message,
            amount: plan.price,
            user: user._id
        };
        const transaction = await dao_1.default.transactionDAOService.create(txnValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful',
            result: transaction
        };
        return Promise.resolve(response);
    }
    async toggleProfileVisibility(req) {
        //@ts-ignore
        const userId = req.user._id;
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        if (user.planType === constants_1.BLACK_PLAN)
            return Promise.reject(CustomAPIError_1.default.response("You are not allowed to toggle profile visibility", HttpStatus_1.default.BAD_REQUEST.code));
        const updatedUser = await dao_1.default.userDAOService.updateByAny({ _id: user._id }, { profileVisibility: !user.profileVisibility });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful',
            result: updatedUser?.profileVisibility
        };
        return Promise.resolve(response);
    }
    async updateJobDescription(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object(User_1.$updateJobDescription).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        const twentyDaysAgo = new Date();
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
        if (user.updatedAt && user.updatedAt >= twentyDaysAgo) {
            return Promise.reject(CustomAPIError_1.default.response("Job preference was last updated less than 20 days ago", HttpStatus_1.default.BAD_REQUEST.code));
        }
        const updateValues = {
            verify: constants_1.PENDING_VERIFICATION,
            updatedAt: new Date(),
            jobType: value.jobType,
            jobDescription: value.jobDescription
        };
        const updatedUser = await dao_1.default.userDAOService.updateByAny({ _id: user._id }, updateValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful, your profile will be verified in 48 hours',
            result: updatedUser
        };
        return Promise.resolve(response);
    }
    async updatePreference(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object({
            preference: {
                pAbout: joi_1.default.string().required().label("About"),
                pMinAge: joi_1.default.string().required().label("Minimum Age"),
                pMaxAge: joi_1.default.string().required().label("Maximu Age"),
                pMinHeight: joi_1.default.string().required().label("Minimum Height"),
                pMaxHeight: joi_1.default.string().required().label("Maximum Height")
            }
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        const updateValues = {
            preference: {
                pAbout: value.preference.pAbout,
                pMinAge: value.preference.pMinAge,
                pMaxAge: value.preference.pMaxAge,
                pMinHeight: value.preference.pMinHeight,
                pMaxHeight: value.preference.pMaxHeight,
                pGender: user.gender === 'male' ? 'female' : 'male'
            }
        };
        const updatedUser = await dao_1.default.userDAOService.updateByAny({ _id: user._id }, updateValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful',
            result: updatedUser
        };
        return Promise.resolve(response);
    }
    async uploadVideo(req) {
        const updatedUser = await this.doUploadVideo(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful',
            result: updatedUser
        };
        return Promise.resolve(response);
    }
    async findMatch(req) {
        const matches = await this.doMatch(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful',
            results: matches
        };
        return Promise.resolve(response);
    }
    async likeUser(req) {
        //@ts-ignore
        const userId = req.user._id;
        const likedUserId = req.params.likedUserId;
        const [user, likedUser] = await Promise.all([
            dao_1.default.userDAOService.findById(userId),
            dao_1.default.userDAOService.findById(likedUserId),
        ]);
        if (!user || !likedUser) {
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        }
        if (user.planType === 'black' && likedUser.planType !== 'black')
            return Promise.reject(CustomAPIError_1.default.response("You can't like this user, please upgrade your plan.", HttpStatus_1.default.BAD_REQUEST.code));
        if (user.planType === 'red' && (likedUser.planType === 'purple' || likedUser.planType === 'premium'))
            return Promise.reject(CustomAPIError_1.default.response("You can't like this user, please upgrade your plan.", HttpStatus_1.default.BAD_REQUEST.code));
        const checkLikedUserInUser = user.likedUsers.includes(likedUser._id); //this checks if the liked user was prev liked.
        if (checkLikedUserInUser)
            return Promise.reject(CustomAPIError_1.default.response('You already liked this user.', HttpStatus_1.default.BAD_REQUEST.code));
        const checkUserInLikedUser = likedUser.likedUsers.includes(user._id); // this checks if user exist in likedUsers array
        // if true return as part of the res payload else return false
        let likened;
        if (checkUserInLikedUser) {
            likened = true;
        }
        else {
            likened = false;
        }
        const payload = {
            fromUserId: userId,
            toUserId: likedUserId,
            action: 'like',
            name: Generic_1.default.capitalizeFirstLetter(user.firstName),
            othername: Generic_1.default.capitalizeFirstLetter(user.lastName),
            photo: user.profileImageUrl,
            age: user.age,
            likened
        };
        // if(user.favourites.includes(likedUser._id)) {
        //     await user.updateOne({ $pull: { favourites: likedUser._id } });
        // }
        //remove from unliked array after like
        if (user.unLikedUsers.length > 0) {
            await Promise.all(user.unLikedUsers.map(async (_user) => {
                if (_user.user.toString() === likedUser._id.toString()) {
                    await user.updateOne({ $pull: { unLikedUsers: _user } });
                }
            }));
        }
        user.likedUsers.push(likedUser._id);
        !likedUser.likedByUsers.includes(user._id) && (likedUser.likedByUsers.push(user._id));
        await Promise.all([user.save(), likedUser.save()]);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successfully liked ${likedUser.firstName}'s profile.`,
            result: payload
        };
        return Promise.resolve(response);
    }
    async unLikeUser(req) {
        //@ts-ignore
        const userId = req.user._id;
        const unLikedUserId = req.params.unLikedUserId;
        const [user, unLikedUser] = await Promise.all([
            dao_1.default.userDAOService.findById(userId),
            dao_1.default.userDAOService.findById(unLikedUserId),
        ]);
        if (!user || !unLikedUser) {
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        }
        const payload = {
            fromUserId: userId,
            toUserId: unLikedUserId,
            action: 'dislike',
            name: Generic_1.default.capitalizeFirstLetter(user.firstName),
            othername: Generic_1.default.capitalizeFirstLetter(user.lastName),
            photo: user.profileImageUrl
        };
        // if(user.favourites.includes(unLikedUser._id)) {
        //     await user.updateOne({ $pull: { favourites: unLikedUser._id } });
        // }
        // Remove unLikedUserId from the likedUsers array of user
        await user.updateOne({ $pull: { likedUsers: unLikedUserId } });
        // Remove userId from the likedByUsers array of unLikedUser
        await unLikedUser.updateOne({ $pull: { likedByUsers: userId } });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successfully unliked ${unLikedUser.firstName}'s profile.`,
            result: payload
        };
        return Promise.resolve(response);
    }
    /**
     * this handles when a user is unliked from the match screen
     * so it basically just pushes the unliked user id and date
     * to the array.
     */
    async unLikeUserFromMatch(req) {
        //@ts-ignore
        const userId = req.user._id;
        const unLikedUserId = req.params.unLikedUserId;
        const [user, unLikedUser] = await Promise.all([
            dao_1.default.userDAOService.findById(userId),
            dao_1.default.userDAOService.findById(unLikedUserId),
        ]);
        if (!user || !unLikedUser) {
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        }
        // if(user.favourites.includes(unLikedUser._id)) {
        //     await user.updateOne({ $pull: { favourites: unLikedUser._id } });
        // }
        const payload = {
            date: new Date(),
            user: unLikedUser._id
        };
        const unliked = user.unLikedUsers.find(user => user.user === unLikedUser._id);
        if (unliked) {
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: `Already unliked this user, ${unLikedUser.firstName}'s profile.`,
            };
            return Promise.resolve(response);
        }
        user.unLikedUsers.push(payload);
        await user.save();
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successfully unliked ${unLikedUser.firstName}'s profile.`
        };
        return Promise.resolve(response);
    }
    /**
     * the handle when a user is fav's another user
     */
    async favourites(req) {
        //@ts-ignore
        const userId = req.user._id;
        const favId = req.params.favId;
        const [user, faveUser] = await Promise.all([
            dao_1.default.userDAOService.findById(userId),
            dao_1.default.userDAOService.findById(favId),
        ]);
        if (!user || !faveUser) {
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        }
        if (user.favourites.includes(faveUser._id)) {
            return Promise.reject(CustomAPIError_1.default.response("Already added to favourites.", HttpStatus_1.default.BAD_REQUEST.code));
        }
        // if(user.likedUsers.includes(faveUser._id)) {
        //     return Promise.reject(CustomAPIError.response("You currentlty like this user, can't add to favourites.", HttpStatus.BAD_REQUEST.code));
        // }
        user.favourites.push(faveUser._id);
        await user.save();
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successfully fav ${faveUser.firstName}'s profile.`
        };
        return Promise.resolve(response);
    }
    async newJob(req) {
        const { error, value } = joi_1.default.object({
            name: joi_1.default.string().required().label("job name")
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const job = await dao_1.default.jobDAOService.findByAny({ name: value.name });
        if (job)
            return Promise.reject(CustomAPIError_1.default.response(`${value.name} already exist.`, HttpStatus_1.default.BAD_REQUEST.code));
        let jobValues;
        //@ts-ignore
        const role = await dao_1.default.roleDAOService.findById(req.user.role);
        if (role?.slug === "SUPER_ADMIN_ROLE") {
            jobValues = {
                name: value.name,
                slug: Generic_1.default.generateSlug(value.name),
                status: 'active'
            };
        }
        else {
            jobValues = {
                name: value.name,
                slug: Generic_1.default.generateSlug(value.name),
                status: 'pending'
            };
        }
        const result = await dao_1.default.jobDAOService.create(jobValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `${role?.slug === "SUPER_ADMIN_ROLE" ? "Successfully created." : `Successful, ${value.name} will be added to the list of jobs after review.`}`,
            result
        };
        return Promise.resolve(response);
    }
    async getJobs(req) {
        const jobs = await dao_1.default.jobDAOService.findAll({});
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successful`,
            results: jobs
        };
        return Promise.resolve(response);
    }
    async getJob(req) {
        const jobId = req.params.jobId;
        const job = await dao_1.default.jobDAOService.findById(jobId);
        if (!job)
            return Promise.reject(CustomAPIError_1.default.response("Job not found", HttpStatus_1.default.NOT_FOUND.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successful`,
            result: job
        };
        return Promise.resolve(response);
    }
    async updateJob(req) {
        const jobId = req.params.jobId;
        const { error, value } = joi_1.default.object({
            name: joi_1.default.string().label("job name")
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const job = await dao_1.default.jobDAOService.findById(jobId);
        if (!job)
            return Promise.reject(CustomAPIError_1.default.response("Job not found", HttpStatus_1.default.NOT_FOUND.code));
        await dao_1.default.jobDAOService.update(job, { name: value.name, slug: Generic_1.default.generateSlug(value.name) });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successfully updated`
        };
        return Promise.resolve(response);
    }
    async deleteJob(req) {
        const jobId = req.params.jobId;
        await dao_1.default.jobDAOService.deleteById(jobId);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: `Successfully deleted`
        };
        return Promise.resolve(response);
    }
    async updateLocation(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object({
            latitude: joi_1.default.number().required().label('Latitude'),
            longitude: joi_1.default.number().required().label('Longitude')
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        console.log(value, 'saved location in upd loc controller');
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        const locationValues = {
            location: {
                type: 'Point',
                coordinates: [value.longitude, value.latitude]
            }
        };
        await dao_1.default.userDAOService.update({ _id: user?._id }, locationValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Location updated successfully'
        };
        return Promise.resolve(response);
    }
    async gallery(req) {
        const user = await this.doGallery(req);
        console.log(user);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully uploaded image.',
            result: user
        };
        return Promise.resolve(response);
    }
    ;
    async deletePhotoInGallery(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object({
            photo: joi_1.default.string().required().label('photo'),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
        //delete photo from directory
        const basePath = `${constants_1.UPLOAD_BASE_PATH}/user`;
        user.gallery.map(photo => {
            if (photo === value.photo) {
                const _photo = photo.split('user/')[1];
                fs_1.default.unlink(`${basePath}/${_photo}`, () => { });
            }
        });
        await user.updateOne({ $pull: { gallery: value.photo } });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully removed photo from gallery.'
        };
        return Promise.resolve(response);
    }
    async getUserNotifications(req) {
        //@ts-ignore
        const userId = req.user._id;
        const notifications = await dao_1.default.notificationDAOService.findAll({
            user: userId
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully fetched notifications.',
            results: notifications
        };
        return Promise.resolve(response);
    }
    async getSingleNotification(req) {
        const notificationId = req.params.notificationId;
        const notification = await dao_1.default.notificationDAOService.findByAny({
            _id: notificationId
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully fetched notification.',
            result: notification
        };
        return Promise.resolve(response);
    }
    async updateNotification(req) {
        const notificationId = req.params.notificationId;
        const notification = await dao_1.default.notificationDAOService.findByAny({
            _id: notificationId
        });
        if (!notification)
            return Promise.reject(CustomAPIError_1.default.response("Notification not found.", HttpStatus_1.default.NOT_FOUND.code));
        await dao_1.default.notificationDAOService.updateByAny({ _id: notification._id }, { status: true });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated notification.'
        };
        return Promise.resolve(response);
    }
    async deleteNotification(req) {
        const notificationId = req.params.notificationId;
        const notification = await dao_1.default.notificationDAOService.findById(notificationId);
        if (!notification)
            return Promise.reject(CustomAPIError_1.default.response("Not found.", HttpStatus_1.default.NOT_FOUND.code));
        await dao_1.default.notificationDAOService.deleteById(notification._id);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully deleted notification.'
        };
        return Promise.resolve(response);
    }
    async getAllNotifications(req) {
        const notifications = await dao_1.default.notificationDAOService.findAll({});
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully fetched notifications.',
            results: notifications
        };
        return Promise.resolve(response);
    }
    async getUserChats(req) {
        const { error, value } = joi_1.default.object({
            receiverId: joi_1.default.string().required().label('receiver id'),
            senderId: joi_1.default.string().required().label('sender id')
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const chats = await dao_1.default.chatMessageDAOService.findAll({
            receiverId: value.receiverId,
            senderId: value.senderId
        });
        const results = chats.map(chat => {
            let _chat = {
                //@ts-ignore
                ...chat._doc,
                datePosted: Generic_1.default.dateDifference(new Date())
            };
            return _chat;
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully fetched notifications.',
            results
        };
        return Promise.resolve(response);
    }
    async createChatMessage(req) {
        const { chatId, senderId, message } = req.body;
        const newMessage = await dao_1.default.chatMessageDAOService.create({
            chatId, senderId, message
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successful.',
            result: newMessage
        };
        return Promise.resolve(response);
    }
    async getChatMessages(req) {
        try {
            const { chatId } = req.params;
            //@ts-ignore
            const loggedInUser = req.user._id;
            const updateUnreadStatus = async (query, update) => {
                const unreadMessages = await dao_1.default.chatMessageDAOService.findAll(query);
                if (unreadMessages.length > 0) {
                    const unreadMessageIds = unreadMessages.map((message) => new mongoose_1.Types.ObjectId(message._id));
                    await ChatMessages_1.default.updateMany({ _id: { $in: unreadMessageIds } }, update);
                }
            };
            // Update receiver's unread messages to read
            await updateUnreadStatus({ chatId, receiverStatus: 'unread', senderId: { $ne: loggedInUser } }, { $set: { receiverStatus: 'read' } });
            // Update sender's unread messages to read
            await updateUnreadStatus({ chatId, senderStatus: 'unread', senderId: loggedInUser }, { $set: { senderStatus: 'read' } });
            // Retrieve all chat messages
            const messages = await dao_1.default.chatMessageDAOService.findAll({ chatId }, { sort: { createdAt: 1 } });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: 'Successfully.',
                results: messages
            };
            return Promise.resolve(response);
        }
        catch (error) {
            // Handle errors appropriately
            console.error('Error in getChatMessages:', error);
            const response = {
                code: HttpStatus_1.default.INTERNAL_SERVER_ERROR.code,
                message: 'Internal Server Error',
                result: null
            };
            return Promise.resolve(response);
        }
    }
    async findUserChats(req) {
        try {
            const userId = req.params.userId;
            const chats = await dao_1.default.chatDAOService.findAll({
                members: { $in: [userId] },
            });
            if (!chats)
                return Promise.reject(CustomAPIError_1.default.response("Not found", HttpStatus_1.default.NOT_FOUND.code));
            let _member = [];
            await Promise.all(chats.map(async (chat) => {
                const otherMember = chat.members.find((member) => member !== userId);
                const user = await dao_1.default.userDAOService.findById(otherMember);
                const chatMessages = await dao_1.default.chatMessageDAOService.findAll({
                    chatId: chat._id
                });
                if (!chatMessages)
                    return Promise.reject(CustomAPIError_1.default.response("No chat message found.", HttpStatus_1.default.NOT_FOUND.code));
                //@ts-ignore
                const sortedMessages = chatMessages.sort((a, b) => b.createdAt - a.createdAt);
                const lastMessage = sortedMessages[0];
                const unreadMessages = sortedMessages.filter((message) => message.receiverStatus === 'unread');
                const totalUnreadMessages = unreadMessages.length;
                _member.push({
                    _id: user?._id,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    profileImageUrl: user?.profileImageUrl,
                    chat: chat,
                    totalUnreadMessages: totalUnreadMessages,
                    lastMessage: lastMessage ? lastMessage.message : '',
                    senderId: lastMessage ? lastMessage.senderId : '',
                    //@ts-ignore
                    chatDate: lastMessage ? lastMessage.createdAt : null
                });
            }));
            const member = _member.sort((a, b) => b.chatDate - a.chatDate);
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: 'Successfully fetched notifications.',
                result: { chats, member },
            };
            return Promise.resolve(response);
        }
        catch (error) {
            // Handle errors appropriately, log or send an error response
            console.error(error);
            return Promise.reject(CustomAPIError_1.default.response("Internal Server Error", HttpStatus_1.default.INTERNAL_SERVER_ERROR.code));
        }
    }
    async fetchFavouriteUsers(req) {
        //@ts-ignore
        const userId = req.user._id;
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user) {
            return Promise.reject(CustomAPIError_1.default.response('User not found.', HttpStatus_1.default.NOT_FOUND.code));
        }
        const users = await dao_1.default.userDAOService.findAll();
        const filteredUsers = users.filter(_user => {
            if (user.favourites.includes(_user._id)) {
                return user;
            }
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully fetched users.',
            results: filteredUsers,
        };
        return Promise.resolve(response);
    }
    async findChat(req) {
        const { firstId, secondId } = req.params;
        const chat = await dao_1.default.chatDAOService.findByAny({
            members: { $all: [firstId, secondId] }
        });
        if (!chat)
            return Promise.reject(CustomAPIError_1.default.response("Not found", HttpStatus_1.default.NOT_FOUND.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully fetched notifications.',
            result: chat
        };
        return Promise.resolve(response);
    }
    async createChat(req) {
        const { firstId, secondId } = req.body;
        const chat = await dao_1.default.chatDAOService.findByAny({
            members: { $all: [firstId, secondId] }
        });
        if (!chat) {
            const newChat = await dao_1.default.chatDAOService.create({
                members: [firstId, secondId]
            });
            const response = {
                code: HttpStatus_1.default.OK.code,
                message: 'Successfully created chat.',
                result: newChat
            };
            return Promise.resolve(response);
        }
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully.',
            result: chat
        };
        return Promise.resolve(response);
    }
    async deleteChat(req) {
        const chatId = req.params.chatId;
        await dao_1.default.chatMessageDAOService.deleteById(chatId);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully deleted chat.'
        };
        return Promise.resolve(response);
    }
    async doGallery(req) {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                //@ts-ignore
                const userId = req.user._id;
                const { error, value } = joi_1.default.object({
                    photo: joi_1.default.array().items(joi_1.default.string()).label('photo'),
                }).validate(fields);
                if (error) {
                    return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                }
                const user = await dao_1.default.userDAOService.findById(userId);
                if (!user) {
                    return reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.NOT_FOUND.code));
                }
                ;
                if (user.gallery.length === 5) {
                    return reject(CustomAPIError_1.default.response('You can only upload five photo to your gallery.', HttpStatus_1.default.BAD_REQUEST.code));
                }
                let updatedGallery = [...(user.gallery || [])];
                for (const key of Object.keys(files)) {
                    const galleryImage = files[key];
                    // Validate file size and type for each image
                    const maxSizeInBytes = constants_1.MAX_SIZE_IN_BYTE;
                    if (galleryImage.size > maxSizeInBytes) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_size_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    const allowedFileTypes = constants_1.ALLOWED_FILE_TYPES;
                    if (!allowedFileTypes.includes(galleryImage.mimetype)) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_type_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    // Save each image and get the image path
                    const imagePath = await Generic_1.default.getImagePath({
                        tempPath: galleryImage.filepath,
                        filename: galleryImage.originalFilename,
                        basePath: `${constants_1.UPLOAD_BASE_PATH}/user`,
                    });
                    updatedGallery.push(imagePath);
                }
                ;
                user.gallery = updatedGallery;
                user.save();
                //@ts-ignore
                return resolve(user); // Resolve with the updated user
            });
        });
    }
    async doUploadVideo(req) {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                const userId = req.params.userId;
                const { error, value } = joi_1.default.object({
                    videoUrl: joi_1.default.string().label("video url")
                }).validate(fields);
                if (error)
                    return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                const user = await dao_1.default.userDAOService.findById(userId);
                if (!user)
                    return reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.NOT_FOUND.code));
                const twentyDaysAgo = new Date();
                twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
                if (user.videoUploadedAt && user.videoUploadedAt >= twentyDaysAgo) {
                    return reject(CustomAPIError_1.default.response("Video was last updated less than 20 days ago", HttpStatus_1.default.BAD_REQUEST.code));
                }
                const videoFile = files.videoUrl;
                const basePath = `${constants_1.UPLOAD_BASE_PATH}/user/videos`;
                let _videoUrl = '';
                if (videoFile) {
                    // File size validation
                    const maxSizeInBytes = constants_1.MAX_SIZE_IN_BYTE_VID;
                    if (videoFile.size > maxSizeInBytes) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.vid_size_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    // File type validation
                    const allowedFileTypes = constants_1.ALLOWED_FILE_TYPES_VID;
                    if (!allowedFileTypes.includes(videoFile.mimetype)) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.vid_type_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    _videoUrl = await Generic_1.default.getImagePath({
                        tempPath: videoFile.filepath,
                        filename: videoFile.originalFilename,
                        basePath,
                    });
                }
                ;
                //delete existing image from directory
                if (_videoUrl) {
                    if (user.videoUrl) {
                        const vid = user.videoUrl.split('videos/')[1];
                        fs_1.default.unlink(`${basePath}/${vid}`, () => { });
                    }
                }
                const userValues = {
                    videoUrl: _videoUrl,
                    verify: constants_1.PENDING_VERIFICATION,
                    videoUploadedAt: new Date()
                };
                const updatedUser = await dao_1.default.userDAOService.updateByAny({ _id: userId }, userValues);
                //@ts-ignore
                return resolve(updatedUser);
            });
        });
    }
    async doUpdateUserProfileDetails(req) {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                //@ts-ignore
                const userId = req.user._id;
                const { error, value } = joi_1.default.object({
                    age: joi_1.default.number().required().label('Age'),
                    bio: joi_1.default.string().required().label('Bio'),
                    build: joi_1.default.string().optional().allow('').label('Build'),
                    dob: joi_1.default.date().required().label('Dob'),
                    interests: joi_1.default.any().required().label('Interests'),
                    lastName: joi_1.default.string().required().label('Last name'),
                    firstName: joi_1.default.string().required().label('First name'),
                    occupation: joi_1.default.string().required().label('Occupation'),
                    state: joi_1.default.string().required().label('State'),
                    gender: joi_1.default.string().required().label('Gender'),
                    height: joi_1.default.string().required().label('Height'),
                    profileImageUrl: joi_1.default.string().label('profile image')
                }).validate(fields);
                if (error)
                    return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                const user = await dao_1.default.userDAOService.findById(userId);
                if (!user)
                    return reject(CustomAPIError_1.default.response("User not found", HttpStatus_1.default.NOT_FOUND.code));
                const profile_image = files.profileImageUrl;
                const basePath = `${constants_1.UPLOAD_BASE_PATH}/user`;
                let _profileImageUrl = '';
                if (profile_image) {
                    // File size validation
                    const maxSizeInBytes = constants_1.MAX_SIZE_IN_BYTE;
                    if (profile_image.size > maxSizeInBytes) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_size_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    // File type validation
                    const allowedFileTypes = constants_1.ALLOWED_FILE_TYPES;
                    if (!allowedFileTypes.includes(profile_image.mimetype)) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_type_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    _profileImageUrl = await Generic_1.default.getImagePath({
                        tempPath: profile_image.filepath,
                        filename: profile_image.originalFilename,
                        basePath,
                    });
                }
                ;
                //delete existing image from directory
                if (profile_image) {
                    if (user.profileImageUrl) {
                        const image = user.profileImageUrl.split('user/')[1];
                        fs_1.default.unlink(`${basePath}/${image}`, () => { });
                    }
                }
                // const interests = JSON.stringify(value.interests);
                const payload = {
                    ...value,
                    about: value.bio,
                    jobType: value.occupation,
                    level: 2,
                    profileImageUrl: profile_image && _profileImageUrl
                };
                const updateUser = await dao_1.default.userDAOService.updateByAny({ _id: user._id }, payload);
                //@ts-ignore
                return resolve(updateUser);
            });
        });
    }
    async doUpdateUserProfileImage(req) {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                //@ts-ignore
                const userId = req.user._id;
                const { error, value } = joi_1.default.object({
                    profileImageUrl: joi_1.default.string().label('profile image')
                }).validate(fields);
                if (error)
                    return reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                const user = await dao_1.default.userDAOService.findById(userId);
                if (!user)
                    return reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.NOT_FOUND.code));
                const profile_image = files.profileImageUrl;
                const basePath = `${constants_1.UPLOAD_BASE_PATH}/user`;
                let _profileImageUrl = '';
                if (profile_image) {
                    // File size validation
                    const maxSizeInBytes = constants_1.MAX_SIZE_IN_BYTE;
                    if (profile_image.size > maxSizeInBytes) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_size_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    // File type validation
                    const allowedFileTypes = constants_1.ALLOWED_FILE_TYPES;
                    if (!allowedFileTypes.includes(profile_image.mimetype)) {
                        return reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_type_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    _profileImageUrl = await Generic_1.default.getImagePath({
                        tempPath: profile_image.filepath,
                        filename: profile_image.originalFilename,
                        basePath,
                    });
                }
                ;
                //delete existing image from directory
                if (profile_image) {
                    if (user.profileImageUrl) {
                        const image = user.profileImageUrl.split('user/')[1];
                        fs_1.default.unlink(`${basePath}/${image}`, () => { });
                    }
                }
                const updatedUser = await dao_1.default.userDAOService.updateByAny({ _id: userId }, { profileImageUrl: profile_image && _profileImageUrl });
                //@ts-ignore
                return resolve(updatedUser);
            });
        });
    }
    async doUpdateUser(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object(User_1.$updateUserSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.NOT_FOUND.code));
        if (value.email) {
            const user_email = await dao_1.default.userDAOService.findByAny({
                email: value.email
            });
            if (user.email && user.email !== value.email) {
                if (user_email) {
                    return Promise.reject(CustomAPIError_1.default.response('User with this email already exists', HttpStatus_1.default.NOT_FOUND.code));
                }
            }
            ;
        }
        let phone = '';
        if (value.phone) {
            phone = value.phone.replace(/(^\+?(234)?0?)/, '234');
            const user_phone = await dao_1.default.userDAOService.findByAny({
                phone: phone
            });
            //@ts-ignore
            if (user.phone && user.phone !== phone) {
                if (user_phone) {
                    return Promise.reject(CustomAPIError_1.default.response('User with this phone number already exists', HttpStatus_1.default.NOT_FOUND.code));
                }
            }
            ;
        }
        // let _email = ''
        // if(!user.googleId || !user.facebookId || !user.instagramId) {
        //     _email = value.email as string
        // };
        // let _phone = ''
        // if(user.googleId || user.facebookId || user.instagramId) {
        //     _phone = value.phone
        // };
        const userValues = {
            ...value,
            email: value.email,
            phone: phone === '' ? user.phone : phone
        };
        const updatedUser = await dao_1.default.userDAOService.updateByAny({ _id: userId }, userValues);
        return updatedUser;
    }
    async doUpdateUserStatus(req) {
        const userId = req.params.userId;
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.BAD_REQUEST.code));
        const updatedUser = await dao_1.default.userDAOService.update({ _id: userId }, { active: !user.active });
        return updatedUser;
    }
    ;
    async doDeleteUser(req) {
        const userId = req.params.userId;
        return await dao_1.default.userDAOService.deleteById(userId);
    }
    ;
    async doChangePassword(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = joi_1.default.object(User_1.$changePassword).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.BAD_REQUEST.code));
        const hash = user.password;
        const password = value.currentPassword;
        const isMatch = await this.passwordEncoder?.match(password.trim(), hash.trim());
        if (!isMatch)
            return Promise.reject(CustomAPIError_1.default.response('Password in the database differ from the password entered as current  password', HttpStatus_1.default.UNAUTHORIZED.code));
        const _password = await this.passwordEncoder?.encode(value.password);
        const userValues = {
            password: _password
        };
        const updated = await dao_1.default.userDAOService.updateByAny({ _id: userId }, userValues);
        return updated;
    }
    ;
    /***
     * This ruturns the users that their id is:
     * 1. not in the likeUser array.
     * 2. does not have date below 5 days in the unLikedUser array
     * 3. and finally, meets the user's preference
     *
     */
    async doMatch(req) {
        //@ts-ignore
        const userId = req.user._id;
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user) {
            return Promise.reject(CustomAPIError_1.default.response('User not found', HttpStatus_1.default.NOT_FOUND.code));
        }
        if (user.level < 2)
            return Promise.reject(CustomAPIError_1.default.response("Please ensure all your profile details are completed before proceeding.", HttpStatus_1.default.BAD_REQUEST.code));
        if (Object.keys(user.preference).length === 0)
            return Promise.reject(CustomAPIError_1.default.response("Please fill out your preference before looking for a match.", HttpStatus_1.default.BAD_REQUEST.code));
        const likedUserIds = user.likedUsers;
        let disliked;
        if (user.unLikedUsers.length !== null) {
            disliked = user.unLikedUsers
                .filter(dislikedUser => moment().diff(dislikedUser.date, 'days') < 5)
                .map(dislikedUser => dislikedUser.user);
        }
        const query = {
            profileVisibility: true,
            _id: {
                $nin: [...likedUserIds, ...disliked, user._id]
            },
            level: 2
        };
        const users = await dao_1.default.userDAOService.findAll(query);
        const matcher = new FindMatchService_1.default(users);
        const matches = matcher.findMatches(user, user.preference);
        const finalMatches = matches.map(match => ({
            //@ts-ignore
            ...match._doc,
            distance: Math.ceil(Generic_1.default.location_km(user.location.coordinates[1], user.location.coordinates[0], match.location.coordinates[1], match.location.coordinates[0]))
        }));
        const allUsers = users
            //@ts-ignore
            .filter(_user => _user._doc.gender !== user.gender)
            .map(_user => ({
            //@ts-ignore
            ..._user._doc,
            distance: (_user.location.coordinates[1] === -1 && _user.location.coordinates[0] === -1) ? 0 :
                Math.ceil(Generic_1.default.location_km(user.location.coordinates[1], user.location.coordinates[0], _user.location.coordinates[1], _user.location.coordinates[0]))
        }));
        return finalMatches.length > 0 ? finalMatches : allUsers;
    }
}
exports.default = UserController;
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION, settings_1.UPDATE_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserDetails", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION, settings_1.UPDATE_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserProfileImage", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION, settings_1.UPDATE_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.UPDATE_USER, settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserStatus", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.DELETE_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.USER_PERMISSION, settings_1.READ_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "user", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.USER_PERMISSION, settings_1.READ_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loggedInUser", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "viewUserProfile", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.READ_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "users", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "usersWithIds", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "matchedAndLikedByUsers", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION, settings_1.UPDATE_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "enterPasswordResetCode", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkUser", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendSignUpToken", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "saveUserAddress", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION, settings_1.MANAGE_ALL, settings_1.READ_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSingleAddress", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateAddress", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAddress", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "upgradePlan", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "serviceChargePayment", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "toggleProfileVisibility", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateJobDescription", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePreference", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadVideo", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findMatch", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "likeUser", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unLikeUser", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unLikeUserFromMatch", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "favourites", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newJob", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getJobs", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getJob", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateJob", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteJob", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateLocation", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "gallery", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deletePhotoInGallery", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserNotifications", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSingleNotification", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateNotification", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteNotification", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllNotifications", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserChats", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createChatMessage", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "fetchFavouriteUsers", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findChat", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createChat", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteChat", null);
