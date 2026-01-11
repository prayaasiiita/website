"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "@/src/components/ui/spotlightCard";
import {
    Heart,
    Users,
    BookOpen,
    Palette,
    Lightbulb,
    HandHeart,
    ArrowRight,
    Calendar,
    Phone,
    HelpingHand,
} from "lucide-react";
import PhotoGridSection from "@/src/components/PhotoGridSection";
import { PageImagesMap, getImageSrc, getCarouselImages } from "@/src/components/DynamicImage";
import EmpCard from "@/src/components/ui/empCard";
import { Program } from "@/src/components/ui/program";
import { StudentSvg } from "@/src/components/svg/StudentSvg";
import { DrawingSvg } from "@/src/components/svg/DrawingSvg";
import { ChildrenPlayingSvg } from "@/src/components/svg/ChildrenPlayingSvg";
import { HelpingHandSvg } from "@/src/components/svg/HelpingHandSvg";

// Default fallback images
const FALLBACK_IMAGES = {
    hero: { src: "/p2.jpg", alt: "Children studying" },
    about: [
        { src: "/p1.jpg", alt: "Children learning" },
        { src: "/p2.jpg", alt: "Students studying" },
    ],
    cta: {
        src: "",
        alt: "Children",
    },
};

function Counter({
    end,
    suffix = "",
    duration = 2000,
}: {
    end: number;
    suffix?: string;
    duration?: number;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const increment = end / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, end, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    );
}

function HeroSection({ images }: { images: PageImagesMap }) {
    const heroSrc = getImageSrc(images, "hero", "main", FALLBACK_IMAGES.hero.src);
    const heroAlt = images["hero:main"]?.alt || FALLBACK_IMAGES.hero.alt;
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={heroSrc}
                    alt={heroAlt}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="hero-gradient absolute inset-0" />
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/25 to-black/10" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-24 pb-12 sm:pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-xs rounded-3xl text-white text-base sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg">
                        A Students Initiative at IIIT Allahabad
                    </span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Empowering Lives,
                    <br />
                    <span className="bg-linear-to-r from-[#FFF6A5] via-[#F2C94C] to-[#fedc8d] bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(242,201,76,0.45)]">
                        Education is Opportunity to Success
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8 sm:mb-10 px-4"
                >
                    Prayaas is an earnest attempt to bring sunshine in wearisome lives. It
                    is a volunteer movement initiated by student fraternity of IIIT
                    Allahabad to ameliorate the life of not so privileged kids.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
                >
                    <Link
                        href="/get-involved#donate"
                        className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs"
                    >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        Donate Now
                    </Link>
                    <Link
                        href="/contact-us"
                        className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs"
                    >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        Contact Us
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

function AboutSection({ images }: { images: PageImagesMap }) {
    // Get all carousel images dynamically (supports unlimited slides)
    const aboutImages = getCarouselImages(images, "about", FALLBACK_IMAGES.about);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % aboutImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [aboutImages.length]);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="bg-white py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm">
                            About Prayaas
                        </span>
                        <h2
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4 sm:mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Transforming Communities Through Education
                        </h2>
                        <p className="text-(--ngo-gray) text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
                            Prayaas, which means &ldquo;effort&rdquo; in Hindi, is a student-run
                            social initiative at IIIT Allahabad. Founded by compassionate
                            students who believe in the power of education, we work tirelessly
                            to bridge the gap between privilege and potential.
                        </p>
                        <p className="text-(--ngo-gray) text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                            Our volunteers dedicate their time to teaching underprivileged
                            children from nearby villages, providing them with academic
                            support, life skills training, and recreational activities that
                            nurture their overall development.
                        </p>
                        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            {[
                                { icon: Heart, label: "Compassion", color: "var(--ngo-orange)" },
                                { icon: BookOpen, label: "Education", color: "var(--ngo-green)" },
                                { icon: Users, label: "Community", color: "var(--ngo-yellow)" },
                            ].map((item) => (
                                <div key={item.label} className="text-center">
                                    <div
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center"
                                        style={{ backgroundColor: `${item.color}20` }}
                                    >
                                        <item.icon
                                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9"
                                            style={{ color: item.color }}
                                        />
                                    </div>
                                    <span className="font-bold text-(--ngo-dark) text-xs sm:text-sm md:text-base">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${activeIndex * 100}%` }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                {aboutImages.map((image, index) => (
                                    <div key={`about-${index}`} className="min-w-full aspect-4/3 sm:aspect-3/2 relative">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority={index === 0}
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                            <div className="absolute inset-x-0 bottom-3 sm:bottom-4 flex items-center justify-center gap-2">
                                {aboutImages.map((_, index) => (
                                    <button
                                        key={`dot-${index}`}
                                        type="button"
                                        aria-label={`Show slide ${index + 1}`}
                                        onClick={() => handleDotClick(index)}
                                        className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                                            ? "w-6 sm:w-8 bg-(--ngo-orange)"
                                            : "w-2 sm:w-3 bg-white/70 hover:bg-white"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-48 h-48 sm:w-72 sm:h-72 bg-(--ngo-orange)/10 rounded-xl sm:rounded-2xl -z-10" />
                        <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-32 h-32 sm:w-48 sm:h-48 bg-(--ngo-green)/10 rounded-xl sm:rounded-2xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ProgramsSection() {
    const programs = [
        {
            icon: StudentSvg,
            title: "Education & Tutoring",
            description:
                "Regular classes covering academics, computer literacy, and language skills to help children excel in their studies.",
            color: "var(--ngo-orange)",
        },
        {
            icon: DrawingSvg,
            title: "Recreational Activities",
            description:
                "Art, music, sports, and cultural programs that foster creativity and teamwork among children.",
            color: "#4ade80",
        },
        {
            icon: ChildrenPlayingSvg,
            title: "Life Skills Development",
            description:
                "Sessions on hygiene, communication, leadership, and other essential skills for holistic growth.",
            color: "var(--ngo-yellow)",
        },
        {
            icon: HelpingHandSvg,
            title: "Community Outreach",
            description:
                "Health camps, awareness drives, and community events that extend our impact beyond the classroom.",
            color: "#8b5cf6",
        },
    ];

    return (
        <section className="section-gradient py-8 sm:py-12 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10 sm:mb-12 md:mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm">
                        What We Do
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-3 sm:mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Our Programs
                    </h2>
                    <p className="text-(--ngo-gray) text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                        We run comprehensive programs designed to nurture every aspect of a
                        child&apos;s development
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="h-full flex justify-center"
                        >
                            <Program
                                href={`/programs#${program.title.toLowerCase().replace(/ /g, "-")}`}
                                info={program.description}
                                heading={program.title}
                                svg={<program.icon />}
                                color={program.color}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ImpactSection() {
    const stats = [
        { value: 5000, suffix: "+", label: "Children Educated", icon: BookOpen },
        { value: 30, suffix: "+", label: "Active Volunteers", icon: Users },
        { value: 100, suffix: "+", label: "Events Conducted", icon: Calendar },
        { value: 21, suffix: "+", label: "Years of Impact", icon: Heart },
    ];

    return (
        <section className="bg-(--ngo-dark) relative overflow-hidden py-8 sm:py-12 md:py-14">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-(--ngo-orange) rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-(--ngo-green) rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10 sm:mb-12 md:mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm">
                        Our Impact
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2 mb-3 sm:mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Creating Lasting Change
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                        Every number represents a story of hope, transformation, and a step
                        towards a brighter future
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <SpotlightCard
                                className="h-full text-center p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                                spotlightColor="rgba(255, 255, 255, 0.25)"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-(--ngo-orange)/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-(--ngo-orange)" />
                                </div>
                                <div
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    <Counter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-gray-400 font-medium text-sm sm:text-base">{stat.label}</p>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

type EmpowermentItem = {
    _id: string;
    title: string;
    shortDescription: string;
    coverImageUrl?: string;
    coverImageAlt?: string;
    slug: string;
    tags?: { _id: string; name: string; color?: string }[];
};

function TestimonialsSection() {
    const [empowerments, setEmpowerments] = useState<EmpowermentItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [cardWidth, setCardWidth] = useState(0);
    const [gap, setGap] = useState(24);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch empowerments from MongoDB
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/empowerments?limit=12');
                if (!res.ok) {
                    console.warn('Failed to fetch empowerments:', res.status);
                    return;
                }
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    setEmpowerments(data.items);
                }
            } catch (error) {
                console.warn('Error fetching empowerments:', error);
            }
        }
        load();
    }, []);

    const items = empowerments;
    const totalItems = items.length;

    // Calculate card width and gap based on viewport
    // Shows partial cards to indicate more content (peek effect)
    useEffect(() => {
        const calculateDimensions = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            const viewportWidth = window.innerWidth;

            // Fractional values create the "peek" effect:
            // - 1.5 = 1 full card + half of next card visible
            // - 2.5 = 2 full cards + half of next card visible
            // - 3.5 = 3 full cards + half of next card visible
            let cardsVisible: number;
            let currentGap: number;

            if (viewportWidth < 640) {
                // Mobile: 1 full card + 0.5 peek
                cardsVisible = 1.5;
                currentGap = 12;
            } else if (viewportWidth < 1024) {
                // Tablet: 2 full cards + 0.5 peek
                cardsVisible = 2.5;
                currentGap = 16;
            } else {
                // Desktop: 3 full cards + 0.5 peek
                cardsVisible = 3.5;
                currentGap = 24;
            }

            // Calculate card width to fit the fractional number of cards
            // Formula: (containerWidth - total gaps) / cardsVisible
            // The number of gaps = floor(cardsVisible) since we're showing partial cards
            const numGaps = Math.floor(cardsVisible);
            const totalGapWidth = numGaps * currentGap;
            const calculatedCardWidth = (containerWidth - totalGapWidth) / cardsVisible;

            setCardWidth(calculatedCardWidth);
            setGap(currentGap);
        };

        calculateDimensions();
        window.addEventListener('resize', calculateDimensions);
        return () => window.removeEventListener('resize', calculateDimensions);
    }, [items.length]);

    // Auto-play carousel - infinite loop
    useEffect(() => {
        if (!isAutoPlay || totalItems === 0 || isTransitioning) return;

        if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

        autoPlayIntervalRef.current = setInterval(() => {
            handleNext();
        }, 4000);

        return () => {
            if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
        };
    }, [isAutoPlay, totalItems, isTransitioning]);

    const handlePrev = () => {
        if (isTransitioning || totalItems === 0) return;

        setIsAutoPlay(false);
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);

        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlay(true), 5000);
    };

    const handleNext = () => {
        if (isTransitioning || totalItems === 0) return;

        setIsAutoPlay(false);
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);

        if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlay(true), 5000);
    };

    // Handle transition end - reset position for infinite loop
    const handleTransitionEnd = () => {
        setIsTransitioning(false);

        // If we've gone past the end, jump to the real first item
        if (currentIndex >= totalItems) {
            setCurrentIndex(0);
        }
        // If we've gone before the start, jump to the real last item
        else if (currentIndex < 0) {
            setCurrentIndex(totalItems - 1);
        }
    };

    // Don't render the section if no items
    if (items.length === 0) {
        return null;
    }

    // Create extended items array: [last, ...all, first] for infinite loop
    const extendedItems = [
        { ...items[totalItems - 1], _cloneId: 'clone-start' },
        ...items,
        { ...items[0], _cloneId: 'clone-end' },
    ];

    // Calculate transform offset (add 1 because of clone at start)
    const translateX = -((currentIndex + 1) * (cardWidth + gap));

    // Determine if we should animate (don't animate when jumping from clone to real)
    const shouldAnimate = isTransitioning;

    // Get the actual index for dot indicators (handle wrap-around)
    const displayIndex = currentIndex < 0
        ? totalItems - 1
        : currentIndex >= totalItems
            ? 0
            : currentIndex;

    return (
        <section className="py-8 sm:py-12 md:py-14 bg-white">
            <div className="w-full max-w-none mx-auto px-3 sm:px-4 lg:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-5 sm:mb-4 md:mb-7"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm">
                        Real Stories
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-1 mb-1 sm:mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Stories of Empowerment
                    </h2>
                    <p className="text-(--ngo-gray) text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                        Explore inspiring stories of transformation
                    </p>
                </motion.div>

                {/* Carousel Container */}
                <div className="relative group">
                    <div
                        ref={containerRef}
                        className="overflow-hidden relative group-hover:overflow-visible"
                    >
                        <div
                            className="flex items-stretch gap-1 sm:gap-6 w-fit"
                            style={{
                                transform: `translateX(${translateX}px)`,
                                transition: shouldAnimate ? 'transform 500ms ease-in-out' : 'none',
                                gap: `${gap}px`,
                            }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {extendedItems.map((item, index) => (
                                <div
                                    key={'_cloneId' in item ? item._cloneId : item._id}
                                    className="shrink-0 h-full"
                                    style={{ width: cardWidth > 0 ? `${cardWidth}px` : '100%' }}
                                    onMouseEnter={() => setIsAutoPlay(false)}
                                    onMouseLeave={() => setIsAutoPlay(true)}
                                >
                                    <EmpCard
                                        tag={item.tags?.[0]?.name ?? "Impact Story"}
                                        tagBgColor={item.tags?.[0]?.color}
                                        headline={item.title}
                                        description={item.shortDescription}
                                        imageSrc={item.coverImageUrl}
                                        imageAlt={item.coverImageAlt || item.title}
                                        ctaText="Read More"
                                        ctaLink={`/empowerments/${item.slug}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4">
                    <button
                        onClick={handlePrev}
                        disabled={isTransitioning}
                        className="z-10 p-2 sm:p-3 rounded-full bg-(--ngo-orange) text-white hover:bg-(--ngo-orange)/80 transition-all disabled:opacity-50"
                        aria-label="Previous stories"
                    >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
                    </button>

                    {/* Dot Indicators */}
                    <div className="flex items-center gap-2">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (isTransitioning) return;
                                    setIsAutoPlay(false);
                                    setIsTransitioning(true);
                                    setCurrentIndex(index);
                                    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
                                    autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlay(true), 5000);
                                }}
                                className={`h-2 rounded-full transition-all ${displayIndex === index
                                    ? "w-8 bg-(--ngo-orange)"
                                    : "w-2 bg-(--ngo-gray)/30 hover:bg-(--ngo-gray)/50"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={isTransitioning}
                        className="z-10 p-2 sm:p-3 rounded-full bg-(--ngo-orange) text-white hover:bg-(--ngo-orange)/80 transition-all disabled:opacity-50"
                        aria-label="Next stories"
                    >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}


function GallerySection({ images }: { images: PageImagesMap }) {
    // Get gallery images from database, fall back to local images
    const dynamicGalleryImages = getCarouselImages(images, "gallery", []);

    // Default local gallery images as fallback
    const localGalleryImages = [
        { src: "/gallery/1.jpeg", alt: "1", aspect: "aspect-[3/2]" },
        { src: "/gallery/2.jpeg", alt: "2", aspect: "aspect-[3/2]" },
        { src: "/gallery/3.jpeg", alt: "3", aspect: "aspect-[2/3]" },
        { src: "/gallery/4.jpeg", alt: "4", aspect: "aspect-[3/2]" },
        { src: "/gallery/5.jpeg", alt: "5", aspect: "aspect-[2/3]" },
        { src: "/gallery/6.jpeg", alt: "6", aspect: "aspect-[3/2]" },
        { src: "/gallery/7.jpeg", alt: "7", aspect: "aspect-[3/2]" },
        { src: "/gallery/8.jpeg", alt: "8", aspect: "aspect-[3/2]" },
        { src: "/gallery/9.jpeg", alt: "9", aspect: "aspect-[3/2]" },
        { src: "/gallery/10.jpeg", alt: "10", aspect: "aspect-[3/2]" },
        { src: "/gallery/11.jpeg", alt: "11", aspect: "aspect-[3/2]" },
        { src: "/gallery/12.jpeg", alt: "12", aspect: "aspect-[3/2]" },
        { src: "/gallery/13.jpeg", alt: "13", aspect: "aspect-[3/2]" },
        { src: "/gallery/14.jpeg", alt: "14", aspect: "aspect-[3/2]" },
        { src: "/gallery/15.jpeg", alt: "15", aspect: "aspect-[3/2]" },
        { src: "/gallery/16.jpeg", alt: "16", aspect: "aspect-[3/2]" },
        { src: "/gallery/17.jpeg", alt: "17", aspect: "aspect-[3/2]" },
        { src: "/gallery/18.jpeg", alt: "18", aspect: "aspect-[3/2]" },
        { src: "/gallery/19.jpeg", alt: "19", aspect: "aspect-[3/2]" },
        { src: "/gallery/20.jpeg", alt: "20", aspect: "aspect-[3/2]" },
        { src: "/gallery/21.jpeg", alt: "21", aspect: "aspect-[3/2]" },
        { src: "/gallery/22.jpeg", alt: "22", aspect: "aspect-[3/2]" },
        { src: "/gallery/23.jpeg", alt: "23", aspect: "aspect-[2/3]" },
        { src: "/gallery/24.jpeg", alt: "24", aspect: "aspect-[3/2]" },
        { src: "/gallery/25.jpeg", alt: "25", aspect: "aspect-[3/2]" },
        { src: "/gallery/26.jpeg", alt: "26", aspect: "aspect-[3/2]" },
        { src: "/gallery/27.jpeg", alt: "27", aspect: "aspect-[3/2]" },
        { src: "/gallery/28.jpeg", alt: "28", aspect: "aspect-[3/2]" },
        { src: "/gallery/29.jpeg", alt: "29", aspect: "aspect-[3/2]" },
        { src: "/gallery/30.jpeg", alt: "30", aspect: "aspect-[3/2]" },
        { src: "/gallery/31.jpeg", alt: "31", aspect: "aspect-[3/2]" },
        { src: "/gallery/32.jpeg", alt: "32", aspect: "aspect-[3/2]" },
        { src: "/gallery/33.jpeg", alt: "33", aspect: "aspect-[3/2]" },
        { src: "/gallery/34.jpeg", alt: "34", aspect: "aspect-[3/2]" },
        { src: "/gallery/35.jpeg", alt: "35", aspect: "aspect-[3/2]" },
        { src: "/gallery/36.jpeg", alt: "36", aspect: "aspect-[2/3]" },
        { src: "/gallery/37.jpeg", alt: "37", aspect: "aspect-[3/2]" },
        { src: "/gallery/38.jpeg", alt: "38", aspect: "aspect-[3/2]" },
        { src: "/gallery/39.jpeg", alt: "39", aspect: "aspect-[3/2]" },
        { src: "/gallery/40.jpeg", alt: "40", aspect: "aspect-[3/2]" },
        { src: "/gallery/41.jpeg", alt: "41", aspect: "aspect-[3/2]" },
        { src: "/gallery/42.jpeg", alt: "42", aspect: "aspect-[3/2]" },
        { src: "/gallery/43.jpeg", alt: "43", aspect: "aspect-[3/2]" },
        { src: "/gallery/44.jpeg", alt: "44", aspect: "aspect-[3/2]" },
        { src: "/gallery/45.jpeg", alt: "45", aspect: "aspect-[3/2]" },
        { src: "/gallery/46.jpeg", alt: "46", aspect: "aspect-[3/2]" },
        { src: "/gallery/47.jpeg", alt: "47", aspect: "aspect-[2/3]" },
        { src: "/gallery/48.jpeg", alt: "48", aspect: "aspect-[3/2]" },
        { src: "/gallery/49.jpeg", alt: "49", aspect: "aspect-[3/2]" },
        { src: "/gallery/50.jpeg", alt: "50", aspect: "aspect-[3/2]" },
        { src: "/gallery/51.jpeg", alt: "51", aspect: "aspect-[3/2]" },
        { src: "/gallery/52.jpeg", alt: "52", aspect: "aspect-[3/2]" },
        { src: "/gallery/53.jpeg", alt: "53", aspect: "aspect-[3/2]" },
        { src: "/gallery/54.jpeg", alt: "54", aspect: "aspect-[3/2]" },
        { src: "/gallery/55.jpeg", alt: "55", aspect: "aspect-[3/2]" },
        { src: "/gallery/56.jpeg", alt: "56", aspect: "aspect-[3/2]" },
        { src: "/gallery/57.jpeg", alt: "57", aspect: "aspect-[3/2]" },
        { src: "/gallery/58.jpeg", alt: "58", aspect: "aspect-[3/2]" },
        { src: "/gallery/59.jpeg", alt: "59", aspect: "aspect-[3/2]" },
        { src: "/gallery/60.jpeg", alt: "60", aspect: "aspect-[3/2]" },
        { src: "/gallery/61.jpeg", alt: "61", aspect: "aspect-[3/2]" },
        { src: "/gallery/62.jpeg", alt: "62", aspect: "aspect-[3/2]" },
        { src: "/gallery/63.jpeg", alt: "63", aspect: "aspect-[3/2]" },
        { src: "/gallery/64.jpeg", alt: "64", aspect: "aspect-[3/2]" },
        { src: "/gallery/65.jpeg", alt: "65", aspect: "aspect-[3/2]" },
        { src: "/gallery/66.jpeg", alt: "66", aspect: "aspect-[3/2]" },
        { src: "/gallery/67.jpeg", alt: "67", aspect: "aspect-[3/2]" },
    ];

    // Use dynamic images if available, otherwise fall back to local
    const galleryImages = dynamicGalleryImages.length > 0
        ? dynamicGalleryImages.map((img) => {
            // Calculate aspect ratio from actual dimensions
            let aspect = "aspect-[3/2]"; // Default fallback
            if (img.width && img.height) {
                const ratio = img.width / img.height;
                if (ratio > 1.2) {
                    aspect = "aspect-[3/2]"; // Landscape
                } else if (ratio < 0.8) {
                    aspect = "aspect-[2/3]"; // Portrait
                } else {
                    aspect = "aspect-square"; // Square-ish
                }
            }
            return {
                src: img.src,
                alt: img.alt,
                aspect,
            };
        })
        : localGalleryImages;

    return (
        <section className="section-gradient py-8 sm:py-12 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm">
                        Gallery
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-3 sm:mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Moments of Joy
                    </h2>
                    <p className="text-(--ngo-gray) text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                        Glimpses of our journey in transforming lives
                    </p>
                </motion.div>
            </div>
            <PhotoGridSection imagesArray={galleryImages} />
            <div className="text-center mt-6 sm:mt-10">
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 text-(--ngo-orange) font-semibold hover:gap-3 transition-all text-base sm:text-lg py-2 min-h-11"
                >
                    View Full Gallery <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
            </div>
        </section>
    );
}

function CTASection({ images }: { images: PageImagesMap }) {
    const ctaSrc = getImageSrc(images, "cta", "background", FALLBACK_IMAGES.cta.src);
    const ctaAlt = images["cta:background"]?.alt || FALLBACK_IMAGES.cta.alt;

    return (
        <section className="py-8 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl sm:rounded-[40px] md:rounded-[50px] max-w-7xl mx-auto ">
                <div className="absolute inset-0">
                    <Image src={ctaSrc} alt={ctaAlt} fill className="object-cover" />
                    <div className="hero-gradient absolute inset-0" />
                    <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/45 to-black/30" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-14 md:py-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Together, We Can Make a Difference
                        </h2>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
                            Every child deserves the opportunity to learn, grow, and dream. Join
                            Prayaas today and be part of this beautiful journey of transformation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                            <Link
                                href="/get-involved#donate"
                                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs"
                            >
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                Donate Now
                            </Link>
                            <Link
                                href="/get-involved#volunteer"
                                className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs"
                            >
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

interface HomePageClientProps {
    images: PageImagesMap;
}

export default function HomePageClient({ images }: HomePageClientProps) {
    return (
        <>
            <HeroSection images={images} />
            <AboutSection images={images} />
            <ProgramsSection />
            <ImpactSection />
            <TestimonialsSection />
            <GallerySection images={images} />
            <CTASection images={images} />
        </>
    );
}
