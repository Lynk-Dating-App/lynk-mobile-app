import mongoose, { Document, Schema } from 'mongoose';

interface ITransactions {
    reference: string,
    amount: string,
    status: string,
    message: string,
    type: string,
    paidAt: Date,
    user: mongoose.Types.ObjectId;
};

const transactionSchema = new Schema<ITransactions>({
    reference: { type: String },
    amount: { type: String },
    status: { type: String },
    message: { type: String },
    type: { type: String },
    paidAt: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

transactionSchema.pre('findOne', function (next) {
    this.populate('user');
    next();
});
  
export interface ITransactionModel extends Document, ITransactions {}
  
const Transaction = mongoose.model<ITransactionModel>('Transaction', transactionSchema as any);

export default Transaction