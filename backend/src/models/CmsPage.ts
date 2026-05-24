import mongoose, { Document, Schema } from 'mongoose';

export interface ICmsPage extends Document {
  key: string;
  content: string;
  updatedBy: mongoose.Types.ObjectId;
}

const cmsPageSchema = new Schema<ICmsPage>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
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

const CmsPage = mongoose.model<ICmsPage>('CmsPage', cmsPageSchema);
export default CmsPage;
