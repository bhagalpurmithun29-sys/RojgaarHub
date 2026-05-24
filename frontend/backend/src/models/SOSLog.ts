import mongoose, { Document, Schema } from 'mongoose';

export interface ISOSLog extends Document {
  userId: mongoose.Types.ObjectId;
  coordinates: {
    lat: number;
    lng: number;
  };
  emergencyContacts: string[];
  status: 'active' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const sosLogSchema = new Schema<ISOSLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    emergencyContacts: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

sosLogSchema.index({ createdAt: -1 });

const SOSLog = mongoose.model<ISOSLog>('SOSLog', sosLogSchema);
export default SOSLog;
