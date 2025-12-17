import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember {
  _id?: string;
  name: string;
  role: string;
  rollNo?: string;
  image: string;
  email: string;
  linkedin: string;
  order: number;
  isVisible: boolean;
}

export interface ITeamGroup extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
  type: 'leadership' | 'faculty' | 'student';
  members: ITeamMember[];
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Member role is required'],
      trim: true,
    },
    rollNo: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    linkedin: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const TeamGroupSchema = new Schema<ITeamGroup>(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['leadership', 'faculty', 'student'],
      default: 'student',
    },
    members: [TeamMemberSchema],
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
TeamGroupSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export default mongoose.models.TeamGroup || mongoose.model<ITeamGroup>('TeamGroup', TeamGroupSchema);
