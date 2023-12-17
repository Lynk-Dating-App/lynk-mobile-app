"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionByRefHandler = exports.getTransactionsHandler = exports.getUserTransactionsHandler = exports.updateTransactionHandler = exports.initTransactionCallbackHandler = exports.subscriptionHandler = exports.updatePlanHandler = exports.getPlansHandler = void 0;
const SubscriptionController_1 = __importDefault(require("../controller/SubscriptionController"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const subscriptionController = new SubscriptionController_1.default();
const getPlansHandler = async (req, res) => {
    const response = await subscriptionController.plans(req);
    res.status(response.code).json(response);
};
exports.getPlansHandler = getPlansHandler;
const updatePlanHandler = async (req, res) => {
    const response = await subscriptionController.updatePlans(req);
    res.status(response.code).json(response);
};
exports.updatePlanHandler = updatePlanHandler;
exports.subscriptionHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await subscriptionController.subscription(req);
    res.status(response.code).json(response);
});
const initTransactionCallbackHandler = async (req, res) => {
    const response = await subscriptionController.initTransactionCallback(req);
    res.status(response.code).json(response);
};
exports.initTransactionCallbackHandler = initTransactionCallbackHandler;
exports.updateTransactionHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await subscriptionController.updateTransaction(req);
    res.status(response.code).json(response);
});
exports.getUserTransactionsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await subscriptionController.getUserTransactions(req);
    res.status(response.code).json(response);
});
exports.getTransactionsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await subscriptionController.getTransactions(req);
    res.status(response.code).json(response);
});
exports.getTransactionByRefHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await subscriptionController.getTransactionsByRef(req);
    res.status(response.code).json(response);
});
