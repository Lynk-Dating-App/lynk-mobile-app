import { Request } from 'express';
import { HasPermission, TryCatch } from '../decorators';
import HttpStatus from '../helpers/HttpStatus';
import CustomAPIError from '../exceptions/CustomAPIError';
import datasources from  '../services/dao';
import { appCommonTypes } from '../@types/app-common';
import HttpResponse = appCommonTypes.HttpResponse;
import { MANAGE_ALL, READ_TRANSACTION, USER_PERMISSION } from '../config/settings';
import axiosClient from '../services/api/axiosClient';
import { 
    PAYMENT_CHANNELS,
    PREMIUM_PURPLE_PLAN, 
    UPLOAD_BASE_PATH
} from '../config/constants';
import { ITransactionModel } from '../models/Transaction';
import RedisService from '../services/RedisService';
import Joi = require('joi');
import { ISubscriptionModel } from '../models/Subscription';
import formidable, { File } from 'formidable';
import { IUserModel } from '../models/User';

const form = formidable({ uploadDir: UPLOAD_BASE_PATH });

const redisService = new RedisService();

export default class SubscriptionController {

    @TryCatch
    public async plans(req: Request) {

        const plans = await datasources.subscriptionDAOService.findAll({});

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            results: plans
          };
      
        return Promise.resolve(response);
    }

    @TryCatch
    public async updatePlans (req: Request) {
        const planId = req.params.planId;

        const { error, value } = Joi.object<any>({
            price: Joi.string().label("plan price")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const plan = await datasources.subscriptionDAOService.findById(planId);
        if(!plan) 
            return Promise.reject(CustomAPIError.response("Plan does not exist", HttpStatus.NOT_FOUND.code));

        const updatedPlan = await datasources.subscriptionDAOService.updateByAny(
            { _id: planId },
            { price: value.price }
        );

        const response: HttpResponse<ISubscriptionModel> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            result: updatedPlan
        }

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async premiumPurple_subscription (req: Request) {
      const red_plan = await this.doPremiumPurple_subscription(req)

      const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: red_plan,
      };
  
      return Promise.resolve(response);
    }

    private async doPremiumPurple_subscription(req: Request) {
        //@ts-ignore
        const userId = req.user._id
        const { error, value } = Joi.object<IUserModel>({
            planType: Joi.string().required().label("plan type")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));

        const plan = await datasources.subscriptionDAOService.findByAny({ name: value.planType });
        if(!plan)
            return Promise.reject(CustomAPIError.response("Plan not found", HttpStatus.NOT_FOUND.code));

        const actualData = JSON.stringify(plan);
        redisService.saveToken(PREMIUM_PURPLE_PLAN, actualData, 3600);

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

        const txnValues: Partial<ITransactionModel> = {
            reference: data.reference,
            authorizationUrl: data.authorization_url,
            type: 'Payment',
            status: initResponse.data.message,
            amount: plan.price as number,
            user: user._id
        };

        const transaction = await datasources.transactionDAOService.create(txnValues as ITransactionModel);

        return transaction;
    }

    @TryCatch
    public async initTransactionCallback(req: Request) {
        const { reference } = req.query as unknown as { reference: string };

        const transaction = await datasources.transactionDAOService.findByAny({
           reference: reference
        });
        
        if (!transaction) {
            return Promise.reject(CustomAPIError.response('Transaction Does not exist.', HttpStatus.NOT_FOUND.code));
        }

        const user = transaction.user;
        if (!user) {
            return Promise.reject(CustomAPIError.response('User Does not exist.', HttpStatus.NOT_FOUND.code));
        }
        
        //verify payment
        axiosClient.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;

        const endpoint = `/transaction/verify/${reference}`;

        const axiosResponse = await axiosClient.get(endpoint);

        const data = axiosResponse.data.data;

        const redisDataPurple = await redisService.getToken(PREMIUM_PURPLE_PLAN);

        //for the purple monthly subscription
        if(redisDataPurple) {
            const planData = redisDataPurple;

            const { name, duration }: any = planData;
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
                
            const updateValue = {
                subscription: {
                    plan: name,
                    startDate: new Date(),
                    endDate: futureDate.setMonth(futureDate.getMonth() + duration)
                },
                isExpired: false
            }

            await datasources.userDAOService.update({ _id: user }, updateValue);
        }
        
        const $transaction = {
            reference: data.reference,
            channel: data.authorization.channel,
            cardType: data.authorization.card_type,
            bank: data.authorization.bank,
            last4: data.authorization.last4,
            expMonth: data.authorization.exp_month,
            expYear: data.authorization.exp_year,
            countryCode: data.authorization.country_code,
            brand: data.authorization.brand,
            currency: data.currency,
            status: data.status,
            paidAt: data.paid_at,
            type: transaction.type,
        };

        await datasources.transactionDAOService.update(
            {_id: transaction._id},
            $transaction
        );

        await redisService.deleteRedisKey(PREMIUM_PURPLE_PLAN);

        const response: HttpResponse<void> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
        };

        return Promise.resolve(response);
    };

    @TryCatch
    public async updateTransaction(req: Request) {
        const value = req.body;

        const transaction = await datasources.transactionDAOService.findByAny({
            reference: value.reference,
        });

        if (!transaction) {
            return Promise.reject(CustomAPIError.response('Transaction Does not exist.', HttpStatus.NOT_FOUND.code));
        }

        const transactionValues = {
            channel: value.channel,
            cardType: value.cardType,
            bank: value.bank,
            last4: value.last4,
            expMonth: value.expMonth,
            expYear: value.expYear,
            countryCode: value.countryCode,
            brand: value.brand,
            currency: value.currency,
            status: value.status,
            paidAt: value.paidAt,
        };

        await datasources.transactionDAOService.update(
            {_id: transaction._id},
            transactionValues
        );

        return Promise.resolve({
            code: HttpStatus.OK.code,
            message: 'Transaction updated successfully',
            result: transaction,
        } as HttpResponse<ITransactionModel>);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async getTransactionsByRef(req: Request) {
        const { reference } = req.body;
        const transaction = await datasources.transactionDAOService.findByAny({
            reference: reference
        });

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            result: transaction
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([USER_PERMISSION])
    public async getUserTransactions(req: Request) {

        //@ts-ignore
        const userId = req.user._id;

        const transactions = await datasources.transactionDAOService.findAll({ user: userId });

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            results: transactions 
        };

        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL, READ_TRANSACTION])
    public async getTransactions(req: Request) {

        const transactions = await datasources.transactionDAOService.findAll({});

        const response: HttpResponse<any> = {
            code: HttpStatus.OK.code,
            message: HttpStatus.OK.value,
            results: transactions 
        };

        return Promise.resolve(response);
    }

}
