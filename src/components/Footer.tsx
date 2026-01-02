"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  ArrowRight,
} from "lucide-react";
import { links } from "@/details";
import Image from "next/image";

export function Footer() {
  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "Our Programs" },
    { href: "/impact", label: "Our Impact" },
    { href: "/gallery", label: "Gallery" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact-us", label: "Contact" },
  ];

  const programs = [
    { href: "/programs#education", label: "Education & Tutoring" },
    { href: "/programs#recreation", label: "Recreational Activities" },
    { href: "/programs#life-skills", label: "Life Skills Development" },
    { href: "/programs#outreach", label: "Community Outreach" },
  ];

  const socialLinks = [
    { href: links.facebook, icon: Facebook, label: "Facebook", color: "hover:bg-[#1877F2]" },
    { href: links.x, icon: Twitter, label: "Twitter", color: "hover:bg-[#1DA1F2]" },
    { href: links.instagram, icon: Instagram, label: "Instagram", color: "hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]" },
    { href: links.linkedIn, icon: Linkedin, label: "LinkedIn", color: "hover:bg-[#0077B5]" },
    { href: links.youtube, icon: Youtube, label: "YouTube", color: "hover:bg-[#FF0000]" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419] text-white rounded-t-4xl mt-16">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 rounded-t-4xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-(--ngo-orange) rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-(--ngo-green) rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 pb-3">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 mb-5">
          {/* Brand Section */}
          <div className="space-y-2.5 lg:col-span-1 col-span-1">
            <Link href="/" className="inline-block group">
              <Image 
                src="/logo.png" 
                alt="Prayaas Logo" 
                width={140} 
                height={93} 
                className="h-12 w-auto sm:h-14 transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
            <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
              A student-run initiative at IIIT Allahabad dedicated to making
              quality education accessible to underprivileged children and
              creating lasting positive change in our community.
            </p>
            
            {/* Social Media Icons */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Connect With Us
              </p>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all duration-300 ${social.color} group`}
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links & Programs - Side by side on mobile */}
          <div className="col-span-1 grid grid-cols-2 gap-5 sm:gap-6 lg:contents">
          {/* Quick Links */}
          <div>
            <h3
              className="text-base sm:text-lg font-bold mb-3.5 text-white relative inline-block"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-(--ngo-orange) rounded-full" />
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-(--ngo-orange) transition-all duration-200 text-xs sm:text-sm py-0.5 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3
              className="text-base sm:text-lg font-bold mb-3.5 text-white relative inline-block"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Programs
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-(--ngo-green) rounded-full" />
            </h3>
            <ul className="space-y-2.5">
              {programs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-(--ngo-green) transition-all duration-200 text-xs sm:text-sm py-0.5 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3
              className="text-base sm:text-lg font-bold mb-3.5 text-white relative inline-block"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-(--ngo-orange) rounded-full" />
            </h3>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-(--ngo-orange)/10 flex items-center justify-center shrink-0 group-hover:bg-(--ngo-orange)/20 transition-colors">
                  <MapPin className="w-4 h-4 text-(--ngo-orange)" />
                </div>
                <span className="text-gray-300 text-xs sm:text-sm leading-relaxed pt-0.5">
                  IIIT Allahabad, Jhalwa, Prayagraj, Uttar Pradesh 211015, India
                </span>
              </li>
              <li className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-(--ngo-orange)/10 flex items-center justify-center shrink-0 group-hover:bg-(--ngo-orange)/20 transition-colors">
                  <Mail className="w-4 h-4 text-(--ngo-orange)" />
                </div>
                <a
                  href="mailto:prayaas@iiita.ac.in"
                  className="text-gray-300 hover:text-(--ngo-orange) transition-colors text-xs sm:text-sm"
                >
                  prayaas@iiita.ac.in
                </a>
              </li>
              <li className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-(--ngo-orange)/10 flex items-center justify-center shrink-0 group-hover:bg-(--ngo-orange)/20 transition-colors">
                  <Phone className="w-4 h-4 text-(--ngo-orange)" />
                </div>
                <a
                  href="tel:+919876543210"
                  className="text-gray-300 hover:text-(--ngo-orange) transition-colors text-xs sm:text-sm"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-(--ngo-orange)/10 to-(--ngo-green)/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-5 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <Heart className="w-4 h-4 text-(--ngo-orange)" />
                Make a Difference Today
              </h4>
              <p className="text-gray-300 text-xs sm:text-sm">
                Your support helps us provide quality education to children in need
              </p>
            </div>
            <Link
              href="/get-involved#donate"
              className="btn-primary text-xs sm:text-sm px-4 py-2 flex items-center gap-2 whitespace-nowrap group hover:scale-105 transition-transform"
            >
              Donate Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Prayaas IIIT Allahabad. All rights reserved. Made with{" "}
              <Heart className="w-4 h-4 inline text-(--ngo-orange) fill-current" /> by students, for the community.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap justify-center">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-(--ngo-orange) transition-colors py-1"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-(--ngo-orange) transition-colors py-1"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
