import { Request, Response } from "express";
import PasswordEncoder from "../utils/PasswordEncoder";
import UserController from "../controller/UserController";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";

const passwordEncoder = new PasswordEncoder();
const userController = new UserController(passwordEncoder);

export const updateUserHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.updateUser(req);

    res.status(response.code).json(response);
});

export const updateUserDetailHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.updateUserDetails(req);

    res.status(response.code).json(response);
});

export const updateUserProfileImageHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.updateUserProfileImage(req);

    res.status(response.code).json(response);
});

export const updateUserStatusHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.updateUserStatus(req);

    res.status(response.code).json(response);
});

export const upgradePlanHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.upgradePlan(req);

    res.status(response.code).json(response);
});

export const deleteUserHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.deleteUser(req);

    res.status(response.code).json(response);
});

export const getUserHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.user(req);

    res.status(response.code).json(response);
});

export const getLoggedInUserHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.loggedInUser(req);

    res.status(response.code).json(response);
});

export const getUsersHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.users(req);

    res.status(response.code).json(response);
});

export const getUsersWithIdsHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.usersWithIds(req);

    res.status(response.code).json(response);
});

export const getMatchAndLikedByUsersHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.matchedAndLikedByUsers(req);

    res.status(response.code).json(response);
});

export const changeUserPasswordHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await userController.changePassword(req);

    res.status(response.code).json(response);
});

export const resetUserPasswordHandler = async (req: Request, res: Response) =>  {
    const response = await userController.resetPassword(req);

    //@ts-ignore
    res.status(response.code).json(response);
};

export const saveUserPasswordHandler = async (req: Request, res: Response) =>  {
    const response = await userController.savePassword(req);

    //@ts-ignore
    res.status(response.code).json(response);
};

export const enterResetCodeHandler = async (req: Request, res: Response) =>  {
    const response = await userController.enterPasswordResetCode(req);

    //@ts-ignore
    res.status(response.code).json(response);
};

export const saveUserAddressHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.saveUserAddress(req);

    res.status(response.code).json(response);
});

export const getSingleUserAddressHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getSingleAddress(req);

    res.status(response.code).json(response);
});

export const updateUserAddressHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.updateAddress(req);

    res.status(response.code).json(response);
});

export const deleteUserAddressHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.deleteAddress(req);

    res.status(response.code).json(response);
});

export const toggleProfileVisibilityHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.toggleProfileVisibility(req);

    res.status(response.code).json(response);
});

export const toggleAutoRenewalHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.toggleAutoRenewal(req);

    res.status(response.code).json(response);
});

export const verifyUserHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.verifyUser(req);

    res.status(response.code).json(response);
});

export const requestVerificationHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.requestVerification(req);

    res.status(response.code).json(response);
});

export const updateJobDescriptionHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.updateJobDescription(req);

    res.status(response.code).json(response);
});

export const updatePreferenceHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.updatePreference(req);

    res.status(response.code).json(response);
});

export const uploadVideoHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.uploadVideo(req);

    res.status(response.code).json(response);
});

export const findMatchHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.findMatch(req);

    res.status(response.code).json(response);
});

export const likeUserHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.likeUser(req);

    res.status(response.code).json(response);
});

export const unLikeUserHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.unLikeUser(req);

    res.status(response.code).json(response);
});

export const unLikeUserFromMatchHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.unLikeUserFromMatch(req);

    res.status(response.code).json(response);
});

export const favouritesHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.favourites(req);

    res.status(response.code).json(response);
});

export const viewUserProfileHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.viewUserProfile(req);

    res.status(response.code).json(response);
});

export const newJobHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.newJob(req);

    res.status(response.code).json(response);
});

export const getJobsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getJobs(req);

    res.status(response.code).json(response);
});

export const getJobHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getJob(req);

    res.status(response.code).json(response);
});

export const updateJobHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.updateJob(req);

    res.status(response.code).json(response);
});

export const deleteJobHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.deleteJob(req);

    res.status(response.code).json(response);
});

export const updateLocationHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.updateLocation(req);

    res.status(response.code).json(response);
});

export const galleryHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.gallery(req);

    res.status(response.code).json(response);
});

export const deletePhotoFromGalleryHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.deletePhotoInGallery(req);

    res.status(response.code).json(response);
});

export const getUserNotificationsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getUserNotifications(req);

    res.status(response.code).json(response);
});

export const deleteNotificationsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.deleteNotification(req);

    res.status(response.code).json(response);
});

export const getSingleNotificationHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getSingleNotification(req);

    res.status(response.code).json(response);
});

export const updateNotificationHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.updateNotification(req);

    res.status(response.code).json(response);
});

export const getAllNotificationsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getAllNotifications(req);

    res.status(response.code).json(response);
});

export const getUserChatsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getUserChats(req);

    res.status(response.code).json(response);
});

export const deleteChatsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.deleteChat(req);

    res.status(response.code).json(response);
});

export const createChatHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.createChat(req);

    res.status(response.code).json(response);
});

export const findChatHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.findChat(req);

    res.status(response.code).json(response);
});

export const findUserChatsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.findUserChats(req);

    res.status(response.code).json(response);
});

export const createChatMessageHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.createChatMessage(req);

    res.status(response.code).json(response);
});

export const getChatMessagesHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.getChatMessages(req);

    res.status(response.code).json(response);
});

export const sendSignUpTokenHandler = async (req: Request, res: Response) => {
    const response = await userController.sendSignUpToken(req);

    res.status(response.code).json(response);
};

export const validateSignUpTokenHandler = async (req: Request, res: Response) => {
    const response = await userController.validateSignUpToken(req);

    res.status(response.code).json(response);
};

export const checkUserHandler = async (req: Request, res: Response) => {
    const response = await userController.checkUser(req);

    res.status(response.code).json(response);
};

export const fetchFavUsersHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.fetchFavouriteUsers(req);

    res.status(response.code).json(response);
});

export const fetchLikedAndLikedByUsersHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.likedAndLikedByUsers(req);

    res.status(response.code).json(response);
});

export const generateKeyHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.generateKey(req);

    res.status(response.code).json(response);
});

export const changeKeyStatusHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.changeKeyStatus(req);

    res.status(response.code).json(response);
});

export const unVerifiedUsersHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.unVerifiedUsers(req);

    res.status(response.code).json(response);
});

export const externalVerifyUserHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await userController.externalVerifyUser(req);

    res.status(response.code).json(response);
});