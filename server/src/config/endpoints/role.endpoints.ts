import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import { createRole, deleteRoleHandler, fetchPermissionsHandler, getRoleHandler, getRolesHandler, updateRoleHandler } from '../../routes/roleRoute';

const roleEndpoints: RouteEndpoints = [
    {
        name: 'role',
        method: 'post',
        path: '/role',
        handler: createRole
    },
    {
        name: 'delete role',
        method: 'delete',
        path: '/role-delete/:roleId',
        handler: deleteRoleHandler
    },
    {
        name: 'update role',
        method: 'put',
        path: '/role-update/:roleId',
        handler: updateRoleHandler
    },
    {
        name: 'get roles',
        method: 'get',
        path: '/roles',
        handler: getRolesHandler
    },
    {
        name: 'get role',
        method: 'get',
        path: '/role/:roleId',
        handler: getRoleHandler
    },
    {
        name: 'fetch permissions',
        method: 'get',
        path: '/permissions',
        handler: fetchPermissionsHandler
    }
];

export default roleEndpoints;