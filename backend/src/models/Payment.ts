import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  amount: number;
  platformFee: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  refundStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'wallet', // cash, wallet, razorpay, etc.
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
      index: true,
    },
    refundStatus: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for ultra-fast transaction analytics querying
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
