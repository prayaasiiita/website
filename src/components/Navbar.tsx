"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "Events" }, // program to event krna hai 
    { href: "/impact", label: "Impact" },
    { href: "/gallery", label: "Gallery" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact-us", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-transform duration-300 hover:scale-120">
            <Image src="/logo.png" alt="Logo.png" width={100} height={100} />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-xl transition-all duration-200 hover:scale-110 ${scrolled
                  ? "text-(--ngo-dark) hover:text-(--ngo-orange)"
                  : "text-white/80 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* <Link
              href="/get-involved#volunteer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                scrolled
                  ? "border-2 border-(--ngo-green) text-(--ngo-green) hover:bg-(--ngo-green) hover:text-white"
                  : "border-2 border-white text-white hover:bg-white hover:text-(--ngo-dark)"
              }`}
            >
              <Users className="w-4 h-4" />
              Volunteer
            </Link> */}
            <Link
              href="/get-involved#donate"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold bg-(--ngo-orange) text-white hover:bg-(--ngo-orange-dark) transition-all duration-300"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg ${scrolled ? "text-(--ngo-dark)" : "text-white"
              }`}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <Image src="/logo.png" alt="Logo.png" width={100} height={100} className="" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-(--ngo-dark)"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-lg font-semibold text-(--ngo-dark) hover:text-(--ngo-orange)"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="px-4 pb-6 pt-4 border-t">
                <Link
                  href="/get-involved#donate"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full font-semibold bg-(--ngo-orange) text-white shadow-md"
                >
                  <Heart className="w-4 h-4" />
                  Donate
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
