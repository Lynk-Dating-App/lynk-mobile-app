"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = exports.HasAnyAuthority = exports.HasAuthority = exports.HasAnyRole = exports.HasPlan = exports.HasPermission = exports.HasRole = void 0;
require("reflect-metadata");
const CustomAPIError_1 = __importDefault(require("../exceptions/CustomAPIError"));
const HttpStatus_1 = __importDefault(require("../helpers/HttpStatus"));
const errorResponse = CustomAPIError_1.default.response('Unauthorized access. Please contact system administrator', HttpStatus_1.default.FORBIDDEN.code);
/**
 * @description Specify role name to access resource
 * @description {@param role} must match name of role in the database
 * @name HasRole
 * @param role
 */
function HasRole(role) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (request) {
            //@ts-ignore
            const roles = request.user.role;
            const findRole = roles.find((item) => item.name === role);
            if (!findRole)
                return errorResponse;
            return method.apply(this, arguments);
        };
    };
}
exports.HasRole = HasRole;
/**
 *
 * @param authorizedPermission
 * @param userPermissions
 * @returns
 */
function HasPermission(authorizedPermission) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (request) {
            let isAuthorized = false;
            if (authorizedPermission.length === 0)
                isAuthorized = true;
            else
                request.permissions
                    .map(item => item.name)
                    .forEach(permission_name => {
                    if (authorizedPermission.includes(permission_name)) {
                        isAuthorized = true;
                    }
                });
            if (!isAuthorized)
                return Promise.reject(errorResponse);
            return method.apply(this, arguments);
        };
    };
}
exports.HasPermission = HasPermission;
function HasPlan(authorizedPlan) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (request) {
            let isAuthorized = false;
            if (authorizedPlan[0] === '*')
                isAuthorized = true;
            else
                for (let sub of request.subscription) {
                    if (authorizedPlan.includes(sub.plan)) {
                        isAuthorized = true;
                    }
                }
            if (!isAuthorized)
                return Promise.reject(errorResponse);
            return method.apply(this, arguments);
        };
    };
}
exports.HasPlan = HasPlan;
/**
 * @name HasAnyRole
 * @description Specify an array of role names to access resource
 * @description Role names must match at least one of the names in the database
 * @description If an asterisk * is supplied as the only element in the array,then all roles will be allowed to access resource.
 * @param roles {string[]}
 */
function HasAnyRole(roles) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (request) {
            if (roles[0] === '*')
                return method.apply(this, arguments);
            //@ts-ignore
            const _roles = request.user.role;
            if (_roles.length === 0)
                return errorResponse;
            for (const _role of _roles) {
                const match = roles.some(role => role === _role.name);
                if (!match)
                    return errorResponse;
            }
            return method.apply(this, arguments);
        };
    };
}
exports.HasAnyRole = HasAnyRole;
/**
 * @description Specify authority name to access resource
 * @name HasAuthority
 * @param authority
 */
function HasAuthority(authority) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (request) {
            const permissions = request.permissions;
            const findRole = permissions.find(item => item.name === authority);
            if (!findRole)
                return errorResponse;
            return method.apply(this, arguments);
        };
    };
}
exports.HasAuthority = HasAuthority;
/**
 * @name HasAnyAuthority
 * @description Specify an array of role names to access resource
 * @description Authority (Permission) names must match at least one of the names in the database
 * @description If an asterisk * is supplied as the only element in the array,then all authorities will be allowed to access resource.
 * @param authorities {string[]}
 */
function HasAnyAuthority(authorities) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (request) {
            if (authorities[0] === '*')
                return method.apply(this, arguments);
            const _permissions = request.permissions;
            if (_permissions.length === 0)
                return errorResponse;
            for (const authority of authorities) {
                const match = _permissions.some(permission => permission.name === authority);
                if (!match)
                    return errorResponse;
            }
            return method.apply(this, arguments);
        };
    };
}
exports.HasAnyAuthority = HasAnyAuthority;
function TryCatch(target, propertyKey, descriptor) {
    const method = descriptor.value;
    descriptor.value = function (request) {
        try {
            return method.apply(this, arguments);
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
}
exports.TryCatch = TryCatch;
