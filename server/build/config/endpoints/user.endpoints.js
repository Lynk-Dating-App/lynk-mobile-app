"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userRoute_1 = require("../../routes/userRoute");
const userEndpoints = [
    {
        name: 'update-user',
        method: 'put',
        path: '/user-update',
        handler: userRoute_1.updateUserHandler
    },
    {
        name: 'update-user-profile-detail',
        method: 'put',
        path: '/user-update-profile-detail',
        handler: userRoute_1.updateUserDetailHandler
    },
    {
        name: 'update-user-profile-image',
        method: 'put',
        path: '/user-update-profile-image',
        handler: userRoute_1.updateUserProfileImageHandler
    },
    {
        name: 'upgrade-plan',
        method: 'post',
        path: '/upgrade-plan',
        handler: userRoute_1.upgradePlanHandler
    },
    {
        name: 'toggle-profile-visibility',
        method: 'put',
        path: '/toggle-profile-visibility',
        handler: userRoute_1.toggleProfileVisibilityHandler
    },
    {
        name: 'update user status',
        method: 'put',
        path: '/user-status-update/:userId',
        handler: userRoute_1.updateUserStatusHandler
    },
    {
        name: 'delete user',
        method: 'delete',
        path: '/delete-user/:userId',
        handler: userRoute_1.deleteUserHandler
    },
    {
        name: 'change user password',
        method: 'put',
        path: '/change-user-password',
        handler: userRoute_1.changeUserPasswordHandler
    },
    {
        name: 'save user password after reset',
        method: 'put',
        path: '/password-reset/save-password',
        handler: userRoute_1.saveUserPasswordHandler
    },
    {
        name: 'reset user password',
        method: 'post',
        path: '/password-reset-user',
        handler: userRoute_1.resetUserPasswordHandler
    },
    {
        name: 'enter password reset code',
        method: 'post',
        path: '/enter-password-reset-code',
        handler: userRoute_1.enterResetCodeHandler
    },
    {
        name: 'fetch users',
        method: 'get',
        path: '/users',
        handler: userRoute_1.getUsersHandler
    },
    {
        name: 'fetch users with ids',
        method: 'post',
        path: '/users-with-ids',
        handler: userRoute_1.getUsersWithIdsHandler
    },
    {
        name: 'fetch matched and liked users',
        method: 'get',
        path: '/users-matched-liked-users/:userId',
        handler: userRoute_1.getMatchAndLikedByUsersHandler
    },
    {
        name: 'get user',
        method: 'get',
        path: '/user/:userId',
        handler: userRoute_1.getUserHandler
    },
    {
        name: 'get logged in user',
        method: 'get',
        path: '/logged-in-user',
        handler: userRoute_1.getLoggedInUserHandler
    },
    {
        name: 'save user address',
        method: 'post',
        path: '/user-address',
        handler: userRoute_1.saveUserAddressHandler
    },
    {
        name: 'get user address',
        method: 'get',
        path: '/user-address/:userAddressId',
        handler: userRoute_1.getSingleUserAddressHandler
    },
    {
        name: 'update user address',
        method: 'put',
        path: '/user-address/:userAddressId',
        handler: userRoute_1.updateUserAddressHandler
    },
    {
        name: 'update job description',
        method: 'put',
        path: '/job-description-update',
        handler: userRoute_1.updateJobDescriptionHandler
    },
    {
        name: 'delete user address',
        method: 'delete',
        path: '/user-address/:userAddressId',
        handler: userRoute_1.deleteUserAddressHandler
    },
    {
        name: 'update preference',
        method: 'put',
        path: '/user-preference',
        handler: userRoute_1.updatePreferenceHandler
    },
    {
        name: 'upload video',
        method: 'put',
        path: '/upload-user-video/:userId',
        handler: userRoute_1.uploadVideoHandler
    },
    {
        name: 'find match',
        method: 'get',
        path: '/find-match',
        handler: userRoute_1.findMatchHandler
    },
    {
        name: 'like user',
        method: 'put',
        path: '/like-user/:likedUserId',
        handler: userRoute_1.likeUserHandler
    },
    {
        name: 'unlike user',
        method: 'put',
        path: '/unlike-user/:unLikedUserId',
        handler: userRoute_1.unLikeUserHandler
    },
    {
        name: 'unlike user from match',
        method: 'put',
        path: '/unlike-user-from-match/:unLikedUserId',
        handler: userRoute_1.unLikeUserFromMatchHandler
    },
    {
        name: 'fav user',
        method: 'put',
        path: '/fav-user/:favId',
        handler: userRoute_1.favouritesHandler
    },
    {
        name: 'view user profile',
        method: 'post',
        path: '/view-user-profile',
        handler: userRoute_1.viewUserProfileHandler
    },
    {
        name: 'create job',
        method: 'post',
        path: '/new-job',
        handler: userRoute_1.newJobHandler
    },
    {
        name: 'get jobs',
        method: 'get',
        path: '/read-jobs',
        handler: userRoute_1.getJobsHandler
    },
    {
        name: 'get job',
        method: 'get',
        path: '/read-job/:jobId',
        handler: userRoute_1.getJobHandler
    },
    {
        name: 'update job',
        method: 'put',
        path: '/update-job/:jobId',
        handler: userRoute_1.updateJobHandler
    },
    {
        name: 'delete job',
        method: 'delete',
        path: '/delete-job/:jobId',
        handler: userRoute_1.deleteJobHandler
    },
    {
        name: 'update user location',
        method: 'put',
        path: '/update-user-location',
        handler: userRoute_1.updateLocationHandler
    },
    {
        name: 'gallery',
        method: 'put',
        path: '/gallery',
        handler: userRoute_1.galleryHandler
    },
    {
        name: 'delete photo in gallery',
        method: 'put',
        path: '/delete-photo-gallery',
        handler: userRoute_1.deletePhotoFromGalleryHandler
    },
    {
        name: 'get user notifications',
        method: 'get',
        path: '/user-notifications',
        handler: userRoute_1.getUserNotificationsHandler
    },
    {
        name: 'delete notification',
        method: 'delete',
        path: '/delete-notification/:notificationId',
        handler: userRoute_1.deleteNotificationsHandler
    },
    {
        name: 'get single notification',
        method: 'get',
        path: '/get-single-notification/:notificationId',
        handler: userRoute_1.getSingleNotificationHandler
    },
    {
        name: 'update notification',
        method: 'put',
        path: '/update-notification/:notificationId',
        handler: userRoute_1.updateNotificationHandler
    },
    {
        name: 'all notifications',
        method: 'get',
        path: '/all-notifications',
        handler: userRoute_1.getAllNotificationsHandler
    },
    {
        name: 'get user chats',
        method: 'post',
        path: '/get-user-chats',
        handler: userRoute_1.getUserChatsHandler
    },
    {
        name: 'delete chat',
        method: 'delete',
        path: '/delete-chat/:chatId',
        handler: userRoute_1.deleteChatsHandler
    },
    {
        name: 'create chat',
        method: 'post',
        path: '/create-chat',
        handler: userRoute_1.createChatHandler
    },
    {
        name: 'find chat',
        method: 'get',
        path: '/find-user-chats/:userId',
        handler: userRoute_1.findUserChatsHandler
    },
    {
        name: 'find chat',
        method: 'get',
        path: '/find-chat/:firstId/:secondId',
        handler: userRoute_1.findChatHandler
    },
    {
        name: 'create chat message',
        method: 'post',
        path: '/create-chat-message',
        handler: userRoute_1.createChatMessageHandler
    },
    {
        name: 'get chat messages',
        method: 'get',
        path: '/get-chat-messages/:chatId',
        handler: userRoute_1.getChatMessagesHandler
    },
    {
        name: 'send sign up token',
        method: 'post',
        path: '/send-sign-up-token',
        handler: userRoute_1.sendSignUpTokenHandler
    },
    {
        name: 'validate sign up token',
        method: 'post',
        path: '/validate-sign-up-token',
        handler: userRoute_1.validateSignUpTokenHandler
    },
    {
        name: 'check if user exist',
        method: 'post',
        path: '/check-user',
        handler: userRoute_1.checkUserHandler
    },
    {
        name: 'fetch fav users',
        method: 'get',
        path: '/favourite-users',
        handler: userRoute_1.fetchFavUsersHandler
    }
];
exports.default = userEndpoints;
