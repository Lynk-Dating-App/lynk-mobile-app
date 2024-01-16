import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import {IWaitlistModel} from '../../models/Waitlist';
import WaitlistRepository from '../../repositories/WaitlistRepository';

import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class UserDAOService implements ICrudDAO<IWaitlistModel> {
  private waitlistRepository: WaitlistRepository;

  constructor(waitlistRepository: WaitlistRepository) {
    this.waitlistRepository = waitlistRepository
  }

  //@ts-ignore
  insertMany(records: ReadonlyArray<IWaitlistModel>): Promise<IWaitlistModel[]> {
    return this.waitlistRepository.bulkCreate(records)
  }

  create(values: IWaitlistModel): Promise<IWaitlistModel> {
    return this.waitlistRepository.save(values);
  }

  findAll(filter?: FilterQuery<IWaitlistModel>, options?: QueryOptions): Promise<IWaitlistModel[]> {
    return this.waitlistRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<IWaitlistModel | null> {
    return this.waitlistRepository.findById(id, options);
  }

  findByAny(filter: FilterQuery<IWaitlistModel>, options?: QueryOptions): Promise<IWaitlistModel | null> {
    return this.waitlistRepository.findOne(filter, options);
  }

  update(update: UpdateQuery<IWaitlistModel>, options: QueryOptions): Promise<IWaitlistModel | null> {
    return this.waitlistRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<IWaitlistModel>,
    update: UpdateQuery<IWaitlistModel>,
    options?: QueryOptions
  ): Promise<IWaitlistModel | null> {
    return this.waitlistRepository.updateByAny(filter, update, options)
  }

  deleteByAny(filter: FilterQuery<IWaitlistModel>, options?: QueryOptions): Promise<void> {
    return this.waitlistRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.waitlistRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.waitlistRepository.deleteById(id, options);
  }

  exist(filter: FilterQuery<IWaitlistModel>, options?: QueryOptions): Promise<boolean> {
    return this.waitlistRepository.exist(filter, options);
  }

}
