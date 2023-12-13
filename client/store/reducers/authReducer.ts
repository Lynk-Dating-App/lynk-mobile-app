import { IThunkAPIStatus } from '@app-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
    enterPasswordResetCodeAction, 
    galleryAction, isUserExistAction, 
    resetPasswordAction, 
    savePasswordAfterResetAction, 
    sendSignUpTokenAction, signInAction, 
    signInWithBiometricAction, 
    signUpAction, updateProfileDetailAction, 
    validateSignUpTokenAction 
} from '../actions/authActions';
import { CustomJwtPayload } from '@app-interfaces';
import { IPermission } from '@app-models';
import { saveTokenToSecureStore } from '../../components/ExpoStore/SecureStore';
import settings from '../../config/settings';
import socket from '../../config/socket';

interface IAuthState {
    authToken: string;

    sendSignUpTokenStatus: IThunkAPIStatus;
    sendSignUpTokenSuccess: string;
    sendSignUpTokenError?: string;

    resetPasswordStatus: IThunkAPIStatus;
    resetPasswordSuccess: string;
    resetPasswordError?: string;

    enterPasswordStatus: IThunkAPIStatus;
    enterPasswordSuccess: string;
    enterPasswordError?: string;

    enterPasswordResetCodeStatus: IThunkAPIStatus;
    enterPasswordResetCodeSuccess: string;
    enterPasswordResetCodeError?: string;

    signInStatus: IThunkAPIStatus;
    signInSuccess: string;
    signInError?: string;

    signInWithBiometricStatus: IThunkAPIStatus;
    signInWithBiometricSuccess: string;
    signInWithBiometricError?: string;

    validateSignUpTokenStatus: IThunkAPIStatus;
    validateSignUpTokenSuccess: string;
    validateSignUpTokenError?: string;

    signUpStatus: IThunkAPIStatus;
    signUpSuccess: string;
    signUpError?: string;

    userExistStatus: IThunkAPIStatus;
    userExistSuccess: string;
    userExistError?: string;

    updateProfileDetailStatus: IThunkAPIStatus;
    updateProfileDetailSuccess: string;
    updateProfileDetailError?: string;

    galleryStatus: IThunkAPIStatus;
    gallerySuccess: string;
    galleryError?: string;

    permissions: IPermission[];
};

const initialState: IAuthState = {
    authToken: '',

    sendSignUpTokenError: '',
    sendSignUpTokenSuccess: '',
    sendSignUpTokenStatus: 'idle',

    resetPasswordError: '',
    resetPasswordSuccess: '',
    resetPasswordStatus: 'idle',

    enterPasswordError: '',
    enterPasswordSuccess: '',
    enterPasswordStatus: 'idle',

    enterPasswordResetCodeError: '',
    enterPasswordResetCodeSuccess: '',
    enterPasswordResetCodeStatus: 'idle',

    signInError: '',
    signInSuccess: '',
    signInStatus: 'idle',

    signInWithBiometricError: '',
    signInWithBiometricSuccess: '',
    signInWithBiometricStatus: 'idle',

    validateSignUpTokenError: '',
    validateSignUpTokenSuccess: '',
    validateSignUpTokenStatus: 'idle',

    signUpError: '',
    signUpSuccess: '',
    signUpStatus: 'idle',

    userExistError: '',
    userExistSuccess: '',
    userExistStatus: 'idle',

    updateProfileDetailError: '',
    updateProfileDetailSuccess: '',
    updateProfileDetailStatus: 'idle',

    galleryError: '',
    gallerySuccess: '',
    galleryStatus: 'idle',

    permissions: []
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearSendSignUpTokenStatus(state: IAuthState) {
            state.sendSignUpTokenStatus = 'idle';
            state.sendSignUpTokenSuccess = '';
            state.sendSignUpTokenError = '';
        },

        clearValidateSignUpTokenStatus(state: IAuthState) {
            state.validateSignUpTokenStatus = 'idle';
            state.validateSignUpTokenSuccess = '';
            state.validateSignUpTokenError = '';
        },

        clearSignUpStatus(state: IAuthState) {
            state.signUpStatus = 'idle';
            state.signUpSuccess = '';
            state.signUpError = '';
        },

        clearUserExistStatus(state: IAuthState) {
            state.userExistStatus = 'idle';
            state.userExistSuccess = '';
            state.userExistError = '';
        },

        clearUpdateProfileDetailStatus(state: IAuthState) {
            state.updateProfileDetailStatus = 'idle';
            state.updateProfileDetailSuccess = '';
            state.updateProfileDetailError = '';
        },

        clearGalleryStatus(state: IAuthState) {
            state.galleryStatus = 'idle';
            state.gallerySuccess = '';
            state.galleryError = '';
        },

        clearSignInStatus(state: IAuthState) {
            state.signInStatus = 'idle';
            state.signInSuccess = '';
            state.signInError = '';
        },

        clearSignInWithBiometricStatus(state: IAuthState) {
            state.signInWithBiometricStatus = 'idle';
            state.signInWithBiometricSuccess = '';
            state.signInWithBiometricError = '';
        },

        clearResetPasswordStatus(state: IAuthState) {
            state.resetPasswordStatus = 'idle';
            state.resetPasswordSuccess = '';
            state.resetPasswordError = '';
        },

        clearEnterPasswordCodeStatus(state: IAuthState) {
            state.enterPasswordResetCodeStatus = 'idle';
            state.enterPasswordResetCodeSuccess = '';
            state.enterPasswordResetCodeError = '';
        },

        clearEnterPasswordStatus(state: IAuthState) {
            state.enterPasswordStatus = 'idle';
            state.enterPasswordSuccess = '';
            state.enterPasswordError = '';
        },
    },

    extraReducers: builder => {
        builder
            .addCase(sendSignUpTokenAction.pending, state => {
                state.sendSignUpTokenStatus = 'loading';
            })
            .addCase(sendSignUpTokenAction.fulfilled, (state, action) => {
                state.sendSignUpTokenStatus = 'completed';
                state.sendSignUpTokenSuccess = action.payload.message;
            })
            .addCase(sendSignUpTokenAction.rejected, (state, action) => {
                state.sendSignUpTokenStatus = 'failed';

                if (action.payload) {
                state.sendSignUpTokenError = action.payload.message;
                } else state.sendSignUpTokenError = action.error.message;
            });

        builder
            .addCase(resetPasswordAction.pending, state => {
                state.resetPasswordStatus = 'loading';
            })
            .addCase(resetPasswordAction.fulfilled, (state, action) => {
                state.resetPasswordStatus = 'completed';
                state.resetPasswordSuccess = action.payload.message;
            })
            .addCase(resetPasswordAction.rejected, (state, action) => {
                state.resetPasswordStatus = 'failed';

                if (action.payload) {
                state.resetPasswordError = action.payload.message;
                } else state.resetPasswordError = action.error.message;
            });

        builder
            .addCase(savePasswordAfterResetAction.pending, state => {
                state.enterPasswordStatus = 'loading';
            })
            .addCase(savePasswordAfterResetAction.fulfilled, (state, action) => {
                state.enterPasswordStatus = 'completed';
                state.enterPasswordSuccess = action.payload.message;
            })
            .addCase(savePasswordAfterResetAction.rejected, (state, action) => {
                state.enterPasswordStatus = 'failed';

                if (action.payload) {
                state.enterPasswordError = action.payload.message;
                } else state.enterPasswordError = action.error.message;
            });

        builder
            .addCase(enterPasswordResetCodeAction.pending, state => {
                state.enterPasswordResetCodeStatus = 'loading';
            })
            .addCase(enterPasswordResetCodeAction.fulfilled, (state, action) => {
                state.enterPasswordResetCodeStatus = 'completed';
                state.enterPasswordResetCodeSuccess = action.payload.message;
            })
            .addCase(enterPasswordResetCodeAction.rejected, (state, action) => {
                state.enterPasswordResetCodeStatus = 'failed';

                if (action.payload) {
                state.enterPasswordResetCodeError = action.payload.message;
                } else state.enterPasswordResetCodeError = action.error.message;
            });

        builder
            .addCase(validateSignUpTokenAction.pending, state => {
                state.validateSignUpTokenStatus = 'loading';
            })
            .addCase(validateSignUpTokenAction.fulfilled, (state, action) => {
                state.validateSignUpTokenStatus = 'completed';
                state.validateSignUpTokenSuccess = action.payload.message;
            })
            .addCase(validateSignUpTokenAction.rejected, (state, action) => {
                state.validateSignUpTokenStatus = 'failed';

                if (action.payload) {
                state.validateSignUpTokenError = action.payload.message;
                } else state.validateSignUpTokenError = action.error.message;
            });

        builder
            .addCase(signUpAction.pending, state => {
                state.signUpStatus = 'loading';
            })
            .addCase(signUpAction.fulfilled, (state, action) => {
                state.signUpStatus = 'completed';
                state.signUpSuccess = action.payload.message;

                if (action.payload.result) {
                    state.authToken = action.payload.result;

                    // const { permissions } = jwtDecode(state.authToken) as CustomJwtPayload;

                    // state.permissions = permissions;
                    // saveTokenToSecureStore(SECURE_STORE.permissions, JSON.stringify(permissions));
                    saveTokenToSecureStore(settings.auth.admin, state.authToken);
        
                }
            })
            .addCase(signUpAction.rejected, (state, action) => {
                state.signUpStatus = 'failed';

                if (action.payload) {
                state.signUpError = action.payload.message;
                } else state.signUpError = action.error.message;
            });

        builder
            .addCase(signInAction.pending, state => {
                state.signInStatus = 'loading';
            })
            .addCase(signInAction.fulfilled, (state, action) => {
                state.signInStatus = 'completed';
                state.signInSuccess = action.payload.message;

                if (action.payload.result) {
                    state.authToken = action.payload.result.jwt;

                    socket.emit('userId', action.payload.result.userId)
                    saveTokenToSecureStore(settings.auth.admin, state.authToken);
                }
            })
            .addCase(signInAction.rejected, (state, action) => {
                state.signInStatus = 'failed';

                if (action.payload) {
                state.signInError = action.payload.message;
                } else state.signInError = action.error.message;
            });

        builder
            .addCase(signInWithBiometricAction.pending, state => {
                state.signInWithBiometricStatus = 'loading';
            })
            .addCase(signInWithBiometricAction.fulfilled, (state, action) => {
                state.signInWithBiometricStatus = 'completed';
                state.signInWithBiometricSuccess = action.payload.message;

                if (action.payload.result) {
                    state.authToken = action.payload.result.jwt;

                    socket.emit('userId', action.payload.result.userId)
                    saveTokenToSecureStore(settings.auth.admin, state.authToken);
                }
            })
            .addCase(signInWithBiometricAction.rejected, (state, action) => {
                state.signInWithBiometricStatus = 'failed';

                if (action.payload) {
                state.signInWithBiometricError = action.payload.message;
                } else state.signInWithBiometricError = action.error.message;
            });

        builder
            .addCase(isUserExistAction.pending, state => {
                state.userExistStatus = 'loading';
            })
            .addCase(isUserExistAction.fulfilled, (state, action) => {
                state.userExistStatus = 'completed';
                state.userExistSuccess = action.payload.message;
            })
            .addCase(isUserExistAction.rejected, (state, action) => {
                state.userExistStatus = 'failed';

                if (action.payload) {
                state.userExistError = action.payload.message;
                } else state.userExistError = action.error.message;
            });

        builder
            .addCase(updateProfileDetailAction.pending, state => {
                state.updateProfileDetailStatus = 'loading';
            })
            .addCase(updateProfileDetailAction.fulfilled, (state, action) => {
                state.updateProfileDetailStatus = 'completed';
                state.updateProfileDetailSuccess = action.payload.message;
            })
            .addCase(updateProfileDetailAction.rejected, (state, action) => {
                state.updateProfileDetailStatus = 'failed';

                if (action.payload) {
                state.updateProfileDetailError = action.payload.message;
                } else state.updateProfileDetailError = action.error.message;
            });

        builder
            .addCase(galleryAction.pending, state => {
                state.galleryStatus = 'loading';
            })
            .addCase(galleryAction.fulfilled, (state, action) => {
                state.galleryStatus = 'completed';
                state.gallerySuccess = action.payload.message;
            })
            .addCase(galleryAction.rejected, (state, action) => {
                state.galleryStatus = 'failed';

                if (action.payload) {
                state.galleryError = action.payload.message;
                } else state.galleryError = action.error.message;
            });
    }

});

export const {
    clearSendSignUpTokenStatus,
    clearValidateSignUpTokenStatus,
    clearSignUpStatus,
    clearSignInStatus,
    clearUserExistStatus,
    clearUpdateProfileDetailStatus,
    clearGalleryStatus,
    clearEnterPasswordCodeStatus,
    clearResetPasswordStatus,
    clearEnterPasswordStatus,
    clearSignInWithBiometricStatus
} = authSlice.actions;

export default authSlice.reducer;