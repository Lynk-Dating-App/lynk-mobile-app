import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import {ICardModel} from '../../models/Card';
import CardRepository from '../../repositories/CardRepository';

import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class CardDAOService implements ICrudDAO<ICardModel> {
  private cardRepository: CardRepository;

  constructor(cardRepository: CardRepository) {
    this.cardRepository = cardRepository
  }

  //@ts-ignore
  insertMany(records: ReadonlyArray<ICardModel>): Promise<ICardModel[]> {
    return this.cardRepository.bulkCreate(records)
  }

  create(values: ICardModel): Promise<ICardModel> {
    return this.cardRepository.save(values);
  }

  findAll(filter?: FilterQuery<ICardModel>, options?: QueryOptions): Promise<ICardModel[]> {
    return this.cardRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<ICardModel | null> {
    return this.cardRepository.findById(id, options);
  }

  findByIdPopulatePermissions(id: any, options?: QueryOptions): Promise<ICardModel | null> {
    return this.cardRepository.findByIdPopulatePermissions(id, options);
  }

  findByAnyPopulatePermissions(filter: FilterQuery<ICardModel>, options?: QueryOptions): Promise<ICardModel | null> {
    return this.cardRepository.findByAnyPopulatePermissions(filter, options);
  }

  findByAny(filter: FilterQuery<ICardModel>, options?: QueryOptions): Promise<ICardModel | null> {
    return this.cardRepository.findOne(filter, options);
  }

  update(update: UpdateQuery<ICardModel>, options: QueryOptions): Promise<ICardModel | null> {
    return this.cardRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<ICardModel>,
    update: UpdateQuery<ICardModel>,
    options?: QueryOptions
  ): Promise<ICardModel | null> {
    return this.cardRepository.updateByAny(filter, update, options)
  }

  deleteByAny(filter: FilterQuery<ICardModel>, options?: QueryOptions): Promise<void> {
    return this.cardRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.cardRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.cardRepository.deleteById(id, options);
  }

  exist(filter: FilterQuery<ICardModel>, options?: QueryOptions): Promise<boolean> {
    return this.cardRepository.exist(filter, options);
  }

}
