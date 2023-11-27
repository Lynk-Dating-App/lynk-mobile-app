import { appCommonTypes } from "../@types/app-common";
import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import { Request, Response } from "express";
import { TryCatch } from "../decorators";
import Joi from "joi";
import { $loginSchema, $saveUserSchema, IUserModel } from "../models/User";
import CustomAPIError from "../exceptions/CustomAPIError";
import HttpStatus from "../helpers/HttpStatus";
import datasources from '../services/dao';
import settings from "../config/settings";
import Generic from "../utils/Generic";
import { IAdminModel } from "../models/Admin";
import { 
  ALLOWED_FILE_TYPES, 
  MAX_SIZE_IN_BYTE, MESSAGES, 
  PAYMENT_CHANNELS, 
  PENDING_VERIFICATION, 
  UPLOAD_BASE_PATH } 
from "../config/constants";
// import authService from "../services/AuthService";
import formidable, { File } from 'formidable';
import { ITransactionModel } from "../models/Transaction";
import axiosClient from '../services/api/axiosClient';
import { Server } from 'socket.io';

const form = formidable({ uploadDir: UPLOAD_BASE_PATH });

export default class AuthenticationController {
    private readonly passwordEncoder: BcryptPasswordEncoder | undefined;
    private io: Server<any, any, any, any> | null; 

    constructor(passwordEncoder?: BcryptPasswordEncoder) {
      this.passwordEncoder = passwordEncoder;
      this.io = null;
    }

        /**
     * 
     * @name customer_signup
     * @param req
     * customer signup
     */
    @TryCatch
    public async admin_login(req: Request) {
      const { error, value } = Joi.object<IAdminModel>($loginSchema).validate(req.body);

      if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      const user = await datasources.adminDAOService.findByAny({email: value.email});
      if(!user) return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.BAD_REQUEST.code));

      const hash = user.password;
      const password = value.password;

      const isMatch = await this.passwordEncoder?.match(password.trim(), hash.trim());
      if(!isMatch) return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));

      if(!user.active)
      return Promise.reject(
          CustomAPIError.response('Account is disabled. Please contact administrator', HttpStatus.UNAUTHORIZED.code)
      );

      const role = await datasources.roleDAOService.findByIdPopulatePermissions(user.role);

      if(!role) return Promise.reject(CustomAPIError.response('Role is not found', HttpStatus.UNAUTHORIZED.code));

      const permissions: any = [];
      
      for (const _permission of role.permissions) {
        permissions.push(_permission)
      }

      //generate JWT
      const jwt = Generic.generateJwt({
        userId: user.id,
        permissions
      });

      const { accessToken, refreshToken }: any = await Generic.generateJWT({
        userId: user.id,
        permissions,
      });

      //update user authentication date and authentication token
      const updateValues = {
        loginDate: new Date(),
        loginToken: jwt
      };

      await datasources.adminDAOService.updateByAny({user}, updateValues);

      const response: HttpResponse<string> = {
        code: HttpStatus.OK.code,
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
    @TryCatch
    public async signupUser_black (req: Request) {
      const user = await this.doBlackPlanSignup(req)
      
      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: 'Account created successfully',
        result: user,
      };
  
      return Promise.resolve(response);
    }

    private async doBlackPlanSignup(req: Request) {
      const { error, value } = Joi.object<IUserModel>($saveUserSchema).validate(req.body);
      if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      const phone = value.phone.replace(/(^\+?(234)?0?)/, '234');
      const _phone = await datasources.userDAOService.findByAny({phone});
      if(_phone) return Promise.reject(CustomAPIError.response('Phone number already in use', HttpStatus.BAD_REQUEST.code));

      const email = await datasources.userDAOService.findByAny({email: value.email});
      if(email) return Promise.reject(CustomAPIError.response('Email already in use', HttpStatus.BAD_REQUEST.code));

      const role = await datasources.roleDAOService.findByAny({
        slug: settings.roles[1]
      });
      if(!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

      const plan = await datasources.subscriptionDAOService.findByAny({
        name: 'black'
      });
      if (!plan) {
        return Promise.reject(CustomAPIError.response('Subscription not found', HttpStatus.BAD_REQUEST.code));
      }

      const password = await this.passwordEncoder?.encode(value.password as string);

      const userValues: Partial<IUserModel> = {
        ...value,
        phone: phone,
        role: role._id,
        active: true,
        password: password,
        planType: plan.name,
        verify: PENDING_VERIFICATION,
        level: 1
      };

      const user = await datasources.userDAOService.create(userValues as IUserModel);

      role.users.push(user._id);
      await role.save();

      const _role = await datasources.roleDAOService.findByIdPopulatePermissions(user.role);
      if(!_role) return Promise.reject(CustomAPIError.response('Role is not found', HttpStatus.UNAUTHORIZED.code));

      const permissions: any = [];
  
      for (const _permission of _role.permissions) {
        permissions.push(_permission)
      }

      //generate JWT
      const jwt = Generic.generateJwt({
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

      await datasources.userDAOService.updateByAny({_id: user._id}, updateValues);
      
      return jwt;
    };

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

    public async setIO(socketIO: any) {
      this.io = socketIO;
    }

    @TryCatch
    public async sign_in_user(req: Request) {
      const { error, value } = Joi.object<any>($loginSchema).validate(req.body);
      if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

      let user;
      if(value.emailOrPhone.startsWith('234')) {
        user = await datasources.userDAOService.findByAny({phone: value.emailOrPhone});
        if(!user) return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.BAD_REQUEST.code));
      } else {
        user = await datasources.userDAOService.findByAny({email: value.emailOrPhone});
        if(!user) return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.BAD_REQUEST.code));
      }

      if(user.googleId || user.facebookId || user.instagramId) {
        return Promise.reject(
          CustomAPIError
          .response(`You tried signing in as ${value.email} using a password, which is not the authentication method you used during sign up. Try again using the authentication method you used during sign up.`, HttpStatus.BAD_REQUEST.code))
      };
      
      const hash = user.password as string;
      const password = value.password as string;

      const isMatch = await this.passwordEncoder?.match(password.trim(), hash ? hash.trim() : '');
      if(!isMatch) return Promise.reject(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));

      if(!user.active)
        return Promise.reject(
          CustomAPIError.response('Account is disabled. Please contact administrator', HttpStatus.UNAUTHORIZED.code)
        );

      const role = await datasources.roleDAOService.findByIdPopulatePermissions(user.role);
      if(!role) return Promise.reject(CustomAPIError.response('Role is not found', HttpStatus.UNAUTHORIZED.code));

      const permissions: any = [];
      
      for (const _permission of role.permissions) {
        permissions.push(_permission)
      }

      //generate JWT
      const jwt = Generic.generateJwt({
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

      await datasources.userDAOService.updateByAny({user}, updateValues);

      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: 'Login successful',
        result: {jwt, userId: user._id}
      };

      return Promise.resolve(response);
    }

    public async loginFailed(req: Request, res:Response) {
      console.log(res, 'error')
      const response: HttpResponse<string> = {
        code: HttpStatus.OK.code,
        message: 'Login successful',
        // result: jwt
      };

      return Promise.resolve(response);
    };

    public googleOAuthFailed(req: Request, res: Response) {
      try {
        res.send('error page')
      } catch (error) {
        return Promise.reject(error)
      }
    }

    @TryCatch
    public async subscribeAndSignUp_red (req: Request) {
      const red_plan = await this.doRedPlan(req)

      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: red_plan,
      };
  
      return Promise.resolve(response);
    }

    private async doRedPlan(req: Request): Promise<HttpResponse<IUserModel>> {
      return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
          const planId = req.params.planId;
          
          const { error, value } = Joi.object<IUserModel>($saveUserSchema).validate(fields);
          if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

          const email = await datasources.userDAOService.findByAny({email: value.email});
          if(email) return Promise.reject(CustomAPIError.response('Email already in use', HttpStatus.BAD_REQUEST.code));

          const role = await datasources.roleDAOService.findByAny({
            slug: settings.roles[1]
          });
          if(!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

          const plan = await datasources.subscriptionDAOService.findById(planId);
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
          const amount = plan.price as number;
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

          //start create the user on payment success//
          let user;
          if(data) {

            const profile_image = files.profileImageUrl as File;
            const basePath = `${UPLOAD_BASE_PATH}/users`;
    
            let _profileImageUrl = ''
            if(profile_image) {
              // File size validation
              const maxSizeInBytes = MAX_SIZE_IN_BYTE
              if (profile_image.size > maxSizeInBytes) {
                  return Promise.reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
              }
      
              // File type validation
              const allowedFileTypes = ALLOWED_FILE_TYPES;
              if (!allowedFileTypes.includes(profile_image.mimetype as string)) {
                  return Promise.reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
              }
      
              _profileImageUrl = await Generic.getImagePath({
                  tempPath: profile_image.filepath,
                  filename: profile_image.originalFilename as string,
                  basePath,
              });
            };
    
            const password = await this.passwordEncoder?.encode(value.password as string);
    
            const userValues: Partial<IUserModel> = {
              role: role._id,
              firstName: value.firstName,
              lastName: value.lastName,
              email: value.email,
              active: true,
              password: password,
              planType: plan.name,
              verify: PENDING_VERIFICATION,
              profileImageUrl: _profileImageUrl,
              level: 1
            };
    
            const _user = await datasources.userDAOService.create(userValues as IUserModel);
    
            role.users.push(_user._id);
            await role.save();

            user = _user
          }
          //end user creation

          const txnValues: Partial<ITransactionModel> = {
              reference: data.reference,
              authorizationUrl: data.authorization_url,
              type: 'Payment',
              status: initResponse.data.message,
              amount: plan.price as number,
              user: user?._id
          };

          const transaction = await datasources.transactionDAOService.create(txnValues as ITransactionModel);

          return transaction;
        })
      })
    }

    @TryCatch
    public async subscribeAndSignUp_purple (req: Request) {
      const purple_plan = await this.doPurplePlan(req)

      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: purple_plan,
      };
  
      return Promise.resolve(response);
    }

    private async doPurplePlan(req: Request) {
      form.parse(req, async (err, fields, files) => {
        const planId = req.params.planId;
        
        const { error, value } = Joi.object<IUserModel>($saveUserSchema).validate(fields);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const email = await datasources.userDAOService.findByAny({email: value.email});
        if(email) return Promise.reject(CustomAPIError.response('Email already in use', HttpStatus.BAD_REQUEST.code));

        const role = await datasources.roleDAOService.findByAny({
          slug: settings.roles[1]
        });
        if(!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));

        const plan = await datasources.subscriptionDAOService.findById(planId);
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
        const amount = plan.price as number;
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

        //start create the user on payment success//
        let user;
        if(data) {

          const profile_image = files.profileImageUrl as File;
          const basePath = `${UPLOAD_BASE_PATH}/users`;
  
          let _profileImageUrl = ''
          if(profile_image) {
            // File size validation
            const maxSizeInBytes = MAX_SIZE_IN_BYTE
            if (profile_image.size > maxSizeInBytes) {
                return Promise.reject(CustomAPIError.response(MESSAGES.image_size_error, HttpStatus.BAD_REQUEST.code));
            }
    
            // File type validation
            const allowedFileTypes = ALLOWED_FILE_TYPES;
            if (!allowedFileTypes.includes(profile_image.mimetype as string)) {
                return Promise.reject(CustomAPIError.response(MESSAGES.image_type_error, HttpStatus.BAD_REQUEST.code));
            }
    
            _profileImageUrl = await Generic.getImagePath({
                tempPath: profile_image.filepath,
                filename: profile_image.originalFilename as string,
                basePath,
            });
          };
  
          const password = await this.passwordEncoder?.encode(value.password as string);
  
          const userValues: Partial<IUserModel> = {
            role: role._id,
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            active: true,
            password: password,
            planType: plan.name,
            verify: PENDING_VERIFICATION,
            profileImageUrl: _profileImageUrl,
            level: 1
          };
  
          const _user = await datasources.userDAOService.create(userValues as IUserModel);
  
          role.users.push(_user._id);
          await role.save();

          user = _user
        }
        //end user creation

        const txnValues: Partial<ITransactionModel> = {
            reference: data.reference,
            authorizationUrl: data.authorization_url,
            type: 'Payment',
            status: initResponse.data.message,
            amount: plan.price as number,
            user: user?._id
        };

        const transaction = await datasources.transactionDAOService.create(txnValues as ITransactionModel);

        return transaction;
      }
  )}
}