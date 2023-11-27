import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

interface IAdmin {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  active: boolean | null;
  loginToken: string | null;
  loginDate: Date | null;
  role: mongoose.Types.ObjectId;
  // slug: string | null;
  roleName: string;
  previousPassword: string;
}

const adminSchema = new Schema<IAdmin>({
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  email: { type: String },
  phone: { type: String },
  active: { type: Boolean, allowNull: true },
  loginToken: { type: String, allowNull: true },
  loginDate: { type: Date, allowNull: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  // slug: { type: String, allowNull: true }
});

adminSchema.pre('find', function (next) {
  this.populate({
    path: 'role',
    select: '_id name slug permissions'
  });
  next();
});

export interface IAdminModel extends Document, IAdmin {}

const Admin = mongoose.model<IAdminModel>('Admin', adminSchema as any);

export const $saveAdminSchema: Joi.SchemaMap = {
  firstName: Joi.string().required().label('firstName'),
  lastName: Joi.string().required().label('lastName'),
  email: Joi.string().required().label('email'),
  phone: Joi.string().required().label('phone'),
  password: Joi.string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=\S+$)[A-Za-z\d]{8,20}$/)
    .messages({
      'string.pattern.base': `Password does not meet requirements.`,
    })
    .required()
    .label('password'),
  confirmPassword: Joi.ref('password'),
  roleName: Joi.string().required().label('role name'),
};

export const $updateAdminSchema: Joi.SchemaMap = {
  firstName: Joi.string().label('firstName'),
  lastName: Joi.string().label('lastName'),
  email: Joi.string().label('email'),
  gender: Joi.string().label('gender'),
  phone: Joi.string().label('phone'),
};

export const $loginSchema: Joi.SchemaMap = {
  email: Joi.string().required().label('email'),
  password: Joi.string()
  .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=\S+$)[A-Za-z\d]{8,20}$/)
  .messages({
    'string.pattern.base': `Password does not meet requirements.`,
  })
  .required()
  .label('password')
};

export const $changePassword: Joi.SchemaMap = {
  password: Joi.string()
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=\S+$)[A-Za-z\d]{8,20}$/)
    .messages({
      'string.pattern.base': `Password does not meet requirements.`,
    })
    .required()
    .label('password'),
  confirmPassword: Joi.ref("password"),
  previousPassword: Joi.string().required().label('previous password')
};

export default Admin;
