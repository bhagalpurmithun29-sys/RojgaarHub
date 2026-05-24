import mongoose, { Document, Schema } from 'mongoose';

export interface IDispute extends Document {
  bookingId: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  chatEvidence: string[];
  workPhotos: string[];
  timeline: string[];
  createdAt: Date;
  updatedAt: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'rejected'],
      default: 'pending',
      required: true,
      index: true,
    },
    chatEvidence: [
      {
        type: String,
      },
    ],
    workPhotos: [
      {
        type: String,
      },
    ],
    timeline: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Dispute = mongoose.model<IDispute>('Dispute', disputeSchema);
export default Dispute;
