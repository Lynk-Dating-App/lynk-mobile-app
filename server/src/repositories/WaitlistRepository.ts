import CrudRepository from '../helpers/CrudRepository';
import { Model, Types } from 'mongoose';
import Waitlist, { IWaitlistModel } from '../models/Waitlist';

export default class WaitlistRepository extends CrudRepository<IWaitlistModel, Types.ObjectId> {
  constructor() {
    super(Waitlist as Model<IWaitlistModel>);
  }
}
