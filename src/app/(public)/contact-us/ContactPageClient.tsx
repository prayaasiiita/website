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
    Loader2,
    CheckCircle2,
    X,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import SpotlightCard from "@/src/components/ui/spotlightCard";
import { PageImagesMap, getImageSrc } from "@/src/components/DynamicImage";
import { contactFormSchema, type ContactFormData } from "@/src/lib/validations/contact-form";
import { submitContactForm } from "./actions";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: "onBlur", // Validate on blur for better UX
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: undefined,
            message: '',
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        // Prevent duplicate submissions
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const result = await submitContactForm(data);

            if (result.success) {
                // Show success message
                toast.success('Message sent successfully!', {
                    duration: 3000,
                });

                // Store email and show success modal
                setSubmittedEmail(data.email);
                setShowSuccess(true);

                // Reset form on success
                reset();
            } else {
                // Handle validation errors from server
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, messages]) => {
                        setError(field as keyof ContactFormData, {
                            type: "server",
                            message: messages[0],
                        });
                    });
                }

                // Show error message
                toast.error(result.message, {
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error("Form submission error:", error);
            toast.error("An unexpected error occurred. Please try again later.", {
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                        className="w-10 h-10 rounded-full bg-(--ngo-dark) flex items-center justify-center text-white hover:bg-(--ngo-orange) transition-colors"
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
                        <form 
                            onSubmit={handleSubmit(onSubmit)}
                            className="bg-white rounded-3xl p-8 shadow-xl"
                            noValidate
                        >
                            <div className="grid sm:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-(--ngo-dark) font-medium mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("firstName")}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            errors.firstName ? "border-red-500" : "border-gray-200"
                                        } focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all`}
                                        placeholder="First Name"
                                        disabled={isSubmitting}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-(--ngo-dark) font-medium mb-2">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register("lastName")}
                                        className={`w-full px-4 py-3 rounded-xl border ${
                                            errors.lastName ? "border-red-500" : "border-gray-200"
                                        } focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all`}
                                        placeholder="Last Name"
                                        disabled={isSubmitting}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.email ? "border-red-500" : "border-gray-200"
                                    } focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all`}
                                    placeholder="example@example.com"
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    {...register("phone")}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.phone ? "border-red-500" : "border-gray-200"
                                    } focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all`}
                                    placeholder="+91 XXXXX XXXXX"
                                    disabled={isSubmitting}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    {...register("subject")}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.subject ? "border-red-500" : "border-gray-200"
                                    } focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all bg-white`}
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select a topic</option>
                                    <option value="volunteer">Volunteering</option>
                                    <option value="donate">Donation</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.subject && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.subject.message}
                                    </p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-(--ngo-dark) font-medium mb-2">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    {...register("message")}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        errors.message ? "border-red-500" : "border-gray-200"
                                    } focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all resize-none`}
                                    placeholder="How can we help you?"
                                    disabled={isSubmitting}
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-110 p-4"
                    onClick={() => setShowSuccess(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Success Icon with Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </motion.div>

                        {/* Success Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <h3 className="text-2xl font-bold text-(--ngo-dark) mb-3">
                                Message Sent Successfully! 🎉
                            </h3>
                            <p className="text-(--ngo-gray) text-base mb-6 leading-relaxed">
                                Thank you for reaching out to us! We&apos;ve received your message and
                                sent a confirmation to <span className="font-semibold text-(--ngo-orange)">{submittedEmail}</span>.
                            </p>
                        </motion.div>

                        {/* Info Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6"
                        >
                            <div className="flex gap-3">
                                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-blue-900 mb-1">
                                        Check Your Email
                                    </p>
                                    <p className="text-blue-700">
                                        We&apos;ve sent a confirmation receipt to your email. Our team
                                        will respond within 24 hours.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-3"
                        >
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="w-full px-6 py-3 bg-(--ngo-orange) text-white rounded-xl font-semibold hover:bg-(--ngo-orange-dark) transition-all transform hover:scale-105"
                            >
                                Got It!
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    window.location.href = '/';
                                }}
                                className="w-full px-6 py-3 bg-gray-100 text-(--ngo-dark) rounded-xl font-semibold hover:bg-gray-200 transition-all"
                            >
                                Back to Home
                            </button>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center text-xs text-(--ngo-gray) mt-4"
                        >
                            Need urgent assistance? Email us at{' '}
                            <a
                                href="mailto:prayaas@iiita.ac.in"
                                className="text-(--ngo-orange) hover:underline"
                            >
                                prayaas@iiita.ac.in
                            </a>
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
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
