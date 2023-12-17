"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionRoute_1 = require("../../routes/subscriptionRoute");
const subscriptionEndpoints = [
    {
        name: 'fetch plans',
        method: 'get',
        path: '/plans',
        handler: subscriptionRoute_1.getPlansHandler
    },
    {
        name: 'update plan',
        method: 'put',
        path: '/update-plan/:planId',
        handler: subscriptionRoute_1.updatePlanHandler
    },
    {
        name: 'premium-purple',
        method: 'post',
        path: '/subscribe',
        handler: subscriptionRoute_1.subscriptionHandler
    },
    {
        name: 'paystack init transaction callback',
        method: 'get',
        path: '/transaction/initialize',
        handler: subscriptionRoute_1.initTransactionCallbackHandler
    },
    {
        name: 'update transaction',
        method: 'put',
        path: '/update-transactions',
        handler: subscriptionRoute_1.updateTransactionHandler
    },
    {
        name: 'get user transactions',
        method: 'get',
        path: '/transactions/user',
        handler: subscriptionRoute_1.getUserTransactionsHandler
    },
    {
        name: 'get transactions',
        method: 'get',
        path: '/transactions',
        handler: subscriptionRoute_1.getTransactionsHandler
    },
    {
        name: 'get transaction by ref',
        method: 'post',
        path: '/transaction-ref',
        handler: subscriptionRoute_1.getTransactionByRefHandler
    },
];
exports.default = subscriptionEndpoints;
