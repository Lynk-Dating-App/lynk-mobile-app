import mongoose, { Document, Schema } from 'mongoose';

interface IVerifiedKey {
    status: boolean,
    name: string,
    key: string,
    slug: string
}

const verifiedKeySchema = new Schema<IVerifiedKey>({
    status: { type: Boolean, default: true },
    name: { type: String },
    key: { type: String },
    slug: { type: String }
});

export interface IVerifiedKeyModel extends Document, IVerifiedKey {}
const IVerifiedKey = mongoose.model<IVerifiedKeyModel>('IVerifiedKey', verifiedKeySchema as any);

export default IVerifiedKey;
