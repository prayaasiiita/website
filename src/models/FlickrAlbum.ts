import mongoose from 'mongoose';

// Approval status for albums
export type AlbumStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface IFlickrAlbum extends mongoose.Document {
  // Flickr metadata
  flickrId: string;
  title: string;
  description?: string;
  coverPhotoUrl: string;
  coverPhotoId: string;
  photoCount: number;
  flickrOwner: string;
  flickrUrl: string;
  dateCreated: Date;
  dateUpdated: Date;

  // Approval workflow
  status: AlbumStatus;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;

  // Display settings
  displayOrder: number;
  customTitle?: string;
  customDescription?: string;

  // Sync metadata
  lastSyncedAt: Date;
  syncHash: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const FlickrAlbumSchema = new mongoose.Schema<IFlickrAlbum>(
  {
    flickrId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverPhotoUrl: {
      type: String,
      required: true,
    },
    coverPhotoId: {
      type: String,
      required: true,
    },
    photoCount: {
      type: Number,
      default: 0,
    },
    flickrOwner: {
      type: String,
      required: true,
    },
    flickrUrl: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
    },
    dateUpdated: {
      type: Date,
    },

    // Approval workflow
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'hidden'],
      default: 'pending',
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },

    // Display settings
    displayOrder: {
      type: Number,
      default: 0,
    },
    customTitle: {
      type: String,
      trim: true,
    },
    customDescription: {
      type: String,
      trim: true,
    },

    // Sync metadata
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
    syncHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
FlickrAlbumSchema.index({ status: 1, displayOrder: 1 });
FlickrAlbumSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.FlickrAlbum || mongoose.model<IFlickrAlbum>('FlickrAlbum', FlickrAlbumSchema);
