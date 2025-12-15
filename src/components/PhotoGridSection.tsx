"use client";

import Image from "next/image";
import React from "react";

function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(" ");
}

export type ImageInfo = {
    src: string;
    alt: string;
    aspect: string;
};

const PhotoCarousel = React.memo(function PhotoCarousel({
    images,
    direction,
    heightClass,
    animationDuration,
}: {
    images: ImageInfo[];
    direction: "left" | "right";
    heightClass: string;
    animationDuration: string;
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
                        className={cn("relative shrink-0 mx-2 h-full", image.aspect)}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover rounded-lg shadow-sm"
                        />
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
                />
                <PhotoCarousel
                    images={imagesRow2}
                    direction="right"
                    heightClass="h-[200px] md:h-[280px]"
                    animationDuration="190s"
                />
                <PhotoCarousel
                    images={imagesRow3}
                    direction="left"
                    heightClass="h-[160px] md:h-[200px]"
                    animationDuration="170s"
                />
            </div>
        </>
    );
}
