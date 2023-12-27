import { IChangePassword } from '@app-models';
import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';

const GET_USER = 'user:GET_USER';
const GET_LOGGED_IN_USER = 'user:GET_LOGGED_IN_USER';
const GET_MATCHES = 'user:GET_MATCHES';
const GET_USER_CHAT = 'user:GET_USER_CHAT';
const FIND_USER_CHATS = 'user:FIND_USER_CHATS';
const FIND_USER_CHAT = 'user:FIND_USER_CHAT';
const LIKE_USER = 'user:LIKE_USER';
const UNLIKE_USER = 'user:UNLIKE_USER';
const UNLIKE_USER_FROM_MATCH = 'user:UNLIKE_USER_FROM_MATCH';
const FAV_USER = 'user:FAV_USER';
const UPDATE_LOCATION = 'user:UPDATE_LOCATION';
const GET_USER_BY_IDS = 'user:GET_USER_BY_IDS';
const GET_CHAT_MESSAGES = 'user:GET_CHAT_MESSAGES';
const CREATE_CHAT_MESSAGE = 'user:CREATE_CHAT_MESSAGE';
const CREATE_CHAT = 'user:CREATE_CHAT';
const FETCH_FAV_USERS = 'user:FETCH_FAV_USERS';
const UPDATE_PREFERENCE = 'user:UPDATE_PREFERENCE';
const UPDATE_USER = 'user:UPDATE_USER';
const UPDATE_USER_DETAILS = 'user:UPDATE_USER_DETAILS';
const ADD_JOB = 'user:ADD_JOB';
const CHANGE_JOB = 'user:CHANGE_JOB';
const GET_JOBS = 'user:GET_JOBS';
const UPDATE_PROFILE_IMAGE = 'user:UPDATE_PROFILE_IMAGE';
const SAVE_IMAGE_TO_GALLERY = 'user:SAVE_IMAGE_TO_GALLERY';
const DELETE_IMAGE_FROM_GALLERY = 'user:DELETE_IMAGE_FROM_GALLERY';
const GET_PLANS = 'user:GET_PLANS';
const CHANGE_PASSWORD = 'user:CHANGE_PASSWORD';
const DEACTIVATE_ACCOUNT = 'user:DEACTIVATE_ACCOUNT';
const TOGGLE_PROFILE_VISIBILITY = 'user:TOGGLE_PROFILE_VISIBILITY';
const GET_USER_NOTIFICATIONS = 'user:GET_USER_NOTIFICATIONS';
const DELETE_USER_NOTIFICATION = 'user:DELETE_USER_NOTIFICATION';
const GET_SINGLE_NOTIFICATION = 'user:GET_SINGLE_NOTIFICATION';
const UPDATE_NOTIFICATION = 'user:UPDATE_NOTIFICATION'; 
const LIKED_AND_LIKED_BY_USERS = 'user:LIKED_AND_LIKED_BY_USERS';

const API_ROOT = settings.api.rest;

export const getUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GET_USER, async (args: any) => {
    const response = await axiosClient.get(`${API_ROOT}/user/${args}`);

    return response.data;
});

export const getLoggedInUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(GET_LOGGED_IN_USER, async () => {
    const response = await axiosClient.get(`${API_ROOT}/logged-in-user`);
    return response.data;
});

export const getMatchesAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(GET_MATCHES, async () => {
    const response = await axiosClient.get(`${API_ROOT}/find-match`);

    return response.data;
});

export const getUserChatsAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GET_USER_CHAT, async (args) => {
    const response = await axiosClient.post(`${API_ROOT}/get-user-chats`, args);

    return response.data;
});

export const findUserChatsAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(FIND_USER_CHATS, async (userId: string) => {
    const response = await axiosClient.get(`${API_ROOT}/find-user-chats/${userId}`);

    return response.data;
});

export const findSingleChatAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(FIND_USER_CHAT, async (args) => {
    const response = await axiosClient.get(`${API_ROOT}/find-chat/${args.firstId}/${args.secondId}`);

    return response.data;
});

export const getChatMessagesAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GET_CHAT_MESSAGES, async (chatId: string) => {
    const response = await axiosClient.get(`${API_ROOT}/get-chat-messages/${chatId}`);

    return response.data;
});

export const createChatMessageAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(CREATE_CHAT_MESSAGE, async (args) => {
    const response = await axiosClient.post(`${API_ROOT}/create-chat-message`, args);

    return response.data;
});

export const createChatAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(CREATE_CHAT, async (args) => {
    const response = await axiosClient.post(`${API_ROOT}/create-chat`, args);

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

export const getUserByIdsAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GET_USER_BY_IDS, async (args) => {
    const response = await axiosClient.post(`${API_ROOT}/users-with-ids`, args);

    return response.data;
});

export const fetchFavUsersAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(FETCH_FAV_USERS, async () => {
    const response = await axiosClient.get(`${API_ROOT}/favourite-users`);

    return response.data;
});

export const updatePreferenceAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UPDATE_PREFERENCE, async (args) => {
    const response = await axiosClient.put(`${API_ROOT}/user-preference`, args);

    return response.data;
});

export const updateUserDetailAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UPDATE_USER_DETAILS, async (args) => {
    const response = await axiosClient.put(`${API_ROOT}/user-update-profile-detail`, args);

    return response.data;
});

export const updateUserAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UPDATE_USER, async (args) => {
    const response = await axiosClient.put(`${API_ROOT}/user-update`, args);

    return response.data;
});

export const addJobAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(ADD_JOB, async (args) => {
    const response = await axiosClient.post(`${API_ROOT}/new-job`, args);

    return response.data;
});

export const changeJobAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(CHANGE_JOB, async (args) => {
    const response = await axiosClient.put(`${API_ROOT}/job-description-update`, args);

    return response.data;
});

export const getJobsAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(GET_JOBS, async () => {
    const response = await axiosClient.get(`${API_ROOT}/read-jobs`);

    return response.data;
});

export const updateProfileImageAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UPDATE_PROFILE_IMAGE, async (args: any) => {
    const formData = new FormData();
    formData.append('profileImageUrl', args.profileImageUrl);
    
    const response = await axiosClient.put(`${API_ROOT}/user-update-profile-image`, formData);

    return response.data;
});

export const saveGalleryImageAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(SAVE_IMAGE_TO_GALLERY, async (args: any) => {
    const formData = new FormData();
    if (args.profileImageUrl) formData.append('profileImageUrl', args.profileImageUrl);

    const response = await axiosClient.put(`${API_ROOT}/gallery`, formData);

    return response.data;
});

export const deleteGalleryImageAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(DELETE_IMAGE_FROM_GALLERY, async (args: any) => {
    const response = await axiosClient.put(`${API_ROOT}/delete-photo-gallery`, args);

    return response.data;
});

export const getPlansAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(GET_PLANS, async () => {
    const response = await axiosClient.get(`${API_ROOT}/plans`);

    return response.data;
});

export const changePasswordAction = asyncThunkWrapper<ApiResponseSuccess<any>, IChangePassword>(CHANGE_PASSWORD, async (args: any) => {
    const response = await axiosClient.put(`${API_ROOT}/change-user-password`, args);

    return response.data;
});

export const deactivateAccountAction = asyncThunkWrapper<ApiResponseSuccess<any>, {userId: string}>(DEACTIVATE_ACCOUNT, async (args: any) => {
    const response = await axiosClient.put(`${API_ROOT}/user-status-update/${args.userId}`);

    return response.data;
});

export const toggleProfileVisibilityAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(TOGGLE_PROFILE_VISIBILITY, async () => {
    const response = await axiosClient.put(`${API_ROOT}/toggle-profile-visibility`);

    return response.data;
});

export const getUserNotificationsAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(GET_USER_NOTIFICATIONS, async () => {
    const response = await axiosClient.get(`${API_ROOT}/user-notifications`);

    return response.data;
});

export const deleteUserNotificationAction = asyncThunkWrapper<ApiResponseSuccess<any>, {notificationId: string}>(DELETE_USER_NOTIFICATION, async (args: any) => {
    const response = await axiosClient.delete(`${API_ROOT}/delete-notification/${args.notificationId}`);

    return response.data;
});

export const getSingleNotificationAction = asyncThunkWrapper<ApiResponseSuccess<any>, {notificationId: any}>(GET_SINGLE_NOTIFICATION, async (args: any) => {
    const response = await axiosClient.get(`${API_ROOT}/get-single-notification/${args.notificationId}`);

    return response.data;
});

export const updateNotificationAction = asyncThunkWrapper<ApiResponseSuccess<any>, {notificationId: any}>(UPDATE_NOTIFICATION, async (args: any) => {
    const response = await axiosClient.put(`${API_ROOT}/update-notification/${args.notificationId}`);

    return response.data;
});

export const getLikedAndLikedByUsersAction = asyncThunkWrapper<ApiResponseSuccess<any>, void>(LIKED_AND_LIKED_BY_USERS, async () => {
    const response = await axiosClient.get(`${API_ROOT}/liked-and-liked-by-users`);

    return response.data;
});