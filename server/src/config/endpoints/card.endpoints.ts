import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoint = appCommonTypes.RouteEndpoints;
import { createCardHandler, deleteCardHandler, findAllCardsHandler, findDefaultCardHandler, findUserCardsHandler, updateCardHandler } from '../../routes/cardRoute';

const cardEndpoints: RouteEndpoint  = [
    {
        name: 'create card',
        method: 'post',
        path: '/card',
        handler: createCardHandler
    },
    {
        name: 'update card',
        method: 'put',
        path: '/update-card/:cardId',
        handler: updateCardHandler
    },
    {
        name: 'delete card',
        method: 'delete',
        path: '/delete-card/:cardId',
        handler: deleteCardHandler
    },
    {
        name: 'find default card',
        method: 'get',
        path: '/default-card',
        handler: findDefaultCardHandler
    },
    {
        name: 'find user cards',
        method: 'get',
        path: '/find-user-cards',
        handler: findUserCardsHandler
    },
    {
        name: 'find all cards',
        method: 'get',
        path: '/find-all-cards',
        handler: findAllCardsHandler
    }
];

export default cardEndpoints;