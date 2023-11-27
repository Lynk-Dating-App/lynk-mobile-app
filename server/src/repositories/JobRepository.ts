import { Model, Types } from 'mongoose';
import Job, { IJobModel } from '../models/Job';
import CrudRepository from '../helpers/CrudRepository';

export default class JobRepository extends CrudRepository<IJobModel, Types.ObjectId> {
  constructor() {
    super(Job as Model<IJobModel>);
  }
}