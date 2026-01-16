/**
 * Admin Gallery - Fetch All Flickr Albums API
 * GET: Returns all albums from the Flickr account for manual selection
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/src/lib/auth';
import dbConnect from '@/src/lib/mongodb';
import FlickrAlbum from '@/src/models/FlickrAlbum';
import { getPhotosets, buildPhotoUrl, buildAlbumUrl } from '@/src/lib/flickr';

/**
 * GET /api/admin/gallery/flickr-albums
 * Fetch all albums from Flickr (for manual selection)
 */
export async function GET(request: NextRequest) {
    // Verify permission
    const authResult = await requirePermission(request, 'manage_gallery');
    if ('error' in authResult) return authResult.error;

    try {
        await dbConnect();

        // Fetch all albums from Flickr
        const flickrAlbums = await getPhotosets();

        // Get existing album IDs from database
        const existingAlbums = await FlickrAlbum.find({}).select('flickrId').lean();
        const existingIds = new Set(existingAlbums.map(a => a.flickrId));

        // Transform and mark which ones are already added
        const albums = flickrAlbums.map((album) => ({
            flickrId: album.id,
            title: album.title._content,
            description: album.description._content || '',
            coverPhotoUrl: buildPhotoUrl({
                server: album.server,
                id: album.primary,
                secret: album.secret,
            }, 'medium640'),
            photoCount: album.count_photos,
            flickrUrl: buildAlbumUrl(album.owner, album.id),
            owner: album.owner,
            dateCreated: new Date(parseInt(album.date_create) * 1000).toISOString(),
            dateUpdated: new Date(parseInt(album.date_update) * 1000).toISOString(),
            isAdded: existingIds.has(album.id),
            isPrayaas: album.title._content.toLowerCase().includes('prayaas'),
        }));

        return NextResponse.json({
            albums,
            total: albums.length,
            addedCount: albums.filter(a => a.isAdded).length,
        });

    } catch (error) {
        console.error('Failed to fetch Flickr albums:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Flickr albums' },
            { status: 500 }
        );
    }
}
