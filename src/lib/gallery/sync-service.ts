/**
 * Gallery Sync Service
 * Handles synchronization of Flickr albums with the local database
 */

import dbConnect from '@/src/lib/mongodb';
import FlickrAlbum, { IFlickrAlbum, AlbumStatus } from '@/src/models/FlickrAlbum';
import FlickrSyncLog, { IFlickrSyncLog } from '@/src/models/FlickrSyncLog';
import {
    getPrayaasAlbums,
    buildPhotoUrl,
    buildAlbumUrl,
    generateAlbumHash,
    FlickrPhotoset,
} from '@/src/lib/flickr';
import mongoose from 'mongoose';

export interface SyncResult {
    success: boolean;
    syncLogId: string;
    albumsFound: number;
    albumsAdded: number;
    albumsUpdated: number;
    albumsUnchanged: number;
    duration: number;
    error?: string;
}

/**
 * Perform a full sync of Prayaas albums from Flickr
 */
export async function syncFlickrAlbums(
    triggeredBy: 'manual' | 'system' = 'manual',
    adminId?: string,
    adminEmail?: string
): Promise<SyncResult> {
    const startTime = Date.now();

    await dbConnect();

    // Create sync log entry
    const syncLog = await FlickrSyncLog.create({
        startedAt: new Date(),
        status: 'running',
        triggeredBy,
        triggeredByAdmin: adminId ? new mongoose.Types.ObjectId(adminId) : undefined,
        triggeredByEmail: adminEmail,
    }) as IFlickrSyncLog;

    try {
        // Fetch Prayaas albums from Flickr
        const flickrAlbums = await getPrayaasAlbums();

        let albumsAdded = 0;
        let albumsUpdated = 0;
        let albumsUnchanged = 0;

        // Process each album
        for (const flickrAlbum of flickrAlbums) {
            const result = await processAlbum(flickrAlbum);

            switch (result) {
                case 'added':
                    albumsAdded++;
                    break;
                case 'updated':
                    albumsUpdated++;
                    break;
                case 'unchanged':
                    albumsUnchanged++;
                    break;
            }
        }

        const duration = Date.now() - startTime;

        // Update sync log with success
        await FlickrSyncLog.findByIdAndUpdate(syncLog._id, {
            completedAt: new Date(),
            status: 'success',
            albumsFound: flickrAlbums.length,
            albumsAdded,
            albumsUpdated,
            albumsUnchanged,
            duration,
        });

        return {
            success: true,
            syncLogId: syncLog._id.toString(),
            albumsFound: flickrAlbums.length,
            albumsAdded,
            albumsUpdated,
            albumsUnchanged,
            duration,
        };

    } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;

        // Update sync log with failure
        await FlickrSyncLog.findByIdAndUpdate(syncLog._id, {
            completedAt: new Date(),
            status: 'failed',
            duration,
            errorMessage,
            errorStack,
        });

        return {
            success: false,
            syncLogId: syncLog._id.toString(),
            albumsFound: 0,
            albumsAdded: 0,
            albumsUpdated: 0,
            albumsUnchanged: 0,
            duration,
            error: errorMessage,
        };
    }
}

/**
 * Process a single Flickr album - create or update in database
 */
async function processAlbum(
    flickrAlbum: FlickrPhotoset
): Promise<'added' | 'updated' | 'unchanged'> {
    const syncHash = generateAlbumHash(flickrAlbum);

    // Check if album already exists
    const existingAlbum = await FlickrAlbum.findOne({ flickrId: flickrAlbum.id }) as IFlickrAlbum | null;

    if (!existingAlbum) {
        // Create new album as pending
        await FlickrAlbum.create({
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
            status: 'pending' as AlbumStatus,
            displayOrder: 0,
            lastSyncedAt: new Date(),
            syncHash,
        });

        return 'added';
    }

    // Check if album has changed
    if (existingAlbum.syncHash === syncHash) {
        // Update lastSyncedAt even if unchanged
        await FlickrAlbum.findByIdAndUpdate(existingAlbum._id, {
            lastSyncedAt: new Date(),
        });
        return 'unchanged';
    }

    // Update existing album (preserve status and display settings)
    await FlickrAlbum.findByIdAndUpdate(existingAlbum._id, {
        title: flickrAlbum.title._content,
        description: flickrAlbum.description._content || '',
        coverPhotoUrl: buildPhotoUrl({
            server: flickrAlbum.server,
            id: flickrAlbum.primary,
            secret: flickrAlbum.secret,
        }, 'large1024'),
        coverPhotoId: flickrAlbum.primary,
        photoCount: flickrAlbum.count_photos,
        dateUpdated: new Date(parseInt(flickrAlbum.date_update) * 1000),
        lastSyncedAt: new Date(),
        syncHash,
    });

    return 'updated';
}

/**
 * Get the most recent sync log
 */
export async function getLatestSyncLog(): Promise<IFlickrSyncLog | null> {
    await dbConnect();
    return FlickrSyncLog.findOne().sort({ startedAt: -1 }).lean();
}

/**
 * Get sync logs with pagination
 */
export async function getSyncLogs(
    page: number = 1,
    limit: number = 20
): Promise<{
    logs: IFlickrSyncLog[];
    total: number;
    page: number;
    totalPages: number;
}> {
    await dbConnect();

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        FlickrSyncLog.find()
            .sort({ startedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        FlickrSyncLog.countDocuments(),
    ]);

    return {
        logs: logs as IFlickrSyncLog[],
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

/**
 * Check if a sync is currently running
 */
export async function isSyncRunning(): Promise<boolean> {
    await dbConnect();
    const runningSync = await FlickrSyncLog.findOne({ status: 'running' });
    return !!runningSync;
}
