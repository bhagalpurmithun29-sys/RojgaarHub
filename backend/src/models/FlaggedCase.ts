import mongoose, { Document, Schema } from 'mongoose';

export interface IFlaggedCase extends Document {
  userId: mongoose.Types.ObjectId;
  module: 'fake_account' | 'spam' | 'fraud';
  riskLevel: 'Low' | 'Medium' | 'High';
  reason: string;
  status: 'flagged' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const flaggedCaseSchema = new Schema<IFlaggedCase>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    module: {
      type: String,
      enum: ['fake_account', 'spam', 'fraud'],
      required: true,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['flagged', 'reviewed', 'resolved'],
      default: 'flagged',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

flaggedCaseSchema.index({ createdAt: -1 });

const FlaggedCase = mongoose.model<IFlaggedCase>('FlaggedCase', flaggedCaseSchema);
export default FlaggedCase;
