import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/src/lib/auth';
import dbConnect from '@/src/lib/mongodb';
import PageImage, { ALLOWED_PAGES, ALLOWED_SECTIONS, PageType, SectionType } from '@/src/models/PageImage';
import cloudinary, { CLOUDINARY_FOLDER } from '@/src/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { revalidatePublicTags, TAGS } from '@/src/lib/revalidate-paths';
import sharp from 'sharp';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Constants for validation
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const KEY_PATTERN = /^[a-z0-9-_]+$/;
const MAX_CLOUDINARY_SIZE = 10 * 1024 * 1024; // 10MB Cloudinary free plan limit

// Compress image if larger than Cloudinary limit
async function compressImageIfNeeded(inputBuffer: Buffer, mimeType: string): Promise<Buffer> {
    // If file is under limit, return as-is
    if (inputBuffer.length <= MAX_CLOUDINARY_SIZE) {
        return inputBuffer;
    }

    console.log(`Compressing image from ${(inputBuffer.length / (1024 * 1024)).toFixed(2)}MB...`);

    // Get image metadata
    const metadata = await sharp(inputBuffer).metadata();
    const { width = 1920, height = 1080 } = metadata;

    // Try compression with decreasing quality until under limit
    // Start with high quality and reduce gradually
    const qualities = [95, 90, 85, 80, 75, 70, 65, 60];
    const maxDimensions = [
        { w: width, h: height },           // Original size
        { w: 3840, h: 2160 },              // 4K
        { w: 2560, h: 1440 },              // 2K
        { w: 1920, h: 1080 },              // Full HD
    ];

    for (const dims of maxDimensions) {
        // Calculate resize dimensions maintaining aspect ratio
        let newWidth = width;
        let newHeight = height;

        if (width > dims.w || height > dims.h) {
            const ratio = Math.min(dims.w / width, dims.h / height);
            newWidth = Math.round(width * ratio);
            newHeight = Math.round(height * ratio);
        }

        for (const quality of qualities) {
            let sharpInstance = sharp(inputBuffer);

            // Only resize if dimensions changed
            if (newWidth !== width || newHeight !== height) {
                sharpInstance = sharpInstance.resize(newWidth, newHeight, {
                    fit: 'inside',
                    withoutEnlargement: true
                });
            }

            // Compress based on mime type
            if (mimeType === 'image/png') {
                // PNG doesn't have quality, use compression level
                sharpInstance = sharpInstance.png({
                    compressionLevel: Math.min(9, Math.round((100 - quality) / 10)),
                    progressive: true
                });
            } else if (mimeType === 'image/webp') {
                sharpInstance = sharpInstance.webp({ quality });
            } else {
                // Default to JPEG for best compression control
                sharpInstance = sharpInstance.jpeg({ quality, progressive: true });
            }

            const compressedBuffer = await sharpInstance.toBuffer();

            if (compressedBuffer.length <= MAX_CLOUDINARY_SIZE) {
                console.log(`Compressed to ${(compressedBuffer.length / (1024 * 1024)).toFixed(2)}MB (${newWidth}x${newHeight}, quality: ${quality})`);
                return compressedBuffer;
            }
        }
    }

    // Last resort: aggressive compression
    console.log('Using aggressive compression as last resort...');
    const aggressiveBuffer = await sharp(inputBuffer)
        .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 50, progressive: true })
        .toBuffer();
    console.log(`Aggressively compressed to ${(aggressiveBuffer.length / (1024 * 1024)).toFixed(2)}MB`);
    return aggressiveBuffer;
}

// Rate limiting map (simple in-memory, use Redis in production cluster)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30; // requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return false;
    }

    entry.count++;
    return true;
}

// Authentication helper
async function authenticateAdmin(request: NextRequest): Promise<{ success: boolean; error?: string; userId?: string }> {
    void request; // request currently unused but kept for future use
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token) {
            return { success: false, error: 'Authentication required' };
        }

        const payload = verifyToken(token);
        if (!payload) {
            return { success: false, error: 'Invalid or expired token' };
        }

        // Rate limit by user
        if (!checkRateLimit(payload.userId)) {
            return { success: false, error: 'Rate limit exceeded. Please try again later.' };
        }

        return { success: true, userId: payload.userId };
    } catch (error) {
        console.error('Auth error:', error);
        return { success: false, error: 'Authentication failed' };
    }
}

// Sanitize and validate input
function sanitizeString(str: string, maxLength: number = 200): string {
    return str.trim().slice(0, maxLength);
}

function validateKey(key: string): boolean {
    return KEY_PATTERN.test(key) && key.length > 0 && key.length <= 100;
}

function validatePage(page: string): page is PageType {
    return ALLOWED_PAGES.includes(page as PageType);
}

function validateSection(section: string): section is SectionType {
    return ALLOWED_SECTIONS.includes(section as SectionType);
}

// Revalidate caches after changes
async function revalidateCaches(page?: string) {
    // Revalidate all page-images related tags
    revalidatePublicTags([TAGS.PAGE_IMAGES, 'page-images']);

    if (page) {
        revalidatePath(`/${page === 'home' ? '' : page}`);
    }

    // Revalidate common paths
    revalidatePath('/');
    revalidatePath('/about');
}

// GET: Fetch all page images (grouped by page/section)
export async function GET(request: NextRequest) {
    const auth = await authenticateAdmin(request);
    if (!auth.success) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        await dbConnect();

        const images = await PageImage.find({})
            .sort({ page: 1, section: 1, key: 1 })
            .lean();

        // Group images by page and section
        const grouped: Record<string, Record<string, typeof images>> = {};

        images.forEach((img) => {
            if (!grouped[img.page]) {
                grouped[img.page] = {};
            }
            if (!grouped[img.page][img.section]) {
                grouped[img.page][img.section] = [];
            }
            grouped[img.page][img.section].push(img);
        });

        return NextResponse.json({
            success: true,
            images,
            grouped,
            allowedPages: ALLOWED_PAGES,
            allowedSections: ALLOWED_SECTIONS,
        });
    } catch (error) {
        console.error('Error fetching page images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    }
}

// POST: Upload new page image
export async function POST(request: NextRequest) {
    const auth = await authenticateAdmin(request);
    if (!auth.success) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        const file = formData.get('file') as File | null;
        const page = formData.get('page') as string | null;
        const section = formData.get('section') as string | null;
        const key = formData.get('key') as string | null;
        const alt = formData.get('alt') as string | null;

        // Validate required fields
        if (!file || !page || !section || !key || !alt) {
            return NextResponse.json(
                { error: 'Missing required fields: file, page, section, key, alt' },
                { status: 400 }
            );
        }

        // Validate file
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
                { status: 400 }
            );
        }

        // Validate and sanitize inputs
        const cleanPage = page.toLowerCase().trim();
        const cleanSection = section.toLowerCase().trim();
        const cleanKey = key.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
        const cleanAlt = sanitizeString(alt);

        if (!validatePage(cleanPage)) {
            return NextResponse.json(
                { error: `Invalid page. Allowed: ${ALLOWED_PAGES.join(', ')}` },
                { status: 400 }
            );
        }

        if (!validateSection(cleanSection)) {
            return NextResponse.json(
                { error: `Invalid section. Allowed: ${ALLOWED_SECTIONS.join(', ')}` },
                { status: 400 }
            );
        }

        if (!validateKey(cleanKey)) {
            return NextResponse.json(
                { error: 'Invalid key. Use only lowercase letters, numbers, hyphens, underscores' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if image already exists
        const existing = await PageImage.findOne({
            page: cleanPage,
            section: cleanSection,
            key: cleanKey,
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Image with this page/section/key already exists. Use PUT to update.' },
                { status: 409 }
            );
        }

        // Upload to Cloudinary
        const bytes = await file.arrayBuffer();
        const rawBuffer = Buffer.from(bytes);

        // Compress image if needed (Cloudinary free plan has 10MB limit)
        const buffer = await compressImageIfNeeded(rawBuffer, file.type);

        const uploadResult = await new Promise<{
            secure_url: string;
            public_id: string;
            width: number;
            height: number;
        }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `${CLOUDINARY_FOLDER}/pages/${cleanPage}/${cleanSection}`,
                    resource_type: 'image',
                    chunk_size: 6000000, // 6MB chunks for large files
                    timeout: 120000, // 2 minute timeout
                    transformation: [
                        { quality: 'auto:best', fetch_format: 'auto' },
                    ],
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    }
                    else resolve(result as typeof uploadResult);
                }
            );
            uploadStream.end(buffer);
        });

        // Save to database
        const newImage = await PageImage.create({
            page: cleanPage,
            section: cleanSection,
            key: cleanKey,
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            alt: cleanAlt,
            width: uploadResult.width,
            height: uploadResult.height,
        });

        // Revalidate caches
        await revalidateCaches(cleanPage);

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            image: newImage,
        }, { status: 201 });

    } catch (error) {
        console.error('Error uploading page image:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}

// PUT: Update existing page image
export async function PUT(request: NextRequest) {
    const auth = await authenticateAdmin(request);
    if (!auth.success) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const formData = await request.formData();

        const id = formData.get('id') as string | null;
        const file = formData.get('file') as File | null;
        const alt = formData.get('alt') as string | null;

        if (!id) {
            return NextResponse.json(
                { error: 'Image ID is required' },
                { status: 400 }
            );
        }

        // Validate MongoDB ObjectId format
        if (!/^[a-f\d]{24}$/i.test(id)) {
            return NextResponse.json(
                { error: 'Invalid image ID format' },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingImage = await PageImage.findById(id);
        if (!existingImage) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        const updateData: Partial<{
            imageUrl: string;
            publicId: string;
            alt: string;
            width: number;
            height: number;
        }> = {};

        // Update alt text if provided
        if (alt) {
            updateData.alt = sanitizeString(alt);
        }

        // Upload new file if provided
        if (file) {
            if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                return NextResponse.json(
                    { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
                    { status: 400 }
                );
            }

            // Delete old image from Cloudinary
            try {
                await cloudinary.uploader.destroy(existingImage.publicId);
            } catch (deleteError) {
                console.error('Error deleting old image from Cloudinary:', deleteError);
                // Continue with upload even if delete fails
            }

            // Upload new image
            const bytes = await file.arrayBuffer();
            const rawBuffer = Buffer.from(bytes);

            // Compress image if needed (Cloudinary free plan has 10MB limit)
            const buffer = await compressImageIfNeeded(rawBuffer, file.type);

            const uploadResult = await new Promise<{
                secure_url: string;
                public_id: string;
                width: number;
                height: number;
            }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `${CLOUDINARY_FOLDER}/pages/${existingImage.page}/${existingImage.section}`,
                        resource_type: 'image',
                        chunk_size: 6000000, // 6MB chunks for large files
                        timeout: 120000, // 2 minute timeout
                        transformation: [
                            { quality: 'auto:best', fetch_format: 'auto' },
                        ],
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        }
                        else resolve(result as typeof uploadResult);
                    }
                );
                uploadStream.end(buffer);
            });

            updateData.imageUrl = uploadResult.secure_url;
            updateData.publicId = uploadResult.public_id;
            updateData.width = uploadResult.width;
            updateData.height = uploadResult.height;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'No update data provided' },
                { status: 400 }
            );
        }

        const updatedImage = await PageImage.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // Revalidate caches
        await revalidateCaches(existingImage.page);

        return NextResponse.json({
            success: true,
            message: 'Image updated successfully',
            image: updatedImage,
        });

    } catch (error) {
        console.error('Error updating page image:', error);
        return NextResponse.json(
            { error: 'Failed to update image' },
            { status: 500 }
        );
    }
}

// DELETE: Remove page image
export async function DELETE(request: NextRequest) {
    const auth = await authenticateAdmin(request);
    if (!auth.success) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Image ID is required' },
                { status: 400 }
            );
        }

        // Validate MongoDB ObjectId format
        if (!/^[a-f\d]{24}$/i.test(id)) {
            return NextResponse.json(
                { error: 'Invalid image ID format' },
                { status: 400 }
            );
        }

        await dbConnect();

        const image = await PageImage.findById(id);
        if (!image) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(image.publicId);
        } catch (deleteError) {
            console.error('Error deleting from Cloudinary:', deleteError);
            // Continue with DB delete even if Cloudinary fails
        }

        // Delete from database
        await PageImage.findByIdAndDelete(id);

        // Revalidate caches
        await revalidateCaches(image.page);

        return NextResponse.json({
            success: true,
            message: 'Image deleted successfully',
        });

    } catch (error) {
        console.error('Error deleting page image:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
