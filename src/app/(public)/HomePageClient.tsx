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
    ArrowRight,
    Calendar,
    Phone,
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
            {/* Animated background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-(--ngo-orange) rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-1/3 -right-20 w-72 h-72 bg-(--ngo-green) rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-200" />
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-(--ngo-yellow) rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-400" />
            </div>
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
                    <span className="inline-block px-4 sm:px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-base sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 bg-(--ngo-orange) rounded-full animate-pulse" />
                            A Students Initiative at IIIT Allahabad
                        </span>
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
                    <span className="bg-linear-to-r from-[#FFF6A5] via-[#F2C94C] to-[#fedc8d] bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(242,201,76,0.45)] animate-gradient bg-[length:200%_auto]">
                        Education is Opportunity to Success
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8 sm:mb-10 px-4 leading-relaxed"
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
                        className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs group"
                    >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        Donate Now
                    </Link>
                    <Link
                        href="/contact-us"
                        className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs group"
                    >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                        Contact Us
                    </Link>
                </motion.div>
                {/* Scroll indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
                >
                    <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
                    <motion.div 
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
                    >
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    </motion.div>
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
        <section className="bg-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 dots-pattern opacity-30" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                            About Prayaas
                        </span>
                        <h2
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-4 sm:mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Transforming Communities Through{" "}
                            <span className="relative inline-block">
                                Education
                                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                    <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-orange)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                                </svg>
                            </span>
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
                                <motion.div 
                                    key={item.label} 
                                    className="text-center group"
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-2 sm:mb-3 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                                        style={{ backgroundColor: `${item.color}15`, boxShadow: `0 4px 20px ${item.color}20` }}
                                    >
                                        <item.icon
                                            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110"
                                            style={{ color: item.color }}
                                        />
                                    </div>
                                    <span className="font-bold text-(--ngo-dark) text-xs sm:text-sm md:text-base">{item.label}</span>
                                </motion.div>
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
                        <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]">
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
                            <div className="absolute inset-x-0 bottom-4 sm:bottom-5 flex items-center justify-center gap-2.5">
                                {aboutImages.map((_, index) => (
                                    <button
                                        key={`dot-${index}`}
                                        type="button"
                                        aria-label={`Show slide ${index + 1}`}
                                        onClick={() => handleDotClick(index)}
                                        className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 shadow-sm ${activeIndex === index
                                            ? "w-8 sm:w-10 bg-(--ngo-orange)"
                                            : "w-2 sm:w-2.5 bg-white/70 hover:bg-white hover:scale-110"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Decorative elements with animation */}
                        <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-48 h-48 sm:w-72 sm:h-72 bg-linear-to-br from-(--ngo-orange)/15 to-(--ngo-orange)/5 rounded-2xl sm:rounded-3xl -z-10 animate-float-slow" />
                        <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-32 h-32 sm:w-48 sm:h-48 bg-linear-to-br from-(--ngo-green)/15 to-(--ngo-green)/5 rounded-2xl sm:rounded-3xl -z-10 animate-float" style={{ animationDelay: '1s' }} />
                        {/* Additional decorative dots */}
                        <div className="absolute top-1/2 -right-8 w-4 h-4 bg-(--ngo-orange) rounded-full opacity-60 animate-pulse hidden lg:block" />
                        <div className="absolute bottom-1/4 -left-6 w-3 h-3 bg-(--ngo-green) rounded-full opacity-60 animate-pulse hidden lg:block" style={{ animationDelay: '0.5s' }} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function OurWorkSection() {
    const programs = [
        {
            icon: StudentSvg,
            title: "Education & Tutoring",
            description:
                "Regular classes covering academics, computer literacy, and language skills to help children excel in their studies.",
            color: "var(--ngo-orange)",
            gradient: "from-orange-400 to-orange-600",
        },
        {
            icon: DrawingSvg,
            title: "Recreational Activities",
            description:
                "Art, music, sports, and cultural programs that foster creativity and teamwork among children.",
            color: "#10b981",
            gradient: "from-emerald-400 to-emerald-600",
        },
        {
            icon: ChildrenPlayingSvg,
            title: "Life Skills Development",
            description:
                "Sessions on hygiene, communication, leadership, and other essential skills for holistic growth.",
            color: "#f59e0b",
            gradient: "from-amber-400 to-amber-600",
        },
        {
            icon: HelpingHandSvg,
            title: "Community Outreach",
            description:
                "Health camps, awareness drives, and community events that extend our impact beyond the classroom.",
            color: "#8b5cf6",
            gradient: "from-violet-400 to-violet-600",
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-linear-to-b from-white via-(--ngo-cream)/30 to-white">
            {/* Decorative background elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-(--ngo-orange)/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-(--ngo-green)/5 rounded-full blur-3xl" />
            
            {/* Floating decorative shapes */}
            <div className="absolute top-32 left-20 w-4 h-4 bg-(--ngo-orange)/30 rounded-full animate-float hidden lg:block" />
            <div className="absolute top-48 right-32 w-3 h-3 bg-(--ngo-green)/30 rounded-full animate-float-slow hidden lg:block" />
            <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-(--ngo-yellow)/40 rounded-full animate-pulse hidden lg:block" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <motion.div 
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white shadow-sm border border-(--ngo-orange)/10 mb-5"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="w-2 h-2 rounded-full bg-(--ngo-orange)" />
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm">What We Do</span>
                        <span className="w-2 h-2 rounded-full bg-(--ngo-green)" />
                    </motion.div>
                    
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Programs That{" "}
                        <span className="relative inline-block">
                            <span className="text-(--ngo-orange)">Empower</span>
                            <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto">
                        We run comprehensive programs designed to nurture every aspect of a
                        child&apos;s development
                    </p>
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            className="h-full flex justify-center"
                        >
                            <Program
                                href={`/our-work#${program.title.toLowerCase().replace(/ /g, "-")}`}
                                info={program.description}
                                heading={program.title}
                                svg={<program.icon />}
                                color={program.color}
                                gradient={program.gradient}
                            />
                        </motion.div>
                    ))}
                </div>
                
                {/* Bottom CTA */}
                <motion.div 
                    className="text-center mt-12 sm:mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        href="/our-work"
                        className="group inline-flex items-center gap-2 text-(--ngo-orange) font-semibold hover:gap-3 transition-all"
                    >
                        Explore All Programs
                        <span className="w-8 h-8 rounded-full bg-(--ngo-orange)/10 flex items-center justify-center group-hover:bg-(--ngo-orange) group-hover:text-white transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

function ImpactSection() {
    const stats = [
        { value: 5000, suffix: "+", label: "Children Educated", icon: BookOpen, color: "--ngo-orange" },
        { value: 30, suffix: "+", label: "Active Volunteers", icon: Users, color: "--ngo-green" },
        { value: 100, suffix: "+", label: "Events Conducted", icon: Calendar, color: "--ngo-yellow" },
        { value: 21, suffix: "+", label: "Years of Impact", icon: Heart, color: "--ngo-orange" },
    ];

    return (
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 bg-white">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-(--ngo-orange)/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-(--ngo-green)/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--ngo-orange)/10 text-(--ngo-orange) text-sm font-semibold mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-(--ngo-orange) animate-pulse" />
                        Our Impact
                    </span>
                    
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-(--ngo-dark) mb-4 sm:mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Creating{" "}
                        <span className="relative inline-block">
                            <span className="text-(--ngo-orange)">Lasting</span>
                            <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
                            </svg>
                        </span>{" "}
                        Change
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Every number represents a story of hope, transformation, and a step
                        towards a brighter future
                    </p>
                </motion.div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
                            whileHover={{ y: -8 }}
                            className="group"
                        >
                            <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-xl overflow-hidden shadow-lg">
                                
                                {/* Background decorative blob */}
                                <div 
                                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                                    style={{ backgroundColor: `var(${stat.color})` }}
                                />
                                <div 
                                    className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-15 group-hover:opacity-25 transition-opacity duration-500"
                                    style={{ backgroundColor: `var(${stat.color})` }}
                                />
                                
                                {/* Corner accent lines - top left */}
                                <div 
                                    className="absolute top-0 left-0 w-16 h-1 rounded-r-full transition-all duration-300 group-hover:w-20"
                                    style={{ backgroundColor: `var(${stat.color})` }}
                                />
                                <div 
                                    className="absolute top-0 left-0 w-1 h-16 rounded-b-full transition-all duration-300 group-hover:h-20"
                                    style={{ backgroundColor: `var(${stat.color})` }}
                                />
                                
                                {/* Icon container */}
                                <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5">
                                    <div
                                        className="absolute inset-0 rounded-xl bg-white shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                        style={{ backgroundColor: `var(${stat.color})15` }}
                                    >
                                        <stat.icon 
                                            className="w-6 h-6 sm:w-7 sm:h-7" 
                                            style={{ color: `var(${stat.color})` }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Number */}
                                <div className="relative mb-2">
                                    <span
                                        className="text-4xl sm:text-5xl font-bold text-(--ngo-dark)"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        <Counter end={stat.value} suffix={stat.suffix} />
                                    </span>
                                </div>
                                
                                {/* Label */}
                                <p className="text-(--ngo-gray) font-medium text-sm sm:text-base relative z-10">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {/* Bottom text */}
                <motion.p 
                    className="text-center mt-10 sm:mt-12 text-(--ngo-gray) text-sm sm:text-base"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    And counting, thanks to <span className="text-(--ngo-orange) font-medium">supporters like you</span> ✨
                </motion.p>
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
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    // Handle scroll to update progress bar
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const onScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            const maxScroll = scrollWidth - clientWidth;
            const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
            setScrollProgress(progress);
        };
        
        container.addEventListener('scroll', onScroll, { passive: true });
        // Initial calculation
        onScroll();
        
        return () => container.removeEventListener('scroll', onScroll);
    }, [items.length]); // Re-attach when items change

    // Don't render the section if no items
    if (items.length === 0) {
        return null;
    }

    return (
        <section className="py-8 sm:py-12 md:py-14 bg-white">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-5 sm:mb-4 md:mb-7"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2 justify-center">
                        <span className="w-8 h-0.5 bg-(--ngo-orange)" />
                        Real Stories
                        <span className="w-8 h-0.5 bg-(--ngo-orange)" />
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-1 sm:mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Stories of Empowerment
                    </h2>
                    <p className="text-(--ngo-gray) text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
                        Explore inspiring stories of transformation
                    </p>
                </motion.div>
            </div>

            {/* Scrollable Carousel Container */}
            <div className="relative">
                {/* Gradient fade on edges */}
                <div className="absolute left-0 top-0 bottom-4 w-8 sm:w-16 bg-gradient-to-r from-(--ngo-cream) to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-4 w-8 sm:w-16 bg-gradient-to-l from-(--ngo-cream) to-transparent z-10 pointer-events-none" />
                
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {/* Left spacer for centering on larger screens */}
                    <div className="shrink-0 w-0 lg:w-[calc((100vw-1280px)/2)]" />
                    
                    {items.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] z-"
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
                        </motion.div>
                    ))}
                    
                    {/* Right spacer for centering on larger screens */}
                    <div className="shrink-0 w-0 lg:w-[calc((100vw-1280px)/2)]" />
                </div>

                {/* Scroll Progress Bar */}
                <div className="flex flex-col items-center mt-6 px-4">
                    <div className="relative w-32 sm:w-40 md:w-48 h-1.5 bg-(--ngo-gray)/10 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-full bg-linear-to-r from-(--ngo-orange) to-(--ngo-orange-light) rounded-full transition-all duration-150 ease-out shadow-[0_0_8px_var(--ngo-orange)]"
                            style={{ width: `${Math.max(5, scrollProgress)}%` }}
                        />
                    </div>
                    <p className="text-center text-xs text-(--ngo-gray) mt-3 flex items-center gap-1.5">
                        <span className="inline-block w-4 h-4 animate-bounce-slow">👆</span>
                        Swipe to explore more stories
                    </p>
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
        <section className="section-gradient py-8 sm:py-12 md:py-14 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--ngo-orange)]/10 rounded-full blur-xl animate-float hidden lg:block" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-[var(--ngo-green)]/10 rounded-full blur-xl animate-float-slow hidden lg:block" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2 justify-center">
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                        Gallery
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-3 sm:mb-4"
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
                    className="group inline-flex items-center gap-2 text-(--ngo-orange) font-semibold hover:gap-3 transition-all text-base sm:text-lg py-2 min-h-11"
                >
                    View Full Gallery 
                    <span className="w-8 h-8 rounded-full bg-[var(--ngo-orange)]/10 flex items-center justify-center group-hover:bg-[var(--ngo-orange)] group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </Link>
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
                                Make a Difference Today
                            </span>
                            
                            <h2
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-(--ngo-dark) mb-5 leading-tight"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Your Support Can{" "}
                                <span className="relative inline-block">
                                    <span className="text-(--ngo-orange)">Transform</span>
                                    <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                        <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
                                    </svg>
                                </span>{" "}
                                Lives
                            </h2>
                            
                            <p className="text-(--ngo-gray) text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                Every contribution helps us provide education, mentorship, and hope 
                                to children who need it most. Join our mission to build brighter futures.
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
                                    href="/get-involved#volunteer"
                                    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border-2 border-(--ngo-gray)/10 text-(--ngo-dark) font-semibold hover:border-(--ngo-green) hover:text-(--ngo-green) transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <Users className="w-5 h-5" />
                                    Volunteer With Us
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

interface HomePageClientProps {
    images: PageImagesMap;
}

export default function HomePageClient({ images }: HomePageClientProps) {
    return (
        <>
            <HeroSection images={images} />
            <AboutSection images={images} />
            <OurWorkSection />
            <ImpactSection />
            <TestimonialsSection />
            <GallerySection images={images} />
            <CTASection images={images} />
        </>
    );
}
