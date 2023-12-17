"use strict";
/**
 * This helper Class, executes commands in form of methods,we want to run at runtime.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const RoleRepository_1 = __importDefault(require("../repositories/RoleRepository"));
const PermissionRepository_1 = __importDefault(require("../repositories/PermissionRepository"));
const superAdmin_json_1 = __importDefault(require("../resources/data/superAdmin.json"));
const subscription_json_1 = __importDefault(require("../resources/data/subscription.json"));
const AdminRepository_1 = __importDefault(require("../repositories/AdminRepository"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const settings_1 = __importStar(require("../config/settings"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const constants_1 = require("../config/constants");
const SubscriptionRepository_1 = __importDefault(require("../repositories/SubscriptionRepository"));
class CommandLineRunner {
    static singleton = new CommandLineRunner();
    roleRepository;
    permissionRepository;
    userRepository;
    subscriptionRepository;
    constructor() {
        this.roleRepository = new RoleRepository_1.default();
        this.permissionRepository = new PermissionRepository_1.default();
        this.userRepository = new AdminRepository_1.default();
        this.subscriptionRepository = new SubscriptionRepository_1.default();
    }
    static async run() {
        await this.singleton.loadDefaultRolesAndPermissions();
        await this.singleton.loadDefaultSuperAdmin();
        await this.singleton.createUploadDirectory();
        await this.singleton.loadDefaultSubscription();
    }
    async createUploadDirectory() {
        const dirExist = await Generic_1.default.fileExist(constants_1.UPLOAD_BASE_PATH);
        if (!dirExist)
            await promises_1.default.mkdir(constants_1.UPLOAD_BASE_PATH);
    }
    async loadDefaultSuperAdmin() {
        const exist = await this.userRepository.findOne({
            slug: settings_1.default.roles[0]
        });
        if (exist)
            return;
        const passwordEncoder = new PasswordEncoder_1.default();
        Object.assign(superAdmin_json_1.default, {
            password: await passwordEncoder.encode(process.env.ADMIN_PASS),
            confirm_password: await passwordEncoder.encode(process.env.ADMIN_PASS)
        });
        const user = (await this.userRepository.save(superAdmin_json_1.default));
        const role = await this.roleRepository.findOne({
            slug: settings_1.default.roles[0],
        });
        if (role) {
            user.role = role?.id;
            await user.save();
            //@ts-ignore
            role.users.push(user._id);
            await role.save();
        }
    }
    async loadDefaultRolesAndPermissions() {
        //create permissions
        for (const permissionName of settings_1.default.permissions) {
            const findPermission = await this.permissionRepository.findOne({
                name: permissionName
            });
            if (!findPermission) {
                await this.permissionRepository.save({
                    //@ts-ignore
                    name: permissionName,
                    action: permissionName.split('_')[0],
                    subject: permissionName.split('_')[1],
                    inverted: true,
                });
            }
        }
        //create roles
        for (const roleName of settings_1.default.roles) {
            const findRole = await this.roleRepository.findOne({
                slug: roleName
            });
            if (!findRole) {
                await this.roleRepository.save({
                    //@ts-ignore
                    slug: `${roleName}`,
                    name: `${roleName}`.replace(/_/g, ' '),
                });
            }
        }
        //vendor permission
        const vendorPermission = await this.permissionRepository.findAll({
            name: settings_1.default.permissions[1]
        });
        //super admin permissions
        const superAdminPermission = await this.permissionRepository.findAll({
            name: settings_1.MANAGE_ALL
        });
        //get customer role
        const vendorRole = await this.roleRepository.findOne({
            slug: settings_1.default.roles[1]
        });
        //get super admin role
        const superAdminRole = await this.roleRepository.findOne({
            slug: settings_1.default.roles[0]
        });
        //associate roles to their respective permissions
        //@ts-ignore
        for (let perm of vendorPermission) {
            //@ts-ignore
            if (!vendorRole?.permissions.includes(perm._id)) {
                //@ts-ignore  
                vendorRole?.permissions.push(perm._id);
                await vendorRole?.save();
            }
        }
        for (let perm of superAdminPermission) {
            //@ts-ignore
            if (!superAdminRole?.permissions.includes(perm._id)) {
                //@ts-ignore  
                superAdminRole?.permissions.push(perm._id);
                await superAdminRole?.save();
            }
        }
    }
    async loadDefaultSubscription() {
        const fetchSubscriptions = await this.subscriptionRepository.findAll({});
        //@ts-ignore
        const existingSlugs = fetchSubscriptions.map(sub => sub.slug);
        for (let sub of subscription_json_1.default) {
            if (!existingSlugs.includes(sub.slug)) {
                await this.subscriptionRepository.save({
                    name: sub.name,
                    slug: sub.slug,
                    price: sub.price,
                    duration: sub.duration,
                    durationUnit: sub.durationUnit
                });
            }
        }
    }
}
exports.default = CommandLineRunner;
