"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepository_1 = __importDefault(require("../../repositories/AdminRepository"));
const PermissionRepository_1 = __importDefault(require("../../repositories/PermissionRepository"));
const RoleRepository_1 = __importDefault(require("../../repositories/RoleRepository"));
const UserRepository_1 = __importDefault(require("../../repositories/UserRepository"));
const SubscriptionRepository_1 = __importDefault(require("../../repositories/SubscriptionRepository"));
const UserAddressRepository_1 = __importDefault(require("../../repositories/UserAddressRepository"));
const TransactionRepository_1 = __importDefault(require("../../repositories/TransactionRepository"));
const JobRepository_1 = __importDefault(require("../../repositories/JobRepository"));
const NotificationRepository_1 = __importDefault(require("../../repositories/NotificationRepository"));
const ChatMessageRepository_1 = __importDefault(require("../../repositories/ChatMessageRepository"));
const ChatRepository_1 = __importDefault(require("../../repositories/ChatRepository"));
const PermissionDAOService_1 = __importDefault(require("./PermissionDAOService"));
const RoleDAOService_1 = __importDefault(require("./RoleDAOService"));
const AdminDAOService_1 = __importDefault(require("./AdminDAOService"));
const UserDAOService_1 = __importDefault(require("./UserDAOService"));
const SubscriptionDAOService_1 = __importDefault(require("./SubscriptionDAOService"));
const UserAddressDAOService_1 = __importDefault(require("./UserAddressDAOService"));
const TransactionDAOService_1 = __importDefault(require("./TransactionDAOService"));
const JobDAOService_1 = __importDefault(require("./JobDAOService"));
const NotificationDAOService_1 = __importDefault(require("./NotificationDAOService"));
const ChatMessageDAOService_1 = __importDefault(require("./ChatMessageDAOService"));
const TermiiService_1 = __importDefault(require("../TermiiService"));
const ChatDAOService_1 = __importDefault(require("./ChatDAOService"));
const permissionRepository = new PermissionRepository_1.default();
const roleRepository = new RoleRepository_1.default();
const adminRepository = new AdminRepository_1.default();
const userRepository = new UserRepository_1.default();
const subscriptionRepository = new SubscriptionRepository_1.default();
const userAddressRepository = new UserAddressRepository_1.default();
const transactionRepository = new TransactionRepository_1.default();
const jobRepository = new JobRepository_1.default();
const notificationRepository = new NotificationRepository_1.default();
const chatMessageRepository = new ChatMessageRepository_1.default();
const chatRepository = new ChatRepository_1.default();
const permissionDAOService = new PermissionDAOService_1.default(permissionRepository);
const roleDAOService = new RoleDAOService_1.default(roleRepository);
const adminDAOService = new AdminDAOService_1.default(adminRepository);
const userDAOService = new UserDAOService_1.default(userRepository);
const subscriptionDAOService = new SubscriptionDAOService_1.default(subscriptionRepository);
const userAddressDAOService = new UserAddressDAOService_1.default(userAddressRepository);
const transactionDAOService = new TransactionDAOService_1.default(transactionRepository);
const jobDAOService = new JobDAOService_1.default(jobRepository);
const notificationDAOService = new NotificationDAOService_1.default(notificationRepository);
const chatMessageDAOService = new ChatMessageDAOService_1.default(chatMessageRepository);
const chatDAOService = new ChatDAOService_1.default(chatRepository);
const termiiService = new TermiiService_1.default();
exports.default = {
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
    chatDAOService
};
