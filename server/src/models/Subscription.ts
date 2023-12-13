import mongoose, { Document, Schema } from 'mongoose';

interface ISubscription {
  name: string;
  slug: string;
  price: string | '';
  duration: number | null;
  durationUnit: string | null; 
};

const subscriptionSchema = new Schema<ISubscription>({
  name: { type: String },
  slug: { type: String },
  price: { type: String, allowNull: true },
  duration: { type: Number, allowNull: true },
  durationUnit: { type: String, allowNull: true }
});

export interface ISubscriptionModel extends Document, ISubscription {}

const Subscription = mongoose.model<ISubscriptionModel>('Subscription', subscriptionSchema as any);

export default Subscription;


