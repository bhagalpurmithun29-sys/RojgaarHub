import mongoose, { Document, Schema } from 'mongoose';

export interface IAbuseReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  reason: string;
  details?: string;
  createdAt: Date;
}

const abuseReportSchema = new Schema<IAbuseReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

abuseReportSchema.index({ createdAt: -1 });

const AbuseReport = mongoose.model<IAbuseReport>('AbuseReport', abuseReportSchema);
export default AbuseReport;
