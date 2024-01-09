import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';
import { 
    addJobAction,
    changeJobAction,
    changePasswordAction,
    createChatAction,
    createChatMessageAction,
    deactivateAccountAction,
    deleteGalleryImageAction,
    deleteUserNotificationAction,
    favUserAction, 
    fetchFavUsersAction, 
    findSingleChatAction, 
    findUserChatsAction, 
    getChatMessagesAction, 
    getLikedAndLikedByUsersAction, 
    getLoggedInUserAction, 
    getMatchesAction, getPlansAction, getSingleNotificationAction, getUserAction, 
    getUserByIdsAction, 
    getUserChatsAction, 
    getUserNotificationsAction, 
    likeUserAction, 
    requestVerificationAction, 
    saveGalleryImageAction, 
    toggleAutoRenewalAction, 
    toggleProfileVisibilityAction, 
    unLikeFrmMatchAction, 
    unLikeUserAction, 
    updateLocationAction,
    updateNotificationAction,
    updatePreferenceAction,
    updateProfileImageAction,
    updateUserAction,
    updateUserDetailAction
} from '../actions/userAction';
import { 
    IChatMessage, 
    ILikedAndLikedByUsers, 
    ILikedUser, 
    IMatch, IMember, 
    INotification, 
    IPlan, IUnLikedUser, 
    IUserById, IUserChats, 
    OnlineUsers 
} from '@app-models';

interface IUserState {
    getUserStatus: IThunkAPIStatus;
    getUserSuccess: string;
    getUserError?: string;

    requestVerificationStatus: IThunkAPIStatus;
    requestVerificationSuccess: string;
    requestVerificationError?: string;

    getLikedAndLikedByUsersStatus: IThunkAPIStatus;
    getLikedAndLikedByUsersSuccess: string;
    getLikedAndLikedByUsersError?: string;

    deleteUserNotificationStatus: IThunkAPIStatus;
    deleteUserNotificationSuccess: string;
    deleteUserNotificationError?: string;

    getSingleNotificationStatus: IThunkAPIStatus;
    getSingleNotificationSuccess: string;
    getSingleNotificationError?: string;

    updateNotificationStatus: IThunkAPIStatus;
    updateNotificationSuccess: string;
    updateNotificationError?: string;

    getAllUserNotificationStatus: IThunkAPIStatus;
    getAllUserNotificationSuccess: string;
    getAllUserNotificationError?: string;

    toggleProfileVisibilityStatus: IThunkAPIStatus;
    toggleProfileVisibilitySuccess: string;
    toggleProfileVisibilityError?: string;

    toggleAutoRenewalStatus: IThunkAPIStatus;
    toggleAutoRenewalSuccess: string;
    toggleAutoRenewalError?: string;

    deactivateAccountStatus: IThunkAPIStatus;
    deactivateAccountSuccess: string;
    deactivateAccountError?: string;

    changePasswordStatus: IThunkAPIStatus;
    changePasswordSuccess: string;
    changePasswordError?: string;

    getPlansStatus: IThunkAPIStatus;
    getPlansSuccess: string;
    getPlansError?: string;

    saveImageToGalleryStatus: IThunkAPIStatus;
    saveImageToGallerySuccess: string;
    saveImageToGalleryError?: string;

    deleteImageFromGalleryStatus: IThunkAPIStatus;
    deleteImageFromGallerySuccess: string;
    deleteImageFromGalleryError?: string;

    uploadUserProfileImageStatus: IThunkAPIStatus;
    uploadUserProfileImageSuccess: string;
    uploadUserProfileImageError?: string;

    addJobStatus: IThunkAPIStatus;
    addJobSuccess: string;
    addJobError?: string;

    changeJobStatus: IThunkAPIStatus;
    changeJobSuccess: string;
    changeJobError?: string;

    updatePreferenceStatus: IThunkAPIStatus;
    updatePreferenceSuccess: string;
    updatePreferenceError?: string;

    updateUserDetailStatus: IThunkAPIStatus;
    updateUserDetailSuccess: string;
    updateUserDetailError?: string;

    updateUserStatus: IThunkAPIStatus;
    updateUserSuccess: string;
    updateUserError?: string;

    fetchFavUsersStatus: IThunkAPIStatus;
    fetchFavUsersSuccess: string;
    fetchFavUsersError?: string;

    getUserChatsStatus: IThunkAPIStatus;
    getUserChatsSuccess: string;
    getUserChatsError?: string;

    getSingleChatStatus: IThunkAPIStatus;
    getSingleChatSuccess: string;
    getSingleChatError?: string;

    createChatStatus: IThunkAPIStatus;
    createChatSuccess: string;
    createChatError?: string;

    createChatMessageStatus: IThunkAPIStatus;
    createChatMessageSuccess: string;
    createChatMessageError?: string;

    getChatMessagesStatus: IThunkAPIStatus;
    getChatMessagesSuccess: string;
    getChatMessagesError?: string;

    getUserByIdsStatus: IThunkAPIStatus;
    getUserByIdsSuccess: string;
    getUserByIdsError?: string;

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
    photoUri: {photo: string, userId: string};
    unlikedUser: IUnLikedUser;
    fromUserId: string;
    loggedInuser: any;
    chatUsers: IUserChats;
    usersByIds: IUserById[];
    chats: IUserChats[];
    chatMembers: any;
    countUnreadMessages: number;
    chatMessages: IChatMessage[];
    createdChat: IUserChats;
    singleChat: IUserChats;
    chatMessage: IChatMessage;
    onlineUsers: OnlineUsers[];
    notification: string[];
    favUsers: any[];
    savedImage: string[];
    plans: IPlan[];
    profileVisible: boolean;
    autoRenewal: boolean;
    notificationObject: INotification;
    notifications: INotification[];
    signInAfterSignUp: {
        emailOrPhone: string,
        password: string
    };
    signInAfterSignUp2: boolean;
    whichScreen: string;
    likedAndLikedByUsers: ILikedAndLikedByUsers[];
    notificationId: string 
};

const initialState: IUserState = {
    getUserError: '',
    getUserSuccess: '',
    getUserStatus: 'idle',

    requestVerificationError: '',
    requestVerificationSuccess: '',
    requestVerificationStatus: 'idle',

    getLikedAndLikedByUsersError: '',
    getLikedAndLikedByUsersSuccess: '',
    getLikedAndLikedByUsersStatus: 'idle',

    deleteUserNotificationError: '',
    deleteUserNotificationSuccess: '',
    deleteUserNotificationStatus: 'idle',

    getSingleNotificationError: '',
    getSingleNotificationSuccess: '',
    getSingleNotificationStatus: 'idle',

    updateNotificationError: '',
    updateNotificationSuccess: '',
    updateNotificationStatus: 'idle',

    getAllUserNotificationError: '',
    getAllUserNotificationSuccess: '',
    getAllUserNotificationStatus: 'idle',

    toggleProfileVisibilityError: '',
    toggleProfileVisibilitySuccess: '',
    toggleProfileVisibilityStatus: 'idle',

    toggleAutoRenewalError: '',
    toggleAutoRenewalSuccess: '',
    toggleAutoRenewalStatus: 'idle',

    deactivateAccountError: '',
    deactivateAccountSuccess: '',
    deactivateAccountStatus: 'idle',

    changePasswordError: '',
    changePasswordSuccess: '',
    changePasswordStatus: 'idle',

    getPlansError: '',
    getPlansSuccess: '',
    getPlansStatus: 'idle',

    saveImageToGalleryError: '',
    saveImageToGallerySuccess: '',
    saveImageToGalleryStatus: 'idle',

    deleteImageFromGalleryError: '',
    deleteImageFromGallerySuccess: '',
    deleteImageFromGalleryStatus: 'idle',

    uploadUserProfileImageError: '',
    uploadUserProfileImageSuccess: '',
    uploadUserProfileImageStatus: 'idle',

    addJobError: '',
    addJobSuccess: '',
    addJobStatus: 'idle',

    changeJobError: '',
    changeJobSuccess: '',
    changeJobStatus: 'idle',

    updatePreferenceError: '',
    updatePreferenceSuccess: '',
    updatePreferenceStatus: 'idle',

    updateUserDetailError: '',
    updateUserDetailSuccess: '',
    updateUserDetailStatus: 'idle',

    updateUserError: '',
    updateUserSuccess: '',
    updateUserStatus: 'idle',

    fetchFavUsersError: '',
    fetchFavUsersSuccess: '',
    fetchFavUsersStatus: 'idle',

    getUserChatsError: '',
    getUserChatsSuccess: '',
    getUserChatsStatus: 'idle',

    getSingleChatError: '',
    getSingleChatSuccess: '',
    getSingleChatStatus: 'idle',

    getChatMessagesError: '',
    getChatMessagesSuccess: '',
    getChatMessagesStatus: 'idle',

    createChatError: '',
    createChatSuccess: '',
    createChatStatus: 'idle',

    createChatMessageError: '',
    createChatMessageSuccess: '',
    createChatMessageStatus: 'idle',

    getUserByIdsError: '',
    getUserByIdsSuccess: '',
    getUserByIdsStatus: 'idle',

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
    photoUri: {photo: '', userId: ''},
    unlikedUser: null,
    fromUserId: '',
    loggedInuser: null,
    chatUsers: null,
    usersByIds: [],
    chats: [],
    chatMembers: [],
    countUnreadMessages: 0,
    chatMessages: [],
    createdChat: null,
    singleChat: null,
    chatMessage: null,
    onlineUsers: [],
    notification: [],
    favUsers: [],
    savedImage: [],
    plans: [],
    profileVisible: false,
    autoRenewal: false,
    notificationObject: null,
    notifications: [],
    signInAfterSignUp: {
        emailOrPhone: '',
        password: ''
    },
    signInAfterSignUp2: false,
    whichScreen: '',
    likedAndLikedByUsers: [],
    notificationId: ''
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

        clearRequestVerificationStatus(state: IUserState) {
            state.requestVerificationStatus = 'idle';
            state.requestVerificationSuccess = '';
            state.requestVerificationError = '';
        },

        clearGetLikedAndLikedByUsersStatus(state: IUserState) {
            state.getLikedAndLikedByUsersStatus = 'idle';
            state.getLikedAndLikedByUsersSuccess = '';
            state.getLikedAndLikedByUsersError = '';
        },

        clearDeleteUserNotificationStatus(state: IUserState) {
            state.deleteUserNotificationStatus = 'idle';
            state.deleteUserNotificationSuccess = '';
            state.deleteUserNotificationError = '';
        },

        clearGetSingleNotificationStatus(state: IUserState) {
            state.getSingleNotificationStatus = 'idle';
            state.getSingleNotificationSuccess = '';
            state.getSingleNotificationError = '';
        },

        clearUpdateNotificationStatus(state: IUserState) {
            state.updateNotificationStatus = 'idle';
            state.updateNotificationSuccess = '';
            state.updateNotificationError = '';
        },

        clearGetAllUserNotificationStatus(state: IUserState) {
            state.getAllUserNotificationStatus = 'idle';
            state.getAllUserNotificationSuccess = '';
            state.getAllUserNotificationError = '';
        },

        clearToggleProfileVisibilityStatus(state: IUserState) {
            state.toggleProfileVisibilityStatus = 'idle';
            state.toggleProfileVisibilitySuccess = '';
            state.toggleProfileVisibilityError = '';
        },

        clearToggleAutoRenewalStatus(state: IUserState) {
            state.toggleAutoRenewalStatus = 'idle';
            state.toggleAutoRenewalSuccess = '';
            state.toggleAutoRenewalError = '';
        },

        clearDeactivateAccountStatus(state: IUserState) {
            state.deactivateAccountStatus = 'idle';
            state.deactivateAccountSuccess = '';
            state.deactivateAccountError = '';
        },

        clearChangePasswordStatus(state: IUserState) {
            state.changePasswordStatus = 'idle';
            state.changePasswordSuccess = '';
            state.changePasswordError = '';
        },

        clearGetPlansStatus(state: IUserState) {
            state.getPlansStatus = 'idle';
            state.getPlansSuccess = '';
            state.getPlansError = '';
        },

        clearSaveImageToGalleryStatus(state: IUserState) {
            state.saveImageToGalleryStatus = 'idle';
            state.saveImageToGallerySuccess = '';
            state.saveImageToGalleryError = '';
        },

        clearDeleteImageFromGalleryStatus(state: IUserState) {
            state.deleteImageFromGalleryStatus = 'idle';
            state.deleteImageFromGallerySuccess = '';
            state.deleteImageFromGalleryError = '';
        },

        clearUploadUserProfileImageStatus(state: IUserState) {
            state.uploadUserProfileImageStatus = 'idle';
            state.uploadUserProfileImageSuccess = '';
            state.uploadUserProfileImageError = '';
        },

        clearUpdatePreferenceStatus(state: IUserState) {
            state.updatePreferenceStatus = 'idle';
            state.updatePreferenceSuccess = '';
            state.updatePreferenceError = '';
        },

        clearGetUserChatsStatus(state: IUserState) {
            state.getUserChatsStatus = 'idle';
            state.getUserChatsSuccess = '';
            state.getUserChatsError = '';
        },

        clearGetChatMessagesStatus(state: IUserState) {
            state.getChatMessagesStatus = 'idle';
            state.getChatMessagesSuccess = '';
            state.getChatMessagesError = '';
        },

        clearGetUserByIdsStatus(state: IUserState) {
            state.getUserByIdsStatus = 'idle';
            state.getUserByIdsSuccess = '';
            state.getUserByIdsError = '';
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

        clearCreateChatStatus(state: IUserState) {
            state.createChatStatus = 'idle';
            state.createChatSuccess = '';
            state.createChatError = '';
        },

        clearCreateChatMessageStatus(state: IUserState) {
            state.createChatMessageStatus = 'idle';
            state.createChatMessageSuccess = '';
            state.createChatMessageError = '';
        },

        clearGetSingleChatStatus(state: IUserState) {
            state.getSingleChatStatus = 'idle';
            state.getSingleChatSuccess = '';
            state.getSingleChatError = '';
        },

        clearFetchFavUsersStatus(state: IUserState) {
            state.fetchFavUsersStatus = 'idle';
            state.fetchFavUsersSuccess = '';
            state.fetchFavUsersError = '';
        },

        clearAddJobStatus(state: IUserState) {
            state.addJobStatus = 'idle';
            state.addJobSuccess = '';
            state.addJobError = '';
        },

        clearChangeJobStatus(state: IUserState) {
            state.changeJobStatus = 'idle';
            state.changeJobSuccess = '';
            state.changeJobError = '';
        },

        clearUpdateUserDetailStatus(state: IUserState) {
            state.updateUserDetailStatus = 'idle';
            state.updateUserDetailSuccess = '';
            state.updateUserDetailError = '';
        },

        clearUpdateUserStatus(state: IUserState) {
            state.updateUserStatus = 'idle';
            state.updateUserSuccess = '';
            state.updateUserError = '';
        },

        setPhotoUri(state: IUserState, action) {
            state.photoUri = {photo: action.payload.photo, userId: action.payload.userId}
        },

        setFromUserId(state: IUserState, action) {
            state.fromUserId = action.payload
        },

        setNotificationId(state: IUserState, action) {
            state.notificationId = action.payload
        },

        setChatUsers(state: IUserState, action) {
            // state.chatUsers = [...state.chatUsers, action.payload]
            state.chatUsers = action.payload
        },

        setOnlineUsers(state: IUserState, action) {
            state.onlineUsers = action.payload
        },

        setNotification(state: IUserState, action) {
            state.notification = [...state.notification, action.payload]
        },

        setSignInAfterSignUp(state: IUserState, action) {
            state.signInAfterSignUp = { 
                emailOrPhone: action.payload.emailOrPhone,
                password: action.payload.password
            }
        },

        setSignInAfterSignUp2(state: IUserState, action) {
            state.signInAfterSignUp2 = action.payload
        },
        
        setWhichScreen(state: IUserState, action) {
            state.whichScreen = action.payload
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
            .addCase(requestVerificationAction.pending, state => {
                state.requestVerificationStatus = 'loading';
            })
            .addCase(requestVerificationAction.fulfilled, (state, action) => {
                state.requestVerificationStatus = 'completed';
                state.requestVerificationSuccess = action.payload.message;
            })
            .addCase(requestVerificationAction.rejected, (state, action) => {
                state.requestVerificationStatus = 'failed';

                if (action.payload) {
                state.requestVerificationError = action.payload.message;
                } else state.requestVerificationError = action.error.message;
            });

        builder
            .addCase(getLikedAndLikedByUsersAction.pending, state => {
                state.getLikedAndLikedByUsersStatus = 'loading';
            })
            .addCase(getLikedAndLikedByUsersAction.fulfilled, (state, action) => {
                state.getLikedAndLikedByUsersStatus = 'completed';
                state.getLikedAndLikedByUsersSuccess = action.payload.message;

                state.likedAndLikedByUsers = action.payload.results as ILikedAndLikedByUsers[];
            })
            .addCase(getLikedAndLikedByUsersAction.rejected, (state, action) => {
                state.getLikedAndLikedByUsersStatus = 'failed';

                if (action.payload) {
                state.getLikedAndLikedByUsersError = action.payload.message;
                } else state.getLikedAndLikedByUsersError = action.error.message;
            });

        builder
            .addCase(deleteUserNotificationAction.pending, state => {
                state.deleteUserNotificationStatus = 'loading';
            })
            .addCase(deleteUserNotificationAction.fulfilled, (state, action) => {
                state.deleteUserNotificationStatus = 'completed';
                state.deleteUserNotificationSuccess = action.payload.message;

            })
            .addCase(deleteUserNotificationAction.rejected, (state, action) => {
                state.deleteUserNotificationStatus = 'failed';

                if (action.payload) {
                state.deleteUserNotificationError = action.payload.message;
                } else state.deleteUserNotificationError = action.error.message;
            });

        builder
            .addCase(getSingleNotificationAction.pending, state => {
                state.getSingleNotificationStatus = 'loading';
            })
            .addCase(getSingleNotificationAction.fulfilled, (state, action) => {
                state.getSingleNotificationStatus = 'completed';
                state.getSingleNotificationSuccess = action.payload.message;

                state.notificationObject = action.payload.result as INotification

            })
            .addCase(getSingleNotificationAction.rejected, (state, action) => {
                state.getSingleNotificationStatus = 'failed';

                if (action.payload) {
                state.getSingleNotificationError = action.payload.message;
                } else state.getSingleNotificationError = action.error.message;
            });

        builder
            .addCase(updateNotificationAction.pending, state => {
                state.updateNotificationStatus = 'loading';
            })
            .addCase(updateNotificationAction.fulfilled, (state, action) => {
                state.updateNotificationStatus = 'completed';
                state.updateNotificationSuccess = action.payload.message;

                state.notificationObject = action.payload.result as INotification

            })
            .addCase(updateNotificationAction.rejected, (state, action) => {
                state.updateNotificationStatus = 'failed';

                if (action.payload) {
                state.updateNotificationError = action.payload.message;
                } else state.updateNotificationError = action.error.message;
            });

        builder
            .addCase(getUserNotificationsAction.pending, state => {
                state.getAllUserNotificationStatus = 'loading';
            })
            .addCase(getUserNotificationsAction.fulfilled, (state, action) => {
                state.getAllUserNotificationStatus = 'completed';
                state.getAllUserNotificationSuccess = action.payload.message;

                state.notifications = action.payload.results as INotification[]

            })
            .addCase(getUserNotificationsAction.rejected, (state, action) => {
                state.getAllUserNotificationStatus = 'failed';

                if (action.payload) {
                state.getAllUserNotificationError = action.payload.message;
                } else state.getAllUserNotificationError = action.error.message;
            });

        builder
            .addCase(toggleProfileVisibilityAction.pending, state => {
                state.toggleProfileVisibilityStatus = 'loading';
            })
            .addCase(toggleProfileVisibilityAction.fulfilled, (state, action) => {
                state.toggleProfileVisibilityStatus = 'completed';
                state.toggleProfileVisibilitySuccess = action.payload.message;

                state.profileVisible = action.payload.result
            })
            .addCase(toggleProfileVisibilityAction.rejected, (state, action) => {
                state.toggleProfileVisibilityStatus = 'failed';

                if (action.payload) {
                state.toggleProfileVisibilityError = action.payload.message;
                } else state.toggleProfileVisibilityError = action.error.message;
            });

        builder
            .addCase(toggleAutoRenewalAction.pending, state => {
                state.toggleAutoRenewalStatus = 'loading';
            })
            .addCase(toggleAutoRenewalAction.fulfilled, (state, action) => {
                state.toggleAutoRenewalStatus = 'completed';
                state.toggleAutoRenewalSuccess = action.payload.message;

                state.profileVisible = action.payload.result
            })
            .addCase(toggleAutoRenewalAction.rejected, (state, action) => {
                state.toggleAutoRenewalStatus = 'failed';

                if (action.payload) {
                state.toggleAutoRenewalError = action.payload.message;
                } else state.toggleAutoRenewalError = action.error.message;
            });

        builder
            .addCase(deactivateAccountAction.pending, state => {
                state.deactivateAccountStatus = 'loading';
            })
            .addCase(deactivateAccountAction.fulfilled, (state, action) => {
                state.deactivateAccountStatus = 'completed';
                state.deactivateAccountSuccess = action.payload.message;
            })
            .addCase(deactivateAccountAction.rejected, (state, action) => {
                state.deactivateAccountStatus = 'failed';

                if (action.payload) {
                state.deactivateAccountError = action.payload.message;
                } else state.deactivateAccountError = action.error.message;
            });

        builder
            .addCase(changePasswordAction.pending, state => {
                state.changePasswordStatus = 'loading';
            })
            .addCase(changePasswordAction.fulfilled, (state, action) => {
                state.changePasswordStatus = 'completed';
                state.changePasswordSuccess = action.payload.message;
            })
            .addCase(changePasswordAction.rejected, (state, action) => {
                state.changePasswordStatus = 'failed';

                if (action.payload) {
                state.changePasswordError = action.payload.message;
                } else state.changePasswordError = action.error.message;
            });

        builder
            .addCase(getPlansAction.pending, state => {
                state.getPlansStatus = 'loading';
            })
            .addCase(getPlansAction.fulfilled, (state, action) => {
                state.getPlansStatus = 'completed';
                state.getPlansSuccess = action.payload.message;

                state.plans = action.payload.results as IPlan[];
            })
            .addCase(getPlansAction.rejected, (state, action) => {
                state.getPlansStatus = 'failed';

                if (action.payload) {
                state.getPlansError = action.payload.message;
                } else state.getPlansError = action.error.message;
            });

        builder
            .addCase(updateProfileImageAction.pending, state => {
                state.uploadUserProfileImageStatus = 'loading';
            })
            .addCase(updateProfileImageAction.fulfilled, (state, action) => {
                state.uploadUserProfileImageStatus = 'completed';
                state.uploadUserProfileImageSuccess = action.payload.message;
            })
            .addCase(updateProfileImageAction.rejected, (state, action) => {
                state.uploadUserProfileImageStatus = 'failed';

                if (action.payload) {
                state.uploadUserProfileImageError = action.payload.message;
                } else state.uploadUserProfileImageError = action.error.message;
            });

        builder
            .addCase(updateUserDetailAction.pending, state => {
                state.updateUserDetailStatus = 'loading';
            })
            .addCase(updateUserDetailAction.fulfilled, (state, action) => {
                state.updateUserDetailStatus = 'completed';
                state.updateUserDetailSuccess = action.payload.message;
            })
            .addCase(updateUserDetailAction.rejected, (state, action) => {
                state.updateUserDetailStatus = 'failed';

                if (action.payload) {
                state.updateUserDetailError = action.payload.message;
                } else state.updateUserDetailError = action.error.message;
            });

        builder
            .addCase(updateUserAction.pending, state => {
                state.updateUserStatus = 'loading';
            })
            .addCase(updateUserAction.fulfilled, (state, action) => {
                state.updateUserStatus = 'completed';
                state.updateUserSuccess = action.payload.message;
            })
            .addCase(updateUserAction.rejected, (state, action) => {
                state.updateUserStatus = 'failed';

                if (action.payload) {
                state.updateUserError = action.payload.message;
                } else state.updateUserError = action.error.message;
            });

        builder
            .addCase(addJobAction.pending, state => {
                state.addJobStatus = 'loading';
            })
            .addCase(addJobAction.fulfilled, (state, action) => {
                state.addJobStatus = 'completed';
                state.addJobSuccess = action.payload.message;
            })
            .addCase(addJobAction.rejected, (state, action) => {
                state.addJobStatus = 'failed';

                if (action.payload) {
                state.addJobError = action.payload.message;
                } else state.addJobError = action.error.message;
            });

        builder
            .addCase(changeJobAction.pending, state => {
                state.changeJobStatus = 'loading';
            })
            .addCase(changeJobAction.fulfilled, (state, action) => {
                state.changeJobStatus = 'completed';
                state.changeJobSuccess = action.payload.message;
            })
            .addCase(changeJobAction.rejected, (state, action) => {
                state.changeJobStatus = 'failed';

                if (action.payload) {
                state.changeJobError = action.payload.message;
                } else state.changeJobError = action.error.message;
            });

        builder
            .addCase(updatePreferenceAction.pending, state => {
                state.updatePreferenceStatus = 'loading';
            })
            .addCase(updatePreferenceAction.fulfilled, (state, action) => {
                state.updatePreferenceStatus = 'completed';
                state.updatePreferenceSuccess = action.payload.message;
            })
            .addCase(updatePreferenceAction.rejected, (state, action) => {
                state.updatePreferenceStatus = 'failed';

                if (action.payload) {
                state.updatePreferenceError = action.payload.message;
                } else state.updatePreferenceError = action.error.message;
            });

        builder
            .addCase(fetchFavUsersAction.pending, state => {
                state.fetchFavUsersStatus = 'loading';
            })
            .addCase(fetchFavUsersAction.fulfilled, (state, action) => {
                state.fetchFavUsersStatus = 'completed';
                state.fetchFavUsersSuccess = action.payload.message;

                state.favUsers = action.payload.results as any;
            })
            .addCase(fetchFavUsersAction.rejected, (state, action) => {
                state.fetchFavUsersStatus = 'failed';

                if (action.payload) {
                state.fetchFavUsersError = action.payload.message;
                } else state.fetchFavUsersError = action.error.message;
            });

        builder
            .addCase(createChatAction.pending, state => {
                state.createChatStatus = 'loading';
            })
            .addCase(createChatAction.fulfilled, (state, action) => {
                state.createChatStatus = 'completed';
                state.createChatSuccess = action.payload.message;

                state.createdChat = action.payload.result
            })
            .addCase(createChatAction.rejected, (state, action) => {
                state.createChatStatus = 'failed';

                if (action.payload) {
                state.createChatError = action.payload.message;
                } else state.createChatError = action.error.message;
            });

        builder
            .addCase(findSingleChatAction.pending, state => {
                state.getSingleChatStatus = 'loading';
            })
            .addCase(findSingleChatAction.fulfilled, (state, action) => {
                state.getSingleChatStatus = 'completed';
                state.getSingleChatSuccess = action.payload.message;

                state.singleChat = action.payload.result as IUserChats
            })
            .addCase(findSingleChatAction.rejected, (state, action) => {
                state.getSingleChatStatus = 'failed';

                if (action.payload) {
                state.getSingleChatError = action.payload.message;
                } else state.getSingleChatError = action.error.message;
            });

        builder
            .addCase(createChatMessageAction.pending, state => {
                state.createChatMessageStatus = 'loading';
            })
            .addCase(createChatMessageAction.fulfilled, (state, action) => {
                state.createChatMessageStatus = 'completed';
                state.createChatMessageSuccess = action.payload.message;

                state.chatMessage = action.payload.result;
            })
            .addCase(createChatMessageAction.rejected, (state, action) => {
                state.createChatMessageStatus = 'failed';

                if (action.payload) {
                state.createChatMessageError = action.payload.message;
                } else state.createChatMessageError = action.error.message;
            });

        builder
            .addCase(findUserChatsAction.pending, state => {
                state.getUserChatsStatus = 'loading';
            })
            .addCase(findUserChatsAction.fulfilled, (state, action) => {
                state.getUserChatsStatus = 'completed';
                state.getUserChatsSuccess = action.payload.message;

                state.chats = action.payload.result.chats as IUserChats[];
                state.chatMembers = action.payload.result.member as IMember;
                state.countUnreadMessages = action.payload.result.countUnreadMessages
            })
            .addCase(findUserChatsAction.rejected, (state, action) => {
                state.getUserChatsStatus = 'failed';

                if (action.payload) {
                    state.getUserChatsError = action.payload.message;
                } else state.getUserChatsError = action.error.message;
            });

        builder
            .addCase(getUserByIdsAction.pending, state => {
                state.getUserByIdsStatus = 'loading';
            })
            .addCase(getUserByIdsAction.fulfilled, (state, action) => {
                state.getUserByIdsStatus = 'completed';
                state.getUserByIdsSuccess = action.payload.message;

                state.usersByIds = action.payload.results as IUserById[];
            })
            .addCase(getUserByIdsAction.rejected, (state, action) => {
                state.getUserByIdsStatus = 'failed';

                if (action.payload) {
                state.getUserByIdsError = action.payload.message;
                } else state.getUserByIdsError = action.error.message;
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

        builder
            .addCase(getChatMessagesAction.pending, state => {
                state.getChatMessagesStatus = 'loading';
            })
            .addCase(getChatMessagesAction.fulfilled, (state, action) => {
                state.getChatMessagesStatus = 'completed';
                state.getChatMessagesSuccess = action.payload.message;

                state.chatMessages = action.payload.results as IChatMessage[]
            })
            .addCase(getChatMessagesAction.rejected, (state, action) => {
                state.getChatMessagesStatus = 'failed';

                if (action.payload) {
                state.getChatMessagesError = action.payload.message;
                } else state.getChatMessagesError = action.error.message;
            });

        builder
            .addCase(saveGalleryImageAction.pending, state => {
                state.saveImageToGalleryStatus = 'loading';
            })
            .addCase(saveGalleryImageAction.fulfilled, (state, action) => {
                state.saveImageToGalleryStatus = 'completed';
                state.saveImageToGallerySuccess = action.payload.message;

                state.savedImage = action.payload.result
            })
            .addCase(saveGalleryImageAction.rejected, (state, action) => {
                state.saveImageToGalleryStatus = 'failed';

                if (action.payload) {
                state.saveImageToGalleryError = action.payload.message;
                } else state.saveImageToGalleryError = action.error.message;
            });

        builder
            .addCase(deleteGalleryImageAction.pending, state => {
                state.deleteImageFromGalleryStatus = 'loading';
            })
            .addCase(deleteGalleryImageAction.fulfilled, (state, action) => {
                state.deleteImageFromGalleryStatus = 'completed';
                state.deleteImageFromGallerySuccess = action.payload.message;
            })
            .addCase(deleteGalleryImageAction.rejected, (state, action) => {
                state.deleteImageFromGalleryStatus = 'failed';

                if (action.payload) {
                state.deleteImageFromGalleryError = action.payload.message;
                } else state.deleteImageFromGalleryError = action.error.message;
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
    setNotificationId,
    clearUpdateLocationStatus,
    clearGetLoggedInUserStatus,
    setChatUsers,
    clearGetUserByIdsStatus,
    clearGetUserChatsStatus,
    clearGetChatMessagesStatus,
    clearCreateChatStatus,
    clearCreateChatMessageStatus,
    clearGetSingleChatStatus,
    setOnlineUsers, setNotification,
    clearUpdatePreferenceStatus,
    clearAddJobStatus, clearChangeJobStatus,
    clearUpdateUserDetailStatus, clearUpdateUserStatus,
    clearUploadUserProfileImageStatus,
    clearDeleteImageFromGalleryStatus,
    clearSaveImageToGalleryStatus, clearGetPlansStatus,
    clearChangePasswordStatus, clearDeactivateAccountStatus,
    clearToggleProfileVisibilityStatus,
    clearToggleAutoRenewalStatus,
    clearDeleteUserNotificationStatus,
    clearGetSingleNotificationStatus,
    clearGetAllUserNotificationStatus,
    clearUpdateNotificationStatus, setSignInAfterSignUp,
    setSignInAfterSignUp2, setWhichScreen,
    clearGetLikedAndLikedByUsersStatus,
    clearRequestVerificationStatus
} = userSlice.actions;

export default userSlice.reducer;