import CrudRepository from '../helpers/CrudRepository';
import { Model, Types } from 'mongoose';
import User, { IAdminModel } from '../models/Admin';

export default class AdminRepository extends CrudRepository<IAdminModel, Types.ObjectId> {
  constructor() {
    super(User as Model<IAdminModel>);
  }
}
