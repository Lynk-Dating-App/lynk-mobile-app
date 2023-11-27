import CrudRepository from '../helpers/CrudRepository';
import { Model, Types } from 'mongoose';
import Subscription, { ISubscriptionModel } from '../models/Subscription';

export default class SubscriptionRepository extends CrudRepository<ISubscriptionModel, Types.ObjectId> {
  constructor() {
    super(Subscription as Model<ISubscriptionModel>);
  }
}