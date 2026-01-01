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
    { href: links.facebook, icon: Facebook, label: "Facebook" },
    { href: links.x, icon: Twitter, label: "Twitter" },
    { href: links.instagram, icon: Instagram, label: "Instagram" },
    { href: links.linkedIn, icon: Linkedin, label: "LinkedIn" },
    { href: links.youtube, icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-(--ngo-dark) text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 md:pt-16 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image src="/logo.png" alt="Logo.png" width={120} height={80} className="h-16 w-auto sm:h-20" />
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              A student-run initiative at IIIT Allahabad dedicated to making
              quality education accessible to underprivileged children and
              creating lasting positive change in our community.
            </p>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-(--ngo-orange) transition-colors duration-300 min-w-11 min-h-11"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="text-lg sm:text-xl font-bold mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-(--ngo-orange) transition-colors duration-200 text-sm sm:text-base py-1 min-h-11 flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-lg sm:text-xl font-bold mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Programs
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {programs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-(--ngo-orange) transition-colors duration-200 text-sm sm:text-base py-1 min-h-11 flex items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-lg sm:text-xl font-bold mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Us
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-(--ngo-orange) mt-1 shrink-0" />
                <span className="text-gray-400 text-sm sm:text-base">
                  IIIT Allahabad, Jhalwa, Prayagraj, Uttar Pradesh 211015, India
                </span>
              </li>
              <li className="flex items-center gap-3 min-h-11">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-(--ngo-orange) shrink-0" />
                <a
                  href="mailto:prayaas@iiita.ac.in"
                  className="text-gray-400 hover:text-(--ngo-orange) transition-colors text-sm sm:text-base"
                >
                  prayaas@iiita.ac.in
                </a>
              </li>
              <li className="flex items-center gap-3 min-h-11">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-(--ngo-orange) shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-gray-400 hover:text-(--ngo-orange) transition-colors text-sm sm:text-base"
                >
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 sm:mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Prayaas IIIT Allahabad. All rights
              reserved.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap justify-center">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-(--ngo-orange) transition-colors py-2 min-h-11 flex items-center"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-(--ngo-orange) transition-colors py-2 min-h-11 flex items-center"
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
