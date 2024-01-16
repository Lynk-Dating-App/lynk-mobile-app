import mongoose, { Document, Schema } from 'mongoose';

interface IWaitlist {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const waitlistSchema = new Schema<IWaitlist>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
});

export interface IWaitlistModel extends Document, IWaitlist {}

const Waitlist = mongoose.model<IWaitlistModel>('Waitlist', waitlistSchema as any);

export default Waitlist;
