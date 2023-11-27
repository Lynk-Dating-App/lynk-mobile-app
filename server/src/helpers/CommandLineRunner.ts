/**
 * This helper Class, executes commands in form of methods,we want to run at runtime.
 */

import fs from 'fs/promises';
import RoleRepository from '../repositories/RoleRepository';
import PermissionRepository from '../repositories/PermissionRepository';
import { appModelTypes } from '../@types/app-model';
import adminJson from '../resources/data/superAdmin.json';
import subscriptions from '../resources/data/subscription.json';
import UserRepository from '../repositories/AdminRepository';
import PasswordEncoder from '../utils/PasswordEncoder';
import axiosClient from '../services/api/axiosClient';
import Role from '../models/Role';
import Permission from '../models/Permission';
import AbstractCrudRepository = appModelTypes.AbstractCrudRepository;
import IPayStackBank = appModelTypes.IPayStackBank;
import settings, { MANAGE_ALL } from '../config/settings';
import { IAdminModel } from '../models/Admin';
import Generic from '../utils/Generic';
import { UPLOAD_BASE_PATH } from '../config/constants';
import SubscriptionRepository from '../repositories/SubscriptionRepository';
import Subscription from '../models/Subscription';

export default class CommandLineRunner {
  public static singleton: CommandLineRunner = new CommandLineRunner();
  private roleRepository: AbstractCrudRepository;
  private permissionRepository: AbstractCrudRepository;
  private userRepository: AbstractCrudRepository;
  private subscriptionRepository: AbstractCrudRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
    this.permissionRepository = new PermissionRepository();
    this.userRepository = new UserRepository();
    this.subscriptionRepository = new SubscriptionRepository();
  }

  public static async run() {
    await this.singleton.loadDefaultRolesAndPermissions();
    await this.singleton.loadDefaultSuperAdmin();
    await this.singleton.createUploadDirectory();
    await this.singleton.loadDefaultSubscription();
  }

  async createUploadDirectory() {
    const dirExist = await Generic.fileExist(UPLOAD_BASE_PATH);
    if (!dirExist) await fs.mkdir(UPLOAD_BASE_PATH);
  }

  async loadDefaultSuperAdmin() {
    const exist = await this.userRepository.findOne({
      slug: settings.roles[0]
    });

    if (exist) return;

    const passwordEncoder = new PasswordEncoder();

    Object.assign(adminJson, {
      password: await passwordEncoder.encode(<string>process.env.ADMIN_PASS),
      confirm_password: await passwordEncoder.encode(<string>process.env.ADMIN_PASS)
    });

    const user = (await this.userRepository.save(adminJson as any)) as IAdminModel;

    const role = await this.roleRepository.findOne({
      slug: settings.roles[0],
    });

    if (role) {
      user.role = role?.id;
      await user.save();
      //@ts-ignore
      role.users.push(user._id);
      await role.save();
    }
  }

  async loadDefaultRolesAndPermissions() {

    //create permissions
    for (const permissionName of settings.permissions) {
      const findPermission = await this.permissionRepository.findOne({
        name: permissionName
      });
      if(!findPermission) {
        await this.permissionRepository.save({
          //@ts-ignore
          name: permissionName,
          action: permissionName.split('_')[0],
          subject: permissionName.split('_')[1],
          inverted: true,
        });
      }
    }

    //create roles
    for (const roleName of settings.roles) {
      const findRole = await this.roleRepository.findOne({
        slug: roleName
      });

      if(!findRole) {
        await this.roleRepository.save({
          //@ts-ignore
          slug: `${roleName}`,
          name: `${roleName}`.replace(/_/g, ' '),
        });
      }
    }

    //vendor permission
    const vendorPermission = await this.permissionRepository.findAll({
      name: settings.permissions[1]
    });

    //super admin permissions
    const superAdminPermission = await this.permissionRepository.findAll({
      name: MANAGE_ALL
    });

    //get customer role
    const vendorRole = await this.roleRepository.findOne({
      slug: settings.roles[1]
    });

    //get super admin role
    const superAdminRole = await this.roleRepository.findOne({
      slug: settings.roles[0]
    });

    //associate roles to their respective permissions
    //@ts-ignore
    for(let perm of vendorPermission){
      //@ts-ignore
      if(!vendorRole?.permissions.includes(perm._id)){
        //@ts-ignore  
        vendorRole?.permissions.push(perm._id);
        await vendorRole?.save();
      }
    }
    for(let perm of superAdminPermission){
      //@ts-ignore
      if(!superAdminRole?.permissions.includes(perm._id)){
        //@ts-ignore  
        superAdminRole?.permissions.push(perm._id);
        await superAdminRole?.save();
      }
    }
  }

  async loadDefaultSubscription() {
    
    const fetchSubscriptions = await this.subscriptionRepository.findAll({})
    //@ts-ignore
    const existingSlugs = fetchSubscriptions.map(sub => sub.slug);

    for(let sub of subscriptions){
      if(!existingSlugs.includes(sub.slug)){
        
        await this.subscriptionRepository.save({
          name: sub.name,
          slug: sub.slug,
          price: sub.price,
          duration: sub.duration,
          durationUnit: sub.durationUnit
        } as any);
      }
    }

  }

}
