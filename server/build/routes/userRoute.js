"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSignUpTokenHandler = exports.getChatMessagesHandler = exports.createChatMessageHandler = exports.findUserChatsHandler = exports.findChatHandler = exports.createChatHandler = exports.deleteChatsHandler = exports.getUserChatsHandler = exports.getAllNotificationsHandler = exports.updateNotificationHandler = exports.getSingleNotificationHandler = exports.deleteNotificationsHandler = exports.getUserNotificationsHandler = exports.deletePhotoFromGalleryHandler = exports.galleryHandler = exports.updateLocationHandler = exports.deleteJobHandler = exports.updateJobHandler = exports.getJobHandler = exports.getJobsHandler = exports.newJobHandler = exports.viewUserProfileHandler = exports.favouritesHandler = exports.unLikeUserFromMatchHandler = exports.unLikeUserHandler = exports.likeUserHandler = exports.findMatchHandler = exports.uploadVideoHandler = exports.updatePreferenceHandler = exports.updateJobDescriptionHandler = exports.toggleProfileVisibilityHandler = exports.deleteUserAddressHandler = exports.updateUserAddressHandler = exports.getSingleUserAddressHandler = exports.saveUserAddressHandler = exports.enterResetCodeHandler = exports.saveUserPasswordHandler = exports.resetUserPasswordHandler = exports.changeUserPasswordHandler = exports.getMatchAndLikedByUsersHandler = exports.getUsersWithIdsHandler = exports.getUsersHandler = exports.getLoggedInUserHandler = exports.getUserHandler = exports.deleteUserHandler = exports.upgradePlanHandler = exports.updateUserStatusHandler = exports.updateUserProfileImageHandler = exports.updateUserDetailHandler = exports.updateUserHandler = void 0;
exports.fetchFavUsersHandler = exports.checkUserHandler = exports.validateSignUpTokenHandler = void 0;
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const UserController_1 = __importDefault(require("../controller/UserController"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const passwordEncoder = new PasswordEncoder_1.default();
const userController = new UserController_1.default(passwordEncoder);
exports.updateUserHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateUser(req);
    res.status(response.code).json(response);
});
exports.updateUserDetailHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateUserDetails(req);
    res.status(response.code).json(response);
});
exports.updateUserProfileImageHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateUserProfileImage(req);
    res.status(response.code).json(response);
});
exports.updateUserStatusHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateUserStatus(req);
    res.status(response.code).json(response);
});
exports.upgradePlanHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.upgradePlan(req);
    res.status(response.code).json(response);
});
exports.deleteUserHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.deleteUser(req);
    res.status(response.code).json(response);
});
exports.getUserHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.user(req);
    res.status(response.code).json(response);
});
exports.getLoggedInUserHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.loggedInUser(req);
    res.status(response.code).json(response);
});
exports.getUsersHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.users(req);
    res.status(response.code).json(response);
});
exports.getUsersWithIdsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.usersWithIds(req);
    res.status(response.code).json(response);
});
exports.getMatchAndLikedByUsersHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.matchedAndLikedByUsers(req);
    res.status(response.code).json(response);
});
exports.changeUserPasswordHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.changePassword(req);
    res.status(response.code).json(response);
});
const resetUserPasswordHandler = async (req, res) => {
    const response = await userController.resetPassword(req);
    //@ts-ignore
    res.status(response.code).json(response);
};
exports.resetUserPasswordHandler = resetUserPasswordHandler;
const saveUserPasswordHandler = async (req, res) => {
    const response = await userController.savePassword(req);
    //@ts-ignore
    res.status(response.code).json(response);
};
exports.saveUserPasswordHandler = saveUserPasswordHandler;
const enterResetCodeHandler = async (req, res) => {
    const response = await userController.enterPasswordResetCode(req);
    //@ts-ignore
    res.status(response.code).json(response);
};
exports.enterResetCodeHandler = enterResetCodeHandler;
exports.saveUserAddressHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.saveUserAddress(req);
    res.status(response.code).json(response);
});
exports.getSingleUserAddressHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getSingleAddress(req);
    res.status(response.code).json(response);
});
exports.updateUserAddressHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateAddress(req);
    res.status(response.code).json(response);
});
exports.deleteUserAddressHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.deleteAddress(req);
    res.status(response.code).json(response);
});
exports.toggleProfileVisibilityHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.toggleProfileVisibility(req);
    res.status(response.code).json(response);
});
exports.updateJobDescriptionHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateJobDescription(req);
    res.status(response.code).json(response);
});
exports.updatePreferenceHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updatePreference(req);
    res.status(response.code).json(response);
});
exports.uploadVideoHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.uploadVideo(req);
    res.status(response.code).json(response);
});
exports.findMatchHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.findMatch(req);
    res.status(response.code).json(response);
});
exports.likeUserHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.likeUser(req);
    res.status(response.code).json(response);
});
exports.unLikeUserHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.unLikeUser(req);
    res.status(response.code).json(response);
});
exports.unLikeUserFromMatchHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.unLikeUserFromMatch(req);
    res.status(response.code).json(response);
});
exports.favouritesHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.favourites(req);
    res.status(response.code).json(response);
});
exports.viewUserProfileHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.viewUserProfile(req);
    res.status(response.code).json(response);
});
exports.newJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.newJob(req);
    res.status(response.code).json(response);
});
exports.getJobsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getJobs(req);
    res.status(response.code).json(response);
});
exports.getJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getJob(req);
    res.status(response.code).json(response);
});
exports.updateJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateJob(req);
    res.status(response.code).json(response);
});
exports.deleteJobHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.deleteJob(req);
    res.status(response.code).json(response);
});
exports.updateLocationHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateLocation(req);
    res.status(response.code).json(response);
});
exports.galleryHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.gallery(req);
    res.status(response.code).json(response);
});
exports.deletePhotoFromGalleryHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.deletePhotoInGallery(req);
    res.status(response.code).json(response);
});
exports.getUserNotificationsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getUserNotifications(req);
    res.status(response.code).json(response);
});
exports.deleteNotificationsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.deleteNotification(req);
    res.status(response.code).json(response);
});
exports.getSingleNotificationHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getSingleNotification(req);
    res.status(response.code).json(response);
});
exports.updateNotificationHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.updateNotification(req);
    res.status(response.code).json(response);
});
exports.getAllNotificationsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getAllNotifications(req);
    res.status(response.code).json(response);
});
exports.getUserChatsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getUserChats(req);
    res.status(response.code).json(response);
});
exports.deleteChatsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.deleteChat(req);
    res.status(response.code).json(response);
});
exports.createChatHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.createChat(req);
    res.status(response.code).json(response);
});
exports.findChatHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.findChat(req);
    res.status(response.code).json(response);
});
exports.findUserChatsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.findUserChats(req);
    res.status(response.code).json(response);
});
exports.createChatMessageHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.createChatMessage(req);
    res.status(response.code).json(response);
});
exports.getChatMessagesHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.getChatMessages(req);
    res.status(response.code).json(response);
});
const sendSignUpTokenHandler = async (req, res) => {
    const response = await userController.sendSignUpToken(req);
    res.status(response.code).json(response);
};
exports.sendSignUpTokenHandler = sendSignUpTokenHandler;
const validateSignUpTokenHandler = async (req, res) => {
    const response = await userController.validateSignUpToken(req);
    res.status(response.code).json(response);
};
exports.validateSignUpTokenHandler = validateSignUpTokenHandler;
const checkUserHandler = async (req, res) => {
    const response = await userController.checkUser(req);
    res.status(response.code).json(response);
};
exports.checkUserHandler = checkUserHandler;
exports.fetchFavUsersHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await userController.fetchFavouriteUsers(req);
    res.status(response.code).json(response);
});
