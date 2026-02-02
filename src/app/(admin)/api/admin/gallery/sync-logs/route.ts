/**
 * Admin Gallery Sync Logs API
 * GET: View sync history
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import { getSyncLogs } from '@/src/lib/gallery/sync-service';

/**
 * GET /api/admin/gallery/sync-logs
 * Get paginated sync history
 */
export async function GET(request: NextRequest) {
    // Verify permission
    const authResult = await requirePermission(request, 'manage_gallery');
    if ('error' in authResult) return authResult.error;

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const result = await getSyncLogs(page, limit);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Failed to fetch sync logs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sync logs' },
            { status: 500 }
        );
    }
}
