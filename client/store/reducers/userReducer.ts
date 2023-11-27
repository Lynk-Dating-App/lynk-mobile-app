import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';
import settings from '../../config/settings';
import { favUserAction, getLoggedInUserAction, getMatchesAction, getUserAction, likeUserAction, unLikeFrmMatchAction, unLikeUserAction, updateLocationAction } from '../actions/userAction';
import { ILikedUser, IMatch, IUnLikedUser } from '@app-models';

interface IUserState {
    getUserStatus: IThunkAPIStatus;
    getUserSuccess: string;
    getUserError?: string;

    getLoggedInUserStatus: IThunkAPIStatus;
    getLoggedInUserSuccess: string;
    getLoggedInUserError?: string;

    getMatchesStatus: IThunkAPIStatus;
    getMatchesSuccess: string;
    getMatchesError?: string;

    likeStatus: IThunkAPIStatus;
    likeSuccess: string;
    likeError?: string;

    unlikeStatus: IThunkAPIStatus;
    unlikeSuccess: string;
    unlikeError?: string;

    unlikeUserFrmMatchStatus: IThunkAPIStatus;
    unlikeUserFrmMatchSuccess: string;
    unlikeUserFrmMatchError?: string;

    favUserStatus: IThunkAPIStatus;
    favUserSuccess: string;
    favUserError?: string;

    updateLocationStatus: IThunkAPIStatus;
    updateLocationSuccess: string;
    updateLocationError?: string;

    user: any;
    matches: IMatch[];
    likedUser: ILikedUser;
    photoUri: string;
    unlikedUser: IUnLikedUser;
    fromUserId: string;
    loggedInuser: null;
};

const initialState: IUserState = {
    getUserError: '',
    getUserSuccess: '',
    getUserStatus: 'idle',

    getLoggedInUserError: '',
    getLoggedInUserSuccess: '',
    getLoggedInUserStatus: 'idle',

    getMatchesError: '',
    getMatchesSuccess: '',
    getMatchesStatus: 'idle',

    likeError: '',
    likeSuccess: '',
    likeStatus: 'idle',

    unlikeError: '',
    unlikeSuccess: '',
    unlikeStatus: 'idle',

    unlikeUserFrmMatchError: '',
    unlikeUserFrmMatchSuccess: '',
    unlikeUserFrmMatchStatus: 'idle',

    favUserError: '',
    favUserSuccess: '',
    favUserStatus: 'idle',

    updateLocationError: '',
    updateLocationSuccess: '',
    updateLocationStatus: 'idle',

    user: null,
    matches: [],
    likedUser: null,
    photoUri: '',
    unlikedUser: null,
    fromUserId: '',
    loggedInuser: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearGetUserStatus(state: IUserState) {
            state.getUserStatus = 'idle';
            state.getUserSuccess = '';
            state.getUserError = '';
        },

        clearGetLoggedInUserStatus(state: IUserState) {
            state.getLoggedInUserStatus = 'idle';
            state.getLoggedInUserSuccess = '';
            state.getLoggedInUserError = '';
        },

        clearGetMatchesStatus(state: IUserState) {
            state.getMatchesStatus = 'idle';
            state.getMatchesSuccess = '';
            state.getMatchesError = '';
        },

        clearLikeStatus(state: IUserState) {
            state.likeStatus = 'idle';
            state.likeSuccess = '';
            state.likeError = '';
        },

        clearUnLikeStatus(state: IUserState) {
            state.unlikeStatus = 'idle';
            state.unlikeSuccess = '';
            state.unlikeError = '';
        },

        clearUnLikeUserFrmMatchStatus(state: IUserState) {
            state.unlikeUserFrmMatchStatus = 'idle';
            state.unlikeUserFrmMatchSuccess = '';
            state.unlikeUserFrmMatchError = '';
        },

        clearFavUserStatus(state: IUserState) {
            state.favUserStatus = 'idle';
            state.favUserSuccess = '';
            state.favUserError = '';
        },

        clearUpdateLocationStatus(state: IUserState) {
            state.updateLocationStatus = 'idle';
            state.updateLocationSuccess = '';
            state.updateLocationError = '';
        },

        setPhotoUri(state: IUserState, action) {
            state.photoUri = action.payload
        },

        setFromUserId(state: IUserState, action) {
            state.fromUserId = action.payload
        }
    },

    extraReducers: builder => {
        builder
            .addCase(getUserAction.pending, state => {
                state.getUserStatus = 'loading';
            })
            .addCase(getUserAction.fulfilled, (state, action) => {
                state.getUserStatus = 'completed';
                state.getUserSuccess = action.payload.message;

                state.user = action.payload.result;
            })
            .addCase(getUserAction.rejected, (state, action) => {
                state.getUserStatus = 'failed';

                if (action.payload) {
                state.getUserError = action.payload.message;
                } else state.getUserError = action.error.message;
            });

        builder
            .addCase(getLoggedInUserAction.pending, state => {
                state.getLoggedInUserStatus = 'loading';
            })
            .addCase(getLoggedInUserAction.fulfilled, (state, action) => {
                state.getLoggedInUserStatus = 'completed';
                state.getLoggedInUserSuccess = action.payload.message;

                state.loggedInuser = action.payload.result;
            })
            .addCase(getLoggedInUserAction.rejected, (state, action) => {
                state.getLoggedInUserStatus = 'failed';

                if (action.payload) {
                state.getLoggedInUserError = action.payload.message;
                } else state.getLoggedInUserError = action.error.message;
            });

        builder
            .addCase(getMatchesAction.pending, state => {
                state.getMatchesStatus = 'loading';
            })
            .addCase(getMatchesAction.fulfilled, (state, action) => {
                state.getMatchesStatus = 'completed';
                state.getMatchesSuccess = action.payload.message;

                state.matches = action.payload.results as IMatch[];
            })
            .addCase(getMatchesAction.rejected, (state, action) => {
                state.getMatchesStatus = 'failed';

                if (action.payload) {
                state.getMatchesError = action.payload.message;
                } else state.getMatchesError = action.error.message;
            });

        builder
            .addCase(likeUserAction.pending, state => {
                state.likeStatus = 'loading';
            })
            .addCase(likeUserAction.fulfilled, (state, action) => {
                state.likeStatus = 'completed';
                state.likeSuccess = action.payload.message;

                state.likedUser = action.payload.result as ILikedUser;
            })
            .addCase(likeUserAction.rejected, (state, action) => {
                state.likeStatus = 'failed';

                if (action.payload) {
                state.likeError = action.payload.message;
                } else state.likeError = action.error.message;
            });

        builder
            .addCase(unLikeUserAction.pending, state => {
                state.unlikeStatus = 'loading';
            })
            .addCase(unLikeUserAction.fulfilled, (state, action) => {
                state.unlikeStatus = 'completed';
                state.unlikeSuccess = action.payload.message;

                state.unlikedUser = action.payload.result as IUnLikedUser;
            })
            .addCase(unLikeUserAction.rejected, (state, action) => {
                state.unlikeStatus = 'failed';

                if (action.payload) {
                state.unlikeError = action.payload.message;
                } else state.unlikeError = action.error.message;
            });

        builder
            .addCase(unLikeFrmMatchAction.pending, state => {
                state.unlikeUserFrmMatchStatus = 'loading';
            })
            .addCase(unLikeFrmMatchAction.fulfilled, (state, action) => {
                state.unlikeUserFrmMatchStatus = 'completed';
                state.unlikeUserFrmMatchSuccess = action.payload.message;

                state.unlikedUser = action.payload.result as IUnLikedUser;
            })
            .addCase(unLikeFrmMatchAction.rejected, (state, action) => {
                state.unlikeUserFrmMatchStatus = 'failed';

                if (action.payload) {
                state.unlikeUserFrmMatchError = action.payload.message;
                } else state.unlikeUserFrmMatchError = action.error.message;
            });

        builder
            .addCase(favUserAction.pending, state => {
                state.favUserStatus = 'loading';
            })
            .addCase(favUserAction.fulfilled, (state, action) => {
                state.favUserStatus = 'completed';
                state.favUserSuccess = action.payload.message;
            })
            .addCase(favUserAction.rejected, (state, action) => {
                state.favUserStatus = 'failed';

                if (action.payload) {
                state.favUserError = action.payload.message;
                } else state.favUserError = action.error.message;
            });

        builder
            .addCase(updateLocationAction.pending, state => {
                state.updateLocationStatus = 'loading';
            })
            .addCase(updateLocationAction.fulfilled, (state, action) => {
                state.updateLocationStatus = 'completed';
                state.updateLocationSuccess = action.payload.message;
            })
            .addCase(updateLocationAction.rejected, (state, action) => {
                state.updateLocationStatus = 'failed';

                if (action.payload) {
                state.updateLocationError = action.payload.message;
                } else state.updateLocationError = action.error.message;
            });
    }
});

export const {
    clearGetUserStatus,
    clearGetMatchesStatus,
    clearLikeStatus,
    clearUnLikeStatus,
    clearFavUserStatus,
    clearUnLikeUserFrmMatchStatus,
    setPhotoUri,
    setFromUserId,
    clearUpdateLocationStatus,
    clearGetLoggedInUserStatus
} = userSlice.actions;

export default userSlice.reducer;