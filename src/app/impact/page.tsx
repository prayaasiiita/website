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
  ArrowRight,
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

function PageHero() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1529390079861-591f72bea6c0?w=1920&q=80"
          alt="Children celebrating"
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
    { value: 500, suffix: "+", label: "Children Educated", icon: BookOpen, color: "var(--ngo-orange)" },
    { value: 150, suffix: "+", label: "Active Volunteers", icon: Users, color: "var(--ngo-green)" },
    { value: 50, suffix: "+", label: "Events Conducted", icon: Calendar, color: "var(--ngo-yellow)" },
    { value: 10, suffix: "+", label: "Years of Service", icon: Heart, color: "#8b5cf6" },
    { value: 85, suffix: "%", label: "School Enrollment Rate", icon: GraduationCap, color: "#ec4899" },
    { value: 30, suffix: "+", label: "Success Stories", icon: Award, color: "#14b8a6" },
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
            By The Numbers
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Achievements
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
              className="bg-(--ngo-cream) rounded-2xl p-8 text-center card-hover"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
              </div>
              <div
                className="text-5xl font-bold text-(--ngo-dark) mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-(--ngo-gray) font-medium">{stat.label}</p>
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
    },
    {
      title: "School Enrollment",
      description:
        "We have successfully enrolled and retained children in formal schooling who would otherwise have dropped out due to economic challenges.",
      stats: "85% enrollment rate",
      icon: GraduationCap,
    },
    {
      title: "Skill Development",
      description:
        "Beyond academics, children develop essential life skills, computer literacy, and communication abilities that prepare them for the future.",
      stats: "100+ skills taught",
      icon: Target,
    },
    {
      title: "Community Engagement",
      description:
        "Our outreach programs have raised awareness about the importance of education among families in surrounding villages.",
      stats: "500+ families reached",
      icon: Users,
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
            Impact Areas
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Where We Make a Difference
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {areas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-(--ngo-orange)/20 flex items-center justify-center shrink-0">
                  <area.icon className="w-7 h-7 text-(--ngo-orange)" />
                </div>
                <div>
                  <h3
                    className="text-2xl font-bold text-(--ngo-dark) mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {area.title}
                  </h3>
                  <p className="text-(--ngo-gray) leading-relaxed mb-4">
                    {area.description}
                  </p>
                  <span className="inline-block px-4 py-2 bg-(--ngo-green)/10 text-(--ngo-green) rounded-full font-semibold text-sm">
                    {area.stats}
                  </span>
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
    },
    {
      name: "Meera Singh",
      story:
        "Meera joined Prayaas unable to read. Today, she reads fluently, helps teach younger students, and dreams of becoming a teacher herself.",
      achievement: "From non-reader to student teacher",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    },
    {
      name: "Raj Patel",
      story:
        "Computer literacy classes at Prayaas opened new doors for Raj. He now helps his father with digital payments and dreams of working in technology.",
      achievement: "Digital literacy champion",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
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
            Success Stories
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lives Transformed
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            Real stories of children who have blossomed through our programs
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-(--ngo-cream) rounded-2xl p-8 card-hover"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6">
                <Image
                  src={story.image}
                  alt={story.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3
                className="text-xl font-bold text-(--ngo-dark) text-center mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {story.name}
              </h3>
              <p className="text-(--ngo-orange) text-sm text-center mb-4 font-medium">
                {story.achievement}
              </p>
              <p className="text-(--ngo-gray) text-center leading-relaxed">
                {story.story}
              </p>
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
    <section className="py-24 bg-(--ngo-dark)">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
            Our Journey
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            A Decade of Impact
          </h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-(--ngo-orange)/30" />
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center mb-8 ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                }`}
              >
                <span className="text-(--ngo-orange) font-bold text-2xl">
                  {milestone.year}
                </span>
                <p className="text-gray-400 mt-1">{milestone.event}</p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-(--ngo-orange) rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 section-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

export default function ImpactPage() {
  return (
    <>
      <PageHero />
      <StatsSection />
      <ImpactAreasSection />
      <SuccessStoriesSection />
      <TimelineSection />
      <CTASection />
    </>
  );
}
