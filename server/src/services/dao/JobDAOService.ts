import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import {IJobModel} from '../../models/Job';
import JobRepository from '../../repositories/JobRepository';

import { appModelTypes } from '../../@types/app-model';
import ICrudDAO = appModelTypes.ICrudDAO;

export default class JobDAOService implements ICrudDAO<IJobModel> {
  private jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository
  }

  //@ts-ignore
  insertMany(records: ReadonlyArray<IJobModel>): Promise<IJobModel[]> {
    return this.jobRepository.bulkCreate(records)
  }

  create(values: IJobModel): Promise<IJobModel> {
    return this.jobRepository.save(values);
  }

  findAll(filter?: FilterQuery<IJobModel>, options?: QueryOptions): Promise<IJobModel[]> {
    return this.jobRepository.findAll(filter, options);
  }

  findById(id: any, options?: QueryOptions): Promise<IJobModel | null> {
    return this.jobRepository.findById(id, options);
  }

  findByIdPopulatePermissions(id: any, options?: QueryOptions): Promise<IJobModel | null> {
    return this.jobRepository.findByIdPopulatePermissions(id, options);
  }

  findByAnyPopulatePermissions(filter: FilterQuery<IJobModel>, options?: QueryOptions): Promise<IJobModel | null> {
    return this.jobRepository.findByAnyPopulatePermissions(filter, options);
  }

  findByAny(filter: FilterQuery<IJobModel>, options?: QueryOptions): Promise<IJobModel | null> {
    return this.jobRepository.findOne(filter, options);
  }

  update(update: UpdateQuery<IJobModel>, options: QueryOptions): Promise<IJobModel | null> {
    return this.jobRepository.update(update, { new: true, ...options });
  }

  updateByAny(
    filter: FilterQuery<IJobModel>,
    update: UpdateQuery<IJobModel>,
    options?: QueryOptions
  ): Promise<IJobModel | null> {
    return this.jobRepository.updateByAny(filter, update, options)
  }

  deleteByAny(filter: FilterQuery<IJobModel>, options?: QueryOptions): Promise<void> {
    return this.jobRepository.deleteByAny(filter, options);
  }

  deleteAll(options?: QueryOptions): Promise<void> {
    return this.jobRepository.deleteAll(options);
  }

  deleteById(id: any, options?: QueryOptions): Promise<void> {
    return this.jobRepository.deleteById(id, options);
  }

  exist(filter: FilterQuery<IJobModel>, options?: QueryOptions): Promise<boolean> {
    return this.jobRepository.exist(filter, options);
  }

}
