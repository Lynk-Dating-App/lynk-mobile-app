import mongoose, { Document, Schema } from 'mongoose';

interface INotification {
    notification: string;
    senderId: string | null;
    image: string | null;
    name: string | null;
    age: string | null;
    status: boolean;
    user: mongoose.Types.ObjectId;
    message: string | null
};

const notificationSchema = new Schema<INotification>({
    notification: { type: String },
    message: { type: String, allowNull: true },
    senderId: { type: String, allowNull: true },
    image: { type: String, allowNull: true },
    name: { type: String, allowNull: true },
    age: { type: String, allowNull: true },
    status: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

notificationSchema.pre('findOne', function (next) {
    this.populate({
      path: 'user',
      select: '_id firstName lastName profileImageUrl age state address'
    });
    next();
});

export interface INotificationModel extends Document, INotification {}

const Notification = mongoose.model<INotificationModel>('Notification', notificationSchema as any);

export default Notification;
