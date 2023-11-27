import mongoose, { Document, Schema } from 'mongoose';

interface IUserToken {
    token: string;
    expired_at: Date;
    userId: mongoose.Types.ObjectId;
};

const userToken = new Schema<IUserToken>({
    token: { type: String },
    expired_at: { type: Date },
    userId: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export interface IUserTokenModel extends Document, IUserToken {}

const UserToken = mongoose.model<IUserTokenModel>('UserToken', userToken as any);

export default UserToken;