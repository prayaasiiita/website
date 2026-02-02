import Image from 'next/image';
import Link from 'next/link';

// Define the interface for the props
interface EmpCardProps {
    tag: string;
    tagBgColor?: string;
    headline: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    ctaText?: string;
    ctaLink?: string;
}

const DUMMY_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23E5D4C1' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='28' font-weight='bold' fill='%23999' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif'%3ENo Image Available%3C/text%3E%3C/svg%3E";

const EmpCard = ({
    tag,
    tagBgColor,
    headline,
    description,
    imageSrc,
    imageAlt = "Impact story image",
    ctaText = "Read Impact Story",
    ctaLink = "#",
}: EmpCardProps) => {
    const finalImageSrc = imageSrc && imageSrc.trim() ? imageSrc : DUMMY_IMAGE;

    return (
        <article className="group w-full h-full bg-gradient-to-br from-white to-[#fef7f0] rounded-4xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col font-sans antialiased text-left shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#fed7aa]/20 hover:border-[var(--ngo-orange)]/20 relative overflow-hidden hover:-translate-y-1">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-[var(--ngo-orange)]/10 to-transparent rotate-45 transform origin-bottom-left transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
            </div>
            
            {/* Subtle shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ngo-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Text Content Section */}
            <div className="flex flex-col items-start grow relative">

                {/* Tag */}
                <span
                    className="text-[#0F172A] text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl tracking-wide shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: tagBgColor || '#f2d5c4' }}
                >
                    {tag}
                </span>

                {/* Image Section */}
                <div className="mt-3 w-full relative aspect-3/2 rounded-3xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-500">
                    <Image
                        src={finalImageSrc}
                        alt={imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Story indicator */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-white text-xs font-medium drop-shadow-lg">Read Story</span>
                    </div>
                </div>

                {/* Headline - uses explicit height for 2 lines: text-lg=1.125rem, leading-tight≈1.25 → 2*1.125*1.25 = 2.8125rem */}
                <h2 className="text-[#111827] text-lg sm:text-xl md:text-2xl leading-tight font-bold mt-3 sm:mt-4 tracking-tight line-clamp-2 h-[2.8rem] sm:h-[3.1rem] md:h-[3.75rem] group-hover:text-[var(--ngo-dark)] transition-colors">
                    {headline}
                </h2>

                {/* Description - uses explicit height for 3 lines: text-sm=0.875rem, leading-snug≈1.375 → 3*0.875*1.375 ≈ 3.6rem */}
                <p className="text-[#6B7280] text-sm sm:text-base leading-snug mt-1.5 sm:mt-2 font-normal line-clamp-3 h-[3.6rem] sm:h-[4.1rem]">
                    {description}
                </p>

                {/* CTA Link */}
                <Link
                    href={ctaLink}
                    className="group/cta flex items-center gap-2 mt-auto pt-4 text-[#111827] font-semibold text-[16px] hover:text-[var(--ngo-orange)] transition-all duration-300"
                >
                    {ctaText}
                    <span className="relative w-8 h-8 rounded-full border border-current flex items-center justify-center overflow-hidden transition-all duration-300 group-hover/cta:bg-[var(--ngo-orange)] group-hover/cta:border-[var(--ngo-orange)]">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="transition-all duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:text-white"
                        >
                            <path
                                d="M8.5 12H15.5M15.5 12L12.5 9M15.5 12L12.5 15"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </Link>
            </div>

        </article>
    );
};

export default EmpCard;