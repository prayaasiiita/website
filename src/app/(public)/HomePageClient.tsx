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
    Quote,
    Calendar,
    Phone,
} from "lucide-react";
import PhotoGridSection from "@/src/components/PhotoGridSection";
import { PageImagesMap, getImageSrc, getCarouselImages } from "@/src/components/DynamicImage";

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
    console.log(heroSrc)
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
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 sm:pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 mt-2 shadow-lg">
                        A Students Initiative at IIIT Allahabad
                    </span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Empowering Lives,
                    <br />
                    <span className="text-(--ngo-yellow)">
                        Education is Opportunity to Succes
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10"
                >
                    Prayaas is an earnest attempt to bring sunshine in wearisome lives. It
                    is a volunteer movement initiated by student fraternity of IIIT
                    Allahabad to ameliorate the life of not so privileged kids.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/get-involved#donate"
                        className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Heart className="w-5 h-5" />
                        Donate Now
                    </Link>
                    <Link
                        href="/contact-us"
                        className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Users className="w-5 h-5" />
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
        <section className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                            About Prayaas
                        </span>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Transforming Communities Through Education
                        </h2>
                        <p className="text-(--ngo-gray) text-lg leading-relaxed mb-6">
                            Prayaas, which means &ldquo;effort&rdquo; in Hindi, is a student-run
                            social initiative at IIIT Allahabad. Founded by compassionate
                            students who believe in the power of education, we work tirelessly
                            to bridge the gap between privilege and potential.
                        </p>
                        <p className="text-(--ngo-gray) text-lg leading-relaxed mb-8">
                            Our volunteers dedicate their time to teaching underprivileged
                            children from nearby villages, providing them with academic
                            support, life skills training, and recreational activities that
                            nurture their overall development.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { icon: Heart, label: "Compassion", color: "var(--ngo-orange)" },
                                { icon: BookOpen, label: "Education", color: "var(--ngo-green)" },
                                { icon: Users, label: "Community", color: "var(--ngo-yellow)" },
                            ].map((item) => (
                                <div key={item.label} className="text-center">
                                    <div
                                        className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                                        style={{ backgroundColor: `${item.color}20` }}
                                    >
                                        <item.icon
                                            className="w-9 h-9"
                                            style={{ color: item.color }}
                                        />
                                    </div>
                                    <span className="font-bold text-(--ngo-dark)">{item.label}</span>
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
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${activeIndex * 100}%` }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                {aboutImages.map((image, index) => (
                                    <div key={`about-${index}`} className="min-w-full">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={600}
                                            height={500}
                                            className="w-full h-auto"
                                            priority={index === 0}
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </div>
                                ))}
                            </motion.div>
                            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                                {aboutImages.map((_, index) => (
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

function ProgramsSection() {
    const programs = [
        {
            icon: BookOpen,
            title: "Education & Tutoring",
            description:
                "Regular classes covering academics, computer literacy, and language skills to help children excel in their studies.",
            color: "var(--ngo-orange)",
        },
        {
            icon: Palette,
            title: "Recreational Activities",
            description:
                "Art, music, sports, and cultural programs that foster creativity and teamwork among children.",
            color: "var(--ngo-green)",
        },
        {
            icon: Lightbulb,
            title: "Life Skills Development",
            description:
                "Sessions on hygiene, communication, leadership, and other essential skills for holistic growth.",
            color: "var(--ngo-yellow)",
        },
        {
            icon: HandHeart,
            title: "Community Outreach",
            description:
                "Health camps, awareness drives, and community events that extend our impact beyond the classroom.",
            color: "#8b5cf6",
        },
    ];

    return (
        <section className="section-gradient py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                        What We Do
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Our Programs
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        We run comprehensive programs designed to nurture every aspect of a
                        child&apos;s development
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <SpotlightCard
                                className="h-full bg-white border-transparent text-(--ngo-dark) shadow-lg card-hover"
                                spotlightColor="rgba(255, 138, 76, 0.2)"
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center"
                                    style={{ backgroundColor: `${program.color}15` }}
                                >
                                    <program.icon
                                        className="w-10 h-10"
                                        style={{ color: program.color }}
                                    />
                                </div>
                                <h3
                                    className="text-xl font-bold text-(--ngo-dark) mb-3"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {program.title}
                                </h3>
                                <p className="text-(--ngo-gray) leading-relaxed">
                                    {program.description}
                                </p>
                                <Link
                                    href={`/programs#${program.title.toLowerCase().replace(/ /g, "-")}`}
                                    className="inline-flex items-center gap-2 mt-4 text-(--ngo-orange) font-semibold hover:gap-3 transition-all"
                                >
                                    Learn More <ArrowRight className="w-4 h-4" />
                                </Link>
                            </SpotlightCard>
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
        <section className="bg-(--ngo-dark) relative overflow-hidden py-12 sm:py-16">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-(--ngo-orange) rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-(--ngo-green) rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                        Our Impact
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Creating Lasting Change
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Every number represents a story of hope, transformation, and a step
                        towards a brighter future
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
                                className="h-full text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                                spotlightColor="rgba(255, 255, 255, 0.25)"
                            >
                                <div className="w-16 h-16 rounded-full bg-(--ngo-orange)/20 flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-8 h-8 text-(--ngo-orange)" />
                                </div>
                                <div
                                    className="text-5xl font-bold text-white mb-2"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    <Counter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-gray-400 font-medium">{stat.label}</p>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    const testimonials = [
        {
            quote:
                "Prayaas changed my life. The volunteers taught me not just academics but also how to dream big. I am now studying engineering because of their support.",
            name: "Rahul Kumar",
            role: "Former Student, Now Engineering Student",
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        },
        {
            quote:
                "Being a volunteer at Prayaas has been the most fulfilling experience of my college life. Seeing the children grow and learn is incredibly rewarding.",
            name: "Priya Sharma",
            role: "Volunteer, 3rd Year Student",
            image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        },
        {
            quote:
                "The dedication of Prayaas volunteers is remarkable. My daughter has shown tremendous improvement in her studies and confidence since joining their program.",
            name: "Sunita Devi",
            role: "Parent",
            image:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        },
        {
            quote:
                "Prayaas empowered our community. With their guidance, my son returned to school and is now preparing for competitive exams with renewed confidence.",
            name: "Ramesh Yadav",
            role: "Parent",
            image:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80",
        },
    ];
    const [hovered, setHovered] = useState<number | null>(null);
    const [columnCount, setColumnCount] = useState(4);

    useEffect(() => {
        const getColumns = () => {
            if (typeof window === "undefined") return 4;
            const width = window.innerWidth;
            if (width < 640) return 1;
            if (width < 1024) return 2;
            return 4;
        };

        const handleResize = () => setColumnCount(getColumns());

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const hoverEnabled = columnCount === 4;

    const columnTemplate =
        hoverEnabled && hovered !== null
            ? testimonials
                .map((_, i) => (hovered === i ? "1.6fr" : "0.8fr"))
                .join(" ")
            : `repeat(${columnCount}, minmax(0, 1fr))`;

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                        Real Stories
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Stories of Hope
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        Hover over the stories on desktop; tap to read on mobile
                    </p>
                </motion.div>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-300"
                    style={{ gridTemplateColumns: columnTemplate }}
                >
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                            animate={{
                                scale: hoverEnabled
                                    ? hovered === null
                                        ? 1
                                        : hovered === index
                                            ? 1.05
                                            : 0.92
                                    : 1,
                                zIndex: hoverEnabled && hovered === index ? 10 : 0,
                            }}
                            className="relative h-80 transition-transform duration-500 ease-out isolation-isolate"
                            onMouseEnter={() => hoverEnabled && setHovered(index)}
                            onMouseLeave={() => hoverEnabled && setHovered(null)}
                            onClick={() =>
                                !hoverEnabled && setHovered(hovered === index ? null : index)
                            }
                        >
                            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 25vw"
                                    className="object-cover"
                                />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-black/70 pointer-events-none"
                                style={{ transformOrigin: "center center" }}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{
                                    scaleX: 1,
                                    opacity: hoverEnabled ? (hovered === index ? 1 : 0) : 1,
                                }}
                                transition={{ duration: 0.55, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end gap-3 text-white"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: hoverEnabled ? (hovered === index ? 1 : 0) : 1,
                                    y: hoverEnabled ? (hovered === index ? 0 : 10) : 0,
                                }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/60 shadow-md">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">{item.name}</h4>
                                        <p className="text-xs uppercase tracking-wide text-white/80">
                                            {item.role}
                                        </p>
                                    </div>
                                </div>
                                <Quote className="w-8 h-8 text-(--ngo-orange)" />
                                <p className="text-sm md:text-base leading-relaxed">
                                    &quot;{item.quote}&quot;
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
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
        <section className="section-gradient py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                        Gallery
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Moments of Joy
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        Glimpses of our journey in transforming lives
                    </p>
                </motion.div>
            </div>
            <PhotoGridSection imagesArray={galleryImages} />
            <div className="text-center mt-6 sm:mt-10">
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 text-(--ngo-orange) font-semibold hover:gap-3 transition-all text-lg"
                >
                    View Full Gallery <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </section>
    );
}

function CTASection({ images }: { images: PageImagesMap }) {
    const ctaSrc = getImageSrc(images, "cta", "background", FALLBACK_IMAGES.cta.src);
    const ctaAlt = images["cta:background"]?.alt || FALLBACK_IMAGES.cta.alt;

    return (
        <section className="relative overflow-hidden py-12 sm:py-16">
            <div className="absolute inset-0">
                <Image src={ctaSrc} alt={ctaAlt} fill className="object-cover" />
                <div className="hero-gradient absolute inset-0" />
                <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/45 to-black/30" />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Together, We Can Make a Difference
                    </h2>
                    <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
                        Every child deserves the opportunity to learn, grow, and dream. Join
                        Prayaas today and be part of this beautiful journey of transformation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/get-involved#donate"
                            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <Heart className="w-5 h-5" />
                            Donate Now
                        </Link>
                        <Link
                            href="/get-involved#volunteer"
                            className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <Phone className="w-5 h-5" />
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

interface HomePageClientProps {
    images: PageImagesMap;
}

export default function HomePageClient({ images }: HomePageClientProps) {
    console.log(images);
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
