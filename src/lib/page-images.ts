import dbConnect from '@/src/lib/mongodb';
import PageImage, { PageType, SectionType } from '@/src/models/PageImage';
import { unstable_cache } from 'next/cache';
import { TAGS } from '@/src/lib/revalidate-paths';

// Re-export types from DynamicImage for server components
export type { PageImageData, PageImagesMap } from '@/src/components/DynamicImage';
import type { PageImageData, PageImagesMap } from '@/src/components/DynamicImage';

// Get all images for a page (server-side, cached)
// Note: We need separate cache functions per page since unstable_cache doesn't handle dynamic keys well
async function fetchPageImagesFromDB(page: PageType): Promise<PageImagesMap> {
    try {
        await dbConnect();

        const images = await PageImage.find({ page })
            .select('section key imageUrl alt width height')
            .lean();

        const imageMap: PageImagesMap = {};

        images.forEach((img) => {
            // Key format: "section:key" for easy lookup
            const lookupKey = `${img.section}:${img.key}`;
            imageMap[lookupKey] = {
                imageUrl: img.imageUrl,
                alt: img.alt,
                width: img.width,
                height: img.height,
            };
        });

        console.log(`[page-images] Fetched ${images.length} images for page: ${page}`, Object.keys(imageMap));
        return imageMap;
    } catch (error) {
        console.error(`Error fetching images for page ${page}:`, error);
        return {};
    }
}

// Create cached version with page-specific keys
const getCachedHomeImages = unstable_cache(
    () => fetchPageImagesFromDB('home'),
    ['page-images-home'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC, 'page-images', 'page-images-home'],
        revalidate: 60,
    }
);

const getCachedAboutImages = unstable_cache(
    () => fetchPageImagesFromDB('about'),
    ['page-images-about'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC, 'page-images', 'page-images-about'],
        revalidate: 60,
    }
);

const getCachedProgramsImages = unstable_cache(
    () => fetchPageImagesFromDB('programs'),
    ['page-images-programs'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC, 'page-images', 'page-images-programs'],
        revalidate: 60,
    }
);

const getCachedImpactImages = unstable_cache(
    () => fetchPageImagesFromDB('impact'),
    ['page-images-impact'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC, 'page-images', 'page-images-impact'],
        revalidate: 60,
    }
);

const getCachedGalleryImages = unstable_cache(
    () => fetchPageImagesFromDB('gallery'),
    ['page-images-gallery'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC, 'page-images', 'page-images-gallery'],
        revalidate: 60,
    }
);

const getCachedContactImages = unstable_cache(
    () => fetchPageImagesFromDB('contact'),
    ['page-images-contact'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC, 'page-images', 'page-images-contact'],
        revalidate: 60,
    }
);

const getCachedGetInvolvedImages = unstable_cache(
    () => fetchPageImagesFromDB('get-involved'),
    ['page-images-get-involved'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC, 'page-images', 'page-images-get-involved'],
        revalidate: 60,
    }
);

// Main function to get page images
export async function getPageImages(page: PageType): Promise<PageImagesMap> {
    switch (page) {
        case 'home':
            return getCachedHomeImages();
        case 'about':
            return getCachedAboutImages();
        case 'programs':
            return getCachedProgramsImages();
        case 'impact':
            return getCachedImpactImages();
        case 'gallery':
            return getCachedGalleryImages();
        case 'contact':
            return getCachedContactImages();
        case 'get-involved':
            return getCachedGetInvolvedImages();
        default:
            // Fallback to direct DB fetch for unknown pages
            return fetchPageImagesFromDB(page);
    }
}

// Get a single image (server-side, cached)
export const getPageImage = unstable_cache(
    async (page: PageType, section: SectionType, key: string): Promise<PageImageData | null> => {
        try {
            await dbConnect();

            const image = await PageImage.findOne({ page, section, key })
                .select('imageUrl alt width height')
                .lean();

            if (!image) return null;

            return {
                imageUrl: image.imageUrl,
                alt: image.alt,
                width: image.width,
                height: image.height,
            };
        } catch (error) {
            console.error(`Error fetching image ${page}/${section}/${key}:`, error);
            return null;
        }
    },
    ['page-image-single'],
    {
        tags: [TAGS.PAGE_IMAGES, TAGS.PUBLIC],
        revalidate: 3600,
    }
);

// Helper to get image URL with fallback
export function getImageUrl(
    images: PageImagesMap,
    section: string,
    key: string,
    fallback: string
): string {
    const lookupKey = `${section}:${key}`;
    return images[lookupKey]?.imageUrl || fallback;
}

// Helper to get image data with fallback
export function getImageData(
    images: PageImagesMap,
    section: string,
    key: string,
    fallback: { src: string; alt: string }
): { src: string; alt: string; width?: number; height?: number } {
    const lookupKey = `${section}:${key}`;
    const img = images[lookupKey];

    if (img) {
        return {
            src: img.imageUrl,
            alt: img.alt,
            width: img.width,
            height: img.height,
        };
    }

    return fallback;
}

