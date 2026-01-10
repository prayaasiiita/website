import Image from 'next/image';
import Link from 'next/link';

// Define the interface for the props
interface EmpCardProps {
    tag: string;
    tagBgColor: string;
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
        <article className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-[#f8f2ed] rounded-4xl p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col font-sans antialiased text-left shadow-sm hover:shadow-md transition-shadow duration-300 mb-2">


            {/* Text Content Section */}
            <div className="flex flex-col items-start grow">

                {/* Tag */}
                <span
                    className="text-[#0F172A] text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg tracking-wide"
                    style={{ backgroundColor: tagBgColor }}
                >
                    {tag}
                </span>

                {/* Image Section */}
                <div className="mt-3 w-full relative aspect-3/2">
                    <Image
                        src={finalImageSrc}
                        alt={imageAlt}
                        fill
                        className="object-cover rounded-4xl"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Headline */}
                <h2 className="text-[#111827] text-lg sm:text-xl md:text-2xl leading-tight font-bold mt-3 sm:mt-4 tracking-tight">
                    {headline}
                </h2>

                {/* Description */}
                <p className="text-[#6B7280] text-sm sm:text-base leading-snug mt-1.5 sm:mt-2 font-normal line-clamp-3">
                    {description}
                </p>

                {/* CTA Link */}
                <Link
                    href={ctaLink}
                    className="group flex items-center gap-2 mt-4 text-[#111827] font-semibold text-[16px] hover:opacity-80 transition-opacity"
                >
                    {ctaText}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-[#111827]"
                    >
                        <circle cx="12" cy="12" r="11.5" strokeWidth="1" />
                        <path
                            d="M8.5 12H15.5M15.5 12L12.5 9M15.5 12L12.5 15"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>

        </article>
    );
};

export default EmpCard;