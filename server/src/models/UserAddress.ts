import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

interface IUserAddress {
    // address_type: string;
    address: string;
    street: string | null;
    country: string;
    state: string;
    district: string;
    favorite: boolean;
    user: mongoose.Types.ObjectId;
}

const userAddressSchema = new Schema<IUserAddress>({
    // address_type: { type: String },
    address: { type: String },
    street: { type: String, allowNull: true },
    country: { type: String },
    state: { type: String },
    district: { type: String },
    favorite: { type: Boolean },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

userAddressSchema.pre('findOne', function (next) {
    this.populate('user');
    next();
});

export interface IUserAddressModel extends Document, IUserAddress {}

const UserAddress = mongoose.model<IUserAddressModel>('UserAddress', userAddressSchema as any);

export const $saveUserAddress: Joi.SchemaMap = {
    address: Joi.string().required().label('address'),
    street: Joi.string().required().label('street'),
    country: Joi.string().required().label('country'),
    state: Joi.string().required().label('state'),
    district: Joi.string().required().label('district'),
};

export const $updateUserAddress: Joi.SchemaMap = {
    // address_type: Joi.string().label('address type'),
    address: Joi.string().label('address'),
    street: Joi.string().label('street'),
    country: Joi.string().label('country'),
    state: Joi.string().label('state'),
    district: Joi.string().label('district'),
};

export default UserAddress;