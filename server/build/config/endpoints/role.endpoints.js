"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleRoute_1 = require("../../routes/roleRoute");
const roleEndpoints = [
    {
        name: 'role',
        method: 'post',
        path: '/role',
        handler: roleRoute_1.createRole
    },
    {
        name: 'delete role',
        method: 'delete',
        path: '/role-delete/:roleId',
        handler: roleRoute_1.deleteRoleHandler
    },
    {
        name: 'update role',
        method: 'put',
        path: '/role-update/:roleId',
        handler: roleRoute_1.updateRoleHandler
    },
    {
        name: 'get roles',
        method: 'get',
        path: '/roles',
        handler: roleRoute_1.getRolesHandler
    },
    {
        name: 'get role',
        method: 'get',
        path: '/role/:roleId',
        handler: roleRoute_1.getRoleHandler
    },
    {
        name: 'fetch permissions',
        method: 'get',
        path: '/permissions',
        handler: roleRoute_1.fetchPermissionsHandler
    }
];
exports.default = roleEndpoints;
