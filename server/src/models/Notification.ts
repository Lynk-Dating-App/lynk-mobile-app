import mongoose, { Document, Schema } from 'mongoose';

interface INotification {
    notification: string;
    status: boolean;
    user: mongoose.Types.ObjectId;
    dateCreated: Date
};

const notificationSchema = new Schema<INotification>({
    notification: { type: String },
    status: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: Date }
});

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
