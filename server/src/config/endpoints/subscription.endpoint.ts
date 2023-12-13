import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoint = appCommonTypes.RouteEndpoints;
import {
    getPlansHandler,
    getTransactionByRefHandler,
    getTransactionsHandler,
    getUserTransactionsHandler,
    initTransactionCallbackHandler,
    subscriptionHandler,
    updatePlanHandler,
    updateTransactionHandler
} from '../../routes/subscriptionRoute';

const subscriptionEndpoints: RouteEndpoint  = [
    {
        name: 'fetch plans',
        method: 'get',
        path: '/plans',
        handler: getPlansHandler
    },
    {
        name: 'update plan',
        method: 'put',
        path: '/update-plan/:planId',
        handler: updatePlanHandler
    },
    {
        name: 'premium-purple',
        method: 'post',
        path: '/subscribe',
        handler: subscriptionHandler
    },
    {
        name: 'paystack init transaction callback',
        method: 'get',
        path: '/transaction/initialize',
        handler: initTransactionCallbackHandler
    },
    {
        name: 'update transaction',
        method: 'put',
        path: '/update-transactions',
        handler: updateTransactionHandler
    },
    {
        name: 'get user transactions',
        method: 'get',
        path: '/transactions/user',
        handler: getUserTransactionsHandler
    },
    {
        name: 'get transactions',
        method: 'get',
        path: '/transactions',
        handler: getTransactionsHandler
    },
    {
        name: 'get transaction by ref',
        method: 'post',
        path: '/transaction-ref',
        handler: getTransactionByRefHandler
    },
];

export default subscriptionEndpoints;