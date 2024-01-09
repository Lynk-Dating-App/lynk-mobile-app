import { Model, Types } from 'mongoose';
import Card, {ICardModel} from '../models/Card';
import CrudRepository from '../helpers/CrudRepository';

export default class CardRepository extends CrudRepository<ICardModel, Types.ObjectId> {
  constructor() {
    super(Card as Model<ICardModel>);
  }
}