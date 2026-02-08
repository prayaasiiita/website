/**
 * Admin Gallery - Add Album from Flickr
 * POST: Manually add a specific Flickr album
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import { createAuditLog } from '@/src/lib/audit';
import dbConnect from '@/src/lib/mongodb';
import FlickrAlbum from '@/src/models/FlickrAlbum';
import { getPhotosetInfo, buildPhotoUrl, buildAlbumUrl, generateAlbumHash } from '@/src/lib/flickr';

/**
 * POST /api/admin/gallery/add
 * Manually add a Flickr album to the gallery
 */
export async function POST(request: NextRequest) {
    // Verify permission
    const authResult = await requirePermission(request, 'manage_gallery');
    if ('error' in authResult) return authResult.error;

    const { admin } = authResult;

    try {
        await dbConnect();

        const body = await request.json();
        const { flickrId, userId } = body;

        if (!flickrId) {
            return NextResponse.json(
                { error: 'flickrId is required' },
                { status: 400 }
            );
        }

        // Check if album already exists
        const existing = await FlickrAlbum.findOne({ flickrId });
        if (existing) {
            return NextResponse.json(
                { error: 'Album already exists in the gallery' },
                { status: 409 }
            );
        }

        // Fetch album info from Flickr
        const flickrAlbum = await getPhotosetInfo(flickrId, userId);

        // Create the album
        const album = await FlickrAlbum.create({
            flickrId: flickrAlbum.id,
            title: flickrAlbum.title._content,
            description: flickrAlbum.description._content || '',
            coverPhotoUrl: buildPhotoUrl({
                server: flickrAlbum.server,
                id: flickrAlbum.primary,
                secret: flickrAlbum.secret,
            }, 'large1024'),
            coverPhotoId: flickrAlbum.primary,
            photoCount: flickrAlbum.count_photos,
            flickrOwner: flickrAlbum.owner,
            flickrUrl: buildAlbumUrl(flickrAlbum.owner, flickrAlbum.id),
            dateCreated: new Date(parseInt(flickrAlbum.date_create) * 1000),
            dateUpdated: new Date(parseInt(flickrAlbum.date_update) * 1000),
            status: 'pending',
            displayOrder: 0,
            lastSyncedAt: new Date(),
            syncHash: generateAlbumHash(flickrAlbum),
        });

        // Log the action
        createAuditLog({
            action: 'create',
            resource: 'gallery',
            resourceId: album._id.toString(),
            admin,
            request,
            metadata: {
                action: 'manual_add',
                albumTitle: flickrAlbum.title._content,
                flickrId,
            },
        });

        return NextResponse.json({
            message: 'Album added successfully',
            album,
        });

    } catch (error) {
        console.error('Failed to add album:', error);
        return NextResponse.json(
            { error: 'Failed to add album' },
            { status: 500 }
        );
    }
}
