import { Request, Response } from "express";
import AdminController from "../controller/AdminController";
import PasswordEncoder from "../utils/PasswordEncoder";
import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";

const passwordEncoder = new PasswordEncoder();
const adminController = new AdminController(passwordEncoder);

export const createAdmin = authenticateRouteWrapper(async (req: Request, res: Response) => {
    const response = await adminController.createAdmin(req);
    res.status(response.code).json(response);
});

export const updateAdminHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await adminController.updateAdmin(req);

    res.status(response.code).json(response);
});

export const updateAdminStatusHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await adminController.updateAdminStatus(req);

    res.status(response.code).json(response);
});

export const deleteAdminHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await adminController.deleteAdmin(req);

    res.status(response.code).json(response);
});

export const getAdminHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await adminController.admin(req);

    res.status(response.code).json(response);
});

export const getAdminsHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await adminController.admins(req);

    res.status(response.code).json(response);
});

export const changeAdminPasswordHandler = authenticateRouteWrapper( async (req, res) =>  {
    const response = await adminController.changePassword(req);

    res.status(response.code).json(response);
});