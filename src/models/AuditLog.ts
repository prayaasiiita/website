import mongoose from 'mongoose';

// Type definitions for audit logging
export type AuditAction =
    | 'login'
    | 'logout'
    | 'create'
    | 'update'
    | 'delete'
    | 'upload'
    | 'password_change'
    | 'password_reset_request'
    | 'password_reset_complete'
    | 'bulk_operation'
    | 'unauthorized_access'
    | 'api_error'
    | 'form_submission'
    | 'security_event';

export type ActorType = 'admin' | 'user' | 'system' | 'anonymous';
export type Severity = 'info' | 'warning' | 'error' | 'critical';

export interface IAuditLog extends mongoose.Document {
    action: AuditAction;
    resource: string;
    resourceId?: string;
    adminId: string;
    adminEmail: string;
    actorType: ActorType;
    severity: Severity;
    requestId?: string;
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
    metadata?: Record<string, unknown>;
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
            'bulk_operation',
            'unauthorized_access',
            'api_error',
            'form_submission',
            'security_event'
        ]
    },
    resource: {
        type: String,
        required: true,
        // e.g., 'volunteer', 'event', 'team', 'gallery', 'content', 'auth', 'contact_form'
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
    actorType: {
        type: String,
        enum: ['admin', 'user', 'system', 'anonymous'],
        default: 'admin',
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'error', 'critical'],
        default: 'info',
    },
    requestId: {
        type: String,
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
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        // Additional context-specific data
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

// New compound indexes for common filter combinations
AuditLogSchema.index({ resource: 1, action: 1, timestamp: -1 });
AuditLogSchema.index({ status: 1, timestamp: -1 });
AuditLogSchema.index({ severity: 1, timestamp: -1 });
AuditLogSchema.index({ actorType: 1, timestamp: -1 });

// TTL index - automatically delete logs older than 90 days (configurable)
AuditLogSchema.index(
    { timestamp: 1 },
    { expireAfterSeconds: 90 * 24 * 60 * 60 } // 90 days
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
