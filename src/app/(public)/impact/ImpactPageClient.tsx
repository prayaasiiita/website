"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
    BookOpen,
    Users,
    Calendar,
    Heart,
    GraduationCap,
    TrendingUp,
    Award,
    Target,
} from "lucide-react";
import { PageImagesMap, getImageSrc } from "@/src/components/DynamicImage";

// Default fallback images
const FALLBACK_IMAGES = {
    hero: { src: "https://images.unsplash.com/photo-1529390079861-591f72bea6c0?w=1920&q=80", alt: "Children celebrating" },
};

function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
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
                        Our Impact
                    </span>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Making a Difference
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                        Every number tells a story. Explore the impact we&apos;ve made in the
                        lives of children and communities.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function StatsSection() {
    const stats = [
        { value: 500, suffix: "+", label: "Children Educated", icon: BookOpen, color: "var(--ngo-orange)", gradient: "from-orange-50 via-white to-amber-50" },
        { value: 150, suffix: "+", label: "Active Volunteers", icon: Users, color: "var(--ngo-green)", gradient: "from-green-50 via-white to-emerald-50" },
        { value: 50, suffix: "+", label: "Events Conducted", icon: Calendar, color: "var(--ngo-yellow)", gradient: "from-yellow-50 via-white to-amber-50" },
        { value: 10, suffix: "+", label: "Years of Service", icon: Heart, color: "#8b5cf6", gradient: "from-purple-50 via-white to-violet-50" },
        { value: 85, suffix: "%", label: "School Enrollment Rate", icon: GraduationCap, color: "#ec4899", gradient: "from-pink-50 via-white to-rose-50" },
        { value: 30, suffix: "+", label: "Success Stories", icon: Award, color: "#14b8a6", gradient: "from-teal-50 via-white to-cyan-50" },
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
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--ngo-orange)/10 text-(--ngo-orange) text-sm font-semibold mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-(--ngo-orange) animate-pulse" />
                        By The Numbers
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Our{" "}
                        <span className="relative inline-block">
                            <span className="text-(--ngo-orange)">Achievements</span>
                            <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        A decade of dedication has led to measurable change in our community
                    </p>
                </motion.div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`group relative bg-linear-to-br ${stat.gradient} rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden`}
                        >
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-8 h-8">
                                <div 
                                    className="absolute top-0 left-0 w-full h-0.5 transition-all duration-300 group-hover:w-12"
                                    style={{ background: `linear-gradient(to right, ${stat.color}, transparent)` }}
                                />
                                <div 
                                    className="absolute top-0 left-0 w-0.5 h-full transition-all duration-300 group-hover:h-12"
                                    style={{ background: `linear-gradient(to bottom, ${stat.color}, transparent)` }}
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8">
                                <div 
                                    className="absolute bottom-0 right-0 w-full h-0.5 transition-all duration-300 group-hover:w-12"
                                    style={{ background: `linear-gradient(to left, ${stat.color}, transparent)` }}
                                />
                                <div 
                                    className="absolute bottom-0 right-0 w-0.5 h-full transition-all duration-300 group-hover:h-12"
                                    style={{ background: `linear-gradient(to top, ${stat.color}, transparent)` }}
                                />
                            </div>
                            
                            {/* Hover gradient blob */}
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at center, ${stat.color}08 0%, transparent 70%)` }}
                            />
                            
                            {/* Icon with decorative ring */}
                            <div className="relative w-16 h-16 mx-auto mb-4">
                                <div 
                                    className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 group-hover:animate-spin-slow"
                                    style={{ borderColor: stat.color }}
                                />
                                <div
                                    className="absolute inset-1 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: `${stat.color}15` }}
                                >
                                    <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                                </div>
                            </div>
                            
                            <div
                                className="text-5xl font-bold text-(--ngo-dark) mb-2 relative"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                <Counter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-(--ngo-gray) font-medium relative">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ImpactAreasSection() {
    const areas = [
        {
            title: "Academic Excellence",
            description:
                "Students in our program have shown significant improvement in their academic performance, with many scoring in the top percentile of their classes.",
            stats: "40% average grade improvement",
            icon: TrendingUp,
            color: "var(--ngo-orange)",
            number: "01",
        },
        {
            title: "School Enrollment",
            description:
                "We have successfully enrolled and retained children in formal schooling who would otherwise have dropped out due to economic challenges.",
            stats: "85% enrollment rate",
            icon: GraduationCap,
            color: "var(--ngo-green)",
            number: "02",
        },
        {
            title: "Skill Development",
            description:
                "Beyond academics, children develop essential life skills, computer literacy, and communication abilities that prepare them for the future.",
            stats: "100+ skills taught",
            icon: Target,
            color: "var(--ngo-yellow)",
            number: "03",
        },
        {
            title: "Community Engagement",
            description:
                "Our outreach programs have raised awareness about the importance of education among families in surrounding villages.",
            stats: "500+ families reached",
            icon: Users,
            color: "var(--ngo-orange)",
            number: "04",
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-(--ngo-orange)/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-(--ngo-green)/5 rounded-full blur-3xl" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--ngo-orange)/10 text-(--ngo-orange) text-sm font-semibold mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-(--ngo-orange) animate-pulse" />
                        Impact Areas
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Where We Make a{" "}
                        <span className="relative inline-block">
                            <span className="text-(--ngo-orange)">Difference</span>
                            <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
                            </svg>
                        </span>
                    </h2>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {areas.map((area, index) => (
                        <motion.div
                            key={area.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="group relative"
                        >
                            <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 overflow-hidden">
                                {/* Large background number */}
                                <div 
                                    className="absolute -top-4 -right-2 text-[120px] font-bold leading-none opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 select-none pointer-events-none"
                                    style={{ fontFamily: "'Playfair Display', serif", color: area.color }}
                                >
                                    {area.number}
                                </div>
                                
                                {/* Accent line on left */}
                                <div 
                                    className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-300 group-hover:top-4 group-hover:bottom-4"
                                    style={{ backgroundColor: area.color }}
                                />
                                
                                <div className="flex items-start gap-5 relative z-10">
                                    {/* Icon */}
                                    <div 
                                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                                        style={{ backgroundColor: `${area.color}15` }}
                                    >
                                        <area.icon className="w-7 h-7" style={{ color: area.color }} />
                                        
                                        {/* Decorative corner */}
                                        <div 
                                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-60"
                                            style={{ backgroundColor: area.color }}
                                        />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className="text-xl sm:text-2xl font-bold text-(--ngo-dark) mb-2 group-hover:text-opacity-90 transition-colors"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {area.title}
                                        </h3>
                                        <p className="text-(--ngo-gray) text-sm sm:text-base leading-relaxed mb-4">
                                            {area.description}
                                        </p>
                                        
                                        {/* Stats badge with icon */}
                                        <div 
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-transform duration-300 group-hover:scale-105"
                                            style={{ 
                                                backgroundColor: `${area.color}10`,
                                                color: area.color
                                            }}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                            {area.stats}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bottom decorative dots */}
                                <div className="absolute bottom-3 right-4 flex gap-1.5 opacity-30">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: area.color }} />
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: area.color }} />
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: area.color }} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SuccessStoriesSection() {
    const stories = [
        {
            name: "Amit Yadav",
            story:
                "From a struggling student to topping his class, Amit's journey with Prayaas shows the power of dedicated mentoring. He is now preparing for competitive exams.",
            achievement: "Class topper, aspiring engineer",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
            color: "var(--ngo-orange)",
        },
        {
            name: "Meera Singh",
            story:
                "Meera joined Prayaas unable to read. Today, she reads fluently, helps teach younger students, and dreams of becoming a teacher herself.",
            achievement: "From non-reader to student teacher",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
            color: "var(--ngo-green)",
        },
        {
            name: "Raj Patel",
            story:
                "Computer literacy classes at Prayaas opened new doors for Raj. He now helps his father with digital payments and dreams of working in technology.",
            achievement: "Digital literacy champion",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
            color: "var(--ngo-orange)",
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-linear-to-br from-white via-(--ngo-cream)/30 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-(--ngo-orange)/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-(--ngo-green)/5 rounded-full blur-3xl" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--ngo-orange)/10 text-(--ngo-orange) text-sm font-semibold mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-(--ngo-orange) animate-pulse" />
                        Success Stories
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Lives{" "}
                        <span className="relative inline-block">
                            <span className="text-(--ngo-orange)">Transformed</span>
                            <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 6 Q 25 0, 50 6 T 100 6" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto">
                        Real stories of children who have blossomed through our programs
                    </p>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group"
                        >
                            <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 overflow-hidden h-full">
                                {/* Top accent bar */}
                                <div 
                                    className="absolute top-0 left-6 right-6 h-1 rounded-b-full transition-all duration-300 group-hover:left-4 group-hover:right-4"
                                    style={{ backgroundColor: story.color }}
                                />
                                
                                {/* Quote decoration */}
                                <div 
                                    className="absolute top-16 right-4 text-6xl font-serif leading-none opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                                    style={{ color: story.color }}
                                >
                                    "
                                </div>
                                
                                {/* Avatar with ring */}
                                <div className="relative w-20 h-20 mx-auto mb-5">
                                    {/* Animated ring */}
                                    <div 
                                        className="absolute -inset-1 rounded-full border-2 border-dashed opacity-40 group-hover:animate-spin-slow"
                                        style={{ borderColor: story.color }}
                                    />
                                    {/* Image */}
                                    <div 
                                        className="relative w-full h-full rounded-full overflow-hidden ring-3 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    >
                                        <Image
                                            src={story.image}
                                            alt={story.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Status dot */}
                                    <div 
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                                        style={{ backgroundColor: story.color }}
                                    >
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Name */}
                                <h3
                                    className="text-xl font-bold text-(--ngo-dark) text-center mb-1"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {story.name}
                                </h3>
                                
                                {/* Achievement badge */}
                                <p 
                                    className="text-sm text-center mb-4 font-medium"
                                    style={{ color: story.color }}
                                >
                                    {story.achievement}
                                </p>
                                
                                {/* Divider */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <div className="w-8 h-px bg-(--ngo-gray)/20" />
                                    <div 
                                        className="w-2 h-2 rounded-full opacity-40"
                                        style={{ backgroundColor: story.color }}
                                    />
                                    <div className="w-8 h-px bg-(--ngo-gray)/20" />
                                </div>
                                
                                {/* Story */}
                                <p className="text-(--ngo-gray) text-center text-sm sm:text-base leading-relaxed">
                                    {story.story}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TimelineSection() {
    const milestones = [
        { year: "2014", event: "Prayaas founded by 5 passionate students" },
        { year: "2015", event: "First batch of 30 students enrolled" },
        { year: "2017", event: "100+ students milestone reached" },
        { year: "2019", event: "Computer literacy program launched" },
        { year: "2021", event: "Virtual classes during pandemic" },
        { year: "2023", event: "500+ children impacted" },
        { year: "2024", event: "10 years of transforming lives" },
    ];

    return (
        <section className="py-20 sm:py-28 relative overflow-hidden">
            {/* Warm cream/beige background */}
            <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50/80 to-amber-50" />
            
            {/* Decorative blurred shapes */}
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-(--ngo-orange)/10 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-(--ngo-green)/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-(--ngo-yellow)/10 blur-3xl" />
            
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.15]" style={{
                backgroundImage: 'radial-gradient(circle, var(--ngo-dark) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }} />
            
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.span 
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/50 text-(--ngo-orange) text-sm font-semibold mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <span className="w-2 h-2 rounded-full bg-(--ngo-orange) animate-pulse" />
                        Our Journey
                    </motion.span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-4 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        A Decade of{" "}
                        <span className="relative inline-block">
                            <span className="bg-linear-to-r from-(--ngo-orange) to-(--ngo-green) bg-clip-text text-transparent">Impact</span>
                            <motion.div 
                                className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-(--ngo-orange) to-(--ngo-green) rounded-full"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            />
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) max-w-lg mx-auto">
                        Every milestone marks another step in our mission to transform lives
                    </p>
                </motion.div>
                
                {/* Timeline */}
                <div className="relative">
                    {/* Central line with gradient */}
                    <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 sm:-translate-x-1/2 rounded-full bg-linear-to-b from-(--ngo-orange)/40 via-(--ngo-green)/40 to-(--ngo-orange)/40" />
                    
                    {milestones.map((milestone, index) => {
                        const isLeft = index % 2 === 0;
                        const color = isLeft ? 'var(--ngo-orange)' : 'var(--ngo-green)';
                        const bgColor = isLeft ? 'rgba(255, 107, 53, 0.08)' : 'rgba(76, 175, 80, 0.08)';
                        
                        return (
                            <motion.div
                                key={milestone.year}
                                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`relative flex items-start mb-8 sm:mb-12 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                            >
                                {/* Spacer for desktop */}
                                <div className="hidden sm:block w-1/2" />
                                
                                {/* Timeline node */}
                                <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 z-10">
                                    <motion.div 
                                        className="relative flex items-center justify-center"
                                        whileHover={{ scale: 1.2, rotate: 180 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {/* Outer rotating ring */}
                                        <motion.div 
                                            className="absolute w-10 h-10 rounded-full border-2 border-dashed opacity-40"
                                            style={{ borderColor: color }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        />
                                        {/* Main dot */}
                                        <div 
                                            className="w-5 h-5 rounded-full ring-4 ring-white shadow-lg"
                                            style={{ backgroundColor: color, boxShadow: `0 4px 15px ${color}40` }}
                                        />
                                    </motion.div>
                                </div>
                                
                                {/* Content */}
                                <div className={`w-full sm:w-1/2 pl-16 sm:pl-0 ${isLeft ? 'sm:pr-12' : 'sm:pl-12'}`}>
                                    <motion.div 
                                        className="group relative"
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {/* Card with thicker padding */}
                                        <div 
                                            className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                                        >
                                            {/* Background tint */}
                                            <div 
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                style={{ backgroundColor: bgColor }}
                                            />
                                            
                                            {/* Corner accent */}
                                            <div 
                                                className={`absolute top-0 ${isLeft ? 'right-0' : 'left-0'} w-16 h-16`}
                                                style={{
                                                    background: `linear-gradient(${isLeft ? '135deg' : '225deg'}, ${color}15 50%, transparent 50%)`
                                                }}
                                            />
                                            
                                            {/* Year badge */}
                                            <div className="relative flex items-center gap-4 mb-3">
                                                <span 
                                                    className="text-3xl sm:text-4xl font-bold"
                                                    style={{ color, fontFamily: "'Playfair Display', serif" }}
                                                >
                                                    {milestone.year}
                                                </span>
                                                <motion.div 
                                                    className="flex-1 h-0.5 rounded-full"
                                                    style={{ backgroundColor: `${color}30` }}
                                                    initial={{ scaleX: 0 }}
                                                    whileInView={{ scaleX: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.3 + index * 0.1 }}
                                                />
                                            </div>
                                            
                                            {/* Event */}
                                            <p className="relative text-(--ngo-dark) font-medium text-base sm:text-lg leading-relaxed">
                                                {milestone.event}
                                            </p>
                                            
                                            {/* Bottom accent bar */}
                                            <motion.div 
                                                className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
                                                style={{ backgroundColor: color }}
                                                initial={{ width: 0 }}
                                                whileHover={{ width: '100%' }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                    
                    {/* End marker */}
                    <motion.div 
                        className="absolute left-6 sm:left-1/2 -bottom-4 sm:-translate-x-1/2"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, type: "spring" }}
                    >
                        <motion.div 
                            className="w-12 h-12 rounded-full bg-linear-to-br from-(--ngo-orange) to-(--ngo-green) flex items-center justify-center shadow-xl ring-4 ring-white"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Bottom callout */}
                <motion.div 
                    className="mt-16 sm:mt-20 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.div 
                        className="inline-flex items-center gap-4 px-6 sm:px-8 py-4 rounded-2xl bg-white shadow-lg border border-gray-100"
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-(--ngo-orange)/20 to-(--ngo-green)/20 flex items-center justify-center">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <div>
                            <p className="text-(--ngo-dark) font-bold text-lg">And the journey continues...</p>
                            <p className="text-(--ngo-gray) text-sm">10+ years strong, still growing</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

function CTASection({ images }: { images: PageImagesMap }) {
    const ctaSrc = getImageSrc(images, "cta", "background", "");

    return (
        <section className="py-24 section-gradient relative overflow-hidden">
            {ctaSrc && (
                <div className="absolute inset-0">
                    <Image
                        src={ctaSrc}
                        alt="Background"
                        fill
                        className="object-cover opacity-10"
                    />
                </div>
            )}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Help Us Create More Impact
                    </h2>
                    <p className="text-(--ngo-gray) text-lg mb-10 max-w-2xl mx-auto">
                        Every contribution, big or small, helps us reach more children and
                        create more success stories.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/get-involved#donate"
                            className="btn-primary flex items-center justify-center gap-2"
                        >
                            <Heart className="w-5 h-5" />
                            Make a Donation
                        </Link>
                        <Link
                            href="/get-involved#volunteer"
                            className="btn-secondary flex items-center justify-center gap-2"
                        >
                            <Users className="w-5 h-5" />
                            Join as Volunteer
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function ImpactPageClient({ images }: { images: PageImagesMap }) {
    return (
        <>
            <PageHero images={images} />
            <StatsSection />
            <ImpactAreasSection />
            <SuccessStoriesSection />
            <TimelineSection />
            <CTASection images={images} />
        </>
    );
}
