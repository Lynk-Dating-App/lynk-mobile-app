import mongoose, { Document, Schema } from 'mongoose';

interface ITransactions {
    reference: string,
    channel: string,
    cardType: string,
    bank: string,
    last4: string,
    expMonth: string,
    expYear: string,
    contryCode: string,
    brand: string,
    currency: string,
    amount: string,
    status: string,
    authorizationCode: string,
    type: string,
    paidAt: Date,
    user: mongoose.Types.ObjectId;
};

const transactionSchema = new Schema<ITransactions>({
    reference: { type: String },
    channel: { type: String },
    cardType: { type: String },
    bank: { type: String },
    last4: { type: String },
    expMonth: { type: String },
    expYear: { type: String },
    contryCode: { type: String },
    brand: { type: String },
    currency: { type: String },
    amount: { type: String },
    status: { type: String },
    authorizationCode: { type: String },
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