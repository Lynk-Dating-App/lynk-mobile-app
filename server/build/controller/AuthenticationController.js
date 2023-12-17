"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const joi_1 = __importDefault(require("joi"));
const User_1 = require("../models/User");
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const dao_1 = __importDefault(require("../services/dao"));
const settings_1 = __importDefault(require("../config/settings"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const constants_1 = require("../config/constants");
// import authService from "../services/AuthService";
const formidable_1 = __importDefault(require("formidable"));
const axiosClient_1 = __importDefault(require("../services/api/axiosClient"));
const form = (0, formidable_1.default)({ uploadDir: constants_1.UPLOAD_BASE_PATH });
class AuthenticationController {
    passwordEncoder;
    io;
    constructor(passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.io = null;
    }
    /**
 *
 * @name customer_signup
 * @param req
 * customer signup
 */
    async admin_login(req) {
        const { error, value } = joi_1.default.object(User_1.$loginSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.adminDAOService.findByAny({ email: value.email });
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.BAD_REQUEST.code));
        const hash = user.password;
        const password = value.password;
        const isMatch = await this.passwordEncoder?.match(password.trim(), hash.trim());
        if (!isMatch)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
        if (!user.active)
            return Promise.reject(CustomAPIError_1.default.response('Account is disabled. Please contact administrator', HttpStatus_1.default.UNAUTHORIZED.code));
        const role = await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
        if (!role)
            return Promise.reject(CustomAPIError_1.default.response('Role is not found', HttpStatus_1.default.UNAUTHORIZED.code));
        const permissions = [];
        for (const _permission of role.permissions) {
            permissions.push(_permission);
        }
        //generate JWT
        const jwt = Generic_1.default.generateJwt({
            userId: user.id,
            permissions
        });
        const { accessToken, refreshToken } = await Generic_1.default.generateJWT({
            userId: user.id,
            permissions,
        });
        //update user authentication date and authentication token
        const updateValues = {
            loginDate: new Date(),
            loginToken: jwt
        };
        await dao_1.default.adminDAOService.updateByAny({ user }, updateValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Login successful',
            result: jwt
        };
        return Promise.resolve(response);
    }
    /**
     *
     * @name customer_signup
     * @param req
     * customer signup
     */
    async signupUser_black(req) {
        const user = await this.doBlackPlanSignup(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Account created successfully',
            result: user,
        };
        return Promise.resolve(response);
    }
    async doBlackPlanSignup(req) {
        const { error, value } = joi_1.default.object(User_1.$saveUserSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const phone = value.phone.replace(/(^\+?(234)?0?)/, '234');
        const _phone = await dao_1.default.userDAOService.findByAny({ phone });
        if (_phone)
            return Promise.reject(CustomAPIError_1.default.response('Phone number already in use', HttpStatus_1.default.BAD_REQUEST.code));
        const email = await dao_1.default.userDAOService.findByAny({ email: value.email });
        if (email)
            return Promise.reject(CustomAPIError_1.default.response('Email already in use', HttpStatus_1.default.BAD_REQUEST.code));
        const role = await dao_1.default.roleDAOService.findByAny({
            slug: settings_1.default.roles[1]
        });
        if (!role)
            return Promise.reject(CustomAPIError_1.default.response('Role not found', HttpStatus_1.default.BAD_REQUEST.code));
        const plan = await dao_1.default.subscriptionDAOService.findByAny({
            name: 'black'
        });
        if (!plan) {
            return Promise.reject(CustomAPIError_1.default.response('Subscription not found', HttpStatus_1.default.BAD_REQUEST.code));
        }
        const password = await this.passwordEncoder?.encode(value.password);
        const userValues = {
            ...value,
            phone: phone,
            role: role._id,
            active: true,
            password: password,
            planType: plan.name,
            verify: constants_1.PENDING_VERIFICATION,
            level: 1
        };
        const user = await dao_1.default.userDAOService.create(userValues);
        role.users.push(user._id);
        await role.save();
        const _role = await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
        if (!_role)
            return Promise.reject(CustomAPIError_1.default.response('Role is not found', HttpStatus_1.default.UNAUTHORIZED.code));
        const permissions = [];
        for (const _permission of _role.permissions) {
            permissions.push(_permission);
        }
        //generate JWT
        const jwt = Generic_1.default.generateJwt({
            userId: user.id,
            isExpired: user.isExpired,
            permissions,
            level: user.level,
            subscription: {
                plan: user.subscription.plan,
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate
            }
        });
        //update user authentication date and authentication token
        const updateValues = {
            loginDate: new Date(),
            loginToken: jwt
        };
        await dao_1.default.userDAOService.updateByAny({ _id: user._id }, updateValues);
        return jwt;
    }
    ;
    // private async doBlackPlanSignup(req: Request): Promise<HttpResponse<IUserModel>> {
    //   return new Promise((resolve, reject) => {
    //     form.parse(req, async (err, fields, files) => {
    //       const { error, value } = Joi.object<IUserModel>($saveUserSchema).validate(fields);
    //       if(error) return reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    //       const email = await datasources.userDAOService.findByAny({email: value.email});
    //       if(email) return reject(CustomAPIError.response('Email already in use', HttpStatus.BAD_REQUEST.code));
    //       const role = await datasources.roleDAOService.findByAny({
    //         slug: settings.roles[1]
    //       });
    //       if(!role) return reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));
    //       const plan = await datasources.subscriptionDAOService.findByAny({
    //         name: 'black'
    //       });
    //       if (!plan) {
    //         return reject(CustomAPIError.response('Subscription not found', HttpStatus.BAD_REQUEST.code));
    //       }
    //       const profile_image = files.profileImageUrl as File;
    //       const basePath = `${UPLOAD_BASE_PATH}/users`;
    //       let _profileImageUrl = ''
    //       if(profile_image) {
    //         // File size validation
    //         const maxSizeInBytes = MAX_SIZE_IN_BYTE
    //         if (profile_image.size > maxSizeInBytes) {
    //             return reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
    //         }
    //         // File type validation
    //         const allowedFileTypes = ALLOWED_FILE_TYPES;
    //         if (!allowedFileTypes.includes(profile_image.mimetype as string)) {
    //             return reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
    //         }
    //         _profileImageUrl = await Generic.getImagePath({
    //             tempPath: profile_image.filepath,
    //             filename: profile_image.originalFilename as string,
    //             basePath,
    //         });
    //       };
    //       const password = await this.passwordEncoder?.encode(value.password as string);
    //       const userValues: Partial<IUserModel> = {
    //         ...value,
    //         role: role._id,
    //         // firstName: value.firstName,
    //         // lastName: value.lastName,
    //         // email: value.email,
    //         active: true,
    //         password: password,
    //         planType: plan.name,
    //         verify: PENDING_VERIFICATION,
    //         profileImageUrl: _profileImageUrl,
    //         level: 1
    //       };
    //       const user = await datasources.userDAOService.create(userValues as IUserModel);
    //       role.users.push(user._id);
    //       await role.save();
    //       const _role = await datasources.roleDAOService.findByIdPopulatePermissions(user.role);
    //       if(!_role) return Promise.reject(CustomAPIError.response('Role is not found', HttpStatus.UNAUTHORIZED.code));
    //       const permissions: any = [];
    //       for (const _permission of _role.permissions) {
    //         permissions.push(_permission)
    //       }
    //       //generate JWT
    //       const jwt = Generic.generateJwt({
    //         userId: user.id,
    //         isExpired: user.isExpired,
    //         permissions,
    //         level: user.level,
    //         subscription: {
    //           plan: user.subscription.plan,
    //           startDate: user.subscription.startDate,
    //           endDate: user.subscription.endDate
    //         }
    //       });
    //       //update user authentication date and authentication token
    //       const updateValues = {
    //         loginDate: new Date(),
    //         loginToken: jwt
    //       };
    //       await datasources.userDAOService.updateByAny({_id: user._id}, updateValues);
    //       return resolve(jwt as any);
    //     })
    //   })
    // };
    async setIO(socketIO) {
        this.io = socketIO;
    }
    async sign_in_user(req) {
        const { error, value } = joi_1.default.object(User_1.$loginSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        let user;
        if (value.emailOrPhone.startsWith('234')) {
            user = await dao_1.default.userDAOService.findByAny({ phone: value.emailOrPhone });
            if (!user)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.BAD_REQUEST.code));
        }
        else {
            user = await dao_1.default.userDAOService.findByAny({ email: value.emailOrPhone });
            if (!user)
                return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.BAD_REQUEST.code));
        }
        if (user.googleId || user.facebookId || user.instagramId) {
            return Promise.reject(CustomAPIError_1.default
                .response(`You tried signing in as ${value.email} using a password, which is not the authentication method you used during sign up. Try again using the authentication method you used during sign up.`, HttpStatus_1.default.BAD_REQUEST.code));
        }
        ;
        const hash = user.password;
        const password = value.password;
        const isMatch = await this.passwordEncoder?.match(password.trim(), hash ? hash.trim() : '');
        if (!isMatch)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.UNAUTHORIZED.code));
        if (!user.active)
            return Promise.reject(CustomAPIError_1.default.response('Account is disabled. Please contact administrator', HttpStatus_1.default.UNAUTHORIZED.code));
        const role = await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
        if (!role)
            return Promise.reject(CustomAPIError_1.default.response('Role is not found', HttpStatus_1.default.UNAUTHORIZED.code));
        const permissions = [];
        for (const _permission of role.permissions) {
            permissions.push(_permission);
        }
        //generate JWT
        const jwt = Generic_1.default.generateJwt({
            userId: user.id,
            isExpired: user.isExpired,
            permissions,
            level: user.level,
            subscription: {
                plan: user.subscription.plan,
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate
            }
        });
        //update user authentication date and authentication token
        const updateValues = {
            loginDate: new Date(),
            loginToken: jwt
        };
        await dao_1.default.userDAOService.updateByAny({ user }, updateValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Login successful',
            result: { jwt, userId: user._id }
        };
        return Promise.resolve(response);
    }
    async sign_in_with_biometric(req) {
        const { error, value } = joi_1.default.object({
            userId: joi_1.default.string().required().label('user biometric identify')
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(value.userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response(HttpStatus_1.default.UNAUTHORIZED.value, HttpStatus_1.default.BAD_REQUEST.code));
        if (!user.active)
            return Promise.reject(CustomAPIError_1.default.response('Account is disabled. Please contact administrator', HttpStatus_1.default.UNAUTHORIZED.code));
        const role = await dao_1.default.roleDAOService.findByIdPopulatePermissions(user.role);
        if (!role)
            return Promise.reject(CustomAPIError_1.default.response('Role is not found', HttpStatus_1.default.UNAUTHORIZED.code));
        const permissions = [];
        for (const _permission of role.permissions) {
            permissions.push(_permission);
        }
        //generate JWT
        const jwt = Generic_1.default.generateJwt({
            userId: user.id,
            isExpired: user.isExpired,
            permissions,
            level: user.level,
            subscription: {
                plan: user.subscription.plan,
                startDate: user.subscription.startDate,
                endDate: user.subscription.endDate
            }
        });
        //update user authentication date and authentication token
        const updateValues = {
            loginDate: new Date(),
            loginToken: jwt
        };
        await dao_1.default.userDAOService.updateByAny({ user }, updateValues);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Login successful',
            result: { jwt, userId: user._id }
        };
        return Promise.resolve(response);
    }
    async loginFailed(req, res) {
        console.log(res, 'error');
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Login successful',
            // result: jwt
        };
        return Promise.resolve(response);
    }
    ;
    googleOAuthFailed(req, res) {
        try {
            res.send('error page');
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async subscribeAndSignUp_red(req) {
        const red_plan = await this.doRedPlan(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: red_plan,
        };
        return Promise.resolve(response);
    }
    async doRedPlan(req) {
        return new Promise((resolve, reject) => {
            form.parse(req, async (err, fields, files) => {
                const planId = req.params.planId;
                const { error, value } = joi_1.default.object(User_1.$saveUserSchema).validate(fields);
                if (error)
                    return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
                const email = await dao_1.default.userDAOService.findByAny({ email: value.email });
                if (email)
                    return Promise.reject(CustomAPIError_1.default.response('Email already in use', HttpStatus_1.default.BAD_REQUEST.code));
                const role = await dao_1.default.roleDAOService.findByAny({
                    slug: settings_1.default.roles[1]
                });
                if (!role)
                    return Promise.reject(CustomAPIError_1.default.response('Role not found', HttpStatus_1.default.BAD_REQUEST.code));
                const plan = await dao_1.default.subscriptionDAOService.findById(planId);
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
                //start create the user on payment success//
                let user;
                if (data) {
                    const profile_image = files.profileImageUrl;
                    const basePath = `${constants_1.UPLOAD_BASE_PATH}/users`;
                    let _profileImageUrl = '';
                    if (profile_image) {
                        // File size validation
                        const maxSizeInBytes = constants_1.MAX_SIZE_IN_BYTE;
                        if (profile_image.size > maxSizeInBytes) {
                            return Promise.reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_size_error, HttpStatus_1.default.BAD_REQUEST.code));
                        }
                        // File type validation
                        const allowedFileTypes = constants_1.ALLOWED_FILE_TYPES;
                        if (!allowedFileTypes.includes(profile_image.mimetype)) {
                            return Promise.reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_type_error, HttpStatus_1.default.BAD_REQUEST.code));
                        }
                        _profileImageUrl = await Generic_1.default.getImagePath({
                            tempPath: profile_image.filepath,
                            filename: profile_image.originalFilename,
                            basePath,
                        });
                    }
                    ;
                    const password = await this.passwordEncoder?.encode(value.password);
                    const userValues = {
                        role: role._id,
                        firstName: value.firstName,
                        lastName: value.lastName,
                        email: value.email,
                        active: true,
                        password: password,
                        planType: plan.name,
                        verify: constants_1.PENDING_VERIFICATION,
                        profileImageUrl: _profileImageUrl,
                        level: 1
                    };
                    const _user = await dao_1.default.userDAOService.create(userValues);
                    role.users.push(_user._id);
                    await role.save();
                    user = _user;
                }
                //end user creation
                const txnValues = {
                    reference: data.reference,
                    // authorizationUrl: data.authorization_url,
                    type: 'Payment',
                    status: initResponse.data.message,
                    amount: plan.price,
                    user: user?._id
                };
                const transaction = await dao_1.default.transactionDAOService.create(txnValues);
                return transaction;
            });
        });
    }
    async subscribeAndSignUp_purple(req) {
        const purple_plan = await this.doPurplePlan(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: purple_plan,
        };
        return Promise.resolve(response);
    }
    async doPurplePlan(req) {
        form.parse(req, async (err, fields, files) => {
            const planId = req.params.planId;
            const { error, value } = joi_1.default.object(User_1.$saveUserSchema).validate(fields);
            if (error)
                return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
            const email = await dao_1.default.userDAOService.findByAny({ email: value.email });
            if (email)
                return Promise.reject(CustomAPIError_1.default.response('Email already in use', HttpStatus_1.default.BAD_REQUEST.code));
            const role = await dao_1.default.roleDAOService.findByAny({
                slug: settings_1.default.roles[1]
            });
            if (!role)
                return Promise.reject(CustomAPIError_1.default.response('Role not found', HttpStatus_1.default.BAD_REQUEST.code));
            const plan = await dao_1.default.subscriptionDAOService.findById(planId);
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
            //start create the user on payment success//
            let user;
            if (data) {
                const profile_image = files.profileImageUrl;
                const basePath = `${constants_1.UPLOAD_BASE_PATH}/users`;
                let _profileImageUrl = '';
                if (profile_image) {
                    // File size validation
                    const maxSizeInBytes = constants_1.MAX_SIZE_IN_BYTE;
                    if (profile_image.size > maxSizeInBytes) {
                        return Promise.reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_size_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    // File type validation
                    const allowedFileTypes = constants_1.ALLOWED_FILE_TYPES;
                    if (!allowedFileTypes.includes(profile_image.mimetype)) {
                        return Promise.reject(CustomAPIError_1.default.response(constants_1.MESSAGES.image_type_error, HttpStatus_1.default.BAD_REQUEST.code));
                    }
                    _profileImageUrl = await Generic_1.default.getImagePath({
                        tempPath: profile_image.filepath,
                        filename: profile_image.originalFilename,
                        basePath,
                    });
                }
                ;
                const password = await this.passwordEncoder?.encode(value.password);
                const userValues = {
                    role: role._id,
                    firstName: value.firstName,
                    lastName: value.lastName,
                    email: value.email,
                    active: true,
                    password: password,
                    planType: plan.name,
                    verify: constants_1.PENDING_VERIFICATION,
                    profileImageUrl: _profileImageUrl,
                    level: 1
                };
                const _user = await dao_1.default.userDAOService.create(userValues);
                role.users.push(_user._id);
                await role.save();
                user = _user;
            }
            //end user creation
            const txnValues = {
                reference: data.reference,
                // authorizationUrl: data.authorization_url,
                type: 'Payment',
                status: initResponse.data.message,
                amount: plan.price,
                user: user?._id
            };
            const transaction = await dao_1.default.transactionDAOService.create(txnValues);
            return transaction;
        });
    }
}
exports.default = AuthenticationController;
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "admin_login", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "signupUser_black", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "sign_in_user", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "sign_in_with_biometric", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "subscribeAndSignUp_red", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "subscribeAndSignUp_purple", null);
