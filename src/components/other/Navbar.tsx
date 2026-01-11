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
    { href: "/our-work", label: "Our Work" },
    { href: "/events", label: "Events" },
    { href: "/impact", label: "Impact" },
    { href: "/gallery", label: "Gallery" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact-us", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-80 w-full transition-all duration-300 ${isOpen
        ? "bg-white shadow-lg py-3"
        : scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-3"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 transition-transform duration-300 hover:scale-105 z-50">
            <Image src="/logo.png" alt="Logo.png" width={120} height={80} className="h-14 w-auto sm:h-18" />
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-base xl:text-lg transition-all duration-200 hover:scale-105 ${scrolled || isOpen
                  ? "text-(--ngo-dark) hover:text-(--ngo-orange)"
                  : "text-(--ngo-dark) hover:text-(--ngo-orange)"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/get-involved#donate"
              className="flex items-center gap-2 px-4 xl:px-5 py-2 xl:py-2.5 rounded-full font-semibold bg-(--ngo-orange) text-white hover:bg-(--ngo-orange-dark) transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2.5 rounded-lg z-50 min-w-11 min-h-11 flex items-center justify-center ${scrolled || isOpen ? "text-(--ngo-dark)" : "text-(--ngo-dark)"
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
              className="fixed top-20 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm lg:hidden z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-20 left-0 right-0 w-full bg-white shadow-2xl lg:hidden flex flex-col z-70 max-h-[calc(100vh-80px)] overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="py-4 px-4 text-lg font-semibold text-(--ngo-dark) hover:text-(--ngo-orange) hover:bg-gray-50 rounded-lg transition-all min-h-13 flex items-center active:scale-[0.98]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="px-4 sm:px-6 pb-safe pb-6 pt-4 border-t border-gray-200 bg-white">
                <Link
                  href="/get-involved#donate"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full font-bold text-lg bg-(--ngo-orange) text-white shadow-lg hover:bg-(--ngo-orange-dark) transition-all min-h-13 active:scale-[0.98]"
                >
                  <Heart className="w-5 h-5" />
                  Donate Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
