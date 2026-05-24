import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemNotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'booking' | 'payment' | 'chat' | 'emergency' | 'reward' | 'system';
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const systemNotificationSchema = new Schema<ISystemNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['booking', 'payment', 'chat', 'emergency', 'reward', 'system'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

systemNotificationSchema.index({ createdAt: -1 });

const SystemNotification = mongoose.model<ISystemNotification>('SystemNotification', systemNotificationSchema);
export default SystemNotification;
