/**
 * Flickr API Client
 * Server-side only - handles all communication with Flickr API
 */

// Flickr API base URL
const FLICKR_API_BASE = 'https://www.flickr.com/services/rest/';

// Photo size suffixes for Flickr URLs
// See: https://www.flickr.com/services/api/misc.urls.html
export const FLICKR_SIZES = {
    square75: 's',      // 75x75
    square150: 'q',     // 150x150
    thumbnail: 't',     // 100 on longest side
    small240: 'm',      // 240 on longest side
    small320: 'n',      // 320 on longest side
    medium500: '-',     // 500 on longest side (no suffix)
    medium640: 'z',     // 640 on longest side
    medium800: 'c',     // 800 on longest side
    large1024: 'b',     // 1024 on longest side
    large1600: 'h',     // 1600 on longest side
    large2048: 'k',     // 2048 on longest side
    original: 'o',      // Original size
} as const;

export type FlickrSize = keyof typeof FLICKR_SIZES;

// Types for Flickr API responses
export interface FlickrPhoto {
    id: string;
    secret: string;
    server: string;
    farm: number;
    title: string;
    isprimary: string;
    dateupload?: string;
    datetaken?: string;
}

export interface FlickrPhotoset {
    id: string;
    owner: string;
    username: string;
    primary: string;
    secret: string;
    server: string;
    farm: number;
    count_views: string;
    count_comments: string;
    count_photos: number;
    count_videos: number;
    title: { _content: string };
    description: { _content: string };
    date_create: string;
    date_update: string;
}

export interface FlickrUser {
    id: string;
    nsid: string;
    username: { _content: string };
}

// Error class for Flickr API errors
export class FlickrAPIError extends Error {
    constructor(
        message: string,
        public code?: number,
        public stat?: string
    ) {
        super(message);
        this.name = 'FlickrAPIError';
    }
}

/**
 * Get Flickr API key from environment
 */
function getApiKey(): string {
    const apiKey = process.env.FLICKR_API_KEY;
    if (!apiKey) {
        throw new FlickrAPIError('FLICKR_API_KEY environment variable is not set');
    }
    return apiKey;
}

/**
 * Get Flickr User ID from environment
 * Supports both NSID format (12345678@N00) and usernames
 */
async function resolveUserId(): Promise<string> {
    const userId = process.env.FLICKR_USER_ID;
    if (!userId) {
        throw new FlickrAPIError('FLICKR_USER_ID environment variable is not set');
    }

    // If it looks like an NSID (contains @), use it directly
    if (userId.includes('@')) {
        return userId;
    }

    // Otherwise, treat it as a username and look up the NSID
    try {
        const user = await findUserByUsernameInternal(userId);
        return user.nsid;
    } catch {
        throw new FlickrAPIError(
            `Could not find Flickr user "${userId}". Make sure FLICKR_USER_ID is set to either a valid NSID (like "12345678@N00") or username.`
        );
    }
}

/**
 * Internal function to find user by username (doesn't depend on resolveUserId)
 */
async function findUserByUsernameInternal(username: string): Promise<FlickrUser> {
    const apiKey = getApiKey();

    const url = new URL(FLICKR_API_BASE);
    url.searchParams.set('method', 'flickr.people.findByUsername');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('format', 'json');
    url.searchParams.set('nojsoncallback', '1');
    url.searchParams.set('username', username);

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
        throw new FlickrAPIError(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data.stat === 'fail') {
        throw new FlickrAPIError(data.message || 'User not found', data.code);
    }

    return data.user;
}

// Cache for resolved user ID to avoid repeated lookups
let cachedUserId: string | null = null;

async function getUserId(): Promise<string> {
    if (cachedUserId) return cachedUserId;
    cachedUserId = await resolveUserId();
    return cachedUserId;
}

/**
 * Make a request to the Flickr API
 */
async function flickrRequest<T>(
    method: string,
    params: Record<string, string | number> = {}
): Promise<T> {
    const apiKey = getApiKey();

    const url = new URL(FLICKR_API_BASE);
    url.searchParams.set('method', method);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('format', 'json');
    url.searchParams.set('nojsoncallback', '1');

    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
    });

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            // Cache for 5 minutes on the server
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            throw new FlickrAPIError(
                `HTTP error: ${response.status} ${response.statusText}`,
                response.status
            );
        }

        const data = await response.json();

        // Check for Flickr API errors
        if (data.stat === 'fail') {
            throw new FlickrAPIError(
                data.message || 'Unknown Flickr API error',
                data.code,
                data.stat
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof FlickrAPIError) {
            throw error;
        }
        throw new FlickrAPIError(
            `Failed to fetch from Flickr API: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

/**
 * Build Flickr photo URL from photo data
 */
export function buildPhotoUrl(
    photo: { server: string; id: string; secret: string; farm?: number },
    size: FlickrSize = 'large1024'
): string {
    const sizeSuffix = FLICKR_SIZES[size];
    // Format: https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
    // For medium500, no suffix is used: https://live.staticflickr.com/{server-id}/{id}_{secret}.jpg
    if (sizeSuffix === '-') {
        return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
    }
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${sizeSuffix}.jpg`;
}

/**
 * Build Flickr album URL
 */
export function buildAlbumUrl(userId: string, albumId: string): string {
    return `https://www.flickr.com/photos/${userId}/albums/${albumId}`;
}

/**
 * Resolve a Flickr username to a user ID (NSID)
 */
export async function findUserByUsername(username: string): Promise<FlickrUser> {
    const response = await flickrRequest<{ user: FlickrUser }>('flickr.people.findByUsername', {
        username,
    });
    return response.user;
}

/**
 * Get all photosets (albums) for a user
 */
export async function getPhotosets(userId?: string): Promise<FlickrPhotoset[]> {
    const uid = userId || await getUserId();

    const response = await flickrRequest<{
        photosets: {
            photoset: FlickrPhotoset[];
            page: number;
            pages: number;
            total: number;
        };
    }>('flickr.photosets.getList', {
        user_id: uid,
        per_page: 500, // Max allowed
    });

    return response.photosets.photoset || [];
}

/**
 * Get photosets that contain "Prayaas" in the title (case-insensitive)
 */
export async function getPrayaasAlbums(userId?: string): Promise<FlickrPhotoset[]> {
    const allAlbums = await getPhotosets(userId);

    return allAlbums.filter((album) => {
        const title = album.title._content.toLowerCase();
        return title.includes('prayaas');
    });
}

/**
 * Get photos in a photoset/album with pagination
 */
export async function getPhotosetPhotos(
    photosetId: string,
    userId?: string,
    page: number = 1,
    perPage: number = 100
): Promise<{
    photos: FlickrPhoto[];
    page: number;
    pages: number;
    perPage: number;
    total: number;
}> {
    const uid = userId || await getUserId();

    const response = await flickrRequest<{
        photoset: {
            id: string;
            primary: string;
            owner: string;
            page: number;
            perpage: number;
            pages: number;
            total: number;
            photo: FlickrPhoto[];
        };
    }>('flickr.photosets.getPhotos', {
        photoset_id: photosetId,
        user_id: uid,
        page,
        per_page: perPage,
        extras: 'date_upload,date_taken',
    });

    return {
        photos: response.photoset.photo || [],
        page: response.photoset.page,
        pages: response.photoset.pages,
        perPage: response.photoset.perpage,
        total: response.photoset.total,
    };
}

/**
 * Get all photos in a photoset (handles pagination)
 */
export async function getAllPhotosetPhotos(
    photosetId: string,
    userId?: string
): Promise<FlickrPhoto[]> {
    const allPhotos: FlickrPhoto[] = [];
    let page = 1;
    let totalPages = 1;

    do {
        const result = await getPhotosetPhotos(photosetId, userId, page, 500);
        allPhotos.push(...result.photos);
        totalPages = result.pages;
        page++;
    } while (page <= totalPages);

    return allPhotos;
}

/**
 * Get photoset info by ID
 */
export async function getPhotosetInfo(
    photosetId: string,
    userId?: string
): Promise<FlickrPhotoset> {
    const uid = userId || await getUserId();

    const response = await flickrRequest<{ photoset: FlickrPhotoset }>(
        'flickr.photosets.getInfo',
        {
            photoset_id: photosetId,
            user_id: uid,
        }
    );

    return response.photoset;
}

/**
 * Generate a hash of album data for change detection
 */
export function generateAlbumHash(album: FlickrPhotoset): string {
    const data = `${album.id}:${album.title._content}:${album.description._content}:${album.count_photos}:${album.date_update}`;
    // Simple hash using btoa (base64) - sufficient for change detection
    return Buffer.from(data).toString('base64').substring(0, 32);
}
