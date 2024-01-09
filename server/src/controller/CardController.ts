import { Request } from 'express';
import { HasPermission, TryCatch } from '../decorators';
import HttpStatus from '../helpers/HttpStatus';
import CustomAPIError from '../exceptions/CustomAPIError';
import datasources from  '../services/dao';
import { appCommonTypes } from '../@types/app-common';
import HttpResponse = appCommonTypes.HttpResponse;
import axiosClient from '../services/api/axiosClient';
import Joi = require('joi');
import { ICardModel } from '../models/Card';
import { MANAGE_ALL } from '../config/settings';

export default class CardController {

    @TryCatch
    public async createCard(req: Request) {
        //@ts-ignore
        const userId = req.user._id;

        const { error, value } = Joi.object<any>({
            cardName: Joi.string().required().label("card name"),
            cardNumber: Joi.string().required().label("card number"),
            expiryDate: Joi.string().required().label("expiry date"),
            cvv: Joi.string().required().label("cvv"),
            cardType: Joi.string().required().label("card type")
        }).validate(req.body);
        if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));

        const user = await datasources.userDAOService.findById(userId);
        if(!user)
            return Promise.reject(CustomAPIError.response("User not found", HttpStatus.NOT_FOUND.code));
        
        if(value.cardNumber.length < 16)
            return Promise.reject(CustomAPIError.response("Card number can not be less than 16 numbers", HttpStatus.BAD_REQUEST.code))
        
        if(value.cardNumber.length > 16)
            return Promise.reject(CustomAPIError.response("Card number can not be greater than 16 numbers", HttpStatus.BAD_REQUEST.code))

        if(value.cvv.length < 3)
            return Promise.reject(CustomAPIError.response("Cvv number can not be less than 3 numbers", HttpStatus.BAD_REQUEST.code))

        if(value.cvv.length > 3)
            return Promise.reject(CustomAPIError.response("Cvv number can not be greater than 3 numbers", HttpStatus.BAD_REQUEST.code))

        const payload: Partial<ICardModel> = {
            ...value,
            user: user._id
        }

        const newCard = await datasources.cardDAOService.create(payload as ICardModel);

        const response: HttpResponse<ICardModel> = {
            code: HttpStatus.OK.code,
            message: "Card was created successfully",
            result: newCard
          };
      
        return Promise.resolve(response);
    }

    @TryCatch
    public async updateCard(req: Request) {
        const cardId = req.params.cardId;
        //@ts-ignore
        const userId = req.user._id;
    
        const oldDefaultCard = await datasources.cardDAOService.findByAny({
            default: true,
            user: userId
        });
    
        if (oldDefaultCard) {
            await datasources.cardDAOService.update({ _id: oldDefaultCard._id }, { default: false });
        }

        const card = await datasources.cardDAOService.findById(cardId);
        if (!card) {
            return Promise.reject(CustomAPIError.response("Card not found", HttpStatus.NOT_FOUND.code));
        };

        await datasources.cardDAOService.update({ _id: card._id }, { default: true });
    
        const response: HttpResponse<ICardModel> = {
            code: HttpStatus.OK.code,
            message: "Card successfully updated."
        };
    
        return Promise.resolve(response);
    }
    

    @TryCatch
    public async deleteCard(req: Request) {
        const cardId = req.params.cardId;

        const card = await datasources.cardDAOService.findById(cardId);
        if(!card)
            return Promise.reject(CustomAPIError.response("Card not found", HttpStatus.NOT_FOUND.code));

        await datasources.cardDAOService.deleteById(card._id);

        const response: HttpResponse<ICardModel> = {
            code: HttpStatus.OK.code,
            message: "Card was successfully deleted."
          };
      
        return Promise.resolve(response);
    }

    @TryCatch
    public async findDefaultCard(req: Request) {
        //@ts-ignore
        const userId = req.user._id;

        const card = await datasources.cardDAOService.findByAny({
            default: true,
            user: userId
        });
        if(!card)
            return Promise.reject(CustomAPIError.response("No card is set to default.", HttpStatus.NOT_FOUND.code));

        const response: HttpResponse<ICardModel> = {
            code: HttpStatus.OK.code,
            message: "Default card fetched successfully.",
            result: card
          };
      
        return Promise.resolve(response);
    }

    @TryCatch
    public async findUserCards(req: Request) {
        //@ts-ignore
        const userId = req.user._id;

        const cards = await datasources.cardDAOService.findAll({user: userId});
        if(!cards)
            return Promise.reject(CustomAPIError.response("No card found.", HttpStatus.NOT_FOUND.code));

        const response: HttpResponse<ICardModel> = {
            code: HttpStatus.OK.code,
            message: "Successfull.",
            results: cards
          };
      
        return Promise.resolve(response);
    }

    @TryCatch
    @HasPermission([MANAGE_ALL])
    public async findAllCards(req: Request) {

        const cards = await datasources.cardDAOService.findAll({});
        if(!cards)
            return Promise.reject(CustomAPIError.response("No card found.", HttpStatus.NOT_FOUND.code));

        const response: HttpResponse<ICardModel> = {
            code: HttpStatus.OK.code,
            message: "Ssuccessfull.",
            results: cards
          };
      
        return Promise.resolve(response);
    }
}