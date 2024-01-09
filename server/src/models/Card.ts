import mongoose, { Document, Schema } from 'mongoose';

interface ICard {
  cvv: string;
  expiryDate: string;
  cardNumber: string;
  cardName: string;
  default: boolean;
  user: mongoose.Types.ObjectId;
  cardType: string;
};

const cardSchema = new Schema<ICard>({
  cvv: { type: String },
  expiryDate: { type: String },
  cardNumber: { type: String },
  cardName: { type: String },
  default: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  cardType: { type: String }
});

export interface ICardModel extends Document, ICard {}

const Card = mongoose.model<ICardModel>('Card', cardSchema as any);

export default Card;