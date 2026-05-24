import mongoose, { Document, Schema } from 'mongoose';

export interface IFeatureFlag extends Document {
  key: string;
  isEnabled: boolean;
  description?: string;
  updatedBy: mongoose.Types.ObjectId;
}

const featureFlagSchema = new Schema<IFeatureFlag>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeatureFlag = mongoose.model<IFeatureFlag>('FeatureFlag', featureFlagSchema);
export default FeatureFlag;
