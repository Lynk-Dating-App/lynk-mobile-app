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
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const dao_1 = __importDefault(require("../services/dao"));
const settings_1 = require("../config/settings");
const axiosClient_1 = __importDefault(require("../services/api/axiosClient"));
const constants_1 = require("../config/constants");
const RedisService_1 = __importDefault(require("../services/RedisService"));
const Joi = require("joi");
const formidable_1 = __importDefault(require("formidable"));
const form = (0, formidable_1.default)({ uploadDir: constants_1.UPLOAD_BASE_PATH });
const redisService = new RedisService_1.default();
class SubscriptionController {
    async plans(req) {
        const plans = await dao_1.default.subscriptionDAOService.findAll({});
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: plans
        };
        return Promise.resolve(response);
    }
    async updatePlans(req) {
        const planId = req.params.planId;
        const { error, value } = Joi.object({
            price: Joi.string().label("plan price")
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const plan = await dao_1.default.subscriptionDAOService.findById(planId);
        if (!plan)
            return Promise.reject(CustomAPIError_1.default.response("Plan does not exist", HttpStatus_1.default.NOT_FOUND.code));
        const updatedPlan = await dao_1.default.subscriptionDAOService.updateByAny({ _id: planId }, { price: value.price });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: updatedPlan
        };
        return Promise.resolve(response);
    }
    // @TryCatch
    // @HasPermission([USER_PERMISSION])
    // public async subscription (req: Request) {
    //   const transation = await this.doSubscribe(req)
    //   const response: HttpResponse<any> = {
    //     code: HttpStatus.OK.code,
    //     message: HttpStatus.OK.value,
    //     result: transation,
    //   };
    //   return Promise.resolve(response);
    // }
    // private async doSubscribe(req: Request) {
    //     //@ts-ignore
    //     const userId = req.user._id
    //     const { error, value } = Joi.object<IUserModel>({
    //         planType: Joi.string().required().label("plan type")
    //     }).validate(req.body);
    //     if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    //     const user = await datasources.userDAOService.findById(userId);
    //     if(!user)
    //         return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
    //     const plan = await datasources.subscriptionDAOService.findByAny({ name: value.planType });
    //     if(!plan)
    //         return Promise.reject(CustomAPIError.response("Plan not found", HttpStatus.NOT_FOUND.code));
    //     const actualData = JSON.stringify(plan);
    //     redisService.saveToken("lynk_plan", actualData, 3600);
    //     //initialize payment
    //     const metadata = {
    //         cancel_action: `${process.env.PAYMENT_GW_CB_URL}/transactions?status=cancelled`,
    //     };
    //     axiosClient.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
    //     axiosClient.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;
    //     let endpoint = '/balance';
    //     const balanceResponse = await axiosClient.get(endpoint);
    //     if (balanceResponse.data.data.balance === 0)
    //     return Promise.reject(
    //         CustomAPIError.response('Insufficient Balance. Please contact support.', HttpStatus.BAD_REQUEST.code),
    //     );
    //     endpoint = '/transaction/initialize';
    //     const callbackUrl = `${process.env.PAYMENT_GW_CB_URL}/`;
    //     const amount = plan.price as number;
    //     let serviceCharge = 0.015 * amount;
    //     if (amount >= 2500) {
    //         serviceCharge = 0.015 * amount + 100;
    //     }
    //     if (serviceCharge >= 2000) serviceCharge = 2000;
    //     const _amount = Math.round((serviceCharge + amount) * 100);
    //     const initResponse = await axiosClient.post(`${endpoint}`, {
    //         email: user.email,
    //         amount: _amount,
    //         callback_url: callbackUrl,
    //         metadata,
    //         channels: PAYMENT_CHANNELS,
    //     });
    //     const data = initResponse.data.data;
    //     const txnValues: Partial<ITransactionModel> = {
    //         reference: data.reference,
    //         authorizationUrl: data.authorization_url,
    //         type: 'Payment',
    //         status: initResponse.data.message,
    //         amount: plan.price as number,
    //         user: user._id
    //     };
    //     const transaction = await datasources.transactionDAOService.create(txnValues as ITransactionModel);
    //     return transaction;
    // }
    async initTransactionCallback(req) {
        const { reference } = req.query;
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            reference: reference
        });
        if (!transaction) {
            return Promise.reject(CustomAPIError_1.default.response('Transaction Does not exist.', HttpStatus_1.default.NOT_FOUND.code));
        }
        const user = transaction.user;
        if (!user) {
            return Promise.reject(CustomAPIError_1.default.response('User Does not exist.', HttpStatus_1.default.NOT_FOUND.code));
        }
        //verify payment
        axiosClient_1.default.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
        axiosClient_1.default.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;
        const endpoint = `/transaction/verify/${reference}`;
        const axiosResponse = await axiosClient_1.default.get(endpoint);
        const data = axiosResponse.data.data;
        const redisDataPurple = await redisService.getToken("lynk_plan");
        //for the purple monthly subscription
        if (redisDataPurple) {
            const planData = redisDataPurple;
            const { name, duration } = planData;
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
            if (name === 'premium') {
                const updateValue = {
                    subscription: {
                        plan: name,
                        startDate: new Date(),
                        endDate: futureDate.setMonth(futureDate.getMonth() + duration)
                    },
                    isExpired: false,
                    planType: name
                };
                await dao_1.default.userDAOService.update({ _id: user }, updateValue);
            }
            else {
                await dao_1.default.userDAOService.update({ _id: user }, { planType: name });
            }
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
        await dao_1.default.transactionDAOService.update({ _id: transaction._id }, $transaction);
        await redisService.deleteRedisKey("lynk_plan");
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
        };
        return Promise.resolve(response);
    }
    ;
    async subscription(req) {
        //@ts-ignore
        const userId = req.user._id;
        const { error, value } = Joi.object({
            amount: Joi.number().required().label('Amount'),
            reference: Joi.string().required().label('Reference'),
            status: Joi.string().required().label('status'),
            message: Joi.string().required().label('message'),
            planType: Joi.string().required().label('plan type'),
        }).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const user = await dao_1.default.userDAOService.findById(userId);
        if (!user)
            return Promise.reject(CustomAPIError_1.default.response('User does not exist', HttpStatus_1.default.NOT_FOUND.code));
        const plan = await dao_1.default.subscriptionDAOService.findByAny({ name: value.planType });
        if (!plan)
            return Promise.reject(CustomAPIError_1.default.response("Plan not found", HttpStatus_1.default.NOT_FOUND.code));
        const $transaction = {
            reference: value.reference,
            amount: value.amount,
            status: value.status,
            message: value.message,
            type: `Payment for ${value.planType} plan`,
            user: user._id,
            paidAt: new Date()
        };
        const transaction = await dao_1.default.transactionDAOService.create($transaction);
        if (transaction) {
            const currentDate = new Date();
            const futureDate = new Date(currentDate);
            if (plan.name === 'premium') {
                const updateValue = {
                    subscription: {
                        plan: plan.name,
                        startDate: new Date(),
                        endDate: plan.duration !== null && futureDate.setMonth(futureDate.getMonth() + plan.duration)
                    },
                    isExpired: false,
                    planType: plan.name
                };
                await dao_1.default.userDAOService.update({ _id: user }, updateValue);
            }
            else {
                await dao_1.default.userDAOService.update({ _id: user }, { planType: plan.name });
            }
        }
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: "Transaction was successful"
        };
        return Promise.resolve(response);
    }
    async updateTransaction(req) {
        const value = req.body;
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            reference: value.reference,
        });
        if (!transaction) {
            return Promise.reject(CustomAPIError_1.default.response('Transaction Does not exist.', HttpStatus_1.default.NOT_FOUND.code));
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
        await dao_1.default.transactionDAOService.update({ _id: transaction._id }, transactionValues);
        return Promise.resolve({
            code: HttpStatus_1.default.OK.code,
            message: 'Transaction updated successfully',
            result: transaction,
        });
    }
    async getTransactionsByRef(req) {
        const { reference } = req.body;
        const transaction = await dao_1.default.transactionDAOService.findByAny({
            reference: reference
        });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: transaction
        };
        return Promise.resolve(response);
    }
    async getUserTransactions(req) {
        //@ts-ignore
        const userId = req.user._id;
        const transactions = await dao_1.default.transactionDAOService.findAll({ user: userId });
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: transactions
        };
        return Promise.resolve(response);
    }
    async getTransactions(req) {
        const transactions = await dao_1.default.transactionDAOService.findAll({});
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: transactions
        };
        return Promise.resolve(response);
    }
}
exports.default = SubscriptionController;
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "plans", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updatePlans", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "initTransactionCallback", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "subscription", null);
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "updateTransaction", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getTransactionsByRef", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.USER_PERMISSION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getUserTransactions", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.READ_TRANSACTION]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getTransactions", null);
