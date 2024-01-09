import CardController from "../controller/CardController";
import PermissionController from "../controller/RoleController";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";

const cardController = new CardController();

export const createCardHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await cardController.createCard(req);
    res.status(response.code).json(response);
});

export const updateCardHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await cardController.updateCard(req);
    res.status(response.code).json(response);
});

export const deleteCardHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await cardController.deleteCard(req);
    res.status(response.code).json(response);
});

export const findDefaultCardHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await cardController.findDefaultCard(req);
    res.status(response.code).json(response);
});

export const findUserCardsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await cardController.findUserCards(req);
    res.status(response.code).json(response);
});

export const findAllCardsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await cardController.findAllCards(req);
    res.status(response.code).json(response);
});