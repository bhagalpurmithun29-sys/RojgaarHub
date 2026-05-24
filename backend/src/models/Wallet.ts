import mongoose, { Document, Schema } from 'mongoose';

export interface IWalletTransaction {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  referenceId?: string; // bookingId or paymentId reference
  date: Date;
}

export interface IWithdrawRecord {
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bankAccountDetails?: string;
  requestedAt: Date;
  processedAt?: Date;
}

export interface IWallet extends Document {
  ownerId: mongoose.Types.ObjectId;
  balance: number;
  transactions: IWalletTransaction[];
  withdrawHistory: IWithdrawRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const walletTransactionSchema = new Schema<IWalletTransaction>({
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String, required: true },
  referenceId: { type: String },
  date: { type: Date, default: Date.now },
}, { _id: false });

const withdrawRecordSchema = new Schema<IWithdrawRecord>({
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', required: true },
  bankAccountDetails: { type: String },
  requestedAt: { type: Date, default: Date.now, required: true },
  processedAt: { type: Date },
}, { _id: false });

const walletSchema = new Schema<IWallet>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    transactions: [walletTransactionSchema],
    withdrawHistory: [withdrawRecordSchema],
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);
export default Wallet;
