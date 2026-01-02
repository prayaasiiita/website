import mongoose from 'mongoose';

export interface IAuditLog extends mongoose.Document {
    action: string;
    resource: string;
    resourceId?: string;
    adminId: string;
    adminEmail: string;
    ipAddress: string;
    userAgent?: string;
    location?: string;
    geoLocation?: {
        city?: string;
        region?: string;
        country?: string;
        countryCode?: string;
        timezone?: string;
        lat?: number;
        lon?: number;
    };
    changes?: {
        before?: unknown;
        after?: unknown;
    };
    status: 'success' | 'failure';
    errorMessage?: string;
    timestamp: Date;
}

const AuditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'login',
            'logout',
            'create',
            'update',
            'delete',
            'upload',
            'password_change',
            'password_reset_request',
            'password_reset_complete',
            'bulk_operation'
        ]
    },
    resource: {
        type: String,
        required: true,
        // e.g., 'volunteer', 'event', 'team', 'gallery', 'content', 'auth'
    },
    resourceId: {
        type: String,
        // ObjectId or identifier of the affected resource
    },
    adminId: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
    },
    location: {
        type: String,
        // URL path where the action occurred
    },
    geoLocation: {
        city: String,
        region: String,
        country: String,
        countryCode: String,
        timezone: String,
        lat: Number,
        lon: Number,
    },
    changes: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['success', 'failure'],
        default: 'success',
    },
    errorMessage: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

// Index for efficient querying
AuditLogSchema.index({ adminId: 1, timestamp: -1 });
AuditLogSchema.index({ resource: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

// TTL index - automatically delete logs older than 90 days (configurable)
AuditLogSchema.index(
    { timestamp: 1 },
    { expireAfterSeconds: 90 * 24 * 60 * 60 } // 90 days
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
