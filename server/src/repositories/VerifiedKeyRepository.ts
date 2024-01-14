import CrudRepository from '../helpers/CrudRepository';
import { Model, Types } from 'mongoose';
import VerifiedKey, { IVerifiedKeyModel } from '../models/VerifiedKey';

export default class VerifiedKeyRepository extends CrudRepository<IVerifiedKeyModel, Types.ObjectId> {
  constructor() {
    super(VerifiedKey as Model<IVerifiedKeyModel>);
  }
}
