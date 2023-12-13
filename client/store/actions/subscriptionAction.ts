import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';

const SUBSCRIPTION = 'auth:SUBSCRIPTION';
const INITIALIZE_SUBSCRIPTION = 'auth:INITIALIZE_SUBSCRIPTION';
const GET_SUBSCRIPTION = 'auth:GET_SUBSCRIPTION';

const API_ROOT = settings.api.rest;

export const subscriptionAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(SUBSCRIPTION, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/subscribe`, args);

    return response.data;
});

export const initTransactionAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(INITIALIZE_SUBSCRIPTION, async (args: any) => {
    const response = await axiosClient.get(`${API_ROOT}/transaction/initialize`);

    return response.data;
});

export const getTransactionByRefAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GET_SUBSCRIPTION, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/transaction-ref`, args);

    return response.data;
});