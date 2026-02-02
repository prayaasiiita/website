/**
 * Public Gallery Album Photos API
 * GET: Returns photos for an approved album
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import FlickrAlbum from '@/src/models/FlickrAlbum';
import { getPhotosetPhotos, buildPhotoUrl } from '@/src/lib/flickr';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/gallery/albums/[id]/photos
 * Get photos for an approved album
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        await dbConnect();
        const { id } = await params;

        // Find the album - only if approved
        const album = await FlickrAlbum.findOne({
            _id: id,
            status: 'approved',
        }).lean();

        if (!album) {
            return NextResponse.json(
                { error: 'Album not found' },
                { status: 404 }
            );
        }

        // Get pagination params
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const perPage = parseInt(searchParams.get('perPage') || '50');

        // Fetch photos from Flickr
        const photosResult = await getPhotosetPhotos(
            album.flickrId,
            album.flickrOwner,
            page,
            Math.min(perPage, 100) // Cap at 100 per page
        );

        // Transform photos for public consumption
        const photos = photosResult.photos.map((photo) => ({
            id: photo.id,
            title: photo.title,
            thumbnail: buildPhotoUrl(photo, 'square150'),
            medium: buildPhotoUrl(photo, 'medium640'),
            large: buildPhotoUrl(photo, 'large1024'),
            xlarge: buildPhotoUrl(photo, 'large1600'),
        }));

        return NextResponse.json({
            album: {
                id: album._id.toString(),
                title: album.customTitle || album.title,
                description: album.customDescription || album.description,
                photoCount: album.photoCount,
            },
            photos,
            pagination: {
                page: photosResult.page,
                perPage: photosResult.perPage,
                total: photosResult.total,
                totalPages: photosResult.pages,
            },
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });

    } catch (error) {
        console.error('Failed to fetch album photos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch photos' },
            { status: 500 }
        );
    }
}
