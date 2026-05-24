import mongoose, { Document, Schema } from 'mongoose';

export interface IOtpSession extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  isLocked: boolean;
  lockUntil?: Date;
  createdAt: Date;
}

const otpSessionSchema = new Schema<IOtpSession>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
      required: true,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically remove expired OTP sessions after 30 minutes to keep collection clean
otpSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

const OtpSession = mongoose.model<IOtpSession>('OtpSession', otpSessionSchema);
export default OtpSession;
