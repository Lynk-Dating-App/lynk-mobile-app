"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminRoute_1 = require("../../routes/adminRoute");
const adminEndpoints = [
    {
        name: 'admin',
        method: 'post',
        path: '/admin',
        handler: adminRoute_1.createAdmin
    },
    {
        name: 'update admin',
        method: 'put',
        path: '/admin-update/:adminId',
        handler: adminRoute_1.updateAdminHandler
    },
    {
        name: 'update admin status',
        method: 'put',
        path: '/admin-status-update/:adminId',
        handler: adminRoute_1.updateAdminStatusHandler
    },
    {
        name: 'delete admin',
        method: 'delete',
        path: '/delete-admin/:adminId',
        handler: adminRoute_1.deleteAdminHandler
    },
    {
        name: 'change admin password',
        method: 'put',
        path: '/change-admin-password/:adminId',
        handler: adminRoute_1.changeAdminPasswordHandler
    },
    {
        name: 'fetch admins',
        method: 'get',
        path: '/admins',
        handler: adminRoute_1.getAdminsHandler
    },
    {
        name: 'get admin',
        method: 'get',
        path: '/admin/:adminId',
        handler: adminRoute_1.getAdminHandler
    }
];
exports.default = adminEndpoints;
