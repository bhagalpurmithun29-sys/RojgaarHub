import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  content: string;
  messageType: 'text' | 'image' | 'document' | 'voice_note' | 'work_photo';
  mediaUrl?: string;
  read: boolean;
  deletedForSender: boolean;
  deletedForEveryone: boolean;
  isSpam: boolean;
  spamScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'document', 'voice_note', 'work_photo'],
      default: 'text',
      required: true,
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
    deletedForSender: {
      type: Boolean,
      default: false,
    },
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
    spamScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
