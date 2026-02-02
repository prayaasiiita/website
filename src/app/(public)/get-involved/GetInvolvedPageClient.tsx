"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Heart,
    Users,
    Calendar,
    Gift,
    CheckCircle,
    ArrowRight,
    Mail,
    Phone,
    Clock,
    MapPin,
} from "lucide-react";
import { PageImagesMap, getImageSrc } from "@/src/components/DynamicImage";

interface GetInvolvedPageClientProps {
    images: PageImagesMap;
}

function PageHero({ images }: { images: PageImagesMap }) {
    return (
        <section className="relative py-32 sm:py-40 overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={getImageSrc(images, "hero", "main", "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80")}
                    alt="Volunteers"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="hero-gradient absolute inset-0" />
            </div>
            
            {/* Floating decorative elements */}
            <motion.div 
                className="absolute top-24 left-[10%] w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hidden lg:flex"
                animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div 
                className="absolute top-32 right-[12%] w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hidden lg:flex"
                animate={{ y: [0, 12, 0], rotate: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <Users className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div 
                className="absolute bottom-32 left-[15%] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hidden lg:flex"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <Gift className="w-5 h-5 text-white" />
            </motion.div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.span 
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20"
                        whileHover={{ scale: 1.05 }}
                    >
                        <span className="w-2 h-2 rounded-full bg-(--ngo-orange) animate-pulse" />
                        Get Involved
                    </motion.span>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Join Our{" "}
                        <span className="relative inline-block">
                            Cause
                            <motion.div 
                                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-linear-to-r from-(--ngo-orange) to-(--ngo-yellow) rounded-full"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            />
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10">
                        There are many ways you can contribute to making a difference in the
                        lives of underprivileged children.
                    </p>
                    
                    {/* Quick action buttons */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <a 
                            href="#donate" 
                            className="group flex items-center gap-2 px-6 py-3 bg-white text-(--ngo-dark) rounded-full font-semibold hover:bg-(--ngo-orange) hover:text-white transition-all duration-300 shadow-lg"
                        >
                            <Heart className="w-5 h-5" />
                            Donate Now
                        </a>
                        <a 
                            href="#volunteer" 
                            className="group flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm text-white rounded-full font-semibold border border-white/30 hover:bg-white hover:text-(--ngo-dark) transition-all duration-300"
                        >
                            <Users className="w-5 h-5" />
                            Volunteer
                        </a>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 50L48 45.8C96 41.7 192 33.3 288 35.2C384 37 480 49 576 54.2C672 59.3 768 57.7 864 50C960 42.3 1056 28.7 1152 26.8C1248 25 1344 35 1392 40L1440 45V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white"/>
                </svg>
            </div>
        </section>
    );
}

function DonateSection() {
    const donationTiers = [
        {
            amount: "₹500",
            title: "Supporter",
            description: "Provides books and stationery for one child for a month",
            features: ["Educational materials", "Notebooks & pens", "Certificate of appreciation"],
            color: "var(--ngo-green)",
            icon: "📚"
        },
        {
            amount: "₹2,000",
            title: "Champion",
            description: "Sponsors a child's complete education for a month",
            features: ["All educational materials", "Uniform support", "Health checkup", "Monthly progress report"],
            popular: true,
            color: "var(--ngo-orange)",
            icon: "🏆"
        },
        {
            amount: "₹5,000",
            title: "Patron",
            description: "Supports a special event or workshop",
            features: ["Sponsor an event", "Recognition at event", "Impact report", "Personal thank you note"],
            color: "var(--ngo-yellow)",
            icon: "⭐"
        },
    ];

    return (
        <section id="donate" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
            {/* Background decorations */}
            <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-(--ngo-orange)/5 blur-3xl" />
            <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-(--ngo-green)/5 blur-3xl" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2 justify-center">
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                        Donate
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Support Our{" "}
                        <span className="relative inline-block">
                            Mission
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-orange)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto">
                        Your generous contribution helps us provide quality education and
                        opportunities to children who need it most.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {donationTiers.map((tier, index) => (
                        <motion.div
                            key={tier.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <motion.div
                                className={`relative rounded-2xl p-6 sm:p-8 h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                                    tier.popular ? "border-2 border-(--ngo-green) ring-4 ring-(--ngo-green)/10" : "border border-gray-100"
                                }`}
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {tier.popular && (
                                    <motion.span 
                                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-(--ngo-green) text-white text-xs font-bold rounded-full shadow-md"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        ✨ Most Popular
                                    </motion.span>
                                )}
                                
                                {/* Icon */}
                                <div className="text-3xl mb-3">{tier.icon}</div>
                                
                                <div className="mb-6">
                                    <span
                                        className="text-3xl sm:text-4xl font-bold"
                                        style={{ fontFamily: "'Playfair Display', serif", color: tier.color }}
                                    >
                                        {tier.amount}
                                    </span>
                                    <span className="text-(--ngo-gray) text-sm">/month</span>
                                    <h3 className="text-lg sm:text-xl font-bold mt-2 text-(--ngo-dark)">
                                        {tier.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-(--ngo-gray)">
                                        {tier.description}
                                    </p>
                                </div>
                                
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <div 
                                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${tier.color}15` }}
                                            >
                                                <CheckCircle
                                                    className="w-3.5 h-3.5"
                                                    style={{ color: tier.color }}
                                                />
                                            </div>
                                            <span className="text-sm text-(--ngo-dark)">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                
                                <motion.button
                                    className="w-full py-3 rounded-xl font-semibold transition-all duration-300 text-white"
                                    style={{ backgroundColor: tier.color }}
                                    whileHover={{ scale: 1.02, opacity: 0.9 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Donate {tier.amount}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-linear-to-br from-(--ngo-cream) to-orange-50 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
                >
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-(--ngo-green)/10 rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-(--ngo-orange)/10 rounded-tr-full" />
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--ngo-green) to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <h3
                            className="text-2xl font-bold text-(--ngo-dark) mb-2"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Custom Donation
                        </h3>
                        <p className="text-(--ngo-gray) mb-6 max-w-xl mx-auto">
                            Want to contribute a different amount or sponsor a specific program?
                            Contact us to discuss how you can make a personalized impact.
                        </p>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-(--ngo-green) text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                Contact Us <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function VolunteerSection() {
    const roles = [
        {
            title: "Teaching Volunteer",
            description:
                "Help teach subjects like Math, Science, English, or Computer basics to children.",
            commitment: "4-6 hours/week",
            skills: ["Subject expertise", "Patience", "Communication"],
            icon: "📖",
            color: "var(--ngo-orange)"
        },
        {
            title: "Activity Coordinator",
            description:
                "Organize and lead recreational activities, sports, arts, and cultural events.",
            commitment: "2-4 hours/week",
            skills: ["Creativity", "Leadership", "Event management"],
            icon: "🎨",
            color: "var(--ngo-green)"
        },
        {
            title: "Content Creator",
            description:
                "Help with social media, photography, videography, and documentation.",
            commitment: "Flexible",
            skills: ["Photography/Video", "Social media", "Writing"],
            icon: "📸",
            color: "var(--ngo-yellow)"
        },
        {
            title: "Event Volunteer",
            description:
                "Assist in organizing special events, health camps, and community outreach programs.",
            commitment: "Event-based",
            skills: ["Organization", "Teamwork", "Communication"],
            icon: "🎪",
            color: "#8B5CF6"
        },
    ];

    return (
        <section id="volunteer" className="py-24 relative overflow-hidden scroll-mt-24">
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-(--ngo-cream) via-white to-green-50" />
            
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-(--ngo-green)/10 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-(--ngo-orange)/10 blur-3xl" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2 justify-center">
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                        Volunteer
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Join Our{" "}
                        <span className="relative inline-block">
                            Team
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto">
                        Become a part of our volunteer family and make a direct impact on
                        children&apos;s lives.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <motion.div 
                                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden"
                                whileHover={{ y: -5 }}
                            >
                                {/* Corner accent */}
                                <div 
                                    className="absolute top-0 right-0 w-20 h-20 opacity-10"
                                    style={{ background: `linear-gradient(135deg, ${role.color} 50%, transparent 50%)` }}
                                />
                                
                                {/* Left accent bar */}
                                <div 
                                    className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
                                    style={{ backgroundColor: role.color }}
                                />
                                
                                <div className="flex items-start gap-4">
                                    <motion.div 
                                        className="text-3xl"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        {role.icon}
                                    </motion.div>
                                    <div className="flex-1">
                                        <h3
                                            className="text-xl font-bold text-(--ngo-dark) mb-2"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {role.title}
                                        </h3>
                                        <p className="text-(--ngo-gray) text-sm mb-4">{role.description}</p>
                                        
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${role.color}20` }}>
                                                <Clock className="w-4 h-4" style={{ color: role.color }} />
                                            </div>
                                            <span className="text-(--ngo-dark) font-medium text-sm">
                                                {role.commitment}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {role.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 text-xs rounded-full font-medium"
                                                    style={{ backgroundColor: `${role.color}15`, color: role.color }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-(--ngo-green)/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-(--ngo-orange)/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-(--ngo-green) to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3
                                className="text-2xl font-bold text-(--ngo-dark) mb-2"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Apply to Volunteer
                            </h3>
                            <p className="text-(--ngo-gray) text-sm">Fill out the form below and we'll get back to you</p>
                        </div>
                        
                        <form className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-(--ngo-dark) font-medium mb-2 text-sm">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none transition-all bg-gray-50 hover:bg-white"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-(--ngo-dark) font-medium mb-2 text-sm">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none transition-all bg-gray-50 hover:bg-white"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-(--ngo-dark) font-medium mb-2 text-sm">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none transition-all bg-gray-50 hover:bg-white"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-(--ngo-dark) font-medium mb-2 text-sm">
                                    Interested Role
                                </label>
                                <select className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none transition-all bg-gray-50 hover:bg-white">
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.title} value={role.title}>
                                            {role.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-(--ngo-dark) font-medium mb-2 text-sm">
                                    Why do you want to volunteer with us?
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none transition-all resize-none bg-gray-50 hover:bg-white"
                                    placeholder="Tell us about yourself and your motivation..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <motion.button
                                    type="submit"
                                    className="w-full py-4 bg-linear-to-r from-(--ngo-green) to-emerald-500 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(76, 175, 80, 0.3)" }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    Submit Application <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function EventsSection() {
    const events = [
        {
            title: "Annual Day Celebration",
            date: "March 15, 2025",
            time: "10:00 AM - 4:00 PM",
            location: "IIIT Allahabad Campus",
            description:
                "Join us for our annual celebration featuring performances, awards, and fun activities.",
            icon: "🎉",
            color: "var(--ngo-orange)"
        },
        {
            title: "Health Camp",
            date: "February 20, 2025",
            time: "9:00 AM - 2:00 PM",
            location: "Jhalwa Village",
            description:
                "Free health checkup camp for children and families in the community.",
            icon: "🏥",
            color: "var(--ngo-green)"
        },
        {
            title: "Career Awareness Workshop",
            date: "April 5, 2025",
            time: "2:00 PM - 5:00 PM",
            location: "Prayaas Learning Center",
            description:
                "Interactive session on career options and goal setting for older students.",
            icon: "🎯",
            color: "var(--ngo-yellow)"
        },
    ];

    return (
        <section id="events" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-(--ngo-orange)/20 via-(--ngo-green)/20 to-(--ngo-yellow)/20" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2 justify-center">
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                        Events
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Upcoming{" "}
                        <span className="relative inline-block">
                            Events
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-yellow)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto">
                        Participate in our events and be part of the positive change we&apos;re
                        creating.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                    {events.map((event, index) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <motion.div 
                                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden border border-gray-100"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {/* Top accent line */}
                                <div 
                                    className="absolute top-0 left-0 right-0 h-1"
                                    style={{ backgroundColor: event.color }}
                                />
                                
                                {/* Date badge */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                                        style={{ backgroundColor: `${event.color}15` }}
                                    >
                                        <span className="text-2xl">{event.icon}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-(--ngo-dark)">{event.date}</span>
                                        <div className="flex items-center gap-1 text-(--ngo-gray) text-xs">
                                            <Clock className="w-3 h-3" />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <h3
                                    className="text-xl font-bold text-(--ngo-dark) mb-3"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {event.title}
                                </h3>
                                <p className="text-(--ngo-gray) text-sm mb-4">{event.description}</p>
                                
                                <div className="flex items-center gap-2 text-sm mb-6 px-3 py-2 rounded-lg" style={{ backgroundColor: `${event.color}10` }}>
                                    <MapPin className="w-4 h-4" style={{ color: event.color }} />
                                    <span className="text-(--ngo-dark)">{event.location}</span>
                                </div>
                                
                                <motion.button 
                                    className="w-full py-3 border-2 rounded-xl font-semibold transition-all duration-300"
                                    style={{ borderColor: event.color, color: event.color }}
                                    whileHover={{ backgroundColor: event.color, color: 'white' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Register Now
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection({ images }: { images: PageImagesMap }) {
    return (
        <section className="py-24 sm:py-28 relative overflow-hidden">
            {/* Light gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-(--ngo-cream) via-white to-green-50" />
            
            {/* Decorative shapes */}
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-(--ngo-orange)/10 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-(--ngo-green)/10 blur-3xl" />
            
            {/* Floating icons */}
            <motion.div 
                className="absolute top-20 left-[15%] text-4xl opacity-30 hidden lg:block"
                animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                💬
            </motion.div>
            <motion.div 
                className="absolute bottom-24 right-[20%] text-3xl opacity-30 hidden lg:block"
                animate={{ y: [0, 8, 0], rotate: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                ✉️
            </motion.div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Icon */}
                    <motion.div 
                        className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--ngo-orange) to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Mail className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Have{" "}
                        <span className="relative inline-block">
                            <span className="text-(--ngo-orange)">Questions?</span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg mb-10 max-w-2xl mx-auto">
                        We&apos;d love to hear from you. Reach out to us for any queries about
                        volunteering, donations, or partnerships.
                    </p>
                    
                    {/* Contact info cards */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                        <motion.a
                            href="mailto:prayaas@iiita.ac.in"
                            className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                            whileHover={{ y: -3 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-(--ngo-orange)/10 flex items-center justify-center group-hover:bg-(--ngo-orange) transition-colors">
                                <Mail className="w-5 h-5 text-(--ngo-orange) group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-(--ngo-dark) font-medium">prayaas@iiita.ac.in</span>
                        </motion.a>
                        <motion.a
                            href="tel:+919876543210"
                            className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
                            whileHover={{ y: -3 }}
                        >
                            <div className="w-10 h-10 rounded-full bg-(--ngo-green)/10 flex items-center justify-center group-hover:bg-(--ngo-green) transition-colors">
                                <Phone className="w-5 h-5 text-(--ngo-green) group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-(--ngo-dark) font-medium">+91 98765 43210</span>
                        </motion.a>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-(--ngo-orange) text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Contact Us <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default function GetInvolvedPageClient({ images }: GetInvolvedPageClientProps) {
    return (
        <>
            <PageHero images={images} />
            <DonateSection />
            <VolunteerSection />
            <EventsSection />
            <CTASection images={images} />
        </>
    );
}
