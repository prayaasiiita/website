/**
 * Admin Gallery API - List albums and trigger sync
 * GET: List all albums with filtering
 * POST: Trigger manual sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';
import dbConnect from '@/src/lib/mongodb';
import '@/src/models/Admin'; // Register Admin model for populate
import FlickrAlbum from '@/src/models/FlickrAlbum';
import { syncFlickrAlbums, isSyncRunning, getLatestSyncLog } from '@/src/lib/gallery/sync-service';
import type { AlbumStatus } from '@/src/models/FlickrAlbum';

/**
 * GET /api/admin/gallery
 * List all albums with optional filtering
 */
export async function GET(request: NextRequest) {
    // Verify permission
    const authResult = await requirePermission(request, 'manage_gallery');
    if ('error' in authResult) return authResult.error;

    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as AlbumStatus | 'all' | null;
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sortBy') || 'dateUpdated';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build query
        const query: Record<string, unknown> = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { customTitle: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Sort configuration
        const sortConfig: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === 'asc' ? 1 : -1,
        };

        const skip = (page - 1) * limit;

        const [albums, total, latestSync] = await Promise.all([
            FlickrAlbum.find(query)
                .sort(sortConfig)
                .skip(skip)
                .limit(limit)
                .populate('approvedBy', 'username email')
                .lean(),
            FlickrAlbum.countDocuments(query),
            getLatestSyncLog(),
        ]);

        // Get status counts for filters
        const statusCounts = await FlickrAlbum.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const counts = {
            all: total,
            pending: 0,
            approved: 0,
            rejected: 0,
            hidden: 0,
        };

        statusCounts.forEach((item: { _id: string; count: number }) => {
            if (item._id in counts) {
                counts[item._id as keyof typeof counts] = item.count;
            }
        });

        return NextResponse.json({
            albums,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            counts,
            latestSync: latestSync ? {
                status: latestSync.status,
                startedAt: latestSync.startedAt,
                completedAt: latestSync.completedAt,
                albumsFound: latestSync.albumsFound,
                albumsAdded: latestSync.albumsAdded,
                albumsUpdated: latestSync.albumsUpdated,
            } : null,
        });

    } catch (error) {
        console.error('Failed to fetch gallery albums:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json(
            {
                error: 'Failed to fetch albums',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/gallery
 * Trigger manual sync with Flickr
 */
export async function POST(request: NextRequest) {
    // Verify permission
    const authResult = await requirePermission(request, 'manage_gallery');
    if ('error' in authResult) return authResult.error;

    const { admin } = authResult;

    try {
        // Check if sync is already running
        const running = await isSyncRunning();
        if (running) {
            return NextResponse.json(
                { error: 'A sync is already in progress' },
                { status: 409 }
            );
        }

        // Trigger sync
        const result = await syncFlickrAlbums('manual', admin.userId, admin.email);

        // Log the sync action
        createAuditLog({
            action: 'update',
            resource: 'gallery',
            resourceId: result.syncLogId,
            admin,
            request,
            metadata: {
                action: 'manual_sync',
                albumsFound: result.albumsFound,
                albumsAdded: result.albumsAdded,
                albumsUpdated: result.albumsUpdated,
                duration: result.duration,
            },
            status: result.success ? 'success' : 'failure',
            errorMessage: result.error,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Sync failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Sync completed successfully',
            ...result,
        });

    } catch (error) {
        console.error('Failed to trigger sync:', error);

        createAuditLog({
            action: 'update',
            resource: 'gallery',
            admin,
            request,
            metadata: { action: 'manual_sync' },
            status: 'failure',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });

        return NextResponse.json(
            { error: 'Failed to trigger sync' },
            { status: 500 }
        );
    }
}
