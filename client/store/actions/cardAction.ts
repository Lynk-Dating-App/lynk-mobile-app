import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';

const CREATE_CARD = 'auth:CREATE_CARD';
const UPDATE_CARD = 'auth:UPDATE_CARD';
const DELETE_CARD = 'auth:DELETE_CARD';
const FIND_DEFAULT_CARD = 'auth:FIND_DEFAULT_CARD';
const FIND_USER_CARDS = 'auth:FIND_USER_CARDS';

const API_ROOT = settings.api.rest;

export const createCardAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(CREATE_CARD, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/card`, args);

    return response.data;
});

export const updateCardAction = asyncThunkWrapper<ApiResponseSuccess<any>, {cardId: string}>(UPDATE_CARD, async (args: any) => {
    const response = await axiosClient.put(`${API_ROOT}/update-card/${args.cardId}`);

    return response.data;
});

export const deleteCardAction = asyncThunkWrapper<ApiResponseSuccess<any>, {cardId: string}>(DELETE_CARD, async (args: any) => {
    const response = await axiosClient.delete(`${API_ROOT}/delete-card/${args.cardId}`);

    return response.data;
});

export const findDefaultCardAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(FIND_DEFAULT_CARD, async () => {
    const response = await axiosClient.get(`${API_ROOT}/default-card`);

    return response.data;
});

export const findUserCardsAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(FIND_USER_CARDS, async () => {
    const response = await axiosClient.get(`${API_ROOT}/find-user-cards`);

    return response.data;
});