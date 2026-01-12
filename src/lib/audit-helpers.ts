import { NextRequest } from 'next/server';
import { createAuditLog, AuditActor } from './audit';
import { JWTPayload } from './auth';
import { AuditAction, Severity, ActorType } from '@/src/models/AuditLog';

/**
 * Audit Helper Functions
 * Provides convenient wrappers for common audit logging scenarios
 */

/**
 * Generate a unique request ID for tracing
 */
export function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Log an API error (4xx/5xx responses)
 */
export function auditAPIError(params: {
    request: NextRequest;
    admin?: JWTPayload | AuditActor;
    resource: string;
    statusCode: number;
    errorMessage: string;
    requestId?: string;
}): void {
    const { request, admin, resource, statusCode, errorMessage, requestId } = params;

    const severity: Severity = statusCode >= 500 ? 'error' : 'warning';

    createAuditLog({
        action: 'api_error',
        resource,
        admin,
        actorType: admin ? 'admin' : 'anonymous',
        severity,
        request,
        requestId,
        status: 'failure',
        errorMessage: `HTTP ${statusCode}: ${errorMessage}`,
        metadata: { statusCode },
    });
}

/**
 * Log a security event
 */
export function auditSecurityEvent(params: {
    request?: NextRequest;
    eventType: 'rate_limit' | 'unauthorized' | 'suspicious_pattern' | 'brute_force' | 'invalid_token';
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, unknown>;
    severity?: Severity;
}): void {
    const { request, eventType, ipAddress, userAgent, details, severity = 'warning' } = params;

    createAuditLog({
        action: 'security_event',
        resource: 'security',
        actorType: 'anonymous',
        severity,
        request,
        ipAddress,
        userAgent,
        status: 'failure',
        errorMessage: eventType,
        metadata: { eventType, ...details },
    });
}

/**
 * Log unauthorized access attempt
 */
export function auditUnauthorizedAccess(params: {
    request: NextRequest;
    resource: string;
    reason?: string;
}): void {
    const { request, resource, reason = 'No valid authentication token' } = params;

    createAuditLog({
        action: 'unauthorized_access',
        resource,
        actorType: 'anonymous',
        severity: 'warning',
        request,
        status: 'failure',
        errorMessage: reason,
    });
}

/**
 * Log a form submission (contact form, etc.)
 */
export function auditFormSubmission(params: {
    formType: string;
    submitterId?: string;
    submitterEmail?: string;
    ipAddress: string;
    userAgent?: string;
    success?: boolean;
    metadata?: Record<string, unknown>;
}): void {
    const {
        formType,
        submitterId,
        submitterEmail,
        ipAddress,
        userAgent,
        success = true,
        metadata,
    } = params;

    createAuditLog({
        action: 'form_submission',
        resource: formType,
        resourceId: submitterId,
        admin: submitterEmail
            ? { userId: submitterId || 'anonymous', email: submitterEmail }
            : undefined,
        actorType: 'user',
        severity: 'info',
        ipAddress,
        userAgent,
        status: success ? 'success' : 'failure',
        metadata,
    });
}

/**
 * Log admin CRUD operations
 */
export function auditAdminAction(params: {
    action: 'create' | 'update' | 'delete' | 'upload' | 'bulk_operation';
    resource: string;
    resourceId?: string;
    admin: JWTPayload;
    request: NextRequest;
    changes?: {
        before?: unknown;
        after?: unknown;
    };
    metadata?: Record<string, unknown>;
}): void {
    const { action, resource, resourceId, admin, request, changes, metadata } = params;

    createAuditLog({
        action,
        resource,
        resourceId,
        admin,
        actorType: 'admin',
        severity: action === 'delete' ? 'warning' : 'info',
        request,
        changes,
        status: 'success',
        metadata,
    });
}

/**
 * Log authentication events
 */
export function auditAuthEvent(params: {
    action: 'login' | 'logout' | 'password_change' | 'password_reset_request' | 'password_reset_complete';
    admin: JWTPayload | AuditActor;
    request: NextRequest;
    success?: boolean;
    errorMessage?: string;
}): void {
    const { action, admin, request, success = true, errorMessage } = params;

    const severity: Severity = success ? 'info' : 'warning';

    createAuditLog({
        action,
        resource: 'auth',
        admin,
        actorType: 'admin',
        severity,
        request,
        status: success ? 'success' : 'failure',
        errorMessage,
    });
}

/**
 * Higher-order function to wrap API route handlers with audit logging
 * Automatically logs errors and unauthorized access
 */
export function withAuditLogging<T>(
    resource: string,
    handler: (request: NextRequest) => Promise<T>
) {
    return async (request: NextRequest): Promise<T> => {
        const requestId = generateRequestId();

        try {
            const result = await handler(request);
            return result;
        } catch (error) {
            // Log the error
            auditAPIError({
                request,
                resource,
                statusCode: 500,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                requestId,
            });
            throw error;
        }
    };
}

/**
 * Re-export types for convenience
 */
export type { AuditAction, Severity, ActorType };
