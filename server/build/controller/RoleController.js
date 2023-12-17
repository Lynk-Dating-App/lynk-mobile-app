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
const dao_1 = __importDefault(require("../services/dao"));
const Role_1 = require("../models/Role");
const joi_1 = __importDefault(require("joi"));
const Generic_1 = __importDefault(require("../utils/Generic"));
const settings_1 = __importStar(require("../config/settings"));
class RoleController {
    async createRole(req) {
        const role = await this.createRoleAndPermission(req);
        // const { permit } = req.body;
        // const role = await datasources.roleDAOService.create({ ...req.body });
        // for (const permissionName of permit) {
        //   const permission = await datasources.permissionDAOService.findByAny({ name: permissionName });
        //   if (permission) {
        //     role.permissions.push(permission._id);
        //   } else {
        //     // Handle the case when a permission is not found
        //     throw new Error(`Permission '${permissionName}' not found.`);
        //   }
        // }
        // await role.save();
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: role,
        };
        return Promise.resolve(response);
    }
    async deleteRole(req) {
        const roleId = req.params.roleId;
        const role = await dao_1.default.roleDAOService.findById(roleId);
        if (!role)
            Promise.reject(CustomAPIError_1.default.response('Role does not exist', HttpStatus_1.default.NOT_FOUND.code));
        await dao_1.default.roleDAOService.deleteById(roleId);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Role deleted successfully'
        };
        return Promise.resolve(response);
    }
    ;
    async getAllRoles(req) {
        const options = {
            slug: {
                $nin: [settings_1.default.roles[0], settings_1.default.roles[1]]
            }
        };
        const roles = await dao_1.default.roleDAOService.findAll(options);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            results: roles
        };
        return Promise.resolve(response);
    }
    ;
    async getRole(req) {
        const roleId = req.params.roleId;
        const role = await dao_1.default.roleDAOService.findById(roleId);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: HttpStatus_1.default.OK.value,
            result: role
        };
        return Promise.resolve(response);
    }
    ;
    async fetchPermissions(req) {
        const options = {
            name: { $ne: settings_1.MANAGE_ALL }
        };
        const permissions = await dao_1.default.permissionDAOService.findAll(options);
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: "Successfully saved permission.",
            results: permissions
        };
        return Promise.resolve(response);
    }
    ;
    async updateRole(req) {
        const roleId = req.params.roleId;
        const { error, value } = joi_1.default.object(Role_1.$updateRoleSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const exist_role = await dao_1.default.roleDAOService.findById(roleId);
        if (!exist_role)
            return Promise.reject(CustomAPIError_1.default.response('Role does not exist', HttpStatus_1.default.BAD_REQUEST.code));
        const role_name = await dao_1.default.roleDAOService.findByAny({
            name: value.name
        });
        if (value.name && exist_role.name !== value.name) {
            if (role_name) {
                return Promise.reject(CustomAPIError_1.default.response('Role with this name already exists', HttpStatus_1.default.NOT_FOUND.code));
            }
        }
        ;
        const roleValues = {
            ...value,
            slug: Generic_1.default.generateSlug(value.name)
        };
        const role = await dao_1.default.roleDAOService.updateByAny(
        //@ts-ignore
        { _id: exist_role?._id }, roleValues);
        //@ts-ignore
        for (const permissionName of value.permit) {
            const permission = await dao_1.default.permissionDAOService.findByAny({ name: permissionName });
            if (permission) {
                if (role?.permissions.includes(permission._id))
                    continue;
                role?.permissions.push(permission._id);
            }
            else {
                // Handle the case when a permission is not found
                return Promise.reject(CustomAPIError_1.default.response(`Permission not found.`, HttpStatus_1.default.NOT_FOUND.code));
            }
        }
        ;
        await role?.save();
        const response = {
            code: HttpStatus_1.default.OK.code,
            message: 'Role update successfully'
        };
        return Promise.resolve(response);
    }
    async createRoleAndPermission(req) {
        const { error, value } = joi_1.default.object(Role_1.$saveRoleSchema).validate(req.body);
        if (error)
            return Promise.reject(CustomAPIError_1.default.response(error.details[0].message, HttpStatus_1.default.BAD_REQUEST.code));
        const exist_role = await dao_1.default.roleDAOService.findByAny({ name: value.name });
        if (exist_role)
            return Promise.reject(CustomAPIError_1.default.response('Role name already exist', HttpStatus_1.default.BAD_REQUEST.code));
        const roleValues = {
            name: value.name,
            slug: Generic_1.default.generateSlug(value.name)
        };
        const role = await dao_1.default.roleDAOService.create(roleValues);
        //@ts-ignore
        for (const permissionName of value.permit) {
            const permission = await dao_1.default.permissionDAOService.findByAny({ name: permissionName });
            if (permission) {
                role.permissions.push(permission._id);
            }
            else {
                // Handle the case when a permission is not found
                throw new Error(`Permission '${permissionName}' not found.`);
            }
        }
        await role.save();
        return role;
    }
}
exports.default = RoleController;
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "createRole", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "deleteRole", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getAllRoles", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getRole", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL, settings_1.FETCH_PERMISSIONS]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "fetchPermissions", null);
__decorate([
    decorators_1.TryCatch,
    (0, decorators_1.HasPermission)([settings_1.MANAGE_ALL]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "updateRole", null);
