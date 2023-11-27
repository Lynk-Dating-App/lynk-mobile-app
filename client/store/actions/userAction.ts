import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';

const GET_USER = 'auth:GET_USER';
const GET_LOGGED_IN_USER = 'auth:GET_LOGGED_IN_USER';
const GET_MATCHES = 'auth:GET_MATCHES';
const LIKE_USER = 'auth:LIKE_USER';
const UNLIKE_USER = 'auth:UNLIKE_USER';
const UNLIKE_USER_FROM_MATCH = 'auth:UNLIKE_USER_FROM_MATCH';
const FAV_USER = 'auth:FAV_USER';
const UPDATE_LOCATION = 'auth:UPDATE_LOCATION';

const API_ROOT = settings.api.rest;

export const getUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GET_USER, async (args: any) => {
    const response = await axiosClient.get(`${API_ROOT}/user/${args}`);

    return response.data;
});

export const getLoggedInUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GET_LOGGED_IN_USER, async () => {
    const response = await axiosClient.get(`${API_ROOT}/logged-in-user`);

    return response.data;
});

export const getMatchesAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(GET_MATCHES, async () => {
    const response = await axiosClient.get(`${API_ROOT}/find-match`);

    return response.data;
});

export const likeUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(LIKE_USER, async (id: string) => {
    const response = await axiosClient.put(`${API_ROOT}/like-user/${id}`);

    return response.data;
});

export const unLikeUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UNLIKE_USER, async (id: string) => {
    const response = await axiosClient.put(`${API_ROOT}/unlike-user/${id}`);

    return response.data;
});

export const unLikeFrmMatchAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UNLIKE_USER_FROM_MATCH, async (id: string) => {
    const response = await axiosClient.put(`${API_ROOT}/unlike-user-from-match/${id}`);

    return response.data;
});

export const favUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(FAV_USER, async (id: string) => {
    const response = await axiosClient.put(`${API_ROOT}/fav-user/${id}`);

    return response.data;
});

export const updateLocationAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UPDATE_LOCATION, async (args) => {
    const response = await axiosClient.put(`${API_ROOT}/update-user-location`, args);

    return response.data;
});