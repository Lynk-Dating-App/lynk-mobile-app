import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import {IVerifiedKeyModel} from '../../models/VerifiedKey';
import VerifiedKeyRepository from '../../repositories/VerifiedKeyRepository';

import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class UserDAOService implements ICrudDAO<IVerifiedKeyModel> {
  private verifiedKeyRepository: VerifiedKeyRepository;

  constructor(verifiedKeyRepository: VerifiedKeyRepository) {
    this.verifiedKeyRepository = verifiedKeyRepository
  }

  //@ts-ignore
  insertMany(records: ReadonlyArray<IVerifiedKeyModel>): Promise<IVerifiedKeyModel[]> {
    return this.verifiedKeyRepository.bulkCreate(records)
  }

  create(values: IVerifiedKeyModel): Promise<IVerifiedKeyModel> {
    return this.verifiedKeyRepository.save(values);
  }

  findAll(filter?: FilterQuery<IVerifiedKeyModel>, options?: QueryOptions): Promise<IVerifiedKeyModel[]> {
    return this.verifiedKeyRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<IVerifiedKeyModel | null> {
    return this.verifiedKeyRepository.findById(id, options);
  }

  findByAny(filter: FilterQuery<IVerifiedKeyModel>, options?: QueryOptions): Promise<IVerifiedKeyModel | null> {
    return this.verifiedKeyRepository.findOne(filter, options);
  }

  update(update: UpdateQuery<IVerifiedKeyModel>, options: QueryOptions): Promise<IVerifiedKeyModel | null> {
    return this.verifiedKeyRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<IVerifiedKeyModel>,
    update: UpdateQuery<IVerifiedKeyModel>,
    options?: QueryOptions
  ): Promise<IVerifiedKeyModel | null> {
    return this.verifiedKeyRepository.updateByAny(filter, update, options)
  }

  deleteByAny(filter: FilterQuery<IVerifiedKeyModel>, options?: QueryOptions): Promise<void> {
    return this.verifiedKeyRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.verifiedKeyRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.verifiedKeyRepository.deleteById(id, options);
  }

  exist(filter: FilterQuery<IVerifiedKeyModel>, options?: QueryOptions): Promise<boolean> {
    return this.verifiedKeyRepository.exist(filter, options);
  }

}
