'use client';

import { ReactNode, useState } from 'react';

interface ProgramProps {
    href: string;
    info: ReactNode;
    heading: ReactNode;
    svg: ReactNode;
    color?: string;
}

export function Program({ href, info, heading, svg, color = "#e85a4f" }: ProgramProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        // Only flip on mobile (screen width < 640px)
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            setIsFlipped(!isFlipped);
        }
    };

    return (
        <>
            {/* Mobile: 3D Flip Card */}
            <div
                className="sm:hidden w-full max-w-70 h-80 cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={handleClick}
            >
                <div
                    className="relative w-full h-full transition-transform duration-700 ease-in-out"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* Front Face */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 bg-white"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Decorative corners */}
                        <div
                            className="z-10 absolute top-0 right-0 w-[20%] h-[20%] rounded-[0_15px_0_100%]"
                            style={{ backgroundColor: color }}
                        />
                        <div
                            className="z-10 absolute bottom-0 left-0 w-[20%] h-[20%] rounded-[0_100%_0_15px]"
                            style={{ backgroundColor: color }}
                        />
                        {/* Content */}
                        <div className="flex items-center justify-center w-22 h-22 mb-3">
                            {svg}
                        </div>
                        <div className="text-center text-xl font-bold text-gray-800">
                            {heading}
                        </div>
                    </div>

                    {/* Back Face */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-2xl shadow-lg flex flex-col items-center justify-center p-6"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            backgroundColor: color
                        }}
                    >
                        <p className="text-lg leading-relaxed text-center font-bold mb-4">
                            {info}
                        </p>
                        <a
                            className="inline-flex items-center gap-2 mt-2 font-semibold text-gray-700 hover:gap-3 transition-all text-sm"
                            href={href}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Learn More
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Desktop: 3D Flip Card on Hover */}
            <div
                className="hidden sm:block w-full max-w-70 h-75 cursor-pointer group"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:transform-[rotateY(180deg)]"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front Face */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-2xl shadow-lg hover:shadow-xl flex flex-col items-center justify-center p-8 bg-white"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Decorative corners */}
                        <div
                            className="z-10 absolute top-0 right-0 w-[20%] h-[20%] rounded-[0_15px_0_100%]"
                            style={{ backgroundColor: color }}
                        />
                        <div
                            className="z-10 absolute bottom-0 left-0 w-[20%] h-[20%] rounded-[0_100%_0_15px]"
                            style={{ backgroundColor: color }}
                        />
                        {/* Content */}
                        <div className="flex items-center justify-center w-22 h-22 mb-4">
                            {svg}
                        </div>
                        <div className="text-center text-xl font-bold text-gray-800">
                            {heading}
                        </div>
                    </div>

                    {/* Back Face */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-2xl shadow-lg flex flex-col items-center justify-center p-8"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            backgroundColor: color
                        }}
                    >
                        <p className="text-lg leading-relaxed text-center font-bold mb-4">
                            {info}
                        </p>
                        <a
                            className="inline-flex items-center gap-2 mt-2 font-semibold hover:gap-3 transition-all text-lg text-gray-700"
                            href={href}
                        >
                            Learn More
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
