import mongoose from 'mongoose';

export interface IGallery extends mongoose.Document {
  title: string;
  image: string;
  alt: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new mongoose.Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    alt: {
      type: String,
      required: [true, 'Alt text is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
