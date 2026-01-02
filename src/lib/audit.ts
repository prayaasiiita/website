import { NextRequest } from 'next/server';
import AuditLog from '@/src/models/AuditLog';
import { JWTPayload } from './auth';

export interface AuditLogParams {
    action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'upload' | 'password_change' | 'password_reset_request' | 'password_reset_complete' | 'bulk_operation';
    resource: string;
    resourceId?: string;
    admin: JWTPayload;
    request: NextRequest;
    changes?: {
        before?: any;
        after?: any;
    };
    status?: 'success' | 'failure';
    errorMessage?: string;
}

/**
 * Create an audit log entry
 * This runs asynchronously and won't block the response
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
    try {
        const {
            action,
            resource,
            resourceId,
            admin,
            request,
            changes,
            status = 'success',
            errorMessage,
        } = params;

        // Extract IP address
        const ipAddress =
            request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Extract user agent
        const userAgent = request.headers.get('user-agent') || undefined;

        // Extract location (URL path)
        const url = new URL(request.url);
        const location = url.pathname + (url.search || '');

        // Get geolocation from IP address (free service)
        let geoLocation;
        try {
            if (ipAddress !== 'unknown' && ipAddress !== '::1' && ipAddress !== '127.0.0.1') {
                const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,region,city,timezone,lat,lon`);
                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();
                    if (geoData.status === 'success') {
                        geoLocation = {
                            city: geoData.city,
                            region: geoData.region,
                            country: geoData.country,
                            countryCode: geoData.countryCode,
                            timezone: geoData.timezone,
                            lat: geoData.lat,
                            lon: geoData.lon,
                        };
                    }
                }
            }
        } catch (error) {
            // Geolocation is optional, don't fail if it errors
            console.warn('Failed to fetch geolocation:', error);
        }

        // Sanitize changes to prevent storing sensitive data
        const sanitizedChanges = sanitizeChanges(changes);

        await AuditLog.create({
            action,
            resource,
            resourceId,
            adminId: admin.userId,
            adminEmail: admin.email,
            ipAddress,
            userAgent,
            location,
            geoLocation,
            changes: sanitizedChanges,
            status,
            errorMessage,
            timestamp: new Date(),
        });
    } catch (error) {
        // Don't let audit logging failures break the main operation
        console.error('Failed to create audit log:', error);
    }
}

/**
 * Sanitize changes object to remove sensitive fields
 */
function sanitizeChanges(changes?: { before?: any; after?: any }) {
    if (!changes) return undefined;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'apiSecret'];

    const sanitize = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;

        const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

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
 * Get audit logs with filtering and pagination
 */
export async function getAuditLogs(filters: {
    adminId?: string;
    resource?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
}) {
    const query: any = {};

    if (filters.adminId) query.adminId = filters.adminId;
    if (filters.resource) query.resource = filters.resource;
    if (filters.action) query.action = filters.action;

    if (filters.startDate || filters.endDate) {
        query.timestamp = {};
        if (filters.startDate) query.timestamp.$gte = filters.startDate;
        if (filters.endDate) query.timestamp.$lte = filters.endDate;
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
