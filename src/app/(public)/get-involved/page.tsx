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

function PageHero() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80"
          alt="Volunteers"
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
            Get Involved
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Our Cause
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            There are many ways you can contribute to making a difference in the
            lives of underprivileged children.
          </p>
        </motion.div>
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
    },
    {
      amount: "₹2,000",
      title: "Champion",
      description: "Sponsors a child's complete education for a month",
      features: ["All educational materials", "Uniform support", "Health checkup", "Monthly progress report"],
      popular: true,
    },
    {
      amount: "₹5,000",
      title: "Patron",
      description: "Supports a special event or workshop",
      features: ["Sponsor an event", "Recognition at event", "Impact report", "Personal thank you note"],
    },
  ];

  return (
    <section id="donate" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-(--ngo-orange)/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-(--ngo-orange)" />
          </div>
          <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
            Donate
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Support Our Mission
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            Your generous contribution helps us provide quality education and
            opportunities to children who need it most.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {donationTiers.map((tier, index) => (
            <motion.div
              key={tier.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? "bg-(--ngo-orange) text-white"
                  : "bg-(--ngo-cream)"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-(--ngo-yellow) text-(--ngo-dark) text-sm font-bold rounded-full">
                  Most Popular
                </span>
              )}
              <div className="text-center mb-6">
                <span
                  className={`text-4xl font-bold ${
                    tier.popular ? "text-white" : "text-(--ngo-orange)"
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {tier.amount}
                </span>
                <h3
                  className={`text-xl font-bold mt-2 ${
                    tier.popular ? "text-white" : "text-(--ngo-dark)"
                  }`}
                >
                  {tier.title}
                </h3>
                <p
                  className={`mt-2 ${
                    tier.popular ? "text-white/80" : "text-(--ngo-gray)"
                  }`}
                >
                  {tier.description}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-5 h-5 shrink-0 ${
                        tier.popular ? "text-white" : "text-(--ngo-green)"
                      }`}
                    />
                    <span
                      className={
                        tier.popular ? "text-white/90" : "text-(--ngo-dark)"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                  tier.popular
                    ? "bg-white text-(--ngo-orange) hover:bg-white/90"
                    : "bg-(--ngo-orange) text-white hover:bg-(--ngo-orange-dark)"
                }`}
              >
                Donate {tier.amount}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-(--ngo-cream) rounded-2xl p-8 text-center"
        >
          <Gift className="w-12 h-12 text-(--ngo-green) mx-auto mb-4" />
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
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 px-6 py-3 bg-(--ngo-green) text-white rounded-full font-semibold hover:bg-[var(--ngo-green-light)] transition-colors"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
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
    },
    {
      title: "Activity Coordinator",
      description:
        "Organize and lead recreational activities, sports, arts, and cultural events.",
      commitment: "2-4 hours/week",
      skills: ["Creativity", "Leadership", "Event management"],
    },
    {
      title: "Content Creator",
      description:
        "Help with social media, photography, videography, and documentation.",
      commitment: "Flexible",
      skills: ["Photography/Video", "Social media", "Writing"],
    },
    {
      title: "Event Volunteer",
      description:
        "Assist in organizing special events, health camps, and community outreach programs.",
      commitment: "Event-based",
      skills: ["Organization", "Teamwork", "Communication"],
    },
  ];

  return (
    <section id="volunteer" className="py-24 section-gradient scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-(--ngo-green)/20 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-(--ngo-green)" />
          </div>
          <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
            Volunteer
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Our Team
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            Become a part of our volunteer family and make a direct impact on
            children&apos;s lives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3
                className="text-2xl font-bold text-(--ngo-dark) mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {role.title}
              </h3>
              <p className="text-(--ngo-gray) mb-4">{role.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-(--ngo-orange)" />
                <span className="text-(--ngo-dark) font-medium">
                  {role.commitment}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-(--ngo-cream) text-(--ngo-dark) text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <h3
            className="text-2xl font-bold text-(--ngo-dark) mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Apply to Volunteer
          </h3>
          <form className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-(--ngo-dark) font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-(--ngo-dark) font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-(--ngo-dark) font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="block text-(--ngo-dark) font-medium mb-2">
                Interested Role
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all bg-white">
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.title} value={role.title}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-(--ngo-dark) font-medium mb-2">
                Why do you want to volunteer with us?
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all resize-none"
                placeholder="Tell us about yourself and your motivation..."
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                Submit Application <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
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
    },
    {
      title: "Health Camp",
      date: "February 20, 2025",
      time: "9:00 AM - 2:00 PM",
      location: "Jhalwa Village",
      description:
        "Free health checkup camp for children and families in the community.",
    },
    {
      title: "Career Awareness Workshop",
      date: "April 5, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Prayaas Learning Center",
      description:
        "Interactive session on career options and goal setting for older students.",
    },
  ];

  return (
    <section id="events" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-(--ngo-yellow)/20 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-(--ngo-yellow)" />
          </div>
          <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-sm">
            Events
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Upcoming Events
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            Participate in our events and be part of the positive change we&apos;re
            creating.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-(--ngo-cream) rounded-2xl p-8 card-hover"
            >
              <div className="flex items-center gap-2 text-(--ngo-orange) mb-4">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">{event.date}</span>
              </div>
              <h3
                className="text-xl font-bold text-(--ngo-dark) mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {event.title}
              </h3>
              <p className="text-(--ngo-gray) mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-(--ngo-gray)">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              <button className="mt-6 w-full py-2 border-2 border-(--ngo-orange) text-(--ngo-orange) rounded-full font-semibold hover:bg-(--ngo-orange) hover:text-white transition-colors">
                Register
              </button>
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
            Have Questions?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Reach out to us for any queries about
            volunteering, donations, or partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="mailto:prayaas@iiita.ac.in"
              className="flex items-center gap-2 text-white hover:text-(--ngo-orange) transition-colors"
            >
              <Mail className="w-5 h-5" />
              prayaas@iiita.ac.in
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-white hover:text-(--ngo-orange) transition-colors"
            >
              <Phone className="w-5 h-5" />
              +91 98765 43210
            </a>
          </div>
          <div className="mt-10">
            <Link
              href="/contact-us"
              className="btn-primary inline-flex items-center gap-2"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero />
      <DonateSection />
      <VolunteerSection />
      <EventsSection />
      <CTASection />
    </>
  );
}
