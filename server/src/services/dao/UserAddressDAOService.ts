import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { IUserAddressModel } from '../../models/UserAddress';
import UserAddressRepository from '../../repositories/UserAddressRepository';

import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class UserAddressDAOService implements ICrudDAO<IUserAddressModel> {
  private userAddressRepository: UserAddressRepository;

  constructor(userAddressRepository: UserAddressRepository) {
    this.userAddressRepository = userAddressRepository
  }

  //@ts-ignore
  insertMany(records: ReadonlyArray<IUserAddressModel>): Promise<IUserAddressModel[]> {
    return this.userAddressRepository.bulkCreate(records)
  }

  create(values: IUserAddressModel): Promise<IUserAddressModel> {
    return this.userAddressRepository.save(values);
  }

  findAll(filter?: FilterQuery<IUserAddressModel>, options?: QueryOptions): Promise<IUserAddressModel[]> {
    return this.userAddressRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<IUserAddressModel | null> {
    return this.userAddressRepository.findById(id, options);
  }

  findByAny(filter: FilterQuery<IUserAddressModel>, options?: QueryOptions): Promise<IUserAddressModel | null> {
    return this.userAddressRepository.findOne(filter, options);
  }

  update(update: UpdateQuery<IUserAddressModel>, options: QueryOptions): Promise<IUserAddressModel | null> {
    return this.userAddressRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<IUserAddressModel>,
    update: UpdateQuery<IUserAddressModel>,
    options?: QueryOptions
  ): Promise<IUserAddressModel | null> {
    return this.userAddressRepository.updateByAny(filter, update, options)
  }

  deleteByAny(filter: FilterQuery<IUserAddressModel>, options?: QueryOptions): Promise<void> {
    return this.userAddressRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.userAddressRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.userAddressRepository.deleteById(id, options);
  }

  exist(filter: FilterQuery<IUserAddressModel>, options?: QueryOptions): Promise<boolean> {
    return this.userAddressRepository.exist(filter, options);
  }

}
