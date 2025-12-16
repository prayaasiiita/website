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
  Rainbow,
  Sun,
  Music4,
  Clock5,
  Handshake,
  Mail,
  Linkedin,
} from "lucide-react";
import SpotlightCard from "@/src/components/SpotlightCard";
import { useEffect, useState } from "react";

function PageHero() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/a5.jpg"
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

  const images = [
    { src: "/a1.jpeg", alt: "Children learning" },
    { src: "/a2.jpg", alt: "Students studying" },
    { src: "/a3.jpeg", alt: "Students studying" },
    { src: "/a4.jpg", alt: "Students studying" },
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
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105">
              <motion.div
                className="flex"
                animate={{ x: `-${activeIndex * 100}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {images.map((image, index) => (
                  <div key={image.src} className="relative min-w-full aspect-6/5">
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
                {images.map((image, index) => (
                  <button
                    key={image.src}
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
  size = "small",
}: {
  member: TeamMember;
  index: number;
  size?: "large" | "medium" | "small";
}) {
  const sizeClasses = {
    large: {
      card: "p-5 max-w-md",
      image: "w-24 h-24 md:w-28 md:h-28",
      name: "text-lg",
      role: "text-sm",
      icons: "w-4 h-4",
    },
    medium: {
      card: "p-5 max-w-sm",
      image: "w-24 h-24 md:w-28 md:h-28",
      name: "text-lg",
      role: "text-sm",
      icons: "w-4 h-4",
    },
    small: {
      card: "p-5",
      image: "w-24 h-24 md:w-28 md:h-28",
      name: "text-lg",
      role: "text-sm",
      icons: "w-4 h-4",
    },
  };

  const classes = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${classes.card}`}
    >
      <div className="flex flex-col items-center text-center">
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
            <div className="w-full h-full bg-gradient-to-br from-(--ngo-orange)/20 to-(--ngo-green)/20 flex items-center justify-center">
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
        {member.rollNo && (
          <p className="text-(--ngo-gray) text-xs mt-1">{member.rollNo}</p>
        )}
        <div className="flex gap-3 mt-4">
          <a
            href={`mailto:${member.email}`}
            aria-label={`Send email to ${member.name}`}
            className="p-2 rounded-full bg-(--ngo-orange)/10 hover:bg-(--ngo-orange)/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-(--ngo-orange)"
          >
            <Mail className={`${classes.icons} text-(--ngo-orange)`} />
          </a>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${member.name}'s LinkedIn profile`}
            className="p-2 rounded-full bg-(--ngo-green)/10 hover:bg-(--ngo-green)/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-(--ngo-green)"
          >
            <Linkedin className={`${classes.icons} text-(--ngo-green)`} />
          </a>
        </div>
      </div>
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
    <div className="mb-12 last:mb-0">
      <motion.h4
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold text-(--ngo-dark) text-center mb-6"
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
            size="small"
          />
        ))}
      </div>
    </div>
  );
}

function TeamSection() {
  // Director
  const director: TeamMember = {
    name: "Prof. Mukesh Kumar",
    role: "Director, IIIT Allahabad",
    image: "",
    email: "director@iiita.ac.in",
    linkedin: "https://www.linkedin.com/",
  };

  // Faculty Coordinator
  const facultyCoordinator: TeamMember = {
    name: "Dr. Prateek Kumar",
    role: "Faculty Coordinator",
    image: "",
    email: "prateek@iiita.ac.in",
    linkedin: "https://www.linkedin.com/",
  };

  // Student Team grouped by roles
  const coordinators: TeamMember[] = [
    {
      name: "Kavya Mitruka",
      role: "Coordinator",
      rollNo: "IIT2023199",
      image: "",
      email: "iit2023199@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Faizan Ali",
      role: "Coordinator",
      rollNo: "IIT2023192",
      image: "",
      email: "iit2023192@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Raman Gautam",
      role: "Coordinator",
      rollNo: "IIT2023252",
      image: "",
      email: "iit2023252@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  const treasurers: TeamMember[] = [
    {
      name: "Isha",
      role: "Treasurer",
      rollNo: "IIT2023202",
      image: "",
      email: "iit2023202@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Shranay Malhotra",
      role: "Treasurer",
      rollNo: "IIT2023093",
      image: "",
      email: "iit2023093@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  const speaker: TeamMember[] = [
    {
      name: "Gaurav Kesherwani",
      role: "Speaker",
      rollNo: "IEC2023011",
      image: "",
      email: "iec2023011@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  const teachingHeads: TeamMember[] = [
    {
      name: "Satyam Naman",
      role: "Teaching Head",
      rollNo: "IIT2023250",
      image: "",
      email: "iit2023250@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Suman Kumari",
      role: "Teaching Head",
      rollNo: "IIT2023187",
      image: "",
      email: "iit2023187@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  const mediaTeam: TeamMember[] = [
    {
      name: "Aashutosh Sahu",
      role: "Media Team",
      rollNo: "IEC2023011",
      image: "",
      email: "iec2023011@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Mohit Rathwa",
      role: "Media Team",
      rollNo: "IEC2023098",
      image: "",
      email: "iec2023098@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
    {
      name: "Sahil Kumar",
      role: "Media Team",
      rollNo: "IEC2023056",
      image: "",
      email: "iec2023056@iiita.ac.in",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  return (
    <section className="py-24 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

        {/* Director - Largest Card, Centered */}
        <div className="flex justify-center mb-16">
          <TeamMemberCard member={director} index={0} size="large" />
        </div>

        {/* Faculty Coordinator - Medium Card, Centered */}
        <div className="flex justify-center mb-20">
          <TeamMemberCard member={facultyCoordinator} index={1} size="medium" />
        </div>

        {/* Student Leadership Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3
            className="text-2xl md:text-3xl font-bold text-(--ngo-dark)"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Student Leadership Team
          </h3>
          <div className="w-24 h-1 bg-(--ngo-orange) mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Student Groups */}
        <div className="space-y-12">
          <StudentTeamGroup
            title="Coordinators"
            members={coordinators}
            startIndex={2}
          />
          <StudentTeamGroup
            title="Treasurers"
            members={treasurers}
            startIndex={5}
          />
          <StudentTeamGroup
            title="Speaker"
            members={speaker}
            startIndex={7}
          />
          <StudentTeamGroup
            title="Teaching Heads"
            members={teachingHeads}
            startIndex={8}
          />
          <StudentTeamGroup
            title="Media Team"
            members={mediaTeam}
            startIndex={10}
          />
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
