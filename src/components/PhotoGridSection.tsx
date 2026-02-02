"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";
import { Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(" ");
}

export type ImageInfo = {
    src: string;
    alt: string;
    aspect: string;
};

// Lightbox Modal Component
function ImageLightbox({
    image,
    onClose,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
}: {
    image: ImageInfo;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
}) {
    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && hasPrev) onPrev();
            if (e.key === "ArrowRight" && hasNext) onNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, onPrev, onNext, hasPrev, hasNext]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Previous button */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Next button */}
            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Image container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={image.src}
                    alt={image.alt}
                    width={1200}
                    height={800}
                    className="object-contain max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                    priority
                />
            </motion.div>

            {/* Image caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {image.alt}
            </div>
        </motion.div>
    );
}

const PhotoCarousel = React.memo(function PhotoCarousel({
    images,
    direction,
    heightClass,
    animationDuration,
    onImageClick,
}: {
    images: ImageInfo[];
    direction: "left" | "right";
    heightClass: string;
    animationDuration: string;
    onImageClick: (image: ImageInfo, index: number) => void;
}) {
    const extendedImages = [...images, ...images];
    const animationClass =
        direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

    const maskStyle = React.useMemo(
        () => ({
            WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%)",
            maskImage:
                "linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%)",
        }),
        []
    );

    return (
        <div className={cn("relative group w-full overflow-hidden", heightClass)} style={maskStyle}>
            <div
                className={cn("flex h-full w-max", animationClass)}
                style={{ animationDuration }}
                aria-hidden
            >
                {extendedImages.map((image, index) => (
                    <div
                        key={index}
                        className={cn("relative shrink-0 mx-2 h-full group/image", image.aspect)}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover rounded-lg shadow-sm"
                        />
                        {/* Eye button overlay - appears on hover */}
                        <button
                            onClick={() => onImageClick(image, index % images.length)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover/image:opacity-100 transition-all duration-300 transform scale-75 group-hover/image:scale-100 hover:scale-110 z-10"
                            aria-label="View full image"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300 rounded-lg pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default function PhotoGridSection({
    imagesArray,
}: {
    imagesArray: ImageInfo[];
}) {
    const [lightboxImage, setLightboxImage] = useState<{ image: ImageInfo; index: number } | null>(null);

    const rotateImages = React.useCallback(
        (offset: number) =>
            imagesArray.map(
                (_, index) => imagesArray[(index + offset) % imagesArray.length]
            ),
        [imagesArray]
    );

    const imagesRow1 = imagesArray;
    const imagesRow2 = rotateImages(Math.floor(imagesArray.length / 3));
    const imagesRow3 = rotateImages(Math.floor((imagesArray.length * 2) / 3));

    const handleImageClick = useCallback((image: ImageInfo, index: number) => {
        // Find the actual index in the original array
        const actualIndex = imagesArray.findIndex(img => img.src === image.src);
        setLightboxImage({ image, index: actualIndex >= 0 ? actualIndex : index });
    }, [imagesArray]);

    const handleClose = useCallback(() => {
        setLightboxImage(null);
    }, []);

    const handlePrev = useCallback(() => {
        if (lightboxImage) {
            const newIndex = (lightboxImage.index - 1 + imagesArray.length) % imagesArray.length;
            setLightboxImage({ image: imagesArray[newIndex], index: newIndex });
        }
    }, [lightboxImage, imagesArray]);

    const handleNext = useCallback(() => {
        if (lightboxImage) {
            const newIndex = (lightboxImage.index + 1) % imagesArray.length;
            setLightboxImage({ image: imagesArray[newIndex], index: newIndex });
        }
    }, [lightboxImage, imagesArray]);

    return (
        <>
            {/* animations */}
            <style>
                {`
            @keyframes scroll-left {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
            }
            @keyframes scroll-right {
                from { transform: translateX(-50%); }
                to { transform: translateX(0); }
            }
            .animate-scroll-left {
                animation-name: scroll-left;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
            .animate-scroll-right {
                animation-name: scroll-right;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
            .group:hover .animate-scroll-left,
            .group:hover .animate-scroll-right {
                animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
                .animate-scroll-left,
                .animate-scroll-right {
                    animation-duration: 1ms;
                    animation-play-state: paused;
                }
            }
        `}
            </style>

            <div className="py-4 md:py-5 space-y-5">
                <PhotoCarousel
                    images={imagesRow1}
                    direction="left"
                    heightClass="h-[160px] md:h-[200px]"
                    animationDuration="160s"
                    onImageClick={handleImageClick}
                />
                <PhotoCarousel
                    images={imagesRow2}
                    direction="right"
                    heightClass="h-[200px] md:h-[280px]"
                    animationDuration="190s"
                    onImageClick={handleImageClick}
                />
                <PhotoCarousel
                    images={imagesRow3}
                    direction="left"
                    heightClass="h-[160px] md:h-[200px]"
                    animationDuration="170s"
                    onImageClick={handleImageClick}
                />
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <ImageLightbox
                        image={lightboxImage.image}
                        onClose={handleClose}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        hasPrev={imagesArray.length > 1}
                        hasNext={imagesArray.length > 1}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
