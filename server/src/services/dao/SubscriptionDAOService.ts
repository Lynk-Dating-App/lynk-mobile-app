import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import {ISubscriptionModel} from '../../models/Subscription';
import SubscriptionRepository from '../../repositories/SubscriptionRepository';

import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class SubscriptionDAOService implements ICrudDAO<ISubscriptionModel> {
  private subscriptionRepository: SubscriptionRepository;

  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository
  }

  //@ts-ignore
  insertMany(records: ReadonlyArray<ISubscriptionModel>): Promise<ISubscriptionModel[]> {
    return this.subscriptionRepository.bulkCreate(records)
  }

  create(values: ISubscriptionModel): Promise<ISubscriptionModel> {
    return this.subscriptionRepository.save(values);
  }

  findAll(filter?: FilterQuery<ISubscriptionModel>, options?: QueryOptions): Promise<ISubscriptionModel[]> {
    return this.subscriptionRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<ISubscriptionModel | null> {
    return this.subscriptionRepository.findById(id, options);
  }

  findByAny(filter: FilterQuery<ISubscriptionModel>, options?: QueryOptions): Promise<ISubscriptionModel | null> {
    return this.subscriptionRepository.findOne(filter, options);
  }

  update(update: UpdateQuery<ISubscriptionModel>, options: QueryOptions): Promise<ISubscriptionModel | null> {
    return this.subscriptionRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<ISubscriptionModel>,
    update: UpdateQuery<ISubscriptionModel>,
    options?: QueryOptions
  ): Promise<ISubscriptionModel | null> {
    return this.subscriptionRepository.updateByAny(filter, update, options)
  }

  deleteByAny(filter: FilterQuery<ISubscriptionModel>, options?: QueryOptions): Promise<void> {
    return this.subscriptionRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.subscriptionRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.subscriptionRepository.deleteById(id, options);
  }

  exist(filter: FilterQuery<ISubscriptionModel>, options?: QueryOptions): Promise<boolean> {
    return this.subscriptionRepository.exist(filter, options);
  }

}
