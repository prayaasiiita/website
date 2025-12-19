import Image from "next/image";

// Shared interface (duplicated from page-images.ts to avoid server-only imports)
export interface PageImageData {
    imageUrl: string;
    alt: string;
    width?: number;
    height?: number;
}

export interface PageImagesMap {
    [key: string]: PageImageData;
}

interface DynamicImageProps {
    images: PageImagesMap;
    section: string;
    imageKey: string;
    fallbackSrc: string;
    fallbackAlt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    sizes?: string;
    quality?: number;
}

/**
 * DynamicImage component that uses pre-fetched images from the database
 * Falls back to default image if not found in the database
 */
export function DynamicImage({
    images,
    section,
    imageKey,
    fallbackSrc,
    fallbackAlt,
    fill = false,
    width,
    height,
    className = "",
    priority = false,
    sizes,
    quality = 85,
}: DynamicImageProps) {
    const lookupKey = `${section}:${imageKey}`;
    const imageData = images[lookupKey];

    const src = imageData?.imageUrl || fallbackSrc;
    const alt = imageData?.alt || fallbackAlt;

    // For fill mode
    if (fill) {
        return (
            <Image
                src={src}
                alt={alt}
                fill
                className={className}
                priority={priority}
                sizes={sizes}
                quality={quality}
            />
        );
    }

    // For explicit dimensions
    const imgWidth = imageData?.width || width || 800;
    const imgHeight = imageData?.height || height || 600;

    return (
        <Image
            src={src}
            alt={alt}
            width={imgWidth}
            height={imgHeight}
            className={className}
            priority={priority}
            sizes={sizes}
            quality={quality}
        />
    );
}

/**
 * Helper to get image src with fallback
 */
export function getImageSrc(
    images: PageImagesMap,
    section: string,
    imageKey: string,
    fallback: string
): string {
    const lookupKey = `${section}:${imageKey}`;
    return images[lookupKey]?.imageUrl || fallback;
}

/**
 * Helper to get image alt with fallback
 */
export function getImageAlt(
    images: PageImagesMap,
    section: string,
    imageKey: string,
    fallback: string
): string {
    const lookupKey = `${section}:${imageKey}`;
    return images[lookupKey]?.alt || fallback;
}

/**
 * Helper to get both src and alt
 */
export function getImageProps(
    images: PageImagesMap,
    section: string,
    imageKey: string,
    fallback: { src: string; alt: string }
): { src: string; alt: string } {
    const lookupKey = `${section}:${imageKey}`;
    const data = images[lookupKey];

    return {
        src: data?.imageUrl || fallback.src,
        alt: data?.alt || fallback.alt,
    };
}

/**
 * Helper to get all carousel/slide images for a section
 * Keys should be: slide-1, slide-2, slide-3, etc.
 * Supports unlimited slides!
 */
export function getCarouselImages(
    images: PageImagesMap,
    section: string,
    fallbacks: { src: string; alt: string }[]
): { src: string; alt: string; width?: number; height?: number }[] {
    // Find all images matching the pattern section:slide-*
    const carouselImages: { src: string; alt: string; width?: number; height?: number; index: number }[] = [];

    Object.entries(images).forEach(([key, data]) => {
        if (key.startsWith(`${section}:slide-`)) {
            const indexStr = key.replace(`${section}:slide-`, '');
            const index = parseInt(indexStr, 10);
            if (!isNaN(index)) {
                carouselImages.push({
                    src: data.imageUrl,
                    alt: data.alt,
                    width: data.width,
                    height: data.height,
                    index,
                });
            }
        }
    });

    // Sort by index and return
    if (carouselImages.length > 0) {
        return carouselImages
            .sort((a, b) => a.index - b.index)
            .map(({ src, alt, width, height }) => ({ src, alt, width, height }));
    }

    // Return fallbacks if no images found
    return fallbacks;
}
