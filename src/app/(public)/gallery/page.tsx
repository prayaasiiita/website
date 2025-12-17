"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Users, ChevronLeft, ChevronRight } from "lucide-react";

function PageHero() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=1920&q=80"
          alt="Gallery"
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
            Gallery
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Moments of Joy
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            A visual journey through our activities, events, and the smiles we
            create every day.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function GallerySection() {
  const categories = ["All", "Classes", "Events", "Activities", "Celebrations"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", alt: "Students in classroom", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1529390079861-591f72bea6c0?w=800&q=80", alt: "Children playing", category: "Activities" },
    { src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80", alt: "Art class", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", alt: "Teaching moment", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80", alt: "Group activity", category: "Activities" },
    { src: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80", alt: "Learning together", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", alt: "Books and learning", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80", alt: "Student celebration", category: "Celebrations" },
    { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80", alt: "Community event", category: "Events" },
    { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80", alt: "Writing practice", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80", alt: "Volunteer teaching", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", alt: "Group discussion", category: "Activities" },
    { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80", alt: "Annual day", category: "Events" },
    { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80", alt: "Graduation ceremony", category: "Celebrations" },
    { src: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80", alt: "Computer class", category: "Classes" },
    { src: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=800&q=80", alt: "Festival celebration", category: "Celebrations" },
  ];

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () =>
    setSelectedImage((prev) =>
      prev !== null ? (prev + 1) % filteredImages.length : null
    );
  const prevImage = () =>
    setSelectedImage((prev) =>
      prev !== null
        ? (prev - 1 + filteredImages.length) % filteredImages.length
        : null
    );

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-(--ngo-orange) text-white"
                  : "bg-(--ngo-cream) text-(--ngo-dark) hover:bg-(--ngo-orange)/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                  index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                onClick={() => openLightbox(index)}
              >
                <div className={`relative ${index % 5 === 0 ? "aspect-square" : "aspect-4/3"}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-white font-medium">{image.alt}</span>
                    <span className="block text-white/70 text-sm">
                      {image.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl max-h-[80vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filteredImages[selectedImage].src}
                  alt={filteredImages[selectedImage].alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
                <div className="text-center mt-4">
                  <p className="text-white text-lg">
                    {filteredImages[selectedImage].alt}
                  </p>
                  <p className="text-white/60 text-sm">
                    {filteredImages[selectedImage].category}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function VideoSection() {
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
            Videos
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Watch Our Story
          </h2>
          <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
            Experience the joy and impact of Prayaas through our videos
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="aspect-video bg-(--ngo-cream) flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-(--ngo-orange) flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-(--ngo-dark)">
                  Our Journey Documentary
                </h3>
                <p className="text-(--ngo-gray) mt-2">
                  A glimpse into 10 years of Prayaas
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="aspect-video bg-(--ngo-cream) flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-(--ngo-green) flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-(--ngo-dark)">
                  Annual Day Highlights
                </h3>
                <p className="text-(--ngo-gray) mt-2">
                  Celebrations and performances by our students
                </p>
              </div>
            </div>
          </motion.div>
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
            Be Part of These Moments
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join us as a volunteer or supporter and help create more beautiful
            memories for our children.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved#volunteer"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Volunteer With Us
            </Link>
            <Link
              href="/get-involved#donate"
              className="btn-outline flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Support Our Work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function GalleryPage() {
  return (
    <>
      <PageHero />
      <GallerySection />
      <VideoSection />
      <CTASection />
    </>
  );
}
