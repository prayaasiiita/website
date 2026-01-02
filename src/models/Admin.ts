import mongoose from 'mongoose';

export interface IAdmin extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastPasswordChange?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    resetPasswordToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    lastPasswordChange: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
