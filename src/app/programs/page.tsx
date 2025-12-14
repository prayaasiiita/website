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
  ArrowRight,
  Users,
  Heart,
  Clock,
  Calendar,
} from "lucide-react";

function PageHero() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80"
          alt="Classroom"
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
  icon: Icon,
  title,
  description,
  features,
  schedule,
  image,
  color,
  reverse = false,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  schedule: string;
  image: string;
  color: string;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="py-24 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-16 items-center ${
            reverse ? "lg:flex-row-reverse" : ""
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
            <div className="flex items-center gap-3 p-4 bg-(--ngo-cream) rounded-xl">
              <Clock className="w-5 h-5 text-(--ngo-orange)" />
              <span className="text-(--ngo-dark) font-medium">
                Schedule: {schedule}
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`relative ${reverse ? "lg:order-1" : ""}`}
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt={title}
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div
              className="absolute -bottom-6 -left-6 w-48 h-48 rounded-2xl -z-10"
              style={{ backgroundColor: `${color}15` }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WeeklySchedule() {
  const schedule = [
    {
      day: "Saturday",
      activities: [
        { time: "10:00 AM - 11:00 AM", activity: "Mathematics & Science" },
        { time: "11:15 AM - 12:15 PM", activity: "English Language" },
        { time: "12:30 PM - 1:00 PM", activity: "Arts & Crafts" },
      ],
    },
    {
      day: "Sunday",
      activities: [
        { time: "10:00 AM - 11:00 AM", activity: "Computer Basics" },
        { time: "11:15 AM - 12:15 PM", activity: "Life Skills Session" },
        { time: "12:30 PM - 1:00 PM", activity: "Games & Sports" },
      ],
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
            Weekly Schedule
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Class Timings
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            Join us every weekend for engaging learning sessions
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {schedule.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-(--ngo-orange)" />
                <h3
                  className="text-2xl font-bold text-(--ngo-dark)"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {day.day}
                </h3>
              </div>
              <div className="space-y-4">
                {day.activities.map((item) => (
                  <div
                    key={item.time}
                    className="flex justify-between items-center p-3 bg-(--ngo-cream) rounded-xl"
                  >
                    <span className="text-(--ngo-gray) text-sm">
                      {item.time}
                    </span>
                    <span className="text-(--ngo-dark) font-medium">
                      {item.activity}
                    </span>
                  </div>
                ))}
              </div>
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
            Help Us Expand Our Programs
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Your support enables us to reach more children and create more
            impactful programs. Join us in making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved#donate"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Support Our Programs
            </Link>
            <Link
              href="/get-involved#volunteer"
              className="btn-outline flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Volunteer With Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ProgramsPage() {
  const programs = [
    {
      id: "education-&-tutoring",
      icon: BookOpen,
      title: "Education & Tutoring",
      description:
        "Our core educational program provides academic support to children in subjects like Mathematics, Science, English, and Hindi. We use innovative teaching methods to make learning engaging and effective.",
      features: [
        "Regular classes in core subjects",
        "Computer literacy and digital skills",
        "Exam preparation and study support",
        "Personalized attention for struggling students",
        "Educational materials and resources provided",
      ],
      schedule: "Saturday & Sunday, 10 AM - 12 PM",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      color: "var(--ngo-orange)",
    },
    {
      id: "recreational-activities",
      icon: Palette,
      title: "Recreational Activities",
      description:
        "We believe in holistic development, which is why our recreational programs focus on arts, music, sports, and cultural activities that nurture creativity and teamwork.",
      features: [
        "Art and craft workshops",
        "Music and dance sessions",
        "Indoor and outdoor sports",
        "Cultural celebrations and events",
        "Team-building activities",
      ],
      schedule: "Sunday, 12:30 PM - 1:30 PM",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
      color: "var(--ngo-green)",
    },
    {
      id: "life-skills-development",
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
      schedule: "Alternate Sundays, 11 AM - 12 PM",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      color: "var(--ngo-yellow)",
    },
    {
      id: "community-outreach",
      icon: HandHeart,
      title: "Community Outreach",
      description:
        "We extend our impact beyond the classroom through health camps, awareness drives, and community events that benefit the entire village.",
      features: [
        "Health and hygiene camps",
        "Awareness programs on education importance",
        "Distribution of educational materials",
        "Festival celebrations with families",
        "Parent engagement sessions",
      ],
      schedule: "Monthly events",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
      color: "#8b5cf6",
    },
  ];

  return (
    <>
      <PageHero />
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
      <WeeklySchedule />
      <CTASection />
    </>
  );
}
