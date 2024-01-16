import AdminRepository from "../../repositories/AdminRepository";
import PermissionRepository from "../../repositories/PermissionRepository";
import RoleRepository from "../../repositories/RoleRepository";
import UserRepository from "../../repositories/UserRepository";
import SubscriptionRepository from "../../repositories/SubscriptionRepository";
import UserAddressRepository from "../../repositories/UserAddressRepository";
import TransactionRepository from "../../repositories/TransactionRepository";
import JobRepository from "../../repositories/JobRepository";
import NotificationRepository from "../../repositories/NotificationRepository";
import ChatMessageRepository from "../../repositories/ChatMessageRepository";
import ChatRepository from "../../repositories/ChatRepository";
import CardRepository from "../../repositories/CardRepository";
import VerifiedKeyRepository from "../../repositories/VerifiedKeyRepository";
import WaitlistRepository from "../../repositories/WaitlistRepository";

import PermissionDAOService from "./PermissionDAOService";
import RoleDAOService from "./RoleDAOService";
import AdminDAOService from "./AdminDAOService";
import UserDAOService from "./UserDAOService";
import SubscriptionDAOService from "./SubscriptionDAOService";
import UserAddressDAOService from "./UserAddressDAOService";
import TransactionDAOService from "./TransactionDAOService";
import JobDAOService from "./JobDAOService";
import NotificationDAOService from "./NotificationDAOService";
import ChatMessageDAOService from "./ChatMessageDAOService";
import TermiiService from "../TermiiService";
import ChatDAOService from "./ChatDAOService";
import CardDAOService from "./CardDAOService";
import VerifiedKeyDAOService from "./VerifiedKeyDAOService";
import WaitlistDAOService from "./WaitlistDAOService";

const permissionRepository = new PermissionRepository();
const roleRepository = new RoleRepository();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const subscriptionRepository = new SubscriptionRepository();
const userAddressRepository = new UserAddressRepository();
const transactionRepository = new TransactionRepository();
const jobRepository = new JobRepository();
const notificationRepository = new NotificationRepository();
const chatMessageRepository = new ChatMessageRepository();
const chatRepository = new ChatRepository();
const cardRepository = new CardRepository();
const verifiedKeyRepository = new VerifiedKeyRepository();
const waitlistRepository = new WaitlistRepository();

const permissionDAOService = new PermissionDAOService(permissionRepository);
const roleDAOService = new RoleDAOService(roleRepository);
const adminDAOService = new AdminDAOService(adminRepository);
const userDAOService = new UserDAOService(userRepository);
const subscriptionDAOService = new SubscriptionDAOService(subscriptionRepository);
const userAddressDAOService = new UserAddressDAOService(userAddressRepository);
const transactionDAOService = new TransactionDAOService(transactionRepository);
const jobDAOService = new JobDAOService(jobRepository);
const notificationDAOService = new NotificationDAOService(notificationRepository);
const chatMessageDAOService = new ChatMessageDAOService(chatMessageRepository);
const chatDAOService = new ChatDAOService(chatRepository);
const cardDAOService = new CardDAOService(cardRepository);
const verifiedKeyDAOService = new VerifiedKeyDAOService(verifiedKeyRepository);
const waitlistDAOService = new WaitlistDAOService(waitlistRepository);

const termiiService = new TermiiService();

export default {
    chatMessageDAOService,
    permissionDAOService,
    jobDAOService,
    roleDAOService,
    adminDAOService,
    userDAOService,
    subscriptionDAOService,
    userAddressDAOService,
    transactionDAOService,
    notificationDAOService,
    termiiService,
    chatDAOService,
    cardDAOService,
    verifiedKeyDAOService,
    waitlistDAOService
}