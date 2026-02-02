"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users,
    Target,
    Eye,
    Sparkles,
    BookOpen,
    Sun,
    Music4,
    Clock5,
    Mail,
    Linkedin,
    ArrowRight,
    Heart,
    Phone,
} from "lucide-react";
import SpotlightCard from "@/src/components/SpotlightCard";
import { useEffect, useRef, useState } from "react";
import { PageImagesMap, getImageSrc, getCarouselImages } from "@/src/components/DynamicImage";
import { HelpingHandSvg } from "@/src/components/svg/HelpingHandSvg";
import { PyramidSvg } from "@/src/components/svg/PyramidSvg";

// Default fallback images
const FALLBACK_IMAGES = {
    hero: { src: "/a5.jpg", alt: "Students" },
    story: [
        { src: "/a1.jpeg", alt: "Children learning" },
        { src: "/a2.jpg", alt: "Students studying" },
        { src: "/a3.jpeg", alt: "Group activities" },
        { src: "/a4.jpg", alt: "Teaching session" },
    ],
    cta: {
        src: "https://images.unsplash.com/photo-1529390079861-591f72bea6c0?w=1920&q=80",
        alt: "Children",
    },
};

function PageHero({ images }: { images: PageImagesMap }) {
    const heroSrc = getImageSrc(images, "hero", "main", FALLBACK_IMAGES.hero.src);
    const heroAlt = images["hero:main"]?.alt || FALLBACK_IMAGES.hero.alt;

    return (
        <section className="relative py-24 sm:py-28 md:py-32 overflow-hidden">
            {/* Animated background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[var(--ngo-orange)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[var(--ngo-green)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-200" />
            </div>
            <div className="absolute inset-0">
                <Image src={heroSrc} alt={heroAlt} fill className="object-cover" priority />
                <div className="hero-gradient absolute inset-0" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-white/20 shadow-lg">
                        <span className="w-2 h-2 bg-[var(--ngo-orange)] rounded-full animate-pulse" />
                        About Us
                    </span>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Our Story of{" "}
                        <span className="relative inline-block">
                            Hope
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-orange)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
                            </svg>
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4 leading-relaxed">
                        Learn about our journey, mission, and the passionate team behind
                        Prayaas IIIT Allahabad.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function StorySection({ images }: { images: PageImagesMap }) {
    // Get all carousel images dynamically (supports unlimited slides)
    const storyImages = getCarouselImages(images, "story", FALLBACK_IMAGES.story);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % storyImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [storyImages.length]);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 dots-pattern opacity-30" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm inline-flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                            Our Story
                        </span>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            How It All Began
                        </h2>
                        <p className="text-(--ngo-gray) text-lg leading-relaxed mb-6">
                            Prayaas was born from a simple yet powerful idea - that education
                            can transform lives. In 2006, a group of passionate students at
                            IIIT Allahabad noticed the stark contrast between the opportunities
                            available to them and those available to children in nearby villages.
                        </p>
                        <p className="text-(--ngo-gray) text-lg leading-relaxed mb-6">
                            What started as informal teaching sessions under a tree has now
                            grown into a comprehensive educational initiative that has touched
                            hundreds of lives. Our founders believed that every child deserves
                            the chance to dream, learn, and grow, regardless of their
                            socioeconomic background.
                        </p>
                        <p className="text-(--ngo-gray) text-lg leading-relaxed">
                            Today, Prayaas stands as a testament to the power of youth-driven
                            change, with all the volunteers working tirelessly to make
                            quality education accessible to all.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${activeIndex * 100}%` }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                {storyImages.map((image, index) => (
                                    <div key={`story-${index}`} className="relative min-w-full aspect-6/5">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-cover"
                                            priority={index === 0}
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                                {storyImages.map((_, index) => (
                                    <button
                                        key={`dot-${index}`}
                                        type="button"
                                        aria-label={`Show slide ${index + 1}`}
                                        onClick={() => handleDotClick(index)}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                                            ? "w-8 bg-(--ngo-orange)"
                                            : "w-3 bg-white/70 hover:bg-white"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-(--ngo-orange)/10 rounded-2xl -z-10" />
                        <div className="absolute -top-6 -right-6 w-48 h-48 bg-(--ngo-green)/10 rounded-2xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function MissionVisionSection() {
    return (
        <section className="py-24 section-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Our Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ y: -8 }}
                        className="group h-full"
                    >
                        <div className="relative h-full bg-linear-to-br from-orange-50 via-white to-amber-50 rounded-3xl p-10 shadow-xl overflow-hidden border border-orange-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-200/30">
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-16 h-1 bg-linear-to-r from-(--ngo-orange) to-transparent transition-all duration-500 group-hover:w-24" />
                            <div className="absolute top-0 left-0 w-1 h-16 bg-linear-to-b from-(--ngo-orange) to-transparent transition-all duration-500 group-hover:h-24" />
                            <div className="absolute bottom-0 right-0 w-16 h-1 bg-linear-to-l from-(--ngo-orange) to-transparent transition-all duration-500 group-hover:w-24" />
                            <div className="absolute bottom-0 right-0 w-1 h-16 bg-linear-to-t from-(--ngo-orange) to-transparent transition-all duration-500 group-hover:h-24" />
                            
                            {/* Background gradient blob */}
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-linear-to-br from-(--ngo-orange)/10 to-(--ngo-yellow)/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Icon with decorative ring */}
                            <div className="relative w-20 h-20 mb-8">
                                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-(--ngo-orange)/30 rotate-6 transition-transform duration-500 group-hover:rotate-12" />
                                <div className="relative w-full h-full rounded-2xl bg-linear-to-br from-(--ngo-orange)/20 to-(--ngo-yellow)/20 flex items-center justify-center shadow-lg shadow-orange-200/50">
                                    <Target className="w-10 h-10 text-(--ngo-orange)" />
                                </div>
                            </div>
                            
                            <h3
                                className="text-3xl font-bold text-(--ngo-dark) mb-4 relative"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Our Mission
                                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-(--ngo-orange) to-(--ngo-yellow) rounded-full transition-all duration-500 group-hover:w-20" />
                            </h3>
                            <p className="text-(--ngo-gray) text-lg leading-relaxed relative z-10">
                                To empower underprivileged children through quality education,
                                life skills training, and holistic development programs, enabling
                                them to break the cycle of poverty and build a brighter future
                                for themselves and their communities.
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Our Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        whileHover={{ y: -8 }}
                        className="group h-full"
                    >
                        <div className="relative h-full bg-linear-to-br from-green-50 via-white to-emerald-50 rounded-3xl p-10 shadow-xl overflow-hidden border border-green-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-200/30">
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-16 h-1 bg-linear-to-r from-(--ngo-green) to-transparent transition-all duration-500 group-hover:w-24" />
                            <div className="absolute top-0 left-0 w-1 h-16 bg-linear-to-b from-(--ngo-green) to-transparent transition-all duration-500 group-hover:h-24" />
                            <div className="absolute bottom-0 right-0 w-16 h-1 bg-linear-to-l from-(--ngo-green) to-transparent transition-all duration-500 group-hover:w-24" />
                            <div className="absolute bottom-0 right-0 w-1 h-16 bg-linear-to-t from-(--ngo-green) to-transparent transition-all duration-500 group-hover:h-24" />
                            
                            {/* Background gradient blob */}
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-linear-to-br from-(--ngo-green)/10 to-emerald-300/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Icon with decorative ring */}
                            <div className="relative w-20 h-20 mb-8">
                                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-(--ngo-green)/30 rotate-6 transition-transform duration-500 group-hover:rotate-12" />
                                <div className="relative w-full h-full rounded-2xl bg-linear-to-br from-(--ngo-green)/20 to-emerald-300/20 flex items-center justify-center shadow-lg shadow-green-200/50">
                                    <Eye className="w-10 h-10 text-(--ngo-green)" />
                                </div>
                            </div>
                            
                            <h3
                                className="text-3xl font-bold text-(--ngo-dark) mb-4 relative"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Our Vision
                                <span className="absolute -bottom-1 left-0 w-12 h-1 bg-linear-to-r from-(--ngo-green) to-emerald-400 rounded-full transition-all duration-500 group-hover:w-20" />
                            </h3>
                            <p className="text-(--ngo-gray) text-lg leading-relaxed relative z-10">
                                A world where every child, regardless of their background, has
                                access to quality education and the opportunity to realize their
                                full potential. We envision communities where education is a
                                bridge to opportunity, not a barrier.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// Principle data for ValuesSection - defined outside component to prevent recreation
const PRINCIPLES = [
    {
        icon: HelpingHandSvg,
        title: "Responsibility",
        description:
            "Every individual must realise that responsibility is the very fundamental basis of the functioning of the system",
        color: "#e85a4f",
    },
    {
        icon: BookOpen,
        title: "Discipline",
        description:
            "The main focus of teaching besides learning must be in discipline.",
        color: "#2d6a4f",
    },
    {
        icon: Sparkles,
        title: "Creativity",
        description:
            "Besides learning, it is absolutely necessary to instill the sparks of creativity in the students.",
        color: "#eec643",
    },
    {
        icon: Clock5,
        title: "Punctuality",
        description:
            "Punctuality in all aspects is the basis of smooth functioning of the organization.",
        color: "#8b5cf6",
    },
    {
        icon: Music4,
        title: "Joy",
        description:
            "It is necessary to always enjoy & have fun with what one is doing and to not consider it burden.",
        color: "#ec4899",
    },
    {
        icon: Sun,
        title: "Happiness",
        description:
            "Happiness & Living in the moment must be the very nature of one and all.",
        color: "#fbbf24",
    },
    {
        icon: PyramidSvg,
        title: "Priorities",
        description:
            "Priorities must be set straight first Studies then Prayaas.",
        color: "#14b8a6",
    },
];

// Orbit angles for positioning elements around the center
const ORBIT_ANGLES = [-225, -180, -135, -90, -45, 0, 45] as const;

function ValuesSection() {
    const [stage, setStage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const rafIdRef = useRef<number | null>(null);
    const stageRef = useRef(stage);

    // Keep stageRef in sync with stage state
    useEffect(() => {
        stageRef.current = stage;
    }, [stage]);

    useEffect(() => {
        const handleScroll = () => {
            // Cancel any pending animation frame to throttle updates
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }

            rafIdRef.current = requestAnimationFrame(() => {
                if (!containerRef.current) return;

                const { top, height } = containerRef.current.getBoundingClientRect();

                // Skip if container hasn't been reached yet
                if (top > 0) return;

                const scrollMovedPercent = (-top / height) * 100;
                const scrollDuration = 10; // Each stage takes 10% of the scroll

                // Calculate new stage based on scroll position
                const newStage = Math.min(
                    Math.floor(scrollMovedPercent / scrollDuration),
                    PRINCIPLES.length - 1
                );

                // Only update state if stage changed (use ref to avoid stale closure)
                if (newStage >= 0 && newStage !== stageRef.current) {
                    setStage(newStage);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Run once on mount to set initial state
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []); // Empty dependency - only run once on mount

    const handleOrbitClick = (index: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scrollDuration = 0.1; // 10% per stage
        const targetScrollOffset = scrollDuration * index * rect.height + 1;

        window.scrollTo({
            top: rect.top + window.scrollY + targetScrollOffset,
            behavior: "smooth"
        });
    };

    return (
        <section
            className="relative w-full h-[300vh] bg-white"
            ref={containerRef}
            aria-label="Our Core Values"
        >
            {/* Section Header - hidden on mobile, visible on tablet+ */}
            <div className="md:block text-center pt-16 pb-4">
                <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                    What We Stand For
                </span>
                <h2
                    className="text-4xl lg:text-5xl font-bold text-(--ngo-dark) mt-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Our Principles
                </h2>
                <p className="text-(--ngo-gray) text-base lg:text-lg mt-2 max-w-xl mx-auto px-4">
                    These 7 principles guide everything we do at Prayaas
                </p>
            </div>

            {/* Sticky orbit container - fills viewport below navbar */}
            <div className="w-full h-[calc(100vh-56px)] md:h-[calc(100vh-80px)] flex justify-center items-center pt-10 md:pt-16 bg-white sticky top-14 md:top-20">
                {/* Decorative rings */}
                <div
                    className="absolute rounded-full border-2 border-dashed opacity-20 transition-all duration-500"
                    style={{
                        width: 'calc(var(--radius, 160px) * 2 + 40px)',
                        height: 'calc(var(--radius, 160px) * 2 + 40px)',
                        borderColor: PRINCIPLES[stage].color
                    }}
                />

                {/* Orbit elements */}
                {ORBIT_ANGLES.map((angle, i) => {
                    const Icon = PRINCIPLES[i].icon;
                    const isActive = i === stage;
                    return (
                        <button
                            key={`orbit-${i}`}
                            type="button"
                            onClick={() => handleOrbitClick(i)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleOrbitClick(i);
                                }
                            }}
                            className={`orbit-child ${isActive ? "active" : ""}`}
                            style={{
                                '--angle': `${angle}deg`,
                                backgroundColor: isActive ? PRINCIPLES[i].color : `${PRINCIPLES[i].color}15`
                            } as React.CSSProperties}
                            aria-label={`View ${PRINCIPLES[i].title}`}
                            aria-pressed={isActive}
                        >
                            <Icon
                                className="w-6 h-6 md:w-7 md:h-7 transition-all duration-300"
                                style={{ color: isActive ? '#ffffff' : PRINCIPLES[i].color }}
                            />
                        </button>
                    );
                })}

                {/* Center content display - responsive sizing */}
                <motion.div
                    key={stage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex flex-col gap-1 sm:gap-2 md:gap-3 justify-center items-center h-52 w-52 sm:h-64 sm:w-64 md:h-85 md:w-85 lg:h-100 lg:w-100 xl:h-110 xl:w-110 rounded-full bg-white z-10 shadow-2xl overflow-hidden"
                    style={{
                        boxShadow: `0 25px 50px -12px ${PRINCIPLES[stage].color}30, 0 0 0 1px ${PRINCIPLES[stage].color}20`
                    }}
                    role="region"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {/* Icon with colored background */}
                    {(() => {
                        const Icon = PRINCIPLES[stage].icon;
                        return (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg"
                                style={{ backgroundColor: `${PRINCIPLES[stage].color}20` }}
                            >
                                <Icon
                                    className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9"
                                    style={{ color: PRINCIPLES[stage].color }}
                                />
                            </motion.div>
                        );
                    })()}

                    <motion.h3
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                        className="w-full text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-center px-2 sm:px-4"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: "black"
                        }}
                    >
                        {PRINCIPLES[stage].title}
                    </motion.h3>

                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="text-[10px] sm:text-xs md:text-sm lg:text-base px-2 sm:px-4 md:px-6 w-full text-center text-(--ngo-gray) leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-4"
                    >
                        {PRINCIPLES[stage].description}
                    </motion.p>

                    {/* Stage indicator dots
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="flex gap-1.5 sm:gap-2 mt-2"
                >
                    {PRINCIPLES.map((principle, i) => (
                        <button
                            key={`dot-${i}`}
                            type="button"
                            onClick={() => handleOrbitClick(i)}
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 hover:scale-125"
                            style={{
                                backgroundColor: i === stage ? principle.color : `${principle.color}30`,
                                transform: i === stage ? 'scale(1.3)' : 'scale(1)'
                            }}
                            aria-label={`Go to ${principle.title}`}
                        />
                    ))}
                </motion.div> */}
                </motion.div>
            </div>
        </section>
    );
}

// Team Member Card Component
interface TeamMember {
    name: string;
    role: string;
    rollNo?: string;
    image: string;
    email: string;
    linkedin: string;
}

function TeamMemberCard({
    member,
    index,
}: {
    member: TeamMember;
    index: number;
}) {
    // Rotate through accent colors for variety
    const accentColors = [
        { primary: 'var(--ngo-orange)', bg: 'from-orange-50 to-orange-100/50' },
        { primary: 'var(--ngo-green)', bg: 'from-emerald-50 to-emerald-100/50' },
        { primary: '#8b5cf6', bg: 'from-violet-50 to-violet-100/50' },
        { primary: '#f59e0b', bg: 'from-amber-50 to-amber-100/50' },
    ];
    const accent = accentColors[index % accentColors.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group"
        >
            <div className={`relative bg-linear-to-br ${accent.bg} rounded-3xl p-6 w-72 sm:w-80 min-h-64 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                
                {/* Corner accent lines - top left */}
                <div 
                    className="absolute top-0 left-0 w-12 h-1 rounded-r-full transition-all duration-500 group-hover:w-20"
                    style={{ backgroundColor: accent.primary }}
                />
                <div 
                    className="absolute top-0 left-0 w-1 h-12 rounded-b-full transition-all duration-500 group-hover:h-20"
                    style={{ backgroundColor: accent.primary }}
                />
                
                {/* Corner accent lines - bottom right */}
                <div 
                    className="absolute bottom-0 right-0 w-10 h-1 rounded-l-full opacity-50 transition-all duration-500 group-hover:w-16"
                    style={{ backgroundColor: accent.primary }}
                />
                <div 
                    className="absolute bottom-0 right-0 w-1 h-10 rounded-t-full opacity-50 transition-all duration-500 group-hover:h-16"
                    style={{ backgroundColor: accent.primary }}
                />
                
                {/* Background gradient blob */}
                <div 
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundColor: accent.primary }}
                />
                
                <div className="flex flex-col items-center text-center h-full justify-between relative z-10">
                    {/* Image container */}
                    <div className="relative mb-4">
                        {/* Decorative ring */}
                        <div 
                            className="absolute -inset-2 rounded-full border-2 border-dashed opacity-30 group-hover:opacity-50 group-hover:animate-spin-slow transition-opacity duration-500"
                            style={{ borderColor: accent.primary }}
                        />
                        <div 
                            className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white shadow-lg transition-transform duration-500 group-hover:scale-105"
                            style={{ boxShadow: `0 4px 20px ${accent.primary}30` }}
                        >
                            {member.image ? (
                                <Image
                                    src={member.image}
                                    alt={`Photo of ${member.name}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-(--ngo-orange)/10 to-(--ngo-green)/10 flex items-center justify-center">
                                    <Users className="w-1/2 h-1/2 text-(--ngo-gray)/40" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Name */}
                    <h3
                        className="font-bold text-(--ngo-dark) text-lg mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {member.name}
                    </h3>
                    
                    {/* Role */}
                    <p 
                        className="font-medium text-sm mb-4"
                        style={{ color: accent.primary }}
                    >
                        {member.role}
                    </p>
                    
                    {/* Social links */}
                    <div className="flex gap-3">
                        <a
                            href={`mailto:${member.email}`}
                            aria-label={`Send email to ${member.name}`}
                            className="p-2.5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2"
                            style={{ '--tw-ring-color': accent.primary } as React.CSSProperties}
                        >
                            <Mail className="w-4 h-4" style={{ color: accent.primary }} />
                        </a>
                        {member.linkedin ? (
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${member.name}'s LinkedIn profile`}
                                className="p-2.5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-(--ngo-green)"
                            >
                                <Linkedin className="w-4 h-4 text-(--ngo-green)" />
                            </a>
                        ) : (
                            <span
                                aria-disabled="true"
                                className="p-2.5 rounded-xl bg-gray-100 cursor-not-allowed opacity-50"
                                title="LinkedIn profile not available"
                            >
                                <Linkedin className="w-4 h-4 text-gray-400" />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Student Team Group Component
function StudentTeamGroup({
    title,
    members,
    startIndex,
}: {
    title: string;
    members: TeamMember[];
    startIndex: number;
}) {
    return (
        <div className="mb-6 last:mb-0">
            <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-(--ngo-dark) text-center mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                {title}
            </motion.h4>
            <div className="flex flex-wrap justify-center gap-6">
                {members.map((member, index) => (
                    <TeamMemberCard
                        key={member.name}
                        member={member}
                        index={startIndex + index}
                    />
                ))}
            </div>
        </div>
    );
}

// Team Group interface for API data
interface TeamGroup {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    order: number;
    type: "leadership" | "faculty" | "student";
    members: TeamMember[];
    isVisible: boolean;
}

function TeamSection() {
    const [teamGroups, setTeamGroups] = useState<TeamGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeamData() {
            try {
                const res = await fetch("/api/team");
                if (res.ok) {
                    const data = await res.json();
                    setTeamGroups(data.groups);
                }
            } catch (error) {
                console.error("Failed to fetch team data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTeamData();
    }, []);

    // Separate groups by type
    const leadershipGroups = teamGroups.filter((g) => g.type === "leadership");
    const facultyGroups = teamGroups.filter((g) => g.type === "faculty");
    const studentGroups = teamGroups.filter((g) => g.type === "student");

    // Get first member from leadership and faculty for special display
    const director = leadershipGroups[0]?.members[0];
    const facultyCoordinator = facultyGroups[0]?.members[0];

    if (loading) {
        return (
            <section className="py-24 section-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="w-16 h-16 border-4 border-(--ngo-orange) border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    // If no data from API, show placeholder message
    if (teamGroups.length === 0) {
        return (
            <section className="py-12 sm:py-16 md:py-20 section-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                            Meet Our Team
                        </span>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            The People Behind Prayaas
                        </h2>
                        <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                            Team information coming soon...
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    let memberIndex = 0;

    return (
        <section className="py-12 sm:py-14 md:py-18 section-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                        Meet Our Team
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        The People Behind Prayaas
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        Dedicated individuals working together to make a difference
                    </p>
                </motion.div>

                {/* Director - Largest Card, Centered */}
                {director && (
                    <div className="flex justify-center mb-6">
                        <TeamMemberCard member={director} index={memberIndex++} />
                    </div>
                )}

                {/* Faculty Coordinator - Medium Card, Centered */}
                {facultyCoordinator && (
                    <div className="flex justify-center mb-6">
                        <TeamMemberCard member={facultyCoordinator} index={memberIndex++} />
                    </div>
                )}

                {/* Student Leadership Team */}
                {studentGroups.length > 0 && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-6"
                        >
                            <h3
                                className="text-2xl md:text-3xl font-bold text-(--ngo-dark)"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Student Team
                            </h3>
                            <div className="w-24 h-1 bg-(--ngo-orange) mx-auto mt-4 rounded-full" />
                        </motion.div>

                        {/* Student Groups */}
                        <div className="space-y-2">
                            {studentGroups.map((group) => {
                                const startIndex = memberIndex;
                                memberIndex += group.members.length;
                                return (
                                    <StudentTeamGroup
                                        key={group._id}
                                        title={group.name}
                                        members={group.members}
                                        startIndex={startIndex}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

function CTASection({ images }: { images: PageImagesMap }) {
    const ctaSrc = getImageSrc(images, "cta", "background", FALLBACK_IMAGES.cta.src);
    const ctaAlt = images["cta:background"]?.alt || FALLBACK_IMAGES.cta.alt;

    return (
        <section className="py-14 sm:py-18 md:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-white via-(--ngo-cream)/50 to-white relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-(--ngo-orange)/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-(--ngo-green)/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left side - Creative visual */}
                    <div className="relative w-full lg:w-5/12 flex justify-center">
                        <div className="relative w-[300px] sm:w-[340px] h-[280px] sm:h-[320px]">
                            
                            {/* Decorative dots */}
                            <div className="absolute -top-4 -left-4 w-3 h-3 rounded-full bg-(--ngo-orange)/60" />
                            <div className="absolute top-8 -left-8 w-2 h-2 rounded-full bg-(--ngo-green)/50" />
                            <div className="absolute -top-2 right-16 w-2 h-2 rounded-full bg-(--ngo-yellow)/70" />
                            <div className="absolute bottom-12 -right-6 w-3 h-3 rounded-full bg-(--ngo-orange)/40" />
                            <div className="absolute -bottom-4 left-20 w-2 h-2 rounded-full bg-(--ngo-green)/60" />
                            
                            {/* Background gradient blob */}
                            <div className="absolute -inset-4 bg-linear-to-br from-(--ngo-orange)/10 via-transparent to-(--ngo-green)/10 rounded-[60px] blur-xl" />
                            
                            {/* Main image card */}
                            <motion.div 
                                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <Image 
                                    src={ctaSrc} 
                                    alt={ctaAlt} 
                                    fill 
                                    className="object-cover" 
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-(--ngo-dark)/40 via-transparent to-transparent" />
                                
                                {/* Gradient border effect */}
                                <div className="absolute inset-0 rounded-3xl ring-2 ring-white/50" />
                            </motion.div>
                            
                            {/* Floating stat card - top right */}
                            <motion.div 
                                className="absolute -top-6 -right-4 sm:-right-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                animate={{ y: [0, -6, 0] }}
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-(--ngo-gray)/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--ngo-green) to-emerald-500 flex items-center justify-center shadow-md">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-(--ngo-dark)">5000+</p>
                                            <p className="text-xs text-(--ngo-gray)">Children Helped</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Floating stat card - bottom left */}
                            <motion.div 
                                className="absolute -bottom-6 -left-4 sm:-left-8"
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                animate={{ y: [0, 6, 0] }}
                            >
                                <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-(--ngo-gray)/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--ngo-orange) to-(--ngo-orange-dark) flex items-center justify-center shadow-md">
                                            <Heart className="w-5 h-5 text-white" fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-(--ngo-dark)">21+ Years</p>
                                            <p className="text-xs text-(--ngo-gray)">Of Service</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Corner accent lines */}
                            <div className="absolute -top-2 -left-2 w-8 h-8">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-(--ngo-orange) to-transparent" />
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-linear-to-b from-(--ngo-orange) to-transparent" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8">
                                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-linear-to-l from-(--ngo-green) to-transparent" />
                                <div className="absolute bottom-0 right-0 w-0.5 h-full bg-linear-to-t from-(--ngo-green) to-transparent" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Right side - Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--ngo-orange)/10 text-(--ngo-orange) text-sm font-semibold mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-(--ngo-orange) animate-pulse" />
                                Be Part of Our Story
                            </span>
                            
                            <h2
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--ngo-dark) mb-5 leading-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Join Our{" "}
                                <span className="relative inline-block">
                                    <span className="text-(--ngo-orange)">Mission</span>
                                    <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                        <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
                                    </svg>
                                </span>
                            </h2>
                            
                            <p className="text-(--ngo-gray) text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                Together, we can create lasting change in the lives of children 
                                who need it most. Your support makes all the difference.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/get-involved#donate"
                                    className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-linear-to-r from-(--ngo-orange) to-(--ngo-orange-dark) text-white font-semibold shadow-lg shadow-(--ngo-orange)/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                                    <Heart className="w-5 h-5" fill="currentColor" />
                                    <span className="relative">Donate Now</span>
                                </Link>
                                <Link
                                    href="/contact-us"
                                    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border-2 border-(--ngo-gray)/10 text-(--ngo-dark) font-semibold hover:border-(--ngo-green) hover:text-(--ngo-green) transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <Phone className="w-5 h-5" />
                                    Get in Touch
                                </Link>
                            </div>
                            
                            {/* Simple trust line */}
                            <p className="mt-6 text-sm text-(--ngo-gray) flex items-center justify-center lg:justify-start gap-2">
                                <span className="text-(--ngo-yellow)">★★★★★</span>
                                <span>Trusted by 500+ families since 2003</span>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

interface AboutPageClientProps {
    images: PageImagesMap;
}

export default function AboutPageClient({ images }: AboutPageClientProps) {
    return (
        <>
            <PageHero images={images} />
            <StorySection images={images} />
            <MissionVisionSection />
            <ValuesSection />
            <TeamSection />
            <CTASection images={images} />
        </>
    );
}
