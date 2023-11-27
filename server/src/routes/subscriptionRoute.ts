import { Request, Response } from "express";
import SubscriptionController from "../controller/SubscriptionController";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";

const subscriptionController = new SubscriptionController();

export const getPlansHandler = async (req: Request, res: Response) =>  {
    const response = await subscriptionController.plans(req);

    res.status(response.code).json(response);
};

export const updatePlanHandler = async (req: Request, res: Response) =>  {
    const response = await subscriptionController.updatePlans(req);

    res.status(response.code).json(response);
};

export const premiumPurpleSubscriptionHandler = authenticateRouteWrapper(async (req, res) =>  {
    const response = await subscriptionController.premiumPurple_subscription(req);

    res.status(response.code).json(response);
});

export const initTransactionCallbackHandler = async (req: Request, res: Response) => {
    const response = await subscriptionController.initTransactionCallback(req);
  
    res.status(response.code).json(response);
};
  
export const updateTransactionHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await subscriptionController.updateTransaction(req);

    res.status(response.code).json(response);
});

export const getUserTransactionsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await subscriptionController.getUserTransactions(req);

    res.status(response.code).json(response);
});

export const getTransactionsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await subscriptionController.getTransactions(req);

    res.status(response.code).json(response);
});

export const getTransactionByRefHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await subscriptionController.getTransactionsByRef(req);

    res.status(response.code).json(response);
});