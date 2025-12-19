import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import PageImage, { PageType, SectionType, ALLOWED_PAGES, ALLOWED_SECTIONS } from '@/src/models/PageImage';

// Validate page value
function isValidPage(page: string): page is PageType {
    return ALLOWED_PAGES.includes(page as PageType);
}

// Validate section value
function isValidSection(section: string): section is SectionType {
    return ALLOWED_SECTIONS.includes(section as SectionType);
}

// GET - Fetch page images (public, cached)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page')?.toLowerCase();
        const section = searchParams.get('section')?.toLowerCase();
        const key = searchParams.get('key')?.toLowerCase();

        await dbConnect();

        // Build query based on params
        const query: Record<string, string> = {};

        if (page) {
            if (!isValidPage(page)) {
                return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
            }
            query.page = page;
        }

        if (section) {
            if (!isValidSection(section)) {
                return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
            }
            query.section = section;
        }

        if (key) {
            query.key = key;
        }

        // Single image lookup
        if (page && section && key) {
            const image = await PageImage.findOne(query).lean();

            if (!image) {
                return NextResponse.json({ image: null }, { status: 200 });
            }

            return NextResponse.json({
                image: {
                    imageUrl: image.imageUrl,
                    alt: image.alt,
                    width: image.width,
                    height: image.height,
                }
            }, { status: 200 });
        }

        // Multiple images
        const images = await PageImage.find(query)
            .select('page section key imageUrl alt width height')
            .sort({ section: 1, key: 1 })
            .lean();

        // Create lookup map for easy access
        const imageMap = images.reduce((acc, img) => {
            const lookupKey = `${img.page}:${img.section}:${img.key}`;
            acc[lookupKey] = {
                imageUrl: img.imageUrl,
                alt: img.alt,
                width: img.width,
                height: img.height,
            };
            return acc;
        }, {} as Record<string, { imageUrl: string; alt: string; width?: number; height?: number }>);

        return NextResponse.json({
            images,
            imageMap,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching page images:', error);
        return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }
}
