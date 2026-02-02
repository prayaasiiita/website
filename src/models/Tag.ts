import mongoose from 'mongoose';

export interface ITag extends mongoose.Document {
  name: string;
  color: string; // hex color like #FFAA00
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new mongoose.Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    color: {
      type: String,
      required: [true, 'Tag color is required'],
      trim: true,
      match: /^#([0-9A-Fa-f]{6})$/, // hex color
    },
  },
  { timestamps: true }
);

TagSchema.index({ name: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
