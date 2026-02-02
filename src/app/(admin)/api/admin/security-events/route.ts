import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import { requirePermission } from '@/src/lib/auth';
import AuditLog from '@/src/models/AuditLog';

/**
 * GET /api/admin/security-events
 * Fetch security-related events for the security dashboard
 */
export async function GET(request: NextRequest) {
    try {
        // Require view_audit_logs permission
        const authResult = await requirePermission(request, 'view_audit_logs');
        if ('error' in authResult) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '24h';

        // Calculate time range
        const now = new Date();
        let startDate: Date;
        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '24h':
            default:
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }

        // Get security-related actions
        const securityActions = [
            'login',
            'login_failed',
            'logout',
            'rate_limit_exceeded',
            'password_changed',
            'unauthorized_access',
            'security_event',
        ];

        // Fetch recent security events
        const events = await AuditLog.find({
            $or: [
                { action: { $in: securityActions } },
                { severity: { $in: ['warning', 'error'] } },
                { actorType: 'system' },
            ],
            createdAt: { $gte: startDate },
        })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        // Get aggregated counts
        const failedLogins = await AuditLog.countDocuments({
            action: 'login_failed',
            createdAt: { $gte: startDate },
        });

        const rateLimits = await AuditLog.countDocuments({
            action: 'rate_limit_exceeded',
            createdAt: { $gte: startDate },
        });

        const unauthorizedAttempts = await AuditLog.countDocuments({
            $or: [
                { action: 'unauthorized_access' },
                { status: 'failure', severity: 'warning' },
            ],
            createdAt: { $gte: startDate },
        });

        const successfulLogins = await AuditLog.countDocuments({
            action: 'login',
            status: 'success',
            createdAt: { $gte: startDate },
        });

        // Get severity distribution
        const severityDistribution = await AuditLog.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: '$severity', count: { $sum: 1 } } },
        ]);

        // Get hourly login attempts for chart (last 24 hours)
        const hourlyLogins = await AuditLog.aggregate([
            {
                $match: {
                    action: { $in: ['login', 'login_failed'] },
                    createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: {
                        hour: { $hour: '$createdAt' },
                        action: '$action',
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.hour': 1 } },
        ]);

        return NextResponse.json({
            events,
            stats: {
                failedLogins,
                rateLimits,
                unauthorizedAttempts,
                successfulLogins,
            },
            severityDistribution: severityDistribution.reduce(
                (acc, item) => {
                    acc[item._id || 'info'] = item.count;
                    return acc;
                },
                {} as Record<string, number>
            ),
            hourlyLogins,
            period,
        });
    } catch (error) {
        console.error('Get security events error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch security events' },
            { status: 500 }
        );
    }
}
