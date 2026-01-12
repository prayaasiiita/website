"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    BookOpen,
    Palette,
    Lightbulb,
    HandHeart,
    CheckCircle,
    Heart,
    Clock,
    Phone,
} from "lucide-react";
import { PageImagesMap, getCarouselImages, getImageSrc } from "@/src/components/DynamicImage";
import { useEffect, useState } from "react";

type ProgramSection = "education" | "recreational" | "lifeskills" | "community";
type ProgramCard = {
    id: string;
    section: ProgramSection;
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    schedule: string;
    images: PageImagesMap;
    color: string;
};

// Default fallback images
const FALLBACK_IMAGES = {
    hero: { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80", alt: "Classroom" },
    programs: {
        education: [{ src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", alt: "Education" }],
        recreational: [{ src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80", alt: "Recreation" }],
        lifeskills: [{ src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", alt: "Life Skills" }],
        community: [{ src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80", alt: "Community" }],
    },
};

function PageHero({ images }: { images: PageImagesMap }) {
    const heroSrc = getImageSrc(images, "hero", "main", FALLBACK_IMAGES.hero.src);
    const heroAlt = images["hero:main"]?.alt || FALLBACK_IMAGES.hero.alt;

    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={heroSrc}
                    alt={heroAlt}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="hero-gradient absolute inset-0" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                        Our Programs
                    </span>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        What We Do
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                        Comprehensive programs designed to nurture every aspect of a child&apos;s
                        development and help them reach their full potential.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function ProgramDetail({
    id,
    section,
    icon: Icon,
    title,
    description,
    features,
    schedule,
    images,
    color,
    reverse = false
}: {
    id: string; // anchor id for the section
    section: 'education' | 'recreational' | 'lifeskills' | 'community';
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    schedule: string;
    images: PageImagesMap; // full page images map
    color: string;
    reverse?: boolean;
}) {
    // Get carousel images for the specific program section; fall back to defaults
    const programImages = getCarouselImages(
        images,
        section,
        FALLBACK_IMAGES.programs[section]
    );

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % programImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [programImages.length]);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };
    return (
        <section id={id} className="py-12 scroll-mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className={`grid lg:grid-cols-2 gap-16 items-center ${reverse ? "lg:flex-row-reverse" : ""
                        }`}
                >
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={reverse ? "lg:order-2" : ""}
                    >
                        <div
                            className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <Icon className="w-8 h-8" style={{ color }} />
                        </div>
                        <h2
                            className="text-4xl font-bold text-(--ngo-dark) mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {title}
                        </h2>
                        <p className="text-(--ngo-gray) text-lg leading-relaxed mb-8">
                            {description}
                        </p>
                        <div className="space-y-4 mb-8">
                            {features.map((feature) => (
                                <div key={feature} className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-(--ngo-green) shrink-0 mt-0.5" />
                                    <span className="text-(--ngo-dark)">{feature}</span>
                                </div>
                            ))}
                        </div>
                        {schedule && <div className="flex items-center gap-3 p-4 bg-(--ngo-cream) rounded-xl">
                            <Clock className="w-5 h-5 text-(--ngo-orange)" />
                            <span className="text-(--ngo-dark) font-medium">
                                Schedule: {schedule}
                            </span>
                        </div>}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`relative ${reverse ? "lg:order-1" : ""}`}
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${activeIndex * 100}%` }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                            >
                                {programImages.map((image, index) => (
                                    <div key={`program-${section}-${index}`} className="min-w-full">
                                        <div className="relative w-full aspect-3/2 bg-gray-100">
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                className="object-cover"
                                                sizes="(min-width: 1024px) 600px, 90vw"
                                                priority={index === 0}
                                                loading={index === 0 ? "eager" : "lazy"}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
                                {programImages.map((_, index) => (
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

function CTASection({ images }: { images: PageImagesMap }) {
    const ctaSrc = getImageSrc(images, "cta", "background", "");
    const ctaAlt = images["cta:background"]?.alt

    return (
        <section className="py-8 sm:py-12 md:py-14 px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl sm:rounded-[40px] md:rounded-[50px] max-w-7xl mx-auto ">
                <div className="absolute inset-0 bg-(--ngo-dark)">
                    {ctaSrc && <><Image src={ctaSrc} alt={ctaAlt} fill className="object-cover" />
                        <div className="hero-gradient absolute inset-0" />
                        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/45 to-black/30" /></>}
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
                            Help Us Expand Our Work
                        </h2>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
                            Your support enables us to reach more children and create more
                            impactful programs. Join us in making a difference.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                            <Link
                                href="/get-involved#donate"
                                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs"
                            >
                                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                Support Our Work
                            </Link>
                            <Link
                                href="/get-involved#volunteer"
                                className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs"
                            >
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                Volunteer With Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}


export default function OurWorkPageClient({ images }: { images: PageImagesMap }) {
    // Get program images from database or use fallbacks
    const programs: ProgramCard[] = [
        {
            id: "education & tutoring",
            section: "education",
            icon: BookOpen,
            title: "Education & Tutoring",
            description:
                "Our core educational program provides academic support to children in subjects like Mathematics, Science, English, and Hindi. We use innovative teaching methods to make learning engaging and effective.",
            features: [
                "Regular classes in core subjects",
                "Verbal Communication Skills Support",
                "Exam preparation and study support",
                "Personalized attention for senior students",
                "Educational materials and resources provided",
            ],
            schedule: "Monday - Sunday, 5 PM - 6 PM",
            images: images,
            color: "var(--ngo-orange)",
        },
        {
            id: "recreational-activities",
            section: "recreational",
            icon: Palette,
            title: "Recreational Activities",
            description:
                "We believe in holistic development, which is why our recreational programs focus on arts, music, sports, and cultural activities that nurture creativity and teamwork.",
            features: [
                "Art and craft competitions and workshops",
                "Music and dance competitions and workshops",
                "Cultural celebrations and events",
                "Team-building activities",
            ],
            schedule: "",
            images: images,
            color: "var(--ngo-green)",
        },
        {
            id: "life-skills-development",
            section: "lifeskills",
            icon: Lightbulb,
            title: "Life Skills Development",
            description:
                "Beyond academics, we focus on developing essential life skills that help children navigate the world with confidence and resilience.",
            features: [
                "Personal hygiene and health awareness",
                "Communication and public speaking",
                "Financial literacy basics",
                "Environmental awareness",
                "Leadership and confidence building",
            ],
            schedule: "",
            images: images,
            color: "var(--ngo-yellow)",
        },
        {
            id: "community-outreach",
            section: "community",
            icon: HandHeart,
            title: "Community Outreach",
            description:
                "We extend our impact beyond the classroom through health camps, donation drives, and community events that benefit the entire village.",
            features: [
                "Health and hygiene camps",
                "Awareness programs on education importance",
                "Distribution of educational materials",
                "Donation Drives organised time to time",
            ],
            schedule: "",
            images: images,
            color: "#8b5cf6",
        },
    ];

    return (
        <>
            <PageHero images={images} />
            <div className="bg-white">
                {programs.map((program, index) => (
                    <div
                        key={program.id}
                        className={index % 2 === 1 ? "bg-(--ngo-cream)" : "bg-white"}
                    >
                        <ProgramDetail {...program} reverse={index % 2 === 1} />
                    </div>
                ))}
            </div>
            <CTASection images={images} />
        </>
    );
}
