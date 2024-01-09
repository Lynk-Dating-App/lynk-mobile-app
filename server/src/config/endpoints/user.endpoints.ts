import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import {
    changeUserPasswordHandler,
    deleteUserAddressHandler,
    deleteUserHandler,
    getSingleUserAddressHandler,
    getUserHandler,
    getUsersHandler,
    resetUserPasswordHandler,
    saveUserAddressHandler,
    saveUserPasswordHandler,
    updateUserAddressHandler,
    updateUserHandler,
    updateUserStatusHandler,
    enterResetCodeHandler,
    upgradePlanHandler,
    toggleProfileVisibilityHandler,
    updateJobDescriptionHandler,
    updatePreferenceHandler,
    uploadVideoHandler,
    findMatchHandler,
    likeUserHandler,
    unLikeUserHandler,
    viewUserProfileHandler,
    newJobHandler,
    getJobsHandler,
    getJobHandler,
    updateJobHandler,
    deleteJobHandler,
    updateLocationHandler,
    galleryHandler,
    deletePhotoFromGalleryHandler,
    getUserNotificationsHandler,
    deleteNotificationsHandler,
    getAllNotificationsHandler,
    getUserChatsHandler,
    deleteChatsHandler,
    sendSignUpTokenHandler,
    validateSignUpTokenHandler,
    checkUserHandler,
    updateUserDetailHandler,
    updateUserProfileImageHandler,
    unLikeUserFromMatchHandler,
    favouritesHandler,
    getLoggedInUserHandler,
    getUsersWithIdsHandler,
    getMatchAndLikedByUsersHandler,
    createChatHandler,
    findUserChatsHandler,
    findChatHandler,
    createChatMessageHandler,
    getChatMessagesHandler,
    fetchFavUsersHandler,
    getSingleNotificationHandler,
    updateNotificationHandler,
    fetchLikedAndLikedByUsersHandler,
    toggleAutoRenewalHandler,
    verifyUserHandler,
    requestVerificationHandler
} from '../../routes/userRoute';

const userEndpoints: RouteEndpoints = [
    {
        name: 'update-user',
        method: 'put',
        path: '/user-update',
        handler: updateUserHandler
    },
    {
        name: 'update-user-profile-detail',
        method: 'put',
        path: '/user-update-profile-detail',
        handler: updateUserDetailHandler
    },
    {
        name: 'update-user-profile-image',
        method: 'put',
        path: '/user-update-profile-image',
        handler: updateUserProfileImageHandler
    },
    {
        name: 'upgrade-plan',
        method: 'post',
        path: '/upgrade-plan',
        handler: upgradePlanHandler
    },
    {
        name: 'toggle-profile-visibility',
        method: 'put',
        path: '/toggle-profile-visibility',
        handler: toggleProfileVisibilityHandler
    },
    {
        name: 'toggle-auto-renewal',
        method: 'put',
        path: '/toggle-auto-renewal',
        handler: toggleAutoRenewalHandler
    },
    {
        name: 'verify-user',
        method: 'put',
        path: '/verify-user',
        handler: verifyUserHandler
    },
    {
        name: 'request-verification',
        method: 'put',
        path: '/request-verification',
        handler: requestVerificationHandler
    },
    {
        name: 'update user status',
        method: 'put',
        path: '/user-status-update/:userId',
        handler: updateUserStatusHandler
    },
    {
        name: 'delete user',
        method: 'delete',
        path: '/delete-user/:userId',
        handler: deleteUserHandler
    },
    {
        name: 'change user password',
        method: 'put',
        path: '/change-user-password',
        handler: changeUserPasswordHandler
    },
    {
        name: 'save user password after reset',
        method: 'put',
        path: '/password-reset/save-password',
        handler: saveUserPasswordHandler
    },
    {
        name: 'reset user password',
        method: 'post',
        path: '/password-reset-user',
        handler: resetUserPasswordHandler
    },
    {
        name: 'enter password reset code',
        method: 'post',
        path: '/enter-password-reset-code',
        handler: enterResetCodeHandler
    },
    {
        name: 'fetch users',
        method: 'get',
        path: '/users',
        handler: getUsersHandler
    },
    {
        name: 'fetch users with ids',
        method: 'post',
        path: '/users-with-ids',
        handler: getUsersWithIdsHandler
    },
    {
        name: 'fetch matched and liked users',
        method: 'get',
        path: '/users-matched-liked-users/:userId',
        handler: getMatchAndLikedByUsersHandler
    },
    {
        name: 'get user',
        method: 'get',
        path: '/user/:userId',
        handler: getUserHandler
    },
    {
        name: 'get logged in user',
        method: 'get',
        path: '/logged-in-user',
        handler: getLoggedInUserHandler
    },
    {
        name: 'save user address',
        method: 'post',
        path: '/user-address',
        handler: saveUserAddressHandler
    },
    {
        name: 'get user address',
        method: 'get',
        path: '/user-address/:userAddressId',
        handler: getSingleUserAddressHandler
    },
    {
        name: 'update user address',
        method: 'put',
        path: '/user-address/:userAddressId',
        handler: updateUserAddressHandler
    },
    {
        name: 'update job description',
        method: 'put',
        path: '/job-description-update',
        handler: updateJobDescriptionHandler
    },
    {
        name: 'delete user address',
        method: 'delete',
        path: '/user-address/:userAddressId',
        handler: deleteUserAddressHandler
    },
    {
        name: 'update preference',
        method: 'put',
        path: '/user-preference',
        handler: updatePreferenceHandler
    },
    {
        name: 'upload video',
        method: 'put',
        path: '/upload-user-video/:userId',
        handler: uploadVideoHandler
    },
    {
        name: 'find match',
        method: 'get',
        path: '/find-match',
        handler: findMatchHandler
    },
    {
        name: 'like user',
        method: 'put',
        path: '/like-user/:likedUserId',
        handler: likeUserHandler
    },
    {
        name: 'unlike user',
        method: 'put',
        path: '/unlike-user/:unLikedUserId',
        handler: unLikeUserHandler
    },
    {
        name: 'unlike user from match',
        method: 'put',
        path: '/unlike-user-from-match/:unLikedUserId',
        handler: unLikeUserFromMatchHandler
    },
    {
        name: 'fav user',
        method: 'put',
        path: '/fav-user/:favId',
        handler: favouritesHandler
    },
    {
        name: 'view user profile',
        method: 'post',
        path: '/view-user-profile',
        handler: viewUserProfileHandler
    },
    {
        name: 'create job',
        method: 'post',
        path: '/new-job',
        handler: newJobHandler
    },
    {
        name: 'get jobs',
        method: 'get',
        path: '/read-jobs',
        handler: getJobsHandler
    },
    {
        name: 'get job',
        method: 'get',
        path: '/read-job/:jobId',
        handler: getJobHandler
    },
    {
        name: 'update job',
        method: 'put',
        path: '/update-job/:jobId',
        handler: updateJobHandler
    },
    {
        name: 'delete job',
        method: 'delete',
        path: '/delete-job/:jobId',
        handler: deleteJobHandler
    },
    {
        name: 'update user location',
        method: 'put',
        path: '/update-user-location',
        handler: updateLocationHandler
    },
    {
        name: 'gallery',
        method: 'put',
        path: '/gallery',
        handler: galleryHandler
    },
    {
        name: 'delete photo in gallery',
        method: 'put',
        path: '/delete-photo-gallery',
        handler: deletePhotoFromGalleryHandler
    },
    {
        name: 'get user notifications',
        method: 'get',
        path: '/user-notifications',
        handler: getUserNotificationsHandler
    },
    {
        name: 'delete notification',
        method: 'delete',
        path: '/delete-notification/:notificationId',
        handler: deleteNotificationsHandler
    },
    {
        name: 'get single notification',
        method: 'get',
        path: '/get-single-notification/:notificationId',
        handler: getSingleNotificationHandler
    },
    {
        name: 'update notification',
        method: 'put',
        path: '/update-notification/:notificationId',
        handler: updateNotificationHandler
    },
    {
        name: 'all notifications',
        method: 'get',
        path: '/all-notifications',
        handler: getAllNotificationsHandler
    },
    {
        name: 'get user chats',
        method: 'post',
        path: '/get-user-chats',
        handler: getUserChatsHandler
    },
    {
        name: 'delete chat',
        method: 'delete',
        path: '/delete-chat/:chatId',
        handler: deleteChatsHandler
    },
    {
        name: 'create chat',
        method: 'post',
        path: '/create-chat',
        handler: createChatHandler
    },
    {
        name: 'find chat',
        method: 'get',
        path: '/find-user-chats/:userId',
        handler: findUserChatsHandler
    },
    {
        name: 'find chat',
        method: 'get',
        path: '/find-chat/:firstId/:secondId',
        handler: findChatHandler
    },
    {
        name: 'create chat message',
        method: 'post',
        path: '/create-chat-message',
        handler: createChatMessageHandler
    },
    {
        name: 'get chat messages',
        method: 'get',
        path: '/get-chat-messages/:chatId',
        handler: getChatMessagesHandler
    },
    {
        name: 'send sign up token',
        method: 'post',
        path: '/send-sign-up-token',
        handler: sendSignUpTokenHandler
    },
    {
        name: 'validate sign up token',
        method: 'post',
        path: '/validate-sign-up-token',
        handler: validateSignUpTokenHandler
    },
    {
        name: 'check if user exist',
        method: 'post',
        path: '/check-user',
        handler: checkUserHandler
    },
    {
        name: 'fetch fav users',
        method: 'get',
        path: '/favourite-users',
        handler: fetchFavUsersHandler
    },
    {
        name: 'fetch liked and liked by users',
        method: 'get',
        path: '/liked-and-liked-by-users',
        handler: fetchLikedAndLikedByUsersHandler
    }
];

export default userEndpoints;
