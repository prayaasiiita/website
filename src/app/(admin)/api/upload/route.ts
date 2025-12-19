import { NextRequest, NextResponse } from 'next/server';
import cloudinary, { CLOUDINARY_FOLDER } from '@/src/lib/cloudinary';
import { verifyToken } from '@/src/lib/auth';

// Helper to verify admin authentication
function verifyAdmin(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

// POST - Upload image to Cloudinary
export async function POST(request: NextRequest) {
    try {
        const payload = verifyAdmin(request);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const folder = (formData.get('folder') as string) || 'team';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            folder: `${CLOUDINARY_FOLDER}/${folder}`,
            resource_type: 'image',
            transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        });

        return NextResponse.json(
            {
                message: 'Image uploaded successfully',
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}

// DELETE - Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
    try {
        const payload = verifyAdmin(request);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const publicId = searchParams.get('publicId');

        if (!publicId) {
            return NextResponse.json(
                { error: 'No publicId provided' },
                { status: 400 }
            );
        }

        await cloudinary.uploader.destroy(publicId);

        return NextResponse.json(
            { message: 'Image deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
