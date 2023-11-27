import mongoose, { Document, Schema } from 'mongoose';

interface IPermission {
  name: string;
  action: string;
  subject: string;
  inverted: boolean;
}

const permissionSchema = new Schema<IPermission>({
  name: { type: String, required: true },
  action: { type: String },
  subject: { type: String },
  inverted: { type: Boolean }
});

export interface IPermissionModel extends IPermission, Document{}

const Permission = mongoose.model<IPermissionModel>('Permission', permissionSchema as any);

export default Permission;