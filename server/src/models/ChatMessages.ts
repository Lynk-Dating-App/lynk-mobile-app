import mongoose, { Document, Schema } from 'mongoose';

interface IChatMessage {
    senderId: string;
    receiverId: string;
    status: string;
    message: string;
    dateCreated: Date;
};

const chatMessageSchema = new Schema<IChatMessage>({
    senderId: { type: String },
    receiverId: { type: String },
    status: { type: String },
    message: { type: String },
    dateCreated: { type: Date }
});

export interface IChatMessageModel extends Document, IChatMessage {}

const ChatMessage = mongoose.model<IChatMessageModel>('ChatMessage', chatMessageSchema as any);

export default ChatMessage;