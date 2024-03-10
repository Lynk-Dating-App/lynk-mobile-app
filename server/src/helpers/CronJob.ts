import SubscriptionController from "../controller/SubscriptionController";
import UserRepository from "../repositories/UserRepository";
import datasources from  '../services/dao';
import axiosClient from '../services/api/axiosClient';
import { PAYSTACK_EMAIL, PREMIUM_PLAN_COST } from "../config/constants";
import { ITransactionModel } from "../models/Transaction";
import { INotificationModel } from "../models/Notification";

const userRepository = new UserRepository()
const subscriptionController = new SubscriptionController();

export default class CronJob {

    public static async userIsExpired () {
        console.log('cron job started')
        const users = await userRepository.findAll({});
        const currentDate = new Date();

        for (const user of users) {
            if(user.planType !== 'premium') return;
            if (user.subscription.endDate && user.subscription.endDate <= currentDate) {
                if(!user.autoRenewal) return;

                const plan = await datasources.subscriptionDAOService.findByAny({ name: user.planType });
                if(!plan) return;

                //verify payment
                axiosClient.defaults.baseURL = `${process.env.PAYMENT_GW_BASE_URL}`;
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${process.env.PAYMENT_GW_SECRET_KEY}`;

                if(!user.authorizationCode) return;
                
                const endpoint ='/transaction/charge_authorization';
                const axiosResponse = await axiosClient.post(endpoint, {
                    authorization_code: user.authorizationCode,
                    email: PAYSTACK_EMAIL,
                    amount: PREMIUM_PLAN_COST
                });
                const data = axiosResponse.data.data;

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
                    amount: data.amount,
                    type: `Payment for ${user.planType} plan`,
                    user: user._id,
                    authorizationCode: data.authorization.authorization_code
                };

                const transaction = await datasources.transactionDAOService.create($transaction as unknown as ITransactionModel);
                if(transaction.status === 'success') {
                    const currentDate = new Date();
                    const futureDate = new Date(currentDate);

                    const updateValue = {
                        subscription: {
                            plan: plan.name,
                            startDate: new Date(),
                            endDate: plan.duration !== null && futureDate.setMonth(futureDate.getMonth() + plan.duration)
                        },
                        isExpired: false,
                        planType: plan.name
                    }

                    await datasources.userDAOService.updateByAny({ _id: user._id }, updateValue);
                    await datasources.notificationDAOService.create({
                        message: "Your subscription for premium plan was successful. You can now enjoy the premium offerings.",
                        status: false,
                        user: user._id,
                        notification: "Premium subscription success"
                    } as INotificationModel)
                } else {
                    await datasources.notificationDAOService.create({
                        message: "Your subscription for premium plan was not successful. Please check that your card detail is correct.",
                        status: false,
                        user: user._id,
                        notification: "Premium subscription failed"
                    } as INotificationModel);
                    await datasources.userDAOService.updateByAny({ _id: user._id }, { isExpired: true, planType: 'purple' })
                }

                return;
            }
        }
    }

    private static isFirstDayOfMonth(date: Date) {
        const dayOfMonth = date.getDate();

        return dayOfMonth === 10;
    }

    public static async userRewindCount () {
        const currentDate = new Date();
        const isFirstDay = this.isFirstDayOfMonth(currentDate);
        const users = await userRepository.findAll({});

        if(isFirstDay) {
            for (const user of users) {
                const plan = await datasources.subscriptionDAOService.findByAny({ name: user.planType });
                if(!plan) return;

                if(plan.name === 'premium') {
                    await datasources.userDAOService.updateByAny(
                        { _id: user._id },
                        { rewindCount: 'unlimited' }
                    )
                } else if(plan.name === 'purple') {
                    await datasources.userDAOService.updateByAny(
                        { _id: user._id },
                        { rewindCount: '15' }
                    )
                } else if(plan.name === 'red') {
                    await datasources.userDAOService.updateByAny(
                        { _id: user._id },
                        { rewindCount: '5' }
                    )
                } else if(plan.name === 'black') {
                    await datasources.userDAOService.updateByAny(
                        { _id: user._id },
                        { rewindCount: 'NO' }
                    )
                }
            }
        }
          
    }
}

