import mongoose, { Document, Schema } from 'mongoose';

interface ISubscription {
  name: string;
  slug: string;
  price: number | null;
  duration: number | null;
  durationUnit: string | null; 
};

const subscriptionSchema = new Schema<ISubscription>({
  name: { type: String },
  slug: { type: String },
  price: { type: Number, allowNull: true },
  duration: { type: Number, allowNull: true },
  durationUnit: { type: String, allowNull: true }
});

export interface ISubscriptionModel extends Document, ISubscription {}

const Subscription = mongoose.model<ISubscriptionModel>('Subscription', subscriptionSchema as any);

export default Subscription;


