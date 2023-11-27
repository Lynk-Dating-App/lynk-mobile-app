import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;
import {
    changeAdminPasswordHandler,
    createAdmin,
    deleteAdminHandler,
    getAdminHandler,
    getAdminsHandler,
    updateAdminHandler,
    updateAdminStatusHandler,
} from '../../routes/adminRoute';

const adminEndpoints: RouteEndpoints = [
    {
        name: 'admin',
        method: 'post',
        path: '/admin',
        handler: createAdmin
    },
    {
        name: 'update admin',
        method: 'put',
        path: '/admin-update/:adminId',
        handler: updateAdminHandler
    },
    {
        name: 'update admin status',
        method: 'put',
        path: '/admin-status-update/:adminId',
        handler: updateAdminStatusHandler
    },
    {
        name: 'delete admin',
        method: 'delete',
        path: '/delete-admin/:adminId',
        handler: deleteAdminHandler
    },
    {
        name: 'change admin password',
        method: 'put',
        path: '/change-admin-password/:adminId',
        handler: changeAdminPasswordHandler
    },
    {
        name: 'fetch admins',
        method: 'get',
        path: '/admins',
        handler: getAdminsHandler
    },
    {
        name: 'get admin',
        method: 'get',
        path: '/admin/:adminId',
        handler: getAdminHandler
    }
];

export default adminEndpoints;