/**
 * Public Gallery Albums API
 * GET: Returns only approved albums for public display, grouped by year
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import FlickrAlbum from '@/src/models/FlickrAlbum';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PublicAlbum {
    id: string;
    flickrId: string;
    title: string;
    description?: string;
    coverPhotoUrl: string;
    photoCount: number;
    flickrUrl: string;
    year: string;
}

interface YearGroup {
    year: string;
    albums: PublicAlbum[];
}

/**
 * GET /api/gallery/albums
 * Get all approved albums for public display, grouped by year
 */
export async function GET() {
    try {
        await dbConnect();

        const albums = await FlickrAlbum.find({ status: 'approved' })
            .select({
                flickrId: 1,
                title: 1,
                customTitle: 1,
                description: 1,
                customDescription: 1,
                coverPhotoUrl: 1,
                photoCount: 1,
                flickrUrl: 1,
                displayOrder: 1,
                dateCreated: 1,
                dateUpdated: 1,
            })
            .sort({ dateCreated: -1 }) // Most recent first
            .lean();

        // Transform and group albums by year
        const albumsByYear: Record<string, PublicAlbum[]> = {};

        const publicAlbums: PublicAlbum[] = albums.map((album) => {
            const year = new Date(album.dateCreated).getFullYear().toString();
            const albumData: PublicAlbum = {
                id: album._id.toString(),
                flickrId: album.flickrId,
                title: album.customTitle || album.title,
                description: album.customDescription || album.description,
                coverPhotoUrl: album.coverPhotoUrl,
                photoCount: album.photoCount,
                flickrUrl: album.flickrUrl,
                year,
            };

            if (!albumsByYear[year]) {
                albumsByYear[year] = [];
            }
            albumsByYear[year].push(albumData);

            return albumData;
        });

        // Sort years in descending order (most recent first: 2026, 2025, 2024...)
        const sortedYears = Object.keys(albumsByYear).sort((a, b) => parseInt(b) - parseInt(a));
        const groupedByYear: YearGroup[] = sortedYears.map(year => ({
            year,
            albums: albumsByYear[year],
        }));

        return NextResponse.json({
            albums: publicAlbums,
            groupedByYear,
            total: publicAlbums.length,
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });

    } catch (error) {
        console.error('Failed to fetch public albums:', error);
        return NextResponse.json(
            { error: 'Failed to fetch albums' },
            { status: 500 }
        );
    }
}
