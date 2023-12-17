"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const Admin_1 = require("../models/Admin");
const dao_1 = __importDefault(require("../services/dao"));
const joi_1 = __importDefault(require("joi"));
const settings_1 = __importStar(require("../config/settings"));
const Generic_1 = __importDefault(require("../utils/Generic"));
class AdminController {
    constructor(passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    async createAdmin(req) {
        const admin = await this.doCreateAdmin(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: admin,
        };
        return Promise.resolve(response);
    }
    ;
    /**
 * @name updateAdmin
 * @param req
 * @desc Updates the admin
 * only admins with manage_all or update_admin permission
 * can do this
 */
    async updateAdmin(req) {
        const customer = await this.doUpdateAdmin(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated',
            result: customer
        };
        return Promise.resolve(response);
    }
    ;
    /*
    * @name changePassword
    * @param req
    * @desc Changes admin password
    * only admins with manage all permission and update admin
    * permission can do this
    */
    async changePassword(req) {
        const admin = await this.doChangePassword(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: "Successful",
            result: admin,
        };
        return Promise.resolve(response);
    }
    ;
    /**
   * @name updateAdminStatus
   * @param req
   * @desc Updates the admin status
   * only admin with super admin manage all and update admin
   * permission can do this
   */
    async updateAdminStatus(req) {
        const admin = await this.doUpdateAdminStatus(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully updated status'
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name deleteAdmin
     * @param req
     * @desc deletes the admin
     * only admin with super admin manage all and delete admin
     * permission can do this
     */
    async deleteAdmin(req) {
        const admin = await this.doDeleteAdmin(req);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Successfully deleted'
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name admin
     * @param req
     * @desc Gets a single admin
     * only admin with super admin manage all and read admin
     * permission can do this
     */
    async admin(req) {
        const adminId = req.params.adminId;
        const admin = await dao_1.default.adminDAOService.findById(adminId);
        if (!admin)
            return Promise.reject(CustomAPIError_1.default.response(`Admin with Id: ${adminId} does not exist`, HttpStatus_1.default.BAD_REQUEST.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: admin,
        };
        return Promise.resolve(response);
    }
    ;
    /**
     * @name admins
     * @param req
     * @desc Gets all admins, its also search and retrieves
     * admins according to admin first name, last name and status
     * only admins with super admin manage all and read admin
     * permission can do this
     */
    async admins(req) {
        const role = await dao_1.default.roleDAOService.findByAny({
            slug: settings_1.default.roles[0]
        });
        const superAdminUser = await dao_1.default.adminDAOService.findByAny({
            role: role?.id
        });
        const options = {
            sort: { createdAt: -1 },
            role: { $ne: superAdminUser?.role }
        };
        const admins = await dao_1.default.adminDAOService.findAll(options);
        if (!admins)
            return Promise.reject(CustomAPIError_1.default.response('No admin is available at this time', HttpStatus_1.default.BAD_REQUEST.code));
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: admins,
        };
        return Promise.resolve(response);
    }
    ;
    async doCreateAdmin(req) {
        const { error, value } = joi_1.default.object(Admin_1.$saveAdminSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const role = await dao_1.default.roleDAOService.findByAny({
            slug: Generic_1.default.generateSlug(value.roleName)
        });
        if (!role)
            return Promise.reject(CustomAPIError_1.default.response('Role not found', HttpStatus_1.default.BAD_REQUEST.code));
        if ((role.slug === settings_1.default.roles[0]))
            return Promise.reject(CustomAPIError_1.default.response('Super admin admin already exist', HttpStatus_1.default.BAD_REQUEST.code));
        const email = await dao_1.default.adminDAOService.findByAny({ email: value.email });
        if (email)
            return Promise.reject(CustomAPIError_1.default.response('Email already in use', HttpStatus_1.default.BAD_REQUEST.code));
        const phone = await dao_1.default.adminDAOService.findByAny({ email: value.email });
        if (phone)
            return Promise.reject(CustomAPIError_1.default.response('Phone number already in use', HttpStatus_1.default.BAD_REQUEST.code));
        const password = await this.passwordEncoder.encode(value.password);
        const adminValues = {
            ...value,
            role: role._id,
            active: true,
            password: password
        };
        const admin = await dao_1.default.adminDAOService.create(adminValues);
        role.users.push(admin._id);
        await role.save();
        return admin;
    }
    ;
    async doUpdateAdmin(req) {
        const adminId = req.params.adminId;
        const { error, value } = joi_1.default.object(Admin_1.$updateAdminSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const admin = await dao_1.default.adminDAOService.findById(adminId);
        if (!admin)
            return Promise.reject(CustomAPIError_1.default.response('Admin not found', HttpStatus_1.default.NOT_FOUND.code));
        const admin_email = await dao_1.default.adminDAOService.findByAny({
            email: value.email
        });
        if (value.email && admin.email !== value.email) {
            if (admin_email) {
                return Promise.reject(CustomAPIError_1.default.response('Admin with this email already exists', HttpStatus_1.default.NOT_FOUND.code));
            }
        }
        ;
        const admin_phone = await dao_1.default.adminDAOService.findByAny({
            phone: value.phone
        });
        if (value.phone && admin.phone !== value.phone) {
            if (admin_phone) {
                return Promise.reject(CustomAPIError_1.default.response('Admin with this phone number already exists', HttpStatus_1.default.NOT_FOUND.code));
            }
        }
        ;
        const adminValues = {
            ...value
        };
        const _admin = await dao_1.default.adminDAOService.updateByAny({ _id: admin._id }, adminValues);
        return _admin;
    }
    ;
    async doChangePassword(req) {
        const adminId = req.params.adminId;
        const { error, value } = joi_1.default.object(Admin_1.$changePassword).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const admin = await dao_1.default.adminDAOService.findById(adminId);
        if (!admin)
            return Promise.reject(CustomAPIError_1.default.response('Admin not found', HttpStatus_1.default.BAD_REQUEST.code));
        const hash = admin.password;
        const password = value.previousPassword;
        const isMatch = await this.passwordEncoder.match(password.trim(), hash.trim());
        if (!isMatch)
            return Promise.reject(CustomAPIError_1.default.response('Password in the database differ from the password entered as current password', HttpStatus_1.default.UNAUTHORIZED.code));
        const _password = await this.passwordEncoder.encode(value.password);
        const adminValues = {
            password: _password
        };
        const updated = await dao_1.default.adminDAOService.updateByAny({ _id: adminId }, adminValues);
        return updated;
    }
    ;
    async doUpdateAdminStatus(req) {
        const adminId = req.params.adminId;
        const admin = await dao_1.default.adminDAOService.findById(adminId);
        if (!admin)
            return Promise.reject(CustomAPIError_1.default.response('Admin not found', HttpStatus_1.default.BAD_REQUEST.code));
        const updateAdmin = await dao_1.default.adminDAOService.update({ _id: adminId }, { active: !admin.active });
        return updateAdmin;
    }
    ;
    async doDeleteAdmin(req) {
        const adminId = req.params.adminId;
        return await dao_1.default.adminDAOService.deleteById(adminId);
    }
    ;
}
exports.default = AdminController;
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.CREATE_ADMIN_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createAdmin", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.UPDATE_ADMIN_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmin", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.UPDATE_ADMIN_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePassword", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.UPDATE_ADMIN_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdminStatus", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.DELETE_ADMIN_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdmin", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.READ_ADMIN_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "admin", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.READ_ADMIN_USER]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "admins", null);
