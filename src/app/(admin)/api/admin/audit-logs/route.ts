import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import { verifyAuth } from '@/src/lib/auth';
import { getAuditLogs } from '@/src/lib/audit';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const adminPayload = await verifyAuth(request);
        if (!adminPayload) {
            return NextResponse.json(
                { error: 'Unauthorized', logs: [], total: 0, page: 1, totalPages: 0 },
                { status: 401 }
            );
        }

        await dbConnect();

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const adminId = searchParams.get('adminId');
        const resource = searchParams.get('resource');
        const action = searchParams.get('action');
        const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
        const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Get audit logs
        const result = await getAuditLogs({
            adminId: adminId || undefined,
            resource: resource || undefined,
            action: action || undefined,
            startDate,
            endDate,
            limit,
            skip: (page - 1) * limit,
        });

        // Ensure valid response structure
        return NextResponse.json({
            logs: result.logs || [],
            total: result.total || 0,
            page: result.page || 1,
            totalPages: result.totalPages || 0,
        });

    } catch (error) {
        console.error('Get audit logs error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch audit logs', logs: [], total: 0, page: 1, totalPages: 0 },
            { status: 500 }
        );
    }
}
