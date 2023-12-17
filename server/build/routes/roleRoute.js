"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPermissionsHandler = exports.getRoleHandler = exports.getRolesHandler = exports.updateRoleHandler = exports.deleteRoleHandler = exports.createRole = void 0;
const RoleController_1 = __importDefault(require("../controller/RoleController"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const roleController = new RoleController_1.default();
exports.createRole = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await roleController.createRole(req);
    res.status(response.code).json(response);
});
exports.deleteRoleHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await roleController.deleteRole(req);
    res.status(response.code).json(response);
});
exports.updateRoleHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await roleController.updateRole(req);
    res.status(response.code).json(response);
});
exports.getRolesHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await roleController.getAllRoles(req);
    res.status(response.code).json(response);
});
exports.getRoleHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await roleController.getRole(req);
    res.status(response.code).json(response);
});
exports.fetchPermissionsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await roleController.fetchPermissions(req);
    res.status(response.code).json(response);
});
