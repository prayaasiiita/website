import mongoose from 'mongoose';

export interface IVolunteer extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  interests: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema = new mongoose.Schema<IVolunteer>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    interests: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Volunteer || mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);
