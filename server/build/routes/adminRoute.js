"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAdminPasswordHandler = exports.getAdminsHandler = exports.getAdminHandler = exports.deleteAdminHandler = exports.updateAdminStatusHandler = exports.updateAdminHandler = exports.createAdmin = void 0;
const AdminController_1 = __importDefault(require("../controller/AdminController"));
const PasswordEncoder_1 = __importDefault(require("../utils/PasswordEncoder"));
const authenticateRouteWrapper_1 = __importDefault(require("../middleware/authenticateRouteWrapper"));
const passwordEncoder = new PasswordEncoder_1.default();
const adminController = new AdminController_1.default(passwordEncoder);
exports.createAdmin = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await adminController.createAdmin(req);
    res.status(response.code).json(response);
});
exports.updateAdminHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await adminController.updateAdmin(req);
    res.status(response.code).json(response);
});
exports.updateAdminStatusHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await adminController.updateAdminStatus(req);
    res.status(response.code).json(response);
});
exports.deleteAdminHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await adminController.deleteAdmin(req);
    res.status(response.code).json(response);
});
exports.getAdminHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await adminController.admin(req);
    res.status(response.code).json(response);
});
exports.getAdminsHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await adminController.admins(req);
    res.status(response.code).json(response);
});
exports.changeAdminPasswordHandler = (0, authenticateRouteWrapper_1.default)(async (req, res) => {
    const response = await adminController.changePassword(req);
    res.status(response.code).json(response);
});
