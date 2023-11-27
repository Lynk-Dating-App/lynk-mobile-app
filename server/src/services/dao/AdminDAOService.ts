import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import User, {IAdminModel} from '../../models/Admin';
import AdminRepository from '../../repositories/AdminRepository';

import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class UserDAOService implements ICrudDAO<IAdminModel> {
  private adminRepository: AdminRepository;

  constructor(adminRepository: AdminRepository) {
    this.adminRepository = adminRepository
  }

  //@ts-ignore
  insertMany(records: ReadonlyArray<IAdminModel>): Promise<IAdminModel[]> {
    return this.adminRepository.bulkCreate(records)
  }

  create(values: IAdminModel): Promise<IAdminModel> {
    return this.adminRepository.save(values);
  }

  findAll(filter?: FilterQuery<IAdminModel>, options?: QueryOptions): Promise<IAdminModel[]> {
    return this.adminRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<IAdminModel | null> {
    return this.adminRepository.findById(id, options);
  }

  findByAny(filter: FilterQuery<IAdminModel>, options?: QueryOptions): Promise<IAdminModel | null> {
    return this.adminRepository.findOne(filter, options);
  }

  update(update: UpdateQuery<IAdminModel>, options: QueryOptions): Promise<IAdminModel | null> {
    return this.adminRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<IAdminModel>,
    update: UpdateQuery<IAdminModel>,
    options?: QueryOptions
  ): Promise<IAdminModel | null> {
    return this.adminRepository.updateByAny(filter, update, options)
  }

  deleteByAny(filter: FilterQuery<IAdminModel>, options?: QueryOptions): Promise<void> {
    return this.adminRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.adminRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.adminRepository.deleteById(id, options);
  }

  exist(filter: FilterQuery<IAdminModel>, options?: QueryOptions): Promise<boolean> {
    return this.adminRepository.exist(filter, options);
  }

}
