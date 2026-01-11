import mongoose, { Schema, Types } from 'mongoose';

export type EmpowermentStatus = 'draft' | 'published';

export interface IEmpowerment extends mongoose.Document {
  title: string;
  shortDescription: string;
  content?: string; // markdown or html
  coverImageUrl?: string;
  coverImageAlt?: string;
  tags: Types.ObjectId[];
  status: EmpowermentStatus;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmpowermentSchema = new Schema<IEmpowerment>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 160,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    coverImageAlt: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Empowerment || mongoose.model<IEmpowerment>('Empowerment', EmpowermentSchema);
