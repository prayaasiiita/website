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
  MapPin,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";

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

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/p2.jpg"
          alt="Children studying"
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
            A Students Initiative at IIIT Allahabad
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Empowering Lives,
          <br />
          <span className="text-(--ngo-yellow)">Education is Opportunity to Succes</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10"
        >
          Prayaas is an earnest attempt to bring sunshine in wearisome lives. It is a volunteer movement initiated by student fraternity of IIIT Allahabad to ameliorate the life of not so privileged kids.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/get-involved#donate" className="btn-primary flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" />
            Donate Now
          </Link>
          <Link href="/contact-us" className="btn-outline flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            Contact Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  const images = [
    { src: "/p1.jpg", alt: "Children learning" },
    { src: "/p2.jpg", alt: "Students studying" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

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
              About Prayaas
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Transforming Communities Through Education
            </h2>
            <p className="text-(--ngo-gray) text-lg leading-relaxed mb-6">
              Prayaas, which means &ldquo;effort&rdquo; in Hindi, is a student-run social
              initiative at IIIT Allahabad. Founded by compassionate students who
              believe in the power of education, we work tirelessly to bridge the
              gap between privilege and potential.
            </p>
            <p className="text-(--ngo-gray) text-lg leading-relaxed mb-8">
              Our volunteers dedicate their time to teaching underprivileged
              children from nearby villages, providing them with academic support,
              life skills training, and recreational activities that nurture their
              overall development.
            </p>
            <div className="grid grid-cols-3 gap-6">
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
                    <item.icon className="w-9 h-9" style={{ color: item.color }} />
                  </div>
                  <span className="font-bold text-(--ngo-dark)">
                    {item.label}
                  </span>
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
                {images.map((image, index) => (
                  <div key={image.src} className="min-w-full">
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
                {images.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={`Show slide ${index + 1}`}
                    onClick={() => handleDotClick(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index
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
    <section className="py-24 section-gradient">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center" style={{ backgroundColor: `${program.color}15` }}>
                  <program.icon className="w-10 h-10" style={{ color: program.color }} />
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
    <section className="py-24 bg-(--ngo-dark) relative overflow-hidden">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      quote:
        "Being a volunteer at Prayaas has been the most fulfilling experience of my college life. Seeing the children grow and learn is incredibly rewarding.",
      name: "Priya Sharma",
      role: "Volunteer, 3rd Year Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      quote:
        "The dedication of Prayaas volunteers is remarkable. My daughter has shown tremendous improvement in her studies and confidence since joining their program.",
      name: "Sunita Devi",
      role: "Parent",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
  ];

  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

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
            Testimonials
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Stories of Hope
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            Hear from the people whose lives have been touched by Prayaas
          </p>
        </motion.div>
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-(--ngo-cream) rounded-3xl p-8 md:p-12"
          >
            <Quote className="w-12 h-12 text-(--ngo-orange) mb-6" />
            <p className="text-xl md:text-2xl text-(--ngo-dark) leading-relaxed mb-8 italic">
              &ldquo;{testimonials[current].quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <Image
                src={testimonials[current].image}
                alt={testimonials[current].name}
                width={60}
                height={60}
                className="w-15 h-15 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-(--ngo-dark)">
                  {testimonials[current].name}
                </h4>
                <p className="text-(--ngo-gray) text-sm">
                  {testimonials[current].role}
                </p>
              </div>
            </div>
          </motion.div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white border-2 border-(--ngo-orange) flex items-center justify-center hover:bg-(--ngo-orange) hover:text-white text-(--ngo-orange) transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-(--ngo-orange) text-white flex items-center justify-center hover:bg-(--ngo-orange-dark) transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const images = [
    { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", alt: "Students in classroom" },
    { src: "https://images.unsplash.com/photo-1529390079861-591f72bea6c0?w=600&q=80", alt: "Children playing" },
    { src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80", alt: "Art class" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", alt: "Teaching moment" },
    { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80", alt: "Group activity" },
    { src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80", alt: "Learning together" },
  ];

  return (
    <section className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl ${index === 0 || index === 5 ? "md:col-span-2 md:row-span-2" : ""
                }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium">{image.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-(--ngo-orange) font-semibold hover:gap-3 transition-all text-lg"
          >
            View Full Gallery <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GetInvolvedSection() {
  const ways = [
    {
      title: "Donate",
      description:
        "Your contribution helps provide educational materials, organize events, and support our initiatives.",
      icon: Heart,
      color: "var(--ngo-orange)",
      link: "/get-involved#donate",
      cta: "Make a Donation",
    },
    {
      title: "Volunteer",
      description:
        "Join our team of passionate volunteers and make a direct impact on children's lives.",
      icon: Users,
      color: "var(--ngo-green)",
      link: "/get-involved#volunteer",
      cta: "Become a Volunteer",
    },
    {
      title: "Participate",
      description:
        "Attend our events, workshops, and drives to show your support for our cause.",
      icon: Calendar,
      color: "var(--ngo-yellow)",
      link: "/get-involved#events",
      cta: "View Upcoming Events",
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
            Join Us
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Get Involved
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            There are many ways you can contribute to our mission and help us
            create a brighter future
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {ways.map((way, index) => (
            <motion.div
              key={way.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: `${way.color}10` }}
              />
              <div className="relative p-8 text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${way.color}20` }}
                >
                  <way.icon className="w-10 h-10" style={{ color: way.color }} />
                </div>
                <h3
                  className="text-2xl font-bold text-(--ngo-dark) mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {way.title}
                </h3>
                <p className="text-(--ngo-gray) mb-6 leading-relaxed">
                  {way.description}
                </p>
                <Link
                  href={way.link}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: way.color }}
                >
                  {way.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-24 bg-(--ngo-cream)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
              Contact Us
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let&apos;s Connect
            </h2>
            <p className="text-(--ngo-gray) text-lg mb-8">
              Have questions or want to learn more about how you can help? We&apos;d
              love to hear from you.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-(--ngo-orange)/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-(--ngo-orange)" />
                </div>
                <div>
                  <h4 className="font-semibold text-(--ngo-dark)">
                    Our Location
                  </h4>
                  <p className="text-(--ngo-gray)">
                    IIIT Allahabad, Jhalwa, Prayagraj, UP 211015
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-(--ngo-green)/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-(--ngo-green)" />
                </div>
                <div>
                  <h4 className="font-semibold text-(--ngo-dark)">
                    Working Hours
                  </h4>
                  <p className="text-(--ngo-gray)">
                    Classes: Weekends 10 AM - 1 PM
                  </p>
                </div>
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-(--ngo-dark) font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-(--ngo-dark) font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>
              <div className="mb-6">
                <label className="block text-(--ngo-dark) font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2"
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

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529390079861-591f72bea6c0?w=1920&q=80"
          alt="Children"
          fill
          className="object-cover"
        />
        <div className="hero-gradient absolute inset-0" />
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
            <Link href="/get-involved#donate" className="btn-primary flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              Donate Now
            </Link>
            <Link href="/get-involved#volunteer" className="btn-outline flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Join as Volunteer
            </Link>
            <Link href="/get-involved#volunteer" className="btn-outline flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <ImpactSection />
      <TestimonialsSection />
      <GallerySection />
      <GetInvolvedSection />
      {/* <ContactSection /> */}
      <CTASection />
    </>
  );
}
