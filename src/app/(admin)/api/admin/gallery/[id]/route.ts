/**
 * Admin Gallery Album API - Single album operations
 * GET: Get album details with photos
 * PATCH: Update album status or display settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';
import dbConnect from '@/src/lib/mongodb';
import FlickrAlbum from '@/src/models/FlickrAlbum';
import { getPhotosetPhotos, buildPhotoUrl } from '@/src/lib/flickr';
import type { AlbumStatus } from '@/src/models/FlickrAlbum';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/gallery/[id]
 * Get album details with photos
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    // Verify permission
    const authResult = await requirePermission(request, 'manage_gallery');
    if ('error' in authResult) return authResult.error;

    try {
        await dbConnect();
        const { id } = await params;

        const album = await FlickrAlbum.findById(id)
            .populate('approvedBy', 'username email')
            .lean();

        if (!album) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            );
        }

        // Fetch photos from Flickr
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '50');

        try {
            const photosResult = await getPhotosetPhotos(
                album.flickrId,
                album.flickrOwner,
                page,
                perPage
            );

            // Transform photos with URLs
            const photos = photosResult.photos.map((photo) => ({
                id: photo.id,
                title: photo.title,
                thumbnail: buildPhotoUrl(photo, 'square150'),
                medium: buildPhotoUrl(photo, 'medium640'),
                large: buildPhotoUrl(photo, 'large1024'),
                original: buildPhotoUrl(photo, 'large1600'),
                isPrimary: photo.isprimary === '1',
            }));

            return NextResponse.json({
                album,
                photos,
                pagination: {
                    page: photosResult.page,
                    perPage: photosResult.perPage,
                    total: photosResult.total,
                    totalPages: photosResult.pages,
                },
            });
        } catch (flickrError) {
            // Return album without photos if Flickr API fails
            console.error('Failed to fetch photos from Flickr:', flickrError);
            return NextResponse.json({
                album,
                photos: [],
                pagination: { page: 1, perPage, total: 0, totalPages: 0 },
                warning: 'Failed to fetch photos from Flickr',
            });
        }

    } catch (error) {
        console.error('Failed to fetch album:', error);
        return NextResponse.json(
            { error: 'Failed to fetch album' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/gallery/[id]
 * Update album status or display settings
 */
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    // Verify permission
    const authResult = await requirePermission(request, 'manage_gallery');
    if ('error' in authResult) return authResult.error;

    const { admin } = authResult;

    try {
        await dbConnect();
        const { id } = await params;

        const album = await FlickrAlbum.findById(id);
        if (!album) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        const {
            status,
            rejectionReason,
            customTitle,
            customDescription,
            displayOrder,
            coverPhotoUrl,
        } = body;

        // Track changes for audit log
        const changes: Record<string, unknown> = {};
        const before: Record<string, unknown> = {};

        // Update status if provided
        if (status && ['pending', 'approved', 'rejected', 'hidden'].includes(status)) {
            before.status = album.status;
            changes.status = status as AlbumStatus;
            album.status = status as AlbumStatus;

            if (status === 'approved') {
                album.approvedBy = admin.userId as unknown as typeof album.approvedBy;
                album.approvedAt = new Date();
                album.rejectionReason = undefined;
                changes.approvedAt = album.approvedAt;
            } else if (status === 'rejected') {
                album.rejectionReason = rejectionReason || '';
                album.approvedBy = undefined;
                album.approvedAt = undefined;
                changes.rejectionReason = rejectionReason;
            }
        }

        // Update display settings
        if (customTitle !== undefined) {
            before.customTitle = album.customTitle;
            album.customTitle = customTitle || undefined;
            changes.customTitle = customTitle;
        }

        if (customDescription !== undefined) {
            before.customDescription = album.customDescription;
            album.customDescription = customDescription || undefined;
            changes.customDescription = customDescription;
        }

        if (displayOrder !== undefined) {
            before.displayOrder = album.displayOrder;
            album.displayOrder = displayOrder;
            changes.displayOrder = displayOrder;
        }

        // Update cover photo
        if (coverPhotoUrl) {
            before.coverPhotoUrl = album.coverPhotoUrl;
            album.coverPhotoUrl = coverPhotoUrl;
            changes.coverPhotoUrl = coverPhotoUrl;
        }

        await album.save();

        // Log the update
        createAuditLog({
            action: 'update',
            resource: 'gallery',
            resourceId: id,
            admin,
            request,
            changes: { before, after: changes },
            metadata: {
                albumTitle: album.title,
                action: status ? `status_change_to_${status}` : 'settings_update',
            },
        });

        return NextResponse.json({
            message: 'Album updated successfully',
            album: await FlickrAlbum.findById(id)
                .populate('approvedBy', 'username email')
                .lean(),
        });

    } catch (error) {
        console.error('Failed to update album:', error);
        return NextResponse.json(
            { error: 'Failed to update album' },
            { status: 500 }
        );
    }
}
