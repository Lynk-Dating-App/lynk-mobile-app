import { enrollBiometrics } from '../../Utils/BiometricService';
import axios from '../../config/axiosClient';
import axiosClient from '../../config/axiosClient';
import settings from '../../config/settings';
import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';

const SEND_SIGN_UP_TOKEN = 'auth:SEND_SIGN_UP_TOKEN';
const VALIDATE_SIGN_UP_TOKEN = 'auth:VALIDATE_SIGN_UP_TOKEN';
const SIGN_UP = 'auth:SIGN_UP';
const SIGN_IN = 'auth:SIGN_IN';
const UPDATE_USER_PROFILE_DETAIL = 'auth:UPDATE_USER_PROFILE_DETAIL';
const IS_USER_EXIST = 'auth:IS_USER_EXIST';
const GALLERY = 'auth:GALLERY';
const RESET_PASSWORD = 'auth:RESET_PASSWORD';
const ENTER_PASSWORD_CODE = 'auth:ENTER_PASSWORD_CODE';
const ENTER_PASSWORD_AFTER_RESET = 'auth:ENTER_PASSWORD_AFTER_RESET';
const SIGN_IN_WITH_BIOMETRIC = 'auth:SIGN_IN_WITH_BIOMETRIC';

const API_ROOT = settings.api.rest;
console.log(API_ROOT, 'API_ROOT')
export const sendSignUpTokenAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(SEND_SIGN_UP_TOKEN, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/send-sign-up-token`, args);

    return response.data;
});

export const validateSignUpTokenAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(VALIDATE_SIGN_UP_TOKEN, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/validate-sign-up-token`, args);
    return response.data;
});

export const signUpAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(SIGN_UP, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/sign-up-user-black`, args);

    return response.data;
});

export const isUserExistAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(IS_USER_EXIST, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/check-user`, args);

    return response.data;
});

export const updateProfileDetailAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(UPDATE_USER_PROFILE_DETAIL, async (args: any) => {
    const formData = new FormData();
    // if (args.profileImageUrl) formData.append('profileImageUrl', args.profileImageUrl);
    formData.append('dob', args.dob);
    formData.append('firstName', args.firstName);
    formData.append('lastName', args.lastName);
    formData.append('gender', args.gender);
    formData.append('interests', args.interests);
    formData.append('height', args.height);
    formData.append('build', args.build);
    formData.append('occupation', args.occupation);
    formData.append('state', args.state);
    formData.append('bio', args.bio);

    const response = await axiosClient.put(`${API_ROOT}/user-update-profile-detail`, formData);

    return response.data;
});

export const galleryAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(GALLERY, async (args: any) => {
    const formData = new FormData();

    // formData.append('photo', args);
    args.forEach((imageUri: any, index: number) => {
        formData.append(`photo[${index}]`, imageUri);
    });

    const response = await axiosClient.put(`${API_ROOT}/gallery`, formData);

    return response.data;
});


export const signInAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(SIGN_IN, async (args: any) => {
    // const response = await axiosClient.post(`${API_ROOT}/sign-in-user`, args);
    const response = await axios.post(`http://93.127.162.78:8080/api/v1/sign-in-user`, args);
    return response.data;
});

export const signInWithBiometricAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(SIGN_IN_WITH_BIOMETRIC, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/sign-in-user-with-biometric`, {userId: args});
    return response.data;
}); 

export const resetPasswordAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(RESET_PASSWORD, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/password-reset-user`, args);

    return response.data;
});

export const enterPasswordResetCodeAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(ENTER_PASSWORD_CODE, async (args: any) => {
    const response = await axiosClient.post(`${API_ROOT}/enter-password-reset-code`, args);

    return response.data;
});

export const savePasswordAfterResetAction = asyncThunkWrapper<ApiResponseSuccess<any>, any>(ENTER_PASSWORD_AFTER_RESET, async (args: any) => {
    const response = await axiosClient.put(`${API_ROOT}/password-reset/save-password`, args);

    return response.data;
});