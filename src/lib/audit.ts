import { NextRequest } from 'next/server';
import AuditLog, { AuditAction, ActorType, Severity } from '@/src/models/AuditLog';
import { JWTPayload } from './auth';
import dbConnect from './mongodb';

/**
 * Actor information - can be admin, user, or anonymous
 */
export interface AuditActor {
    userId: string;
    username?: string;
    email: string;
    role?: string;
}

export interface AuditLogParams {
    action: AuditAction;
    resource: string;
    resourceId?: string;
    admin?: JWTPayload | AuditActor;
    actorType?: ActorType;
    severity?: Severity;
    request?: NextRequest;
    requestId?: string;
    ipAddress?: string;
    userAgent?: string;
    changes?: {
        before?: unknown;
        after?: unknown;
    };
    metadata?: Record<string, unknown>;
    status?: 'success' | 'failure';
    errorMessage?: string;
}

/**
 * Extract request metadata (IP, user agent, location)
 */
function extractRequestMetadata(request?: NextRequest): {
    ipAddress: string;
    userAgent?: string;
    location?: string;
} {
    if (!request) {
        return { ipAddress: 'unknown' };
    }

    const ipAddress =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const userAgent = request.headers.get('user-agent') || undefined;

    const url = new URL(request.url);
    const location = url.pathname + (url.search || '');

    return { ipAddress, userAgent, location };
}

/**
 * Fetch geolocation data asynchronously (non-blocking)
 * Returns null if lookup fails or IP is local
 */
async function fetchGeolocation(ipAddress: string): Promise<{
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    timezone?: string;
    lat?: number;
    lon?: number;
} | null> {
    try {
        if (ipAddress === 'unknown' || ipAddress === '::1' || ipAddress === '127.0.0.1') {
            return null;
        }

        const geoResponse = await fetch(
            `http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,region,city,timezone,lat,lon`,
            { signal: AbortSignal.timeout(3000) } // 3 second timeout
        );

        if (!geoResponse.ok) {
            return null;
        }

        const geoData = await geoResponse.json();
        if (geoData.status !== 'success') {
            return null;
        }

        return {
            city: geoData.city,
            region: geoData.region,
            country: geoData.country,
            countryCode: geoData.countryCode,
            timezone: geoData.timezone,
            lat: geoData.lat,
            lon: geoData.lon,
        };
    } catch {
        // Geolocation is optional, silently fail
        return null;
    }
}

/**
 * Sanitize changes object to remove sensitive fields
 */
function sanitizeChanges(changes?: { before?: unknown; after?: unknown }) {
    if (!changes) return undefined;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'apiSecret', 'resetPasswordToken'];

    const sanitize = (obj: unknown): unknown => {
        if (!obj || typeof obj !== 'object') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => sanitize(item));
        }

        const sanitized: Record<string, unknown> = { ...obj as Record<string, unknown> };

        for (const key in sanitized) {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                sanitized[key] = '[REDACTED]';
            } else if (typeof sanitized[key] === 'object') {
                sanitized[key] = sanitize(sanitized[key]);
            }
        }

        return sanitized;
    };

    return {
        before: sanitize(changes.before),
        after: sanitize(changes.after),
    };
}

/**
 * Create an audit log entry (non-blocking)
 * Uses setImmediate to ensure it doesn't block the response
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
    // Execute asynchronously to not block the main response
    setImmediate(async () => {
        try {
            const {
                action,
                resource,
                resourceId,
                admin,
                actorType = 'admin',
                severity = 'info',
                request,
                requestId,
                changes,
                metadata,
                status = 'success',
                errorMessage,
            } = params;

            // Extract request metadata
            const requestMeta = extractRequestMetadata(request);
            const ipAddress = params.ipAddress || requestMeta.ipAddress;
            const userAgent = params.userAgent || requestMeta.userAgent;

            // Sanitize changes
            const sanitizedChanges = sanitizeChanges(changes);

            // Connect to database
            await dbConnect();

            // Create the log entry first (without geolocation)
            const logEntry = await AuditLog.create({
                action,
                resource,
                resourceId,
                adminId: admin?.userId || 'anonymous',
                adminEmail: admin?.email || 'anonymous',
                actorType,
                severity,
                requestId,
                ipAddress,
                userAgent,
                location: requestMeta.location,
                changes: sanitizedChanges,
                metadata,
                status,
                errorMessage,
                timestamp: new Date(),
            });

            // Fetch geolocation asynchronously and update the log
            fetchGeolocation(ipAddress).then(async (geoLocation) => {
                if (geoLocation && logEntry._id) {
                    try {
                        await AuditLog.updateOne(
                            { _id: logEntry._id },
                            { $set: { geoLocation } }
                        );
                    } catch (geoErr) {
                        console.warn('Failed to update geolocation:', geoErr);
                    }
                }
            }).catch(() => {
                // Silently ignore geolocation errors
            });

        } catch (error) {
            // Don't let audit logging failures break the main operation
            console.error('Failed to create audit log:', error);
        }
    });
}

/**
 * Create audit log synchronously (for cases where you need to await)
 * Use sparingly - prefer createAuditLog for most cases
 */
export async function createAuditLogSync(params: AuditLogParams): Promise<void> {
    try {
        const {
            action,
            resource,
            resourceId,
            admin,
            actorType = 'admin',
            severity = 'info',
            request,
            requestId,
            changes,
            metadata,
            status = 'success',
            errorMessage,
        } = params;

        const requestMeta = extractRequestMetadata(request);
        const ipAddress = params.ipAddress || requestMeta.ipAddress;
        const userAgent = params.userAgent || requestMeta.userAgent;

        const sanitizedChanges = sanitizeChanges(changes);

        await dbConnect();

        await AuditLog.create({
            action,
            resource,
            resourceId,
            adminId: admin?.userId || 'anonymous',
            adminEmail: admin?.email || 'anonymous',
            actorType,
            severity,
            requestId,
            ipAddress,
            userAgent,
            location: requestMeta.location,
            changes: sanitizedChanges,
            metadata,
            status,
            errorMessage,
            timestamp: new Date(),
        });

    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
}

/**
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs(filters: {
    adminId?: string;
    resource?: string;
    action?: string;
    actorType?: string;
    severity?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
}) {
    const query: Record<string, unknown> = {};

    if (filters.adminId) query.adminId = filters.adminId;
    if (filters.resource) query.resource = filters.resource;
    if (filters.action) query.action = filters.action;
    if (filters.actorType) query.actorType = filters.actorType;
    if (filters.severity) query.severity = filters.severity;
    if (filters.status) query.status = filters.status;

    if (filters.startDate || filters.endDate) {
        query.timestamp = {} as Record<string, Date>;
        if (filters.startDate) (query.timestamp as Record<string, Date>).$gte = filters.startDate;
        if (filters.endDate) (query.timestamp as Record<string, Date>).$lte = filters.endDate;
    }

    const logs = await AuditLog
        .find(query)
        .sort({ timestamp: -1 })
        .limit(filters.limit || 100)
        .skip(filters.skip || 0)
        .lean();

    const total = await AuditLog.countDocuments(query);

    return {
        logs,
        total,
        page: Math.floor((filters.skip || 0) / (filters.limit || 100)) + 1,
        totalPages: Math.ceil(total / (filters.limit || 100)),
    };
}

/**
 * Get recent activity for a specific admin
 */
export async function getAdminActivity(adminId: string, limit: number = 10) {
    return await AuditLog
        .find({ adminId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
}

/**
 * Get recent activity for a specific resource
 */
export async function getResourceActivity(resource: string, resourceId: string, limit: number = 10) {
    return await AuditLog
        .find({ resource, resourceId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
}

/**
 * Get security events (for monitoring)
 */
export async function getSecurityEvents(limit: number = 50) {
    return await AuditLog
        .find({
            $or: [
                { action: { $in: ['unauthorized_access', 'security_event', 'api_error'] } },
                { status: 'failure' },
                { severity: { $in: ['warning', 'error', 'critical'] } }
            ]
        })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
}
