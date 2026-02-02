'use client';

import { ReactNode, useState } from 'react';

interface ProgramProps {
    href: string;
    info: ReactNode;
    heading: ReactNode;
    svg: ReactNode;
    color?: string;
    gradient?: string;
}

export function Program({ href, info, heading, svg, color = "#e85a4f", gradient = "from-orange-400 to-orange-600" }: ProgramProps) {
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
                className="sm:hidden w-full max-w-72 h-[340px] cursor-pointer"
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
                        className="absolute inset-0 w-full h-full rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center justify-center p-6 bg-white overflow-hidden transition-shadow duration-500"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Background decorative blob */}
                        <div 
                            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
                            style={{ backgroundColor: color }}
                        />
                        <div 
                            className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-15"
                            style={{ backgroundColor: color }}
                        />
                        
                        {/* Top left corner accent */}
                        <div 
                            className="absolute top-0 left-0 w-20 h-1 rounded-r-full"
                            style={{ backgroundColor: color }}
                        />
                        <div 
                            className="absolute top-0 left-0 w-1 h-20 rounded-b-full"
                            style={{ backgroundColor: color }}
                        />
                        
                        {/* Icon with creative background */}
                        <div className="relative mb-6">
                            {/* Icon container */}
                            <div 
                                className="relative w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 hover:scale-105 hover:rotate-3"
                                style={{ backgroundColor: `${color}15` }}
                            >
                                <div className="w-12 h-12 flex items-center justify-center">
                                    {svg}
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center text-xl font-bold text-gray-800 mb-3">
                            {heading}
                        </div>
                        
                        {/* Short preview text */}
                        <p className="text-sm text-gray-500 text-center line-clamp-2 px-2">
                            {info}
                        </p>
                        
                        {/* Tap hint */}
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium" style={{ color }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                            Tap for more
                        </div>
                    </div>

                    {/* Back Face */}
                    <div
                        className={`absolute inset-0 w-full h-full rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 bg-linear-to-br ${gradient} overflow-hidden`}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        <p className="text-base leading-relaxed text-center font-medium text-white mb-6 relative z-10">
                            {info}
                        </p>
                        <a
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm font-semibold text-white hover:bg-white/30 hover:gap-3 transition-all"
                            href={href}
                            onClick={(e) => e.stopPropagation()}
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

            {/* Desktop: 3D Flip Card on Hover */}
            <div
                className="hidden sm:block w-full max-w-72 h-[340px] cursor-pointer group"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:transform-[rotateY(180deg)]"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front Face */}
                    <div
                        className="absolute inset-0 w-full h-full rounded-3xl shadow-lg group-hover:shadow-2xl flex flex-col items-center justify-center p-8 bg-white overflow-hidden transition-all duration-500"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Background decorative blobs */}
                        <div 
                            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-15 group-hover:opacity-25 transition-opacity duration-500"
                            style={{ backgroundColor: color }}
                        />
                        <div 
                            className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                            style={{ backgroundColor: color }}
                        />
                        
                        {/* Corner accent lines */}
                        <div 
                            className="absolute top-0 left-0 w-16 h-1 rounded-r-full transition-all duration-500 group-hover:w-24"
                            style={{ backgroundColor: color }}
                        />
                        <div 
                            className="absolute top-0 left-0 w-1 h-16 rounded-b-full transition-all duration-500 group-hover:h-24"
                            style={{ backgroundColor: color }}
                        />
                        <div 
                            className="absolute bottom-0 right-0 w-12 h-1 rounded-l-full opacity-50 transition-all duration-500 group-hover:w-20"
                            style={{ backgroundColor: color }}
                        />
                        <div 
                            className="absolute bottom-0 right-0 w-1 h-12 rounded-t-full opacity-50 transition-all duration-500 group-hover:h-20"
                            style={{ backgroundColor: color }}
                        />
                        
                        {/* Icon with creative background */}
                        <div className="relative mb-6">
                            {/* Icon container */}
                            <div 
                                className="relative w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rounded-3xl group-hover:rotate-3"
                                style={{ backgroundColor: `${color}12` }}
                            >
                                <div className="w-14 h-14 flex items-center justify-center">
                                    {svg}
                                </div>
                                {/* Glow on hover */}
                                <div 
                                    className="absolute inset-0 rounded-2xl group-hover:rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                                    style={{ boxShadow: `0 0 50px ${color}40` }}
                                />
                            </div>
                        </div>
                        
                        <div className="text-center text-xl font-bold text-gray-800 mb-2 relative z-10">
                            {heading}
                        </div>
                        
                        {/* Description preview */}
                        <p className="text-sm text-gray-500 text-center line-clamp-2 px-2 mb-3 relative z-10">
                            {info}
                        </p>
                        
                        {/* Hover hint with arrow */}
                        <div 
                            className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
                            style={{ color }}
                        >
                            <span>See more</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce-slow">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Back Face */}
                    <div
                        className={`absolute inset-0 w-full h-full rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 bg-linear-to-br ${gradient} overflow-hidden`}
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                        }}
                    >
                        {/* Decorative circles */}
                        <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/10" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-white/10" />
                        <div className="absolute top-1/2 left-6 w-3 h-3 rounded-full bg-white/30" />
                        
                        <p className="text-base leading-relaxed text-center font-medium text-white mb-6 relative z-10">
                            {info}
                        </p>
                        <a
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm font-semibold text-white hover:bg-white/30 hover:gap-3 transition-all shadow-lg"
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
