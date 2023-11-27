import { Request } from 'express';
import { HasPermission, TryCatch } from '../decorators';
import HttpStatus from '../helpers/HttpStatus';
import CustomAPIError from '../exceptions/CustomAPIError';
import Admin, { $changePassword, $saveAdminSchema, $updateAdminSchema, IAdminModel } from '../models/Admin';
import datasources from  '../services/dao';
import { appCommonTypes } from '../@types/app-common';
import Joi from 'joi';

import HttpResponse = appCommonTypes.HttpResponse;
import BcryptPasswordEncoder = appCommonTypes.BcryptPasswordEncoder;
import settings, { CREATE_ADMIN_USER, DELETE_ADMIN_USER, MANAGE_ALL, READ_ADMIN_USER, UPDATE_ADMIN_USER } from '../config/settings';
import Generic from '../utils/Generic';

export default class AdminController {
  private declare readonly passwordEncoder: BcryptPasswordEncoder;

  constructor(passwordEncoder: BcryptPasswordEncoder) {
    this.passwordEncoder = passwordEncoder;
  }


    @TryCatch
    @HasPermission([MANAGE_ALL, CREATE_ADMIN_USER])
    public async createAdmin (req: Request) {
      const admin = await this.doCreateAdmin(req);

      const response: HttpResponse<IAdminModel> = {
          code: HttpStatus.OK.code,
          message: HttpStatus.OK.value,
          result: admin,
        };
    
      return Promise.resolve(response);
    };

      /**
   * @name updateAdmin
   * @param req
   * @desc Updates the admin
   * only admins with manage_all or update_admin permission
   * can do this 
   */
  @TryCatch
  @HasPermission([MANAGE_ALL, UPDATE_ADMIN_USER])
  public async updateAdmin (req: Request) {
      const customer = await this.doUpdateAdmin(req);

      const response: HttpResponse<any> = {
          code: HttpStatus.OK.code,
          message: 'Successfully updated',
          result: customer
      };
    
      return Promise.resolve(response);
  };

  /*
  * @name changePassword
  * @param req
  * @desc Changes admin password
  * only admins with manage all permission and update admin
  * permission can do this 
  */
  @TryCatch
  @HasPermission([MANAGE_ALL, UPDATE_ADMIN_USER])
  public  async changePassword (req: Request) {
    const admin = await this.doChangePassword(req);

    const response: HttpResponse<IAdminModel> = {
      code: HttpStatus.OK.code,
      message: "Successful",
      result: admin,
    };
  
    return Promise.resolve(response);
  };

    /**
   * @name updateAdminStatus
   * @param req
   * @desc Updates the admin status
   * only admin with super admin manage all and update admin
   * permission can do this 
   */
  @TryCatch
  @HasPermission([MANAGE_ALL, UPDATE_ADMIN_USER])
  public  async updateAdminStatus (req: Request) {
    const admin = await this.doUpdateAdminStatus(req);

    const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: 'Successfully updated status'
    };
  
    return Promise.resolve(response);
  };
  
  /**
   * @name deleteAdmin
   * @param req
   * @desc deletes the admin
   * only admin with super admin manage all and delete admin
   * permission can do this 
   */
  @TryCatch
  @HasPermission([MANAGE_ALL, DELETE_ADMIN_USER])
  public  async deleteAdmin (req: Request) {
    const admin = await this.doDeleteAdmin(req);

    const response: HttpResponse<any> = {
        code: HttpStatus.OK.code,
        message: 'Successfully deleted'
    };
  
    return Promise.resolve(response);
  };
  
  /**
   * @name admin
   * @param req
   * @desc Gets a single admin
   * only admin with super admin manage all and read admin
   * permission can do this 
   */
  @TryCatch
  @HasPermission([MANAGE_ALL, READ_ADMIN_USER])
  public  async admin (req: Request) {
    const adminId = req.params.adminId;
    
    const admin = await datasources.adminDAOService.findById(adminId);
    if(!admin) return Promise.reject(CustomAPIError.response(`Admin with Id: ${adminId} does not exist`, HttpStatus.BAD_REQUEST.code));

    const response: HttpResponse<IAdminModel> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        result: admin,
    };
  
    return Promise.resolve(response);
  };
  
  /**
   * @name admins
   * @param req
   * @desc Gets all admins, its also search and retrieves 
   * admins according to admin first name, last name and status
   * only admins with super admin manage all and read admin
   * permission can do this 
   */
  @TryCatch
  @HasPermission([MANAGE_ALL, READ_ADMIN_USER])
  public  async admins (req: Request) {

    const role = await datasources.roleDAOService.findByAny({
      slug: settings.roles[0]
    })
    const superAdminUser = await datasources.adminDAOService.findByAny({
      role: role?.id
    })

    const options = {
        sort: { createdAt: -1 },
        role: { $ne: superAdminUser?.role }
    };

    const admins = await datasources.adminDAOService.findAll(options);

    if(!admins) return Promise.reject(CustomAPIError.response('No admin is available at this time', HttpStatus.BAD_REQUEST.code));

    const response: HttpResponse<IAdminModel> = {
        code: HttpStatus.OK.code,
        message: HttpStatus.OK.value,
        results: admins,
    };
  
    return Promise.resolve(response);
  };

  private async doCreateAdmin(req: Request){
    const { error, value } = Joi.object<IAdminModel>($saveAdminSchema).validate(req.body);

    if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    
    const role = await datasources.roleDAOService.findByAny({
      slug: Generic.generateSlug(value.roleName)
    });
    if(!role) return Promise.reject(CustomAPIError.response('Role not found', HttpStatus.BAD_REQUEST.code));
    if((role.slug === settings.roles[0])) return Promise.reject(CustomAPIError.response('Super admin admin already exist', HttpStatus.BAD_REQUEST.code));

    const email = await datasources.adminDAOService.findByAny({email: value.email});
    if(email) return Promise.reject(CustomAPIError.response('Email already in use', HttpStatus.BAD_REQUEST.code));

    const phone = await datasources.adminDAOService.findByAny({email: value.email});
    if(phone) return Promise.reject(CustomAPIError.response('Phone number already in use', HttpStatus.BAD_REQUEST.code));

    const password = await this.passwordEncoder.encode(value.password)
    
    const adminValues: Partial<IAdminModel> = {
      ...value,
      role: role._id,
      active: true,
      password: password
    };

    const admin = await datasources.adminDAOService.create(adminValues as IAdminModel);

    role.users.push(admin._id);
    await role.save();

    return admin;
  };

  private async doUpdateAdmin(req: Request){

      const adminId = req.params.adminId;
  
      const { error, value } = Joi.object<IAdminModel>($updateAdminSchema).validate(req.body);
  
      if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
      
      const admin = await datasources.adminDAOService.findById(adminId);
      if(!admin) return Promise.reject(CustomAPIError.response('Admin not found', HttpStatus.NOT_FOUND.code));
  
      const admin_email = await datasources.adminDAOService.findByAny({
          email: value.email
      });
  
      if(value.email && admin.email !== value.email){
          if(admin_email) {
            return Promise.reject(CustomAPIError.response('Admin with this email already exists', HttpStatus.NOT_FOUND.code))
          }
      };
  
      const admin_phone = await datasources.adminDAOService.findByAny({
        phone: value.phone
      });
  
      if(value.phone && admin.phone !== value.phone){
          if(admin_phone) {
            return Promise.reject(CustomAPIError.response('Admin with this phone number already exists', HttpStatus.NOT_FOUND.code))
          }
      };
  
      const adminValues: Partial<IAdminModel> = {
        ...value
      };
  
      const _admin = await datasources.adminDAOService.updateByAny(
        {_id: admin._id},
        adminValues
      );
  
      return _admin;
  };

  private async doChangePassword(req: Request) {
      const adminId = req.params.adminId;
      
      const { error, value } = Joi.object<IAdminModel>($changePassword).validate(req.body);

      if(error) return Promise.reject(CustomAPIError.response(error.details[0].message, HttpStatus.BAD_REQUEST.code));
    
      const admin = await datasources.adminDAOService.findById(adminId);
      if(!admin) return Promise.reject(CustomAPIError.response('Admin not found', HttpStatus.BAD_REQUEST.code));
  
      const hash = admin.password as string;
      const password = value.previousPassword;

      const isMatch = await this.passwordEncoder.match(password.trim(), hash.trim());
      if(!isMatch) return Promise.reject(CustomAPIError.response('Password in the database differ from the password entered as current password', HttpStatus.UNAUTHORIZED.code));

      const _password = await this.passwordEncoder.encode(value.password as string);

      const adminValues = {
        password: _password
      };

      const updated = await datasources.adminDAOService.updateByAny(
        {_id: adminId},
        adminValues
      );

      return updated;

  };

  private async doUpdateAdminStatus(req: Request) {
    const adminId = req.params.adminId;

    const admin = await datasources.adminDAOService.findById(adminId);
    if(!admin) return Promise.reject(CustomAPIError.response('Admin not found', HttpStatus.BAD_REQUEST.code));

    const updateAdmin = await datasources.adminDAOService.update(
        {_id: adminId},
        {active: !admin.active}
    );

    return updateAdmin;

  };

  private async doDeleteAdmin(req: Request) {
    const adminId = req.params.adminId;

    return await datasources.adminDAOService.deleteById(adminId);

  };
  
}