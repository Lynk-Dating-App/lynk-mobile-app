import { Request } from "express";
import { HasPermission, TryCatch } from "../decorators";
import HttpStatus from "../helpers/HttpStatus";
import CustomAPIError from "../exceptions/CustomAPIError";
import datasources from  '../services/dao';
import { appCommonTypes } from '../@types/app-common';
import Joi from 'joi';
import HttpResponse = appCommonTypes.HttpResponse;
import {
    ACTIVE_VERIFICATION,
    ALLOWED_FILE_TYPES,
    ALLOWED_FILE_TYPES_VID,
    BLACK_PLAN,
    MAX_SIZE_IN_BYTE,
    MAX_SIZE_IN_BYTE_VID,
    MESSAGES,
    PACKAGE_REQUEST_INFO,
    PAYMENT_CHANNELS,
    PENDING_VERIFICATION,
    PURPLE_PLAN,
    RED_PLAN,
    REQUEST_VERIFICATION,
    UPLOAD_BASE_PATH
} from "../config/constants";
import settings, {
    MANAGE_ALL,
    USER_PERMISSION,
    READ_USER,
    UPDATE_USER,
    DELETE_USER
} from "../config/settings";
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import RedisService from "../services/RedisService";
import SendMailService from "../services/SendMailService";
import Generic from "../utils/Generic";
import formidable, { File } from 'formidable';
import { $saveUserAddress, $updateUserAddress, IUserAddressModel } from "../models/UserAddress";
import User, {
    $updateUserSchema,
    IUserModel,
    $changePassword,
    $resetPassword,
    $savePasswordAfterReset,
    $updateJobDescription
} from "../models/User";
import axiosClient from '../services/api/axiosClient';
import { ITransactionModel } from "../models/Transaction";
import fs from 'fs';
import Matcher from "../services/FindMatchService";
import { appModelTypes } from "../@types/app-model";
import { Server } from 'socket.io';

import IPreference = appModelTypes.IPreference
import { INotificationModel } from "../models/Notification";
import ChatMessage, { IChatMessageModel } from "../models/ChatMessages";
import moment = require("moment");
import mongoose, { Types } from "mongoose";
import { IChatModel } from "../models/ChatModel";
import { IVerifiedKeyModel } from "../models/VerifiedKey";
import { v4 } from 'uuid';
import Waitlist, { IWaitlistModel } from "../models/Waitlist";

const redisService = new RedisService();
const sendMailService = new SendMailService();
const form = formidable({ uploadDir: UPLOAD_BASE_PATH });
form.setMaxListeners(15);

export default class UserController {
    private readonly passwordEncoder: BcryptPasswordEncoder | undefined;
    private io: Server<any, any, any, any> | null; 

    constructor(passwordEncoder?: BcryptPasswordEncoder) {
        this.passwordEncoder = passwordEncoder,
        this.io = null
    }

    public async setIO(socketIO: any) {
        this.io = socketIO;
    }

    /**
     * @name updateCustomer
     * @param req
     * @desc Updates the user
     * only users with user or update_user permission
     * can do this 
     */
    @TryCatch
    @HasPermission([USER_PERMISSION, UPDATE_USER])
    public async updateUserDetails (req: Request) {
        const user = await this.doUpdateUserProfileDetails(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully updated',
            result: user
        };
      
        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION, UPDATE_USER])
    public async updateUserProfileImage (req: Request) {
        const user = await this.doUpdateUserProfileImage(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully updated',
            result: user
        };
      
        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION, UPDATE_USER])
    public async updateUser (req: Request) {
        const user = await this.doUpdateUser(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully updated',
            result: user
        };
      
        return Promise.resolve(response);
    };

    /**
     * @name updateCustomerStatus
     * @param req
     * @desc Updates the user status
     * only user with super admin manage all and update user
     * permission can do this 
     */
    @TryCatch
    @HasPermission([MANAGE_ALL, UPDATE_USER, USER_PERMISSION])
    public  async updateUserStatus (req: Request) {
        await this.doUpdateUserStatus(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully updated status'
        };
      
        return Promise.resolve(response);
    };

    /**
     * @name deleteCustomer
     * @param req
     * @desc deletes the user
     * only user with super admin manage all and delete user
     * permission can do this 
     */
    @TryCatch
    @HasPermission([MANAGE_ALL, DELETE_USER])
    public  async deleteUser (req: Request) {
        await this.doDeleteUser(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully deleted'
        };
      
        return Promise.resolve(response);
    };

    /**
     * @name user
     * @param req
     * @desc Gets a single user
     * only user with super admin manage all and read user
     * permission can do this 
     */
    @TryCatch
    @HasPermission([MANAGE_ALL, USER_PERMISSION, READ_USER])
    public  async user (req: Request) {
        const userId = req.params.userId;
        
        const user = await datasources.userDAOService.findById(userId);
        if(!user) return Promise.reject(CustomAPIError.response(`User with Id: ${userId} does not exist`, HttpStatus.BAD_REQUEST.code));

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            result: user,
        };
      
        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([MANAGE_ALL, USER_PERMISSION, READ_USER])
    public  async loggedInUser (req: Request) {

        //@ts-ignore
        const userId = req.user._id;
        
        const user = await datasources.userDAOService.findById(userId);
        if(!user) return Promise.reject(CustomAPIError.response(`User does not exist`, HttpStatus.BAD_REQUEST.code));

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            result: user
        };
      
        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public  async viewUserProfile (req: Request) {
        
        const { error, value } = Joi.object<any>({
            loggedInUserId: Joi.string().required().label("logged in user id"),
            userId: Joi.string().required().label("user id")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
          
        const user = await datasources.userDAOService.findById(value.loggedInUserId);
        if(!user) return Promise.reject(CustomAPIError.response(`User does not exist`, HttpStatus.BAD_REQUEST.code));

        const _user = await datasources.userDAOService.findById(value.userId);
        if(!_user) return Promise.reject(CustomAPIError.response(`User does not exist`, HttpStatus.BAD_REQUEST.code));

        let result;
        if(user.planType === BLACK_PLAN) {
            if(_user.planType === BLACK_PLAN || (_user.planType === RED_PLAN && _user.profileVisibility === true)) {
                result = _user
            } else if(_user.planType === RED_PLAN && _user.profileVisibility === false) {
                return Promise.reject(
                    CustomAPIError.response(
                        "The user's visibility is off.",
                        HttpStatus.BAD_REQUEST.code
                    )
                )
            } else if (_user.planType === PURPLE_PLAN) {
                return Promise.reject(
                    CustomAPIError.response(
                        "You do not have the priviledge to view this user's profile, please upgrade your current plan.",
                        HttpStatus.BAD_REQUEST.code
                    )
                )
            }
        };

        if(user.planType === RED_PLAN || user.planType === PURPLE_PLAN) {
            if(_user.planType === BLACK_PLAN 
                || (_user.planType === RED_PLAN && _user.profileVisibility === true)
                || (_user.planType === PURPLE_PLAN && _user.profileVisibility === true)
            ) { 
                result = _user
            } else if (
                (_user.planType === RED_PLAN && _user.profileVisibility === false)
                || (_user.planType === PURPLE_PLAN && _user.profileVisibility === false)
            ) {
                return Promise.reject(
                    CustomAPIError.response(
                        "The user's visibility is off.",
                        HttpStatus.BAD_REQUEST.code
                    )
                )
            }
        };

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            result
        };
      
        return Promise.resolve(response);
    };

    /**
     * @name users
     * @param req
     * @desc Gets all users, its also search and retrieves 
     * users according to user first name, last name and status
     * only users with super admin manage all and read user
     * permission can do this 
     */
    @TryCatch
    @HasPermission([MANAGE_ALL, READ_USER])
    public  async users (req: Request) {

        let activeFilter = false;
        let _filter = '';

        if (req.query.active === 'true') {
            activeFilter = true;
            _filter = 't'
        } else if (req.query.active === 'false') {
            activeFilter = false;
            _filter = 't'
        }
    
        const filter = _filter === ''
                        ? {} 
                        : activeFilter ? { active: true } : { active: false };
        
        const options = {
            search: req.query.search,
            searchFields: ['firstName', 'lastName', 'gender']
        };

        const users = await datasources.userDAOService.findAll(filter, options);

        if(!users) return Promise.reject(CustomAPIError.response('No user is available at this time', HttpStatus.BAD_REQUEST.code));

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            results: users,
        };
      
        return Promise.resolve(response);
    };

    /**
     * 
     * @param req array of user's ids
     * 
     * @returns this returns users who's id's are provided in the
     * request array.
     */
    @TryCatch
    @HasPermission([USER_PERMISSION])
    public  async usersWithIds (req: Request) {

        const { userIds } = req.body;
        //@ts-ignore
        const signedInUserId = req.user._id;
        // .exec();

        const chatUsers = await ChatMessage.find({
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
                user.receiverStatus === 'delivered'
            ) {
                count += 1;
                content = user.message;
            }
            const result = {
                //@ts-ignore
                ...user._doc, 
                postedAt: Generic.dateDifference(new Date()), 
                unread: count,
                lastUnreadMessage: content
            }

            return result;
        })

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            results: _users,
        };
      
        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async matchedAndLikedByUsers (req: Request) {

        const userId = req.params.userId;

        const user = await datasources.userDAOService.findById(userId);
        if(!user) 
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        let ids: Types.ObjectId[] = [];
        user.likedUsers.map(id => {
            if(user.likedByUsers.includes(id)) {
                ids.push(id)
            }
        })

        const matchingUsers = await User.find({
            _id: { $in: ids}
        }).select('firstName profileImageUrl age likedUsers _id profileVisibility');
        
        const likedByUsers = await User.find({
            _id: { $in: user.likedByUsers }
        }).select('firstName profileImageUrl age likedUsers _id profileVisibility');

        // Function to filter out users present in both arrays
        const filterMatchingUsers = (user: any) => {
            return !matchingUsers.some((matchingUser) => matchingUser._id.equals(user._id));
        };

        const matched_users = matchingUsers.map(user => ({ ...user.toObject(), isMatch: true }));
        const uniqueLikedByUsers = likedByUsers.filter(filterMatchingUsers);
        const users = [...matched_users, ...uniqueLikedByUsers];

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            results: users,
        };
      
        return Promise.resolve(response);
    };

    /**
     * @name changePassword
     * @param req
     * @desc Changes user password
     * only users with user permission and update user
     * permission can do this 
     */
    @TryCatch
    @HasPermission([USER_PERMISSION, UPDATE_USER])
    public  async changePassword (req: Request) {
        const user = await this.doChangePassword(req);

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: "Successfully changed password",
            result: user,
        };
      
        return Promise.resolve(response);
    };

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
    @TryCatch
    public async resetPassword (req: Request) {
        try {
            const { error, value } = Joi.object<IUserModel>($resetPassword).validate(req.body);
            if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
            
            const phone = value.phone.replace(/(^\+?(234)?0?)/, '234');
            const user = await datasources.userDAOService.findByAny({
                phone
            });
            if(!user) 
                return Promise.reject(CustomAPIError.response("No user found with this provided phone number.", HttpStatus.BAD_REQUEST.code));


            const token = Generic.generatePasswordResetCode(4);
            // const data = {
            //     token: token
            // };
            // const actualData = JSON.stringify(data);

            // redisService.saveToken(`lynk_app_${value.email}`, actualData, 120);

            await datasources.userDAOService.update(
                {_id: user._id},
                {passwordResetCode: token}
            )

            console.log(token, 'phone number')
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

            const response: HttpResponse<any> = {
                code: HttpStatus.OK.code,
                message: `If your email is registered with us, you will receive a password reset code.`
            };
  
            return Promise.resolve(response);
        
        } catch (error) {
            console.error(error, 'token error when setting');
            Promise.reject(CustomAPIError.response('Failed to send the password reset token. Please try again later.', HttpStatus.BAD_REQUEST.code));
        }
        
    };

    @TryCatch
    public async enterPasswordResetCode (req: Request) {

        const { phone, passwordResetCode } = req.body;
 
        const _phone = phone.replace(/(^\+?(234)?0?)/, '234');
        const user = await datasources.userDAOService.findByAny({
            phone: _phone
        });

        if(!user)
            return Promise.reject(CustomAPIError.response('User not found, restart the password reset process.', HttpStatus.BAD_REQUEST.code));

        if(user.passwordResetCode !== passwordResetCode)
            return Promise.reject(CustomAPIError.response('Password reset code do not match.', HttpStatus.BAD_REQUEST.code));


        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Password reset successful.'
        };

        return Promise.resolve(response);

    }

    public async validateSignUpToken (req: Request) {
        try {
            const redisData = await redisService.getToken('lynk_app');
    
            if (redisData) {
                const { token }: any = redisData;
                
                if(token !== req.body.token)
                    return Promise.reject(CustomAPIError.response("Token don't match.", HttpStatus.BAD_REQUEST.code));

                const response: HttpResponse<any> = {
                    code: HttpStatus.OK.code,
                    message: 'Successful.',
                };

                redisService.deleteRedisKey('lynk_app')
                return Promise.resolve(response);

            } else {
                // Token not found in Redis
                return Promise.reject(CustomAPIError.response('Token has expired', HttpStatus.BAD_REQUEST.code))
            }
        
        } catch (error) {
            console.error(error, 'token error when getting');
            return Promise.reject(CustomAPIError.response('Failed to retrieve token please try again later', HttpStatus.BAD_REQUEST.code))
        }

    }

    @TryCatch
    public async checkUser (req: Request) {
        const { error, value } = Joi.object<IUserModel>({
            email: Joi.string().required().label('Phone number')
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
 
        const user = await datasources.userDAOService.findByAny({
            email: value.email
        });
        if(user) 
            return Promise.reject(CustomAPIError.response("User with this email already exist.", HttpStatus.BAD_REQUEST.code));

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `Successful.`
        };

        return Promise.resolve(response);
    }

    @TryCatch
    public async sendSignUpToken (req: Request) {
        const { error, value } = Joi.object<IUserModel>({
            phone: Joi.string().required().label('Phone number')
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const phone = value.phone.replace(/(^\+?(234)?0?)/, '234')
        const user = await datasources.userDAOService.findByAny({
            phone
        });
        if(user) 
            return Promise.reject(CustomAPIError.response("User with phone already exist", HttpStatus.BAD_REQUEST.code));

        // if(phone.length !== 13) 
        //     return Promise.reject(CustomAPIError.response("Invalid Phone number.", HttpStatus.BAD_REQUEST.code));

        const token = Generic.generatePasswordResetCode(4);
        const data = {
            token: token
        };
        const actualData = JSON.stringify(data);
        redisService.saveToken(`lynk_app`, actualData, 120);

        console.log(token, 'phone number')
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

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `A token has been sent to your phone. ${token}`,
            result: token
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
    public async savePassword (req: Request) {
        try {
            const { error, value } = Joi.object<IUserModel>($savePasswordAfterReset).validate(req.body);
            if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
        
            const phone = value.phone.replace(/(^\+?(234)?0?)/, '234')
            const user = await datasources.userDAOService.findByAny({
                phone
            });
            if(!user)
                return Promise.reject(CustomAPIError.response('User not found.', HttpStatus.BAD_REQUEST.code));

            const _password = await this.passwordEncoder?.encode(value.password as string);

            const userValues = {
                password: _password,
                passwordResetCode: ''
            };

            await datasources.userDAOService.updateByAny(
                {_id: user._id},
                userValues
            );

            const response: HttpResponse<any> = {
                code: HttpStatus.OK.code,
                message: `Password reset is successful, login with your new password.`
            };
    
            return Promise.resolve(response);
        
        } catch (error) {
            console.error(error, 'token error when getting');
            return Promise.reject(CustomAPIError.response('Failed to retrieve token please try again later', HttpStatus.BAD_REQUEST.code))
        }
    }

    /***
     * @name checkRedisKey
     * checks if key is available in redis
     */
    public async checkRedisKey(req: Request) {
        const userId = req.params.userId;

        const user = await datasources.userDAOService.findById(userId);

        const keys = `zues_webapp_${user?.email}`;
        const redis = await redisService.checkRedisKey(keys);

        if(redis === '1') {
            const response: HttpResponse<any> = {
                code: HttpStatus.OK.code,
                message: 'Redis data is available.'
            }
            return Promise.resolve(response);
        } else {
            const response: HttpResponse<any> = {
                code: HttpStatus.OK.code,
                message: 'No redis data is available.',
            };
            return Promise.resolve(response);
        }
        
    };

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async saveUserAddress(req: Request) {

        //@ts-ignore
        const userId = req.user._id

        const { error, value } = Joi.object<IUserAddressModel>($saveUserAddress).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
                    
        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response('User not found', HttpStatus.NOT_FOUND.code));

        const userAddress = await datasources.userAddressDAOService.findByAny({ user: userId });
        if(userAddress)
            return Promise.reject(CustomAPIError.response('Address already exists for this user', HttpStatus.NOT_FOUND.code));

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
    
        const addressValues: Partial<IUserAddressModel> ={
            ...value,
            user: userId
        };

        const address = await datasources.userAddressDAOService.create(addressValues as IUserAddressModel);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Address created successfully',
            result: address
        };

        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION, MANAGE_ALL, READ_USER])
    public async getSingleAddress(req: Request) {

        const userAddressId = req.params.userAddressId;
        
        const address = await datasources.userAddressDAOService.findById(userAddressId);
        if(!address)
            return Promise.reject(CustomAPIError.response('Address not found', HttpStatus.NOT_FOUND.code));

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: address
        };

        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async updateAddress(req: Request) {

        const userAddressId = req.params.userAddressId;

        const { error, value } = Joi.object<IUserAddressModel>($updateUserAddress).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
         

        const address = await datasources.userAddressDAOService.findById(userAddressId);
        if(!address)
            return Promise.reject(CustomAPIError.response('Address not found', HttpStatus.NOT_FOUND.code));

        const values = {
            ...value,
            address: value.address
        }

        await datasources.userAddressDAOService.update(
            {_id: userAddressId},
            values
        );
        
        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully updated'
        };

        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async deleteAddress(req: Request) {

        const userAddressId = req.params.userAddressId;

        const address = await datasources.userAddressDAOService.findById(userAddressId);
        if(!address)
            return Promise.reject(CustomAPIError.response('Address not found', HttpStatus.NOT_FOUND.code));

        await datasources.userAddressDAOService.deleteById(address._id)

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully deleted'
        };

        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async upgradePlan(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
            
        const { error, value } = Joi.object<IUserModel>({
            planType: Joi.string().required().label("plan type")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        
        if(user.planType === PURPLE_PLAN)
            return Promise.reject(CustomAPIError.response("You are currently on the highest plan", HttpStatus.BAD_REQUEST.code));
        
        const plan = await datasources.subscriptionDAOService.findByAny({ name: value.planType });
        if(!plan)
            return Promise.reject(CustomAPIError.response("Plan not found", HttpStatus.NOT_FOUND.code));

        //initialize payment
        const metadata = {
            cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
        };

        axiosClient.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;
    
        let endpoint = '/balance';

        const balanceResponse = await axiosClient.get(endpoint);
        if (balanceResponse.data.data.balance === 0)
        return Promise.reject(
            CustomAPIError.response('Insufficient Balance. Please contact support.', HttpStatus.BAD_REQUEST.code),
        );

        endpoint = '/transaction/initialize';

        const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}/`;
        const amount = +plan.price as number;
        let serviceCharge = 0.015 * amount;

        if (amount >= 2500) {
            serviceCharge = 0.015 * amount + 100;
        }

        if (serviceCharge >= 2000) serviceCharge = 2000;

        const _amount = Math.round((serviceCharge + amount) * 100);

        const initResponse = await axiosClient.post(`${endpoint}`, {
            // email: user.email,
            amount: _amount,
            callback_url: callbackUrl,
            metadata,
            channels: PAYMENT_CHANNELS,
        });

        const data = initResponse.data.data;

        if(data) {
            await datasources.userDAOService.update(
                { _id: userId },
                { 
                    planType: plan.name,
                    verify: PENDING_VERIFICATION,
                }
            )
        }

        const txnValues: Partial<ITransactionModel> = {
            reference: data.reference,
            // authorizationUrl: data.authorization_url,
            // type: 'Payment',
            status: initResponse.data.message,
            amount: plan.price,
            user: user._id
        };

        const transaction = await datasources.transactionDAOService.create(txnValues as ITransactionModel);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: transaction
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async serviceChargePayment(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
            
        const { error, value } = Joi.object<IUserModel>({
            planType: Joi.string().required().label("plan type")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        
        if(user.planType !== PURPLE_PLAN)
            return Promise.reject(CustomAPIError.response("You are not allowed to do this.", HttpStatus.BAD_REQUEST.code));
        
        const plan = await datasources.subscriptionDAOService.findByAny({ name: value.planType });
        if(!plan)
            return Promise.reject(CustomAPIError.response("Plan not found", HttpStatus.NOT_FOUND.code));

        //initialize payment
        const metadata = {
            cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
        };

        axiosClient.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;
    
        let endpoint = '/balance';

        const balanceResponse = await axiosClient.get(endpoint);
        if (balanceResponse.data.data.balance === 0)
        return Promise.reject(
            CustomAPIError.response('Insufficient Balance. Please contact support.', HttpStatus.BAD_REQUEST.code),
        );

        endpoint = '/transaction/initialize';

        const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}/`;
        const amount = +plan.price as number;
        let serviceCharge = 0.015 * amount;

        if (amount >= 2500) {
            serviceCharge = 0.015 * amount + 100;
        }

        if (serviceCharge >= 2000) serviceCharge = 2000;

        const _amount = Math.round((serviceCharge + amount) * 100);

        const initResponse = await axiosClient.post(`${endpoint}`, {
            // email: user.email,
            amount: _amount,
            callback_url: callbackUrl,
            metadata,
            channels: PAYMENT_CHANNELS,
        });

        const data = initResponse.data.data;
        const date = new Date();
        const duration = plan.duration as number
        date.setMonth(date.getMonth() + duration);

        if(data) {
            await datasources.userDAOService.update(
                { _id: userId },
                { 
                    isExpired: false,
                    subscription: {
                        startDate: new Date(),
                        endDate: date
                    }
                }
            )
        }

        const txnValues: Partial<ITransactionModel> = {
            reference: data.reference,
            // authorizationUrl: data.authorization_url,
            type: 'Payment',
            status: initResponse.data.message,
            amount: plan.price,
            user: user._id
        };

        const transaction = await datasources.transactionDAOService.create(txnValues as ITransactionModel);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: transaction
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async toggleProfileVisibility (req: Request) {
        
        //@ts-ignore
        const userId = req.user._id;

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        if(user.planType === BLACK_PLAN)
            return Promise.reject(CustomAPIError.response("You are not allowed to toggle profile visibility", HttpStatus.BAD_REQUEST.code));

        const updatedUser = await datasources.userDAOService.updateByAny(
            { _id: user._id },
            { profileVisibility: !user.profileVisibility }
        );

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: updatedUser?.profileVisibility
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async toggleAutoRenewal (req: Request) {
        
        //@ts-ignore
        const userId = req.user._id;

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        const updatedUser = await datasources.userDAOService.updateByAny(
            { _id: user._id },
            { autoRenewal: !user.autoRenewal }
        );

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: updatedUser?.autoRenewal
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async verifyUser (req: Request) {
        
        const userId = req.params.userId;

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        await datasources.userDAOService.updateByAny(
            { _id: user._id },
            { verify: ACTIVE_VERIFICATION }
        );

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful'
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async requestVerification (req: Request) {
        
        //@ts-ignore
        const userId = req.user._id;

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        await datasources.userDAOService.updateByAny(
            { _id: user._id },
            { verify: REQUEST_VERIFICATION }
        );

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful'
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async updateJobDescription(req: Request) {

        //@ts-ignore
        const userId = req.user._id;

        const { error, value } = Joi.object<IUserModel>($updateJobDescription).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        const twentyDaysAgo = new Date();
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

        if (user.updatedAt && user.updatedAt >= twentyDaysAgo) {
            return Promise.reject(CustomAPIError.response("Job preference was last updated less than 20 days ago", HttpStatus.BAD_REQUEST.code));
        }

        const updateValues: Partial<IUserModel> = {
            verify: PENDING_VERIFICATION,
            updatedAt: new Date(),
            jobType: value.jobType,
            jobDescription: value.jobDescription
        }

        const updatedUser = await datasources.userDAOService.updateByAny(
            { _id: user._id },
            updateValues
        )

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful, your profile will be verified in 48 hours',
            result: updatedUser
        };

        return Promise.resolve(response);

    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async updatePreference(req: Request) {

        //@ts-ignore
        const userId = req.user._id;

        const { error, value } = Joi.object<IUserModel>({
            preference: {
                pAbout: Joi.string().required().label("About"),
                pMinAge: Joi.string().required().label("Minimum Age"),
                pMaxAge: Joi.string().required().label("Maximu Age"),
                pMinHeight: Joi.string().required().label("Minimum Height"),
                pMaxHeight: Joi.string().required().label("Maximum Height")
            }
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        const updateValues: Partial<IUserModel> = {
            preference: {
                pAbout: value.preference.pAbout,
                pMinAge: value.preference.pMinAge, 
                pMaxAge: value.preference.pMaxAge,
                pMinHeight: value.preference.pMinHeight, 
                pMaxHeight: value.preference.pMaxHeight, 
                pGender: user.gender === 'male' ? 'female' : 'male'
            }
        }

        const updatedUser = await datasources.userDAOService.updateByAny(
            { _id: user._id },
            updateValues
        )

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: updatedUser
        };

        return Promise.resolve(response);

    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async uploadVideo (req: Request) {
        const updatedUser = await this.doUploadVideo(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: updatedUser
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async findMatch (req: Request) {
        const matches = await this.doMatch(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            results: matches
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async likedAndLikedByUsers(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
      
        const user = await datasources.userDAOService.findById(userId);
        if (!user)
          return Promise.reject(
            CustomAPIError.response('User not found', HttpStatus.NOT_FOUND.code)
          );
      
        const users = await datasources.userDAOService.findAll({
          $and: [
            {
              _id: {
                $in: user.likedUsers.map((userId) => new mongoose.Types.ObjectId(userId))
              }
            },
            {
              _id: {
                $in: user.likedByUsers.map((userId) => new mongoose.Types.ObjectId(userId))
              }
            }
          ]
        });

        const finlUsers = users.map(user => {
            const payload = {
                key: user._id,
                firstName: user.firstName,
                profileImage: user.profileImageUrl
            }
            return payload
        })
      
        const response: HttpResponse<any> = {
          code: HttpStatus.OK.code,
          message: 'Successful',
          results: finlUsers
        };
      
        return Promise.resolve(response);
      }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async likeUser(req: Request) {

        //@ts-ignore
        const userId = req.user._id;
        const likedUserId = req.params.likedUserId;
      
        const [user, likedUser] = await Promise.all([
          datasources.userDAOService.findById(userId),
          datasources.userDAOService.findById(likedUserId),
        ]);
      
        if (!user || !likedUser) {
          return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        }

        if(user.planType === 'black' && likedUser.planType !== 'black')
            return Promise.reject(CustomAPIError.response("You can't like this user, please upgrade your plan.", HttpStatus.BAD_REQUEST.code));

        if(user.planType === 'red' && (likedUser.planType === 'purple' || likedUser.planType === 'premium'))
            return Promise.reject(CustomAPIError.response("You can't like this user, please upgrade your plan.", HttpStatus.BAD_REQUEST.code));

        const checkLikedUserInUser = user.likedUsers.includes(likedUser._id); //this checks if the liked user was prev liked.
        if(checkLikedUserInUser)
            return Promise.reject(CustomAPIError.response('You already liked this user.', HttpStatus.BAD_REQUEST.code))

        const checkUserInLikedUser = likedUser.likedUsers.includes(user._id); // this checks if user exist in likedUsers array
                                                                              // if true return as part of the res payload else return false
        let likened: boolean;               
        if(checkUserInLikedUser) {
            likened = true
        } else {
            likened = false
        }

        const payload = {
            fromUserId: userId,
            toUserId: likedUserId,
            action: 'like',
            name: Generic.capitalizeFirstLetter(user.firstName),
            othername: Generic.capitalizeFirstLetter(user.lastName),
            photo: user.profileImageUrl,
            age: user.age,
            likened
        }

        // if(user.favourites.includes(likedUser._id)) {
        //     await user.updateOne({ $pull: { favourites: likedUser._id } });
        // }

        //remove from unliked array after like
        if (user.unLikedUsers.length > 0) {
            await Promise.all(
              user.unLikedUsers.map(async (_user) => {
                if (_user.user.toString() === likedUser._id.toString()) {
                  await user.updateOne({ $pull: { unLikedUsers: _user } });
                }
              })
            );
        }
        
        user.likedUsers.push(likedUser._id);
        !likedUser.likedByUsers.includes(user._id) && (likedUser.likedByUsers.push(user._id));
        
        await Promise.all([user.save(), likedUser.save()]);
      
        const response: HttpResponse<any> = {
          code: HttpStatus.OK.code,
          message: `Successfully liked ${likedUser.firstName}'s profile.`,
          result: payload
        };
      
        return Promise.resolve(response);
    }
      
    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async unLikeUser(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
        const unLikedUserId = req.params.unLikedUserId;

        const [user, unLikedUser] = await Promise.all([
          datasources.userDAOService.findById(userId),
          datasources.userDAOService.findById(unLikedUserId),
        ]);

        if (!user || !unLikedUser) {
        return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        }

        const payload = {
            fromUserId: userId,
            toUserId: unLikedUserId,
            action: 'dislike',
            name: Generic.capitalizeFirstLetter(user.firstName),
            othername: Generic.capitalizeFirstLetter(user.lastName),
            photo: user.profileImageUrl
        }

        // if(user.favourites.includes(unLikedUser._id)) {
        //     await user.updateOne({ $pull: { favourites: unLikedUser._id } });
        // }
        // Remove unLikedUserId from the likedUsers array of user
        await user.updateOne({ $pull: { likedUsers: unLikedUserId } });

        // Remove userId from the likedByUsers array of unLikedUser
        await unLikedUser.updateOne({ $pull: { likedByUsers: userId } });

        //Delete the unliked user from chat list
        const filter = { members: { $all: [userId, unLikedUserId]}};
        await datasources.chatDAOService.deleteByAny(filter);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
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
    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async unLikeUserFromMatch(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
        const unLikedUserId = req.params.unLikedUserId;

        const [user, unLikedUser] = await Promise.all([
          datasources.userDAOService.findById(userId),
          datasources.userDAOService.findById(unLikedUserId),
        ]);

        if (!user || !unLikedUser) {
        return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        }

        // if(user.favourites.includes(unLikedUser._id)) {
        //     await user.updateOne({ $pull: { favourites: unLikedUser._id } });
        // }
        const payload = {
            date: new Date(),
            user: unLikedUser._id
        }

        const unliked = user.unLikedUsers.find(user => user.user === unLikedUser._id);
        if(unliked) {
            const response: HttpResponse<any> = {
                code: HttpStatus.OK.code,
                message: `Already unliked this user, ${unLikedUser.firstName}'s profile.`,
            };
    
            return Promise.resolve(response);
        }

        user.unLikedUsers.push(payload)
        await user.save()

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `Successfully unliked ${unLikedUser.firstName}'s profile.`
        };

        return Promise.resolve(response);
    }

    /**
     * the handle when a user fav's another user
     */
    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async favourites(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
        const favId = req.params.favId;

        const [user, faveUser] = await Promise.all([
          datasources.userDAOService.findById(userId),
          datasources.userDAOService.findById(favId),
        ]);

        if (!user || !faveUser) {
        return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        }

        if(user.favourites.includes(faveUser._id)) {
            return Promise.reject(CustomAPIError.response("Already added to favourites.", HttpStatus.BAD_REQUEST.code));
        }

        // if(user.likedUsers.includes(faveUser._id)) {
        //     return Promise.reject(CustomAPIError.response("You currentlty like this user, can't add to favourites.", HttpStatus.BAD_REQUEST.code));
        // }

        user.favourites.push(faveUser._id);
        await user.save();

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `Successfully fav ${faveUser.firstName}'s profile.`
        };

        return Promise.resolve(response);
    }

    @TryCatch
    public async newJob(req: Request) {
        const { error, value } = Joi.object<any>({
            name: Joi.string().required().label("job name")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
        
        const job = await datasources.jobDAOService.findByAny({name: value.name });

        if(job)
            return Promise.reject(CustomAPIError.response(`${value.name} already exist.`, HttpStatus.BAD_REQUEST.code));
        
        let jobValues;
        //@ts-ignore
        const role = await datasources.roleDAOService.findById(req.user.role);
        if(role?.slug === "SUPER_ADMIN_ROLE") {
            jobValues = {
                name: value.name,
                slug: Generic.generateSlug(value.name),
                status: 'active'
            }
        } else {
            jobValues = {
                name: value.name,
                slug: Generic.generateSlug(value.name),
                status: 'pending'
            }
        }

        const result = await datasources.jobDAOService.create(jobValues as any);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `${role?.slug === "SUPER_ADMIN_ROLE" ? "Successfully created." : `Successful, ${value.name} will be added to the list of jobs after review.`}`,
            result
        };

        return Promise.resolve(response);
    }

    @TryCatch
    public async getJobs(req: Request) {

        const jobs = await datasources.jobDAOService.findAll({});

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `Successful`,
            results: jobs
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async getJob(req: Request) {

        const jobId = req.params.jobId;

        const job = await datasources.jobDAOService.findById(jobId);
        if(!job)
            return Promise.reject(CustomAPIError.response("Job not found", HttpStatus.NOT_FOUND.code))

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `Successful`,
            result: job
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async updateJob(req: Request) {
        const jobId = req.params.jobId;

        const { error, value } = Joi.object<any>({
            name: Joi.string().label("job name")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const job = await datasources.jobDAOService.findById(jobId);
        if(!job)
            return Promise.reject(CustomAPIError.response("Job not found", HttpStatus.NOT_FOUND.code));

        await datasources.jobDAOService.update(job, {name: value.name, slug: Generic.generateSlug(value.name)});

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `Successfully updated`
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async deleteJob(req: Request) {
        const jobId = req.params.jobId;

        await datasources.jobDAOService.deleteById(jobId);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: `Successfully deleted`
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async updateLocation (req: Request) {

        //@ts-ignore
        const userId = req.user._id;

        const { error, value } = Joi.object<any>({
            latitude: Joi.number().required().label('Latitude'),
            longitude: Joi.number().required().label('Longitude')
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
        console.log(value, 'saved location in upd loc controller')
        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        const locationValues = {
            location: {
                type: 'Point',
                coordinates: [value.longitude, value.latitude]
            }
        }

        await datasources.userDAOService.update({_id: user?._id}, locationValues)

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: 'Location updated successfully'
         };
 
         return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async gallery (req: Request) {
        const gallery = await this.doGallery(req);

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully uploaded image.',
            result: gallery
        };
      
        return Promise.resolve(response);
    };

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async deletePhotoInGallery (req: Request) {

        //@ts-ignore
        const userId = req.user._id;

        const { error, value } = Joi.object<any>({
            photo: Joi.string().required().label('photo'),
        }).validate(req.body);
        if (error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        //delete photo from directory
        const basePath = `${UPLOAD_BASE_PATH}/user`;
        user.gallery.map(photo => {
            if(photo === value.photo) {
                const _photo = photo.split('user/')[1];
                fs.unlink(`${basePath}/${_photo}`, () => {})
            }
        })

        await user.updateOne({ $pull: { gallery: value.photo } });

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully removed photo from gallery.'
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async getUserNotifications (req: Request) {

        //@ts-ignore
        const userId = req.user._id

        const notifications = await datasources.notificationDAOService.findAll({
            user: userId
        })

        const response: HttpResponse<INotificationModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully fetched notifications.',
            results: notifications
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async getSingleNotification (req: Request) {

        const notificationId = req.params.notificationId;

        const notification = await datasources.notificationDAOService.findByAny({
            _id: notificationId
        })

        const response: HttpResponse<INotificationModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully fetched notification.',
            result: notification
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async updateNotification (req: Request) {

        const notificationId = req.params.notificationId;

        const notification = await datasources.notificationDAOService.findByAny({
            _id: notificationId
        })

        if(!notification) 
            return Promise.reject(CustomAPIError.response("Notification not found.", HttpStatus.NOT_FOUND.code));

        await datasources.notificationDAOService.updateByAny(
            {_id: notification._id},
            {status: true}
        )

        const response: HttpResponse<INotificationModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully updated notification.'
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async deleteNotification (req: Request) {

        const notificationId = req.params.notificationId;

        const notification = await datasources.notificationDAOService.findById(notificationId);
        if(!notification)
            return Promise.reject(
                CustomAPIError.response(
                    "Not found.", HttpStatus.NOT_FOUND.code
                )
            )

        await datasources.notificationDAOService.deleteById(notification._id)

        const response: HttpResponse<INotificationModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully deleted notification.'
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async getAllNotifications (req: Request) {

        const notifications = await datasources.notificationDAOService.findAll({})

        const response: HttpResponse<INotificationModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully fetched notifications.',
            results: notifications
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async getUserChats(req: Request) {
        const { error, value } = Joi.object<any>({
            receiverId: Joi.string().required().label('receiver id'),
            senderId: Joi.string().required().label('sender id')
        }).validate(req.body);
        if (error) return Promise.reject(
            CustomAPIError.response(
                error.details[0].message, 
                HttpStatus.BAD_REQUEST.code
            ));

        const chats = await datasources.chatMessageDAOService.findAll({
            receiverId: value.receiverId,
            senderId: value.senderId
        });

        const results = chats.map(chat => {
            let _chat = {
                //@ts-ignore
                ...chat._doc, 
                datePosted: Generic.dateDifference(new Date())}
            return _chat
        })

        const response: HttpResponse<IChatMessageModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully fetched notifications.',
            results
         };
 
        return Promise.resolve(response);

    }

    @TryCatch
    public async createChatMessage(req: Request) {
        const { chatId, senderId, message } = req.body;

        const newMessage = await datasources.chatMessageDAOService.create({
            chatId, senderId, message
        } as IChatMessageModel);

        const response: HttpResponse<IChatMessageModel> = {
            code: HttpStatus.OK.code,
            message: 'Successful.',
            result: newMessage
         };
 
        return Promise.resolve(response);
    }

    public async getChatMessages(req: Request) {
        try {
            const { chatId } = req.params;
            //@ts-ignore
            const loggedInUser = req.user._id;
    
            const updateUnreadStatus = async (query: any, update: any) => {
                const unreadMessages = await datasources.chatMessageDAOService.findAll(query);
    
                if (unreadMessages.length > 0) {
                    const unreadMessageIds = unreadMessages.map((message) => new Types.ObjectId(message._id));
                    await ChatMessage.updateMany(
                        { _id: { $in: unreadMessageIds } },
                        update
                    );
                }
            };
    
            // Update receiver's unread messages to read
            await updateUnreadStatus(
                { chatId, receiverStatus: 'unread', senderId: { $ne: loggedInUser } },
                { $set: { receiverStatus: 'read' } }
            );
    
            // Update sender's unread messages to read
            await updateUnreadStatus(
                { chatId, senderStatus: 'unread', senderId: loggedInUser },
                { $set: { senderStatus: 'read' } }
            );
    
            // Retrieve all chat messages
            const messages = await datasources.chatMessageDAOService.findAll({ chatId }, { sort: { createdAt: 1 } });
    
            const response: HttpResponse<IChatMessageModel> = {
                code: HttpStatus.OK.code,
                message: 'Successfully.',
                results: messages
            };
    
            return Promise.resolve(response);
        } catch (error) {
            // Handle errors appropriately
            console.error('Error in getChatMessages:', error);
            const response: HttpResponse<IChatMessageModel> = {
                code: HttpStatus.INTERNAL_SERVER_ERROR.code,
                message: 'Internal Server Error',
                result: null
            };
            return Promise.resolve(response);
        }
    }

    public async findUserChats(req: Request) {
        try {
          const userId = req.params.userId;
      
          const chats = await datasources.chatDAOService.findAll({
            members: { $in: [userId] },
          });
      
          if (!chats)
            return Promise.reject(
              CustomAPIError.response(
                "Not found",
                HttpStatus.NOT_FOUND.code
              )
            );
        
          let _member: any = [];
          let countUnreadMessages = 0
          await Promise.all(
            chats.map(async (chat) => {
                const otherMember = chat.members.find((member) => member !== userId);
                
                const user = await datasources.userDAOService.findById(otherMember);
                const chatMessages = await datasources.chatMessageDAOService.findAll({
                    chatId: chat._id
                });
                
                if(!chatMessages)
                    return Promise.reject(CustomAPIError.response("No chat message found.", HttpStatus.NOT_FOUND.code))

                //@ts-ignore
                const sortedMessages = chatMessages.sort((a, b) => b.createdAt - a.createdAt);
                const lastMessage = sortedMessages[0];
                
                const unreadMessages = sortedMessages.filter((message) => message.receiverStatus === 'unread' && message.receiverId !== user?._id );
                const totalUnreadMessages = unreadMessages.length;
                
                _member.push({
                    _id: user?._id,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    profileImageUrl: user?.profileImageUrl,
                    chat: chat,
                    totalUnreadMessages: totalUnreadMessages,
                    lastMessage: lastMessage !== undefined ? lastMessage.message : '',
                    senderId: lastMessage ? lastMessage.senderId : null,
                    //@ts-ignore
                    chatDate: lastMessage ? lastMessage.createdAt : null
                });
                
                countUnreadMessages += unreadMessages.length
            })
          );
          console.log(_member, 'lokk at me message')
          const member = _member.sort((a: any, b: any) => b.chatDate - a.chatDate)

          const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully fetched notifications.',
            result: { chats, member, countUnreadMessages },
          };
      
          return Promise.resolve(response);
        } catch (error) {
          // Handle errors appropriately, log or send an error response
          console.error(error);
          return Promise.reject(
            CustomAPIError.response(
              "Internal Server Error",
              HttpStatus.INTERNAL_SERVER_ERROR.code
            )
          );
        }
    }      

    @TryCatch
    public async fetchFavouriteUsers(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
        
        const user = await datasources.userDAOService.findById(userId);
        if (!user) {
            return Promise.reject(CustomAPIError.response('User not found.', HttpStatus.NOT_FOUND.code));
        }

        const users = await datasources.userDAOService.findAll();

        const filteredUsers = users.filter(_user => {
            if(user.favourites.includes(_user._id)) {
                return user
            }
            
        });
    
        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully fetched users.',
            results: filteredUsers,
        };
    
        return Promise.resolve(response);
    }

    @TryCatch
    public async findChat (req: Request) {
        const {firstId, secondId} = req.params

        const chat = await datasources.chatDAOService.findByAny({
            members: {$all: [firstId, secondId]}
        })

        if(!chat) 
            return Promise.reject(CustomAPIError.response("Not found", HttpStatus.NOT_FOUND.code));

        const response: HttpResponse<IChatModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully fetched notifications.',
            result: chat
        };
    
        return Promise.resolve(response);
    }

    @TryCatch
    public async createChat (req: Request) {
        const { firstId, secondId } = req.body;

        const chat = await datasources.chatDAOService.findByAny({
            members: {$all: [firstId, secondId]}
        });

        if(!chat) {

            const newChat = await datasources.chatDAOService.create({
                members: [firstId, secondId]
            } as IChatModel);

            const response: HttpResponse<IChatModel> = {
                code: HttpStatus.OK.code,
                message: 'Successfully created chat.',
                result: newChat
            };
        
            return Promise.resolve(response);
        }

        const response: HttpResponse<IChatModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully.',
            result: chat
        };
    
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async deleteChat(req: Request) {

        const chatId = req.params.chatId;

        await datasources.chatMessageDAOService.deleteById(chatId);

        const response: HttpResponse<IChatMessageModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully deleted chat.'
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async generateKey (req: Request) {
        //@ts-ignore
        const userId = req.user._id;

        const { error, value } = Joi.object<any>({
            name: Joi.string().required().label('name')
        }).validate(req.body);
        if (error) return Promise.reject(
            CustomAPIError.response(
                error.details[0].message, 
                HttpStatus.BAD_REQUEST.code
            ));

        const slug = Generic.generateSlug(value.name)
        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        const verifiedKey = await datasources.verifiedKeyDAOService.findByAny({ slug });
        if(verifiedKey) 
            return Promise.reject(CustomAPIError.response("Key already exist", HttpStatus.BAD_REQUEST.code));

        const payload: Partial<IVerifiedKeyModel> = {
            name: value.name,
            key: v4(),
            slug
        }

        await datasources.verifiedKeyDAOService.create(payload as IVerifiedKeyModel);

        const response: HttpResponse<IVerifiedKeyModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully generated.'
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async changeKeyStatus(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
        const keyId = req.params.keyId;

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        
        const key = await datasources.verifiedKeyDAOService.findById(keyId);
        if(!key)
            return Promise.reject(CustomAPIError.response("Key not found", HttpStatus.NOT_FOUND.code));
        
        const updatedKey = await datasources.verifiedKeyDAOService.updateByAny({ _id: key._id }, { status: !key.status })
        
        const response: HttpResponse<IVerifiedKeyModel> = {
            code: HttpStatus.OK.code,
            message: 'Successfully generated.',
            result: updatedKey
         };
 
        return Promise.resolve(response);
    }

    @TryCatch
    public async unVerifiedUsers (req: Request) {
        const { error, value } = Joi.object<any>({
            name: Joi.string().required().label('Company name'),
            key: Joi.string().required().label('Unique key')
        }).validate(req.body);
        if (error) 
            return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const verifiedKey = await datasources.verifiedKeyDAOService.findByAny({
            $and: [
                { slug: Generic.generateSlug(value.name) },
                { key: value.key }
            ]
        });
              
        if(!verifiedKey)
            return Promise.reject(CustomAPIError.response("Please confirm the key and company name is correct.", HttpStatus.NOT_FOUND.code));

        const users = await datasources.userDAOService.findAll({
            $and: [
                { verify: 'pending' },
                { planType: 'red' || 'purple' || 'premium' }
            ]
        });

        const response: HttpResponse<IUserModel> = {
            code: HttpStatus.OK.code,
            message: 'Successful.',
            results: users
         };
 
        return Promise.resolve(response);

    }

    @TryCatch
    public async externalVerifyUser (req: Request) {
        
        const userId = req.params.userId;

        const { error, value } = Joi.object<any>({
            name: Joi.string().required().label('Company name'),
            key: Joi.string().required().label('Unique key')
        }).validate(req.body);
        if (error) 
            return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const verifiedKey = await datasources.verifiedKeyDAOService.findByAny({
            $and: [
                { slug: Generic.generateSlug(value.name) },
                { key: value.key }
            ]
        });
                
        if(!verifiedKey)
            return Promise.reject(CustomAPIError.response("Please confirm the key and company name is correct.", HttpStatus.NOT_FOUND.code));     

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        const updated = await datasources.userDAOService.updateByAny(
            { _id: user._id },
            { verify: ACTIVE_VERIFICATION }
        );

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: updated
        };

        return Promise.resolve(response);
    }

    @TryCatch
    public async createWaitlistUser(req: Request) {
        const { error, value } = Joi.object<any>({
            firstName: Joi.string().required().label('First name'),
            lastName: Joi.string().required().label('Last name'),
            phoneNumber: Joi.string().required().label('Phone number'),
            email: Joi.string().required().label('Email'),
        }).validate(req.body);
        if (error) {
            return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
        }

        if (value.phoneNumber.length < 11) {
            return Promise.reject(CustomAPIError.response('Incorrect phone number length', HttpStatus.BAD_REQUEST.code));
        }
    
        if (value.phoneNumber.length > 13) {
            return Promise.reject(CustomAPIError.response('Incorrect phone number length', HttpStatus.BAD_REQUEST.code));
        }
    
        // Check if email is in proper format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.email)) {
            return Promise.reject(CustomAPIError.response('Incorrect email format', HttpStatus.BAD_REQUEST.code));
        }

        if (emailRegex.test(value.email)) {
            const user = await datasources.waitlistDAOService.findByAny({email: value.email})
            if(user)
                return Promise.reject(CustomAPIError.response('You are already on the wailist.', HttpStatus.BAD_REQUEST.code));
        }
        
        // Check if first name and last name are not more than 20 characters
        if (value.firstName.length > 20 || value.lastName.length > 20) {
            return Promise.reject(CustomAPIError.response('First name or last name too long', HttpStatus.BAD_REQUEST.code));
        }

        const newWaitlistUser  = await datasources.waitlistDAOService.create({
            ...value
        } as IWaitlistModel);

        const response: HttpResponse<IWaitlistModel> = {
            code: HttpStatus.OK.code,
            message: 'Successful created',
            result: newWaitlistUser
        };

        return Promise.resolve(response);

    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async getWaitlistUsers(req: Request) {
        
        const waitlistUsers = await datasources.waitlistDAOService.findAll();

        const response: HttpResponse<IWaitlistModel> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            results: waitlistUsers
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async updateWaitlistUser(req: Request) {
        const userId = req.params.userId;

        const { error, value } = Joi.object<any>({
            firstName: Joi.string().required().label('First name'),
            lastName: Joi.string().required().label('Last name'),
            phoneNumber: Joi.string().required().label('Phone number'),
            email: Joi.string().required().label('Email'),
        }).validate(req.body);
        if (error) {
            return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
        }

        const user = await datasources.waitlistDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("Waitlist user not found", HttpStatus.NOT_FOUND.code));

        const updatedUser = await datasources.waitlistDAOService.updateByAny(
            { _id: user._id },
            { ...value }
        ) 

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successful',
            result: updatedUser
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async deleteWaitlistUser(req: Request) {
        const userId = req.params.userId;

        const user = await datasources.waitlistDAOService.findById(userId);
        if(!user) 
            return Promise.reject(CustomAPIError.response("Waitlist user not found", HttpStatus.NOT_FOUND.code));

        await datasources.waitlistDAOService.deleteById(user._id)

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: 'Successfully deleted'
        };

        return Promise.resolve(response);
    }

    private async doGallery(req: Request): Promise<HttpResponse<IUserModel>> {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                //@ts-ignore
                const userId = req.user._id;
    
                const { error, value } = Joi.object<any>({
                    photo: Joi.array().items(Joi.string()).label('photo'),
                }).validate(fields);
    
                if (error) {
                    return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
                }
    
                const user = await datasources.userDAOService.findById(userId);
                if (!user) {
                    return reject(CustomAPIError.response('User not found', HttpStatus.NOT_FOUND.code));
                };

                if(user.gallery.length === 5) {
                    return reject(CustomAPIError.response('You can only upload five photo to your gallery.', HttpStatus.BAD_REQUEST.code));
                }

                let updatedGallery = [...(user.gallery || [])];

                for (const key of Object.keys(files)) {
                    const galleryImage = files[key] as any;
    
                    // Validate file size and type for each image
                    const maxSizeInBytes = MAX_SIZE_IN_BYTE;
                    if (galleryImage.size > maxSizeInBytes) {
                        return reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
                    }
    
                    const allowedFileTypes = ALLOWED_FILE_TYPES;
                    if (!allowedFileTypes.includes(galleryImage.mimetype as string)) {
                        return reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
                    }

                    const outputPath = await Generic.compressImage(
                        galleryImage.filepath
                    );
    
                    // Save each image and get the image path
                    const imagePath = await Generic.getImagePath({
                        tempPath: outputPath,
                        filename: galleryImage.originalFilename as string,
                        basePath: `${UPLOAD_BASE_PATH}/user`,
                    });
                 
                    updatedGallery.push(imagePath);
                };

                user.gallery = updatedGallery;
    
                user.save()
                    //@ts-ignore
                return resolve(user.gallery);
            });
        });
    }
    
    private async doUploadVideo(req: Request): Promise<HttpResponse<IUserModel>> {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                const userId = req.params.userId;

                const { error, value } = Joi.object<IUserModel>({
                    videoUrl: Joi.string().label("video url")
                }).validate(fields);
                if(error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
                
                const user = await datasources.userDAOService.findById(userId);
                if(!user) return reject(CustomAPIError.response('User not found', HttpStatus.NOT_FOUND.code));

                const twentyDaysAgo = new Date();
                twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

                if (user.videoUploadedAt && user.videoUploadedAt >= twentyDaysAgo) {
                    return reject(CustomAPIError.response("Video was last updated less than 20 days ago", HttpStatus.BAD_REQUEST.code));
                }

                const videoFile = files.videoUrl as File;
                const basePath = `${UPLOAD_BASE_PATH}/user/videos`;

                let _videoUrl = ''
                if(videoFile) {
                    // File size validation
                    const maxSizeInBytes = MAX_SIZE_IN_BYTE_VID
                    if (videoFile.size > maxSizeInBytes) {
                        return reject(CustomAPIError.response(MESSAGES.vid_size_error, HttpStatus.BAD_REQUEST.code));
                    }
            
                    // File type validation
                    const allowedFileTypes = ALLOWED_FILE_TYPES_VID
                    if (!allowedFileTypes.includes(videoFile.mimetype as string)) {
                        return reject(CustomAPIError.response(MESSAGES.vid_type_error, HttpStatus.BAD_REQUEST.code));
                    }
            
                    _videoUrl = await Generic.getImagePath({
                        tempPath: videoFile.filepath,
                        filename: videoFile.originalFilename as string,
                        basePath,
                    });
                };

                //delete existing image from directory
                if(_videoUrl) {
                    if(user.videoUrl) {
                        const vid = user.videoUrl.split('videos/')[1];
                        fs.unlink(`${basePath}/${vid}`, () => {})
                    }
                }

                const userValues = {
                    videoUrl: _videoUrl,
                    verify: PENDING_VERIFICATION,
                    videoUploadedAt: new Date()
                };

                const updatedUser = await datasources.userDAOService.updateByAny(
                    {_id: userId},
                    userValues
                );
                
                //@ts-ignore
                return resolve(updatedUser);
            })
        })
    }

    private async doUpdateUserProfileDetails(req: Request): Promise<HttpResponse<IUserModel>> {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                //@ts-ignore
                const userId = req.user._id;
                const { error, value } = Joi.object<any>({
                    // age: Joi.number().label('Age'),
                    bio: Joi.string().allow('').label('Bio'),
                    build: Joi.string().optional().allow('').label('Build'),
                    dob: Joi.date().optional().label('Dob'),
                    interests: Joi.any().label('Interests'),
                    lastName: Joi.string().label('Last name'),
                    firstName: Joi.string().label('First name'),
                    occupation: Joi.string().optional().label('Occupation'),
                    state: Joi.string().optional().label('State'),
                    gender: Joi.string().optional().label('Gender'),
                    height: Joi.string().optional().label('Height'),
                    profileImageUrl: Joi.any().label('profile image')
                }).validate(fields);
                if(error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
               
                const user = await datasources.userDAOService.findById(userId);
                if(!user)
                    return reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

                const profile_image = files.profileImageUrl as File;

                const basePath = `${UPLOAD_BASE_PATH}/user`;

                let _profileImageUrl = ''
                if(profile_image) {
                    // File size validation
                    const maxSizeInBytes = MAX_SIZE_IN_BYTE
                    if (profile_image.size > maxSizeInBytes) {
                        return reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
                    }
            
                    // File type validation
                    const allowedFileTypes = ALLOWED_FILE_TYPES;
                    if (!allowedFileTypes.includes(profile_image.mimetype as string)) {
                        return reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
                    }
            
                    _profileImageUrl = await Generic.getImagePath({
                        tempPath: profile_image.filepath as string,
                        filename: profile_image.originalFilename as string,
                        basePath,
                    });
                };
                
                //delete existing image from directory
                if(profile_image) {
                    if(user.profileImageUrl) {
                        const image = user.profileImageUrl.split('user/')[1];
                        fs.unlink(`${basePath}/${image}`, () => {})
                    }
                }
                const age = new Date().getFullYear() - new Date(value.dob).getFullYear()
                const payload = {
                    ...value,
                    about: value.bio,
                    jobType: value.occupation,
                    interests: value.interests.split(','),
                    level: 2,
                    profileImageUrl: profile_image && _profileImageUrl,
                    age: age.toString()
                }

                const updateUser = await datasources.userDAOService.updateByAny({_id: user._id}, payload);

                //@ts-ignore
                return resolve(updateUser);
            })
        })
    }

    private async doUpdateUserProfileImage(req: Request): Promise<HttpResponse<IUserModel>> {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                //@ts-ignore
                const userId = req.user._id;

                const { error, value } = Joi.object<any>({
                    profileImageUrl: Joi.any().label('profile image')
                }).validate(fields);
                if(error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

                const user = await datasources.userDAOService.findById(userId);
                if(!user) return reject(CustomAPIError.response('User not found', HttpStatus.NOT_FOUND.code));

                const profile_image = files.profileImageUrl as File;
                const basePath = `${UPLOAD_BASE_PATH}/user`;

                let _profileImageUrl = ''
                if(profile_image) {
                    // File size validation
                    const maxSizeInBytes = MAX_SIZE_IN_BYTE
                    if (profile_image.size > maxSizeInBytes) {
                        return reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
                    }
            
                    // File type validation
                    const allowedFileTypes = ALLOWED_FILE_TYPES;
                    if (!allowedFileTypes.includes(profile_image.mimetype as string)) {
                        return reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
                    }

                    const outputPath = await Generic.compressImage(
                        profile_image.filepath
                    );

                    _profileImageUrl = await Generic.getImagePath({
                        tempPath: outputPath,
                        filename: profile_image.originalFilename as string,
                        basePath,
                    });
                };
                
                //delete existing image from directory
                if(profile_image) {
                    if(user.profileImageUrl) {
                        const image = user.profileImageUrl.split('user/')[1];
                        fs.unlink(`${basePath}/${image}`, () => {})
                    }
                }

                const updatedUser = await datasources.userDAOService.updateByAny(
                    {_id: userId},
                    { profileImageUrl: profile_image && _profileImageUrl }
                );
                
                //@ts-ignore
                return resolve(updatedUser);
            })
        })
    }

    private async doUpdateUser(req: Request) {

        //@ts-ignore
        const userId = req.user._id;

        const { error, value } = Joi.object<IUserModel>($updateUserSchema).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
        
        const user = await datasources.userDAOService.findById(userId);
        if(!user) return Promise.reject(CustomAPIError.response('User not found', HttpStatus.NOT_FOUND.code));

        if(value.email) {
            const user_email = await datasources.userDAOService.findByAny({
                email: value.email
            });
    
            if(user.email && user.email !== value.email){
                if(user_email) {
                    return Promise.reject(CustomAPIError.response('User with this email already exists', HttpStatus.NOT_FOUND.code))
                }
            };
        }

        let phone = '';
        if(value.phone) {
            phone = value.phone.replace(/(^\+?(234)?0?)/, '234');

            const user_phone = await datasources.userDAOService.findByAny({
                phone: phone
            });
            
            //@ts-ignore
            if(user.phone && user.phone !== phone){
                if(user_phone) {
                    return Promise.reject(CustomAPIError.response('User with this phone number already exists', HttpStatus.NOT_FOUND.code))
                }
            };
        }

        // let _email = ''
        // if(!user.googleId || !user.facebookId || !user.instagramId) {
        //     _email = value.email as string
        // };

        // let _phone = ''
        // if(user.googleId || user.facebookId || user.instagramId) {
        //     _phone = value.phone
        // };

        const age = new Date().getFullYear() - new Date(value.dob).getFullYear()

        const userValues = {
            ...value,
            email: value.email,
            phone: phone === '' ? user.phone : phone,
            age: age.toString()
        };

        const updatedUser = await datasources.userDAOService.updateByAny(
            {_id: userId},
            userValues
        );
        
        return updatedUser;
    }

    private async doUpdateUserStatus(req: Request) {
        const userId = req.params.userId;

        const user = await datasources.userDAOService.findById(userId);
        if(!user) return Promise.reject(CustomAPIError.response('User not found', HttpStatus.BAD_REQUEST.code));

        const updatedUser = await datasources.userDAOService.update(
            {_id: userId},
            {active: !user.active}
        );

        return updatedUser;

    };

    private async doDeleteUser(req: Request) {
        const userId = req.params.userId;

        return await datasources.userDAOService.deleteById(userId);

    };

    private async doChangePassword(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
        
        const { error, value } = Joi.object<IUserModel>($changePassword).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
      
        const user = await datasources.userDAOService.findById(userId);
        if(!user) return Promise.reject(CustomAPIError.response('User not found', HttpStatus.BAD_REQUEST.code));
    
        const hash = user.password as string;
        const password = value.currentPassword;

        const isMatch = await this.passwordEncoder?.match(password.trim(), hash.trim());
        if(!isMatch) return Promise.reject(CustomAPIError.response('Password in the database differ from the password entered as current  password', HttpStatus.UNAUTHORIZED.code));

        const _password = await this.passwordEncoder?.encode(value.password as string);

        const userValues = {
            password: _password
        };

        const updated = await datasources.userDAOService.updateByAny(
            {_id: userId},
            userValues
        );

        return updated;

    };

    /***
     * This ruturns the users that their id is:
     * 1. not in the likeUser array.
     * 2. does not have date below 5 days in the unLikedUser array
     * 3. and finally, meets the user's preference  
     * 
     */
    private async doMatch(req: Request) {
        //@ts-ignore
        const userId = req.user._id;
        const user = await datasources.userDAOService.findById(userId);
        
        if (!user) {
          return Promise.reject(CustomAPIError.response('User not found', HttpStatus.NOT_FOUND.code));
        }

        if(user.level < 2) 
            return Promise.reject(
                CustomAPIError.response(
                    "Please ensure all your profile details are completed before proceeding.", 
                    HttpStatus.BAD_REQUEST.code))

        if(Object.keys(user.preference).length === 0)
            return Promise.reject(
                CustomAPIError.response(
                    "Please fill out your preference before looking for a match.", 
                    HttpStatus.BAD_REQUEST.code));

        const likedUserIds = user.likedUsers;
        let disliked: any;
        if(user.unLikedUsers.length !== null) {
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

        const users = await datasources.userDAOService.findAll(query);

        const matcher = new Matcher(users);
        const matches = matcher.findMatches(user, user.preference as IPreference);

        const finalMatches = matches.map(match => ({
            //@ts-ignore
            ...match._doc,
            distance: Math.ceil(Generic.location_km(
                user.location.coordinates[1],
                user.location.coordinates[0],
                match.location.coordinates[1],
                match.location.coordinates[0]
            ))
        }));

        const allUsers = users
            //@ts-ignore
            .filter(_user => _user._doc.gender !== user.gender)
            .map(_user => ({
                //@ts-ignore
                ..._user._doc,
                distance: (_user.location.coordinates[1] === -1 && _user.location.coordinates[0] === -1) ? 0 :
                Math.ceil(Generic.location_km(
                    user.location.coordinates[1],
                    user.location.coordinates[0],
                    _user.location.coordinates[1],
                    _user.location.coordinates[0]
                ))
            }));

        return finalMatches.length > 0 ? finalMatches : allUsers;
    }
      
}