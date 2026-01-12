import mongoose from 'mongoose';

export interface IEvent extends mongoose.Document {
  title: string;
  description: string;
  image: string;
  date: Date;
  type: 'upcoming' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new mongoose.Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    type: {
      type: String,
      enum: ['upcoming', 'completed'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
EventSchema.index({ type: 1, date: -1 }); // For filtering by type and sorting by date
EventSchema.index({ date: -1 }); // For sorting all events by date

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
