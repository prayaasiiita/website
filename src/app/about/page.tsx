"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Target,
  Eye,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
} from "lucide-react";

function PageHero() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80"
          alt="Students"
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
            About Us
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Story of Hope
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Learn about our journey, mission, and the passionate team behind
            Prayaas IIIT Allahabad.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function StorySection() {
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
              can transform lives. In 2014, a group of passionate students at
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
              change, with over 150 active volunteers working tirelessly to make
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
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"
                alt="Teaching session"
                width={600}
                height={500}
                className="w-full h-auto"
              />
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
            className="bg-white rounded-3xl p-10 shadow-xl"
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl p-10 shadow-xl"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We approach every child with empathy, understanding their unique challenges and needs.",
      color: "var(--ngo-orange)",
    },
    {
      icon: BookOpen,
      title: "Education First",
      description:
        "We believe education is the most powerful tool for transforming lives and communities.",
      color: "var(--ngo-green)",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We work together as a family, supporting each other in our mission to create change.",
      color: "var(--ngo-yellow)",
    },
    {
      icon: Sparkles,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, setting high standards for ourselves.",
      color: "#8b5cf6",
    },
    {
      icon: Award,
      title: "Integrity",
      description:
        "We operate with transparency and honesty, building trust with all stakeholders.",
      color: "#ec4899",
    },
    {
      icon: Target,
      title: "Impact",
      description:
        "We measure our success by the positive change we create in children's lives.",
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
            Our Core Values
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            These principles guide everything we do at Prayaas
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-(--ngo-cream) rounded-2xl p-8 card-hover"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const team = [
    {
      name: "Dr. Prateek Kumar",
      role: "Faculty Advisor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    },
    {
      name: "Ananya Singh",
      role: "President",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    },
    {
      name: "Rahul Verma",
      role: "Vice President",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    },
    {
      name: "Priya Patel",
      role: "Education Head",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3
                className="text-xl font-bold text-(--ngo-dark)"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {member.name}
              </h3>
              <p className="text-(--ngo-orange) font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-(--ngo-dark)">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            Join Our Mission
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Be a part of our story. Together, we can create lasting change in the
            lives of children who need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved#volunteer"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Become a Volunteer
            </Link>
            <Link
              href="/contact-us"
              className="btn-outline flex items-center justify-center gap-2"
            >
              Get in Touch <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero />
      <StorySection />
      <MissionVisionSection />
      <ValuesSection />
      <TeamSection />
      <CTASection />
    </>
  );
}
