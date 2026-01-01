"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { links } from "@/details";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import SpotlightCard from "@/src/components/ui/spotlightCard";
import { PageImagesMap, getImageSrc } from "@/src/components/DynamicImage";

// Default fallback images
const FALLBACK_IMAGES = {
    hero: { src: "/college.jfif", alt: "Contact" },
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
                        Contact Us
                    </span>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Get in Touch
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                        We&apos;d love to hear from you. Whether you have a question, want to
                        volunteer, or just want to say hello.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

function ContactInfoSection() {
    const contactInfo = [
        {
            icon: MapPin,
            title: "Our Location",
            details: ["IIIT Allahabad", "Jhalwa, Prayagraj", "Uttar Pradesh 211015, India"],
            color: "#e85a4f",
            url: "/contact-us#location"
        },
        {
            icon: Mail,
            title: "Email Us",
            details: ["prayaas@iiita.ac.in"],
            color: "#2d6a4f",
            url: "mailto:prayaas@iiita.ac.in"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: ["+91 98765 43210"],
            color: "#eec643",
        },
        {
            icon: Clock,
            title: "Classes Hours",
            details: ["Classes: Mon-Sun 5 AM - 6 PM"],
            color: "#8b5cf6",
        },
    ];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={info.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <SpotlightCard className="h-full text-center p-6 rounded-2xl bg-white border-transparent text-(--ngo-dark) shadow-lg card-hover" spotlightColor="rgba(255, 138, 76, 0.2)">
                                <Link href={`${info.url || "/contact-us"}`}>
                                    <div
                                        className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                                        style={{ backgroundColor: `${info.color}20` }}
                                    >
                                        <info.icon className="w-7 h-7" style={{ color: info.color }} />
                                    </div>
                                    <h3
                                        className="text-lg font-bold text-(--ngo-dark) mb-3"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        {info.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {info.details.map((detail) => (
                                            <p key={detail} className="text-(--ngo-gray) text-sm">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </Link>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ContactFormSection() {
    return (
        <section className="py-12 section-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                            Send us a Message
                        </span>
                        <h2
                            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            We&apos;re Here to Help
                        </h2>
                        <p className="text-(--ngo-gray) text-lg mb-8">
                            Fill out the form and our team will get back to you within 24
                            hours. We&apos;re always happy to answer your questions and discuss
                            how you can get involved.
                        </p>

                        <div className="mt-12">
                            <h4 className="font-semibold text-(--ngo-dark) mb-4">
                                Follow Us on Social Media
                            </h4>
                            <div className="flex gap-4">
                                {[
                                    { icon: Facebook, href: links.facebook },
                                    { icon: Twitter, href: links.x },
                                    { icon: Instagram, href: links.instagram },
                                    { icon: Linkedin, href: links.linkedIn },
                                    { icon: Youtube, href: links.youtube },
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-[var(--ngo-dark)] flex items-center justify-center text-white hover:bg-(--ngo-orange) transition-colors"
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <form className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="grid sm:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-(--ngo-dark) font-medium mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-(--ngo-dark) font-medium mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                                    placeholder="example@example.com"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Subject
                                </label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all bg-white">
                                    <option value="">Select a topic</option>
                                    <option value="volunteer">Volunteering</option>
                                    <option value="donate">Donation</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Send Message <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function MapSection() {
    return (
        <section id="location" className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
                        Find Us
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Our Location
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        Visit us at IIIT Allahabad campus. We&apos;d love to show you around and
                        introduce you to our students.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="rounded-2xl overflow-hidden shadow-xl"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d389.81430389944416!2d81.77236884511889!3d25.427364116755268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3985332156509e25%3A0x3f396199707a3d7f!2sPrayaas%20IIITA!5e0!3m2!1sen!2sin!4v1765682684054!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Prayaas IIITA Location"
                    />
                </motion.div>
            </div>
        </section>
    );
}

export default function ContactPageClient({ images }: { images: PageImagesMap }) {
    return (
        <>
            <PageHero images={images} />
            <ContactInfoSection />
            <ContactFormSection />
            <MapSection />
        </>
    );
}
