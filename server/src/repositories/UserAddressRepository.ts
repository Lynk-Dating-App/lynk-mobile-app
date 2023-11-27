import CrudRepository from '../helpers/CrudRepository';
import { Model, Types } from 'mongoose';
import UserAddress, { IUserAddressModel } from '../models/UserAddress';

export default class UserAddressRepository extends CrudRepository<IUserAddressModel, Types.ObjectId> {
  constructor() {
    super(UserAddress as Model<IUserAddressModel>);
  }
}