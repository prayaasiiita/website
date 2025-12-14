import mongoose from 'mongoose';

export interface IContent extends mongoose.Document {
  section: string;
  key: string;
  value: string;
  type: 'text' | 'number' | 'html' | 'image' | 'array';
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new mongoose.Schema<IContent>(
  {
    section: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'number', 'html', 'image', 'array'],
      default: 'text',
    },
  },
  {
    timestamps: true,
  }
);

ContentSchema.index({ section: 1, key: 1 }, { unique: true });

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
