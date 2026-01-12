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
    Handshake,
    Mail,
    Linkedin,
    ArrowRight,
    Heart,
    Phone,
} from "lucide-react";
import SpotlightCard from "@/src/components/SpotlightCard";
import { useEffect, useState } from "react";
import { PageImagesMap, getImageSrc, getCarouselImages } from "@/src/components/DynamicImage";

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
                    <span className="inline-block px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                        About Us
                    </span>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Our Story of Hope
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
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
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                            Our Story
                        </span>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-6"
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
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105">
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
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full"
                    >
                        <SpotlightCard
                            className="h-full bg-white text-(--ngo-dark) border-transparent rounded-3xl p-10 shadow-xl card-hover"
                            spotlightColor="rgba(234, 179, 8, 0.22)"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-(--ngo-orange)/20 flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-(--ngo-orange)" />
                            </div>
                            <h3
                                className="text-3xl font-bold text-(--ngo-dark) mb-4"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Our Mission
                            </h3>
                            <p className="text-(--ngo-gray) text-lg leading-relaxed">
                                To empower underprivileged children through quality education,
                                life skills training, and holistic development programs, enabling
                                them to break the cycle of poverty and build a brighter future
                                for themselves and their communities.
                            </p>
                        </SpotlightCard>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full"
                    >
                        <SpotlightCard
                            className="h-full bg-white text-(--ngo-dark) border-transparent rounded-3xl p-10 shadow-xl card-hover"
                            spotlightColor="rgba(234, 179, 8, 0.22)"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-(--ngo-green)/20 flex items-center justify-center mb-6">
                                <Eye className="w-8 h-8 text-(--ngo-green)" />
                            </div>
                            <h3
                                className="text-3xl font-bold text-(--ngo-dark) mb-4"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Our Vision
                            </h3>
                            <p className="text-(--ngo-gray) text-lg leading-relaxed">
                                A world where every child, regardless of their background, has
                                access to quality education and the opportunity to realize their
                                full potential. We envision communities where education is a
                                bridge to opportunity, not a barrier.
                            </p>
                        </SpotlightCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ValuesSection() {
    const values = [
        {
            icon: Handshake,
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
            icon: Target,
            title: "Priorities",
            description:
                "Priorities must be set straight first Studies then Prayaas.",
            color: "#14b8a6",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                        What We Stand For
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Our Principles
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        These 7 principles guide everything we do at Prayaas
                    </p>
                </motion.div>
                <div
                    className="grid gap-8 justify-center"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
                >
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <SpotlightCard
                                className="h-full bg-white border-transparent text-(--ngo-dark) shadow-lg card-hover"
                                spotlightColor="rgba(234, 179, 8, 0.22)"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
                                    style={{ backgroundColor: `${value.color}20` }}
                                >
                                    <value.icon className="w-7 h-7" style={{ color: value.color }} />
                                </div>
                                <h3
                                    className="text-xl font-bold text-(--ngo-dark) mb-3"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {value.title}
                                </h3>
                                <p className="text-(--ngo-gray) leading-relaxed">
                                    {value.description}
                                </p>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
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
    const classes = {
        card: "p-5 max-w-md",
        image: "w-24 h-24 md:w-32 md:h-32",
        name: "text-lg",
        role: "text-sm",
        icons: "w-4 h-4",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.01 }}
            whileHover={{ scale: 1.03 }}
        >
            <SpotlightCard
                className={`bg-white text-(--ngo-dark) border-transparent rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-70 sm:w-[320px] md:w-85 min-h-50 sm:min-h-60 ${classes.card}`}
                spotlightColor="rgba(234, 179, 8, 0.22)"
            >
                <div className="flex flex-col items-center text-center h-full justify-between">
                    <div
                        className={`relative ${classes.image} mb-4 rounded-full overflow-hidden ring-4 ring-(--ngo-orange)/20`}
                    >
                        {member.image ? (
                            <Image
                                src={member.image}
                                alt={`Photo of ${member.name}`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-(--ngo-orange)/20 to-(--ngo-green)/20 flex items-center justify-center">
                                <Users className="w-1/2 h-1/2 text-(--ngo-gray)/50" />
                            </div>
                        )}
                    </div>
                    <h3
                        className={`font-bold text-(--ngo-dark) ${classes.name}`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {member.name}
                    </h3>
                    <p className={`text-(--ngo-orange) font-medium ${classes.role}`}>
                        {member.role}
                    </p>
                    <div className="flex gap-3 mt-4">
                        <a
                            href={`mailto:${member.email}`}
                            aria-label={`Send email to ${member.name}`}
                            className="p-2 rounded-full bg-(--ngo-orange)/10 hover:bg-(--ngo-orange)/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-(--ngo-orange)"
                        >
                            <Mail className={`${classes.icons} text-(--ngo-orange)`} />
                        </a>
                        {member.linkedin ? (
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${member.name}'s LinkedIn profile`}
                                className="p-2 rounded-full bg-(--ngo-green)/10 hover:bg-(--ngo-green)/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-(--ngo-green)"
                            >
                                <Linkedin className={`${classes.icons} text-(--ngo-green)`} />
                            </a>
                        ) : (
                            <span
                                aria-disabled="true"
                                className="p-2 rounded-full bg-gray-200 cursor-not-allowed opacity-50"
                                title="LinkedIn profile not available"
                            >
                                <Linkedin className={`${classes.icons} text-gray-400`} />
                            </span>
                        )}
                    </div>
                </div>
            </SpotlightCard>
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
                            Join Our Mission
                        </h2>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
                            Be a part of our story. Together, we can create lasting change in the
                        lives of children who need it most.
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
                                Get in Touch
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
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
