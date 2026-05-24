import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockList extends Document {
  blockerId: mongoose.Types.ObjectId;
  blockedId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const blockListSchema = new Schema<IBlockList>(
  {
    blockerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blockedId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent duplicate blocking entries
blockListSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

const BlockList = mongoose.model<IBlockList>('BlockList', blockListSchema);
export default BlockList;
