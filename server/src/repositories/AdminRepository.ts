import CrudRepository from '../helpers/CrudRepository';
import { Model, Types } from 'mongoose';
import Admin, { IAdminModel } from '../models/Admin';

export default class AdminRepository extends CrudRepository<IAdminModel, Types.ObjectId> {
  constructor() {
    super(Admin as Model<IAdminModel>);
  }
}
