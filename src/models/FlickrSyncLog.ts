import mongoose from 'mongoose';

export type SyncStatus = 'running' | 'success' | 'failed';
export type SyncTrigger = 'manual' | 'system';

export interface IFlickrSyncLog extends mongoose.Document {
    startedAt: Date;
    completedAt?: Date;
    status: SyncStatus;
    triggeredBy: SyncTrigger;
    triggeredByAdmin?: mongoose.Types.ObjectId;
    triggeredByEmail?: string;

    // Sync results
    albumsFound: number;
    albumsAdded: number;
    albumsUpdated: number;
    albumsUnchanged: number;

    // Error tracking
    errorMessage?: string;
    errorStack?: string;

    // Duration in milliseconds
    duration?: number;
}

const FlickrSyncLogSchema = new mongoose.Schema<IFlickrSyncLog>(
    {
        startedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['running', 'success', 'failed'],
            default: 'running',
            index: true,
        },
        triggeredBy: {
            type: String,
            enum: ['manual', 'system'],
            required: true,
        },
        triggeredByAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
        triggeredByEmail: {
            type: String,
        },

        // Sync results
        albumsFound: {
            type: Number,
            default: 0,
        },
        albumsAdded: {
            type: Number,
            default: 0,
        },
        albumsUpdated: {
            type: Number,
            default: 0,
        },
        albumsUnchanged: {
            type: Number,
            default: 0,
        },

        // Error tracking
        errorMessage: {
            type: String,
        },
        errorStack: {
            type: String,
        },

        // Duration
        duration: {
            type: Number,
        },
    },
    {
        timestamps: false, // We manage our own timestamps
    }
);

// Index for querying recent syncs
FlickrSyncLogSchema.index({ startedAt: -1 });
FlickrSyncLogSchema.index({ status: 1, startedAt: -1 });

// TTL index - auto-delete logs older than 30 days
FlickrSyncLogSchema.index(
    { startedAt: 1 },
    { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

export default mongoose.models.FlickrSyncLog || mongoose.model<IFlickrSyncLog>('FlickrSyncLog', FlickrSyncLogSchema);
