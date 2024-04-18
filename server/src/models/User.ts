import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

interface IUser {
  firstName: string;
  lastName: string;
  password: string | null;
  email: string | null;
  address: string | null;
  phone: string;
  gender: string;
  profileImageUrl: string | null;
  active: boolean | null;
  loginToken: string | null;
  loginDate: Date | null;
  role: mongoose.Types.ObjectId;
  passwordResetCode: string;
  createdAt: Date;
  updatedAt: Date;
  currentPassword: string;
  googleId: string | null;
  instagramId: string | null;
  facebookId: string | null;
  isExpired: boolean;
  subscription: {
    plan: string | null,
    startDate: Date | null,
    endDate: Date | null
  },
  confirmPassword: string,
  verify: string,
  profileVisibility: boolean,
  planType: string,
  jobType: string,
  jobDescription: string | null,
  about: string | null,
  height: string | null,
  age: string,
  state: string,
  preference: {
    pAbout: string | null,
    pMinAge: string | null,
    pMaxAge: string | null,
    // pState: string | null,
    pMinHeight: string | null,
    pMaxHeight: string | null,
    pGender: string | null,
  },
  level: number,
  videoUrl: string | null,
  videoUploadedAt: Date | null
  likedUsers: mongoose.Types.ObjectId[];
  likedByUsers: mongoose.Types.ObjectId[];
  favourites: mongoose.Types.ObjectId[];
  unLikedUsers: [
    {
      date: Date;
      user: mongoose.Types.ObjectId[];
    }
  ];
  location: {
    type: "Point",
    coordinates: [number, number]
  },
  gallery: string[],
  build: string | null,
  interests: string[],
  dob: Date,
  publicKey: string | null,
  education: string | null,
  religion: string | null,
  religiousInvolvement: string | null,
  relationshipPreference: string | null,
  personalityTemperament: string | null,
  officeName: string | null,
  officeAddress: string | null,
  socialHandles: [{
    handle: string,
    social: string
  }] | null,
  sexualPreference: string | null,
  authorizationCode: string | null,
  autoRenewal: boolean,
  rewindCount: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String, allowNull: true },
  email: { type: String, allowNull: true },
  address: { type: String, allowNull: true },
  phone: { type: String },
  gender: { type: String },
  profileImageUrl: { type: String, allowNull: true },
  active: { type: Boolean, allowNull: true },
  loginToken: { type: String, allowNull: true },
  loginDate: { type: Date, allowNull: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  passwordResetCode: { type: String, allowNull: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  googleId: { type: String, allowNull: true },
  instagramId: { type: String, allowNull: true },
  facebookId: { type: String, allowNull: true },
  verify: { type: String },
  profileVisibility: { type: Boolean, default: true },
  planType: { type: String },
  isExpired: { type: Boolean, default: false },
  subscription: {
    plan: { type: String, allowNull: true },
    startDate: { type: Date, allowNull: true },
    endDate: { type: Date, allowNull: true }
  },
  jobType: { type: String },
  jobDescription: { type: String },
  about: { type: String, allowNull: true },
  height: { type: String, allowNull: true },
  age: { type: String },
  state: { type: String },
  preference: {
    pAbout: { type: String, allowNull: true },
    pMinAge: { type: String, allowNull: true },
    pMaxAge: { type: String, allowNull: true },
    // pState: { type: String, allowNull: true },
    pMinHeight: { type: String, allowNull: true },
    pMaxHeight: { type: String, allowNull: true },
    pGender: { type: String, allowNull: true }
  },
  level: { type: Number, default: 0 },
  videoUrl: { type: String, allowNull: true },
  videoUploadedAt: { type: Date, allowNull: true },
  likedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likedByUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  favourites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  unLikedUsers: [{ date: {type: Date}, user: {type: Schema.Types.ObjectId, ref: 'User' }}],
  location: {
    type: {
        type: String,
        enum: ['Point'], // Only allow 'Point' as the type
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [-1, -1]
      }
  },
  gallery: [{ type: String }],
  interests: [{ type: String, allowNull: true }],
  build: { type: String, allowNull: true },
  dob: { type: Date },
  publicKey: { type: String, allowNull: true },
  education: {type: String, allowNull: true},
  religion: {type: String, allowNull: true},
  religiousInvolvement: {type: String, allowNull: true},
  relationshipPreference: {type: String, allowNull: true},
  personalityTemperament: {type: String, allowNull: true},
  officeName: {type: String, allowNull: true},
  officeAddress: {type: String, allowNull: true},
  socialHandles: [{
    handle: {type: String, allowNull: true},
    social: {type: String, allowNull: true}
  }],
  sexualPreference: {type: String, allowNull: true},
  authorizationCode: { type: String, allowNull: true },
  autoRenewal: { type: Boolean, default: false },
  rewindCount: { type: String }
});

userSchema.index({ location: '2dsphere' });

export interface IUserModel extends Document, IUser {}

const User = mongoose.model<IUserModel>('User', userSchema as any);

export const $changePassword: Joi.SchemaMap = {
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
    .messages({
      'string.pattern.base': `Password does not meet requirements.`,
    })
    .required()
    .label('password'),
  confirmPassword: Joi.ref("password"),
  currentPassword: Joi.string().required().label('previous password')
};

export const $resetPassword: Joi.SchemaMap = {
  phone: Joi.string().required().label('phone')
};

export const $savePasswordAfterReset: Joi.SchemaMap = {
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
    .messages({
      'string.pattern.base': `Password does not meet requirements.`,
    })
    .required()
    .label('password'),
  confirmPassword: Joi.ref("password"),
  phone: Joi.string().required().label('phone')
};

export const $savePassword: Joi.SchemaMap = {
  email: Joi.string().required().label('email'),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
    .messages({
      'string.pattern.base': `Password does not meet requirements.`,
    })
    .required()
    .label('password'),
  confirmPassword: Joi.ref("password"),
  token: Joi.string().required().label("token")
};

export const $saveUserSchema: Joi.SchemaMap = {
  // firstName: Joi.string().required().label('first name'),
  // lastName: Joi.string().required().label('last name'),
  email: Joi.string().required().label('email'),
  password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
    .messages({
      'string.pattern.base': `Password does not meet requirements.`,
    })
    .required()
    .label('password'),
  confirmPassword: Joi.ref('password'),
  // gender: Joi.string().required().label('gender'),
  phone: Joi.string().required().label('phone Number'),
  // profileImageUrl: Joi.string().optional().label("profile image")
};

export const $updateUserSchema: Joi.SchemaMap = {
  firstName: Joi.string().label('first name'),
  lastName: Joi.string().label('last name'),
  about: Joi.string().label('about'),
  height: Joi.string().label('height'),
  state: Joi.string().label('state'),
  // dob: Joi.date().label('Dob'),
  address: Joi.string().allow('').label('address'),
  officeName: Joi.string().allow('').label('officeName'),
  officeAddress: Joi.string().allow('').label('officeAddress'),
  religion: Joi.string().allow('').label('religion'),
  religiousInvolvement: Joi.string().allow('').label('religiousInvolvement'),
  interests: Joi.any().label('interests'),
  sexualPreference: Joi.string().allow('').label('sexualPreference'),
  relationshipPreference: Joi.string().allow('').label('relationshipPreference'),
  personalityTemperament: Joi.string().allow('').label('personalityTemperament'),
  education: Joi.string().allow('').label('education'),
  email: Joi.string().label('email'),
  phone: Joi.string().label('phone')
};

export const $updateJobDescription: Joi.SchemaMap = {
  jobType: Joi.string().required().label('job type'),
  jobDescription: Joi.string().required().label('job description')
}

export const $loginSchema: Joi.SchemaMap = {
    emailOrPhone: Joi.string().required().label('email or phone'),
    password: Joi.string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/)
    .messages({
      'string.pattern.base': `Password does not meet requirements.`,
    })
    .required()
    .label('password'),
}

export default User;
