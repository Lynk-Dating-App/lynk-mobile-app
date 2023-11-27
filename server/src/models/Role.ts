import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

interface IRole {
  name: string;
  slug: string;
  permit: string[],
  permissions: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
};

const roleSchema = new Schema<IRole>({
  name: { type: String },
  slug: { type: String },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

roleSchema.pre('find', function (next) {
  this.populate('permissions');
  next();
});

export interface IRoleModel extends Document, IRole {}

const Role = mongoose.model<IRoleModel>('Role', roleSchema as any);

export const $saveRoleSchema: Joi.SchemaMap<IRoleModel> = {
  name: Joi.string().required().label('name'),
  slug: Joi.string().optional().label('slug'),
  permit: Joi.array().required().label('permit'),
  permissions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()).optional().label('permissions')
};

export const $updateRoleSchema: Joi.SchemaMap<IRoleModel> = {
  // _id: Joi.string().required().label('roleId'),
  permit: Joi.array().required().label('permit'),
  name: Joi.string().required().label('name')
  // permissions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()).required().label('permissions')
};

export default Role;


