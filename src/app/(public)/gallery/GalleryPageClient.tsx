"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Users, ChevronLeft, ChevronRight, Images, Loader2, Camera } from "lucide-react";
import { PageImagesMap, getImageSrc } from "@/src/components/DynamicImage";

// Default fallback images
const FALLBACK_IMAGES = {
    hero: { src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1920&q=80", alt: "Gallery" },
};

interface Album {
    id: string;
    flickrId: string;
    title: string;
    description?: string;
    coverPhotoUrl: string;
    photoCount: number;
    flickrUrl: string;
    year: string;
}

interface YearGroup {
    year: string;
    albums: Album[];
}

interface Photo {
    id: string;
    title: string;
    thumbnail: string;
    medium: string;
    large: string;
    xlarge: string;
}

function PageHero({ images }: { images: PageImagesMap }) {
    const heroSrc = getImageSrc(images, "hero", "main", FALLBACK_IMAGES.hero.src);
    const heroAlt = images["hero:main"]?.alt || FALLBACK_IMAGES.hero.alt;

    return (
        <section className="relative py-32 overflow-hidden">
            <div className="absolute inset-0">
                <Image
                    src={heroSrc}
                    alt={heroAlt}
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

function AlbumsSection() {
    const [albumsByYear, setAlbumsByYear] = useState<YearGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch albums on mount
    useEffect(() => {
        async function fetchAlbums() {
            try {
                const response = await fetch("/api/gallery/albums");
                if (!response.ok) throw new Error("Failed to fetch albums");
                const data = await response.json();
                setAlbumsByYear(data.groupedByYear || []);
            } catch (err) {
                console.error("Error fetching albums:", err);
                setError("Failed to load gallery. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchAlbums();
    }, []);

    // Fetch photos when album is selected
    const fetchPhotos = useCallback(async (album: Album) => {
        setSelectedAlbum(album);
        setLoadingPhotos(true);
        setPhotos([]);
        try {
            const response = await fetch(`/api/gallery/albums/${album.id}/photos`);
            if (!response.ok) throw new Error("Failed to fetch photos");
            const data = await response.json();
            setPhotos(data.photos);
        } catch (err) {
            console.error("Error fetching photos:", err);
        } finally {
            setLoadingPhotos(false);
        }
    }, []);

    const closeAlbum = () => {
        setSelectedAlbum(null);
        setPhotos([]);
        setSelectedPhoto(null);
    };

    const openLightbox = (index: number) => setSelectedPhoto(index);
    const closeLightbox = () => setSelectedPhoto(null);
    const nextPhoto = useCallback(() =>
        setSelectedPhoto((prev) =>
            prev !== null ? (prev + 1) % photos.length : null
        ), [photos.length]);

    const prevPhoto = useCallback(() =>
        setSelectedPhoto((prev) =>
            prev !== null ? (prev - 1 + photos.length) % photos.length : null
        ), [photos.length]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhoto === null) return;
            if (e.key === "ArrowRight") nextPhoto();
            if (e.key === "ArrowLeft") prevPhoto();
            if (e.key === "Escape") closeLightbox();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedPhoto, photos.length, nextPhoto, prevPhoto]);

    // Filter albums by search query
    const filteredAlbumsByYear = useMemo(() => {
        if (!searchQuery.trim()) return albumsByYear;
        const query = searchQuery.toLowerCase();
        return albumsByYear
            .map(yearGroup => ({
                ...yearGroup,
                albums: yearGroup.albums.filter(album =>
                    album.title.toLowerCase().includes(query) ||
                    (album.description && album.description.toLowerCase().includes(query))
                ),
            }))
            .filter(yearGroup => yearGroup.albums.length > 0);
    }, [albumsByYear, searchQuery]);

    if (loading) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 animate-spin text-(--ngo-orange) mb-4" />
                        <p className="text-(--ngo-gray)">Loading albums...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-(--ngo-gray)">{error}</p>
                    </div>
                </div>
            </section>
        );
    }


    if (filteredAlbumsByYear.length === 0 && !searchQuery) {
        return (
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-(--ngo-gray)">No albums available yet. Check back soon!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white">
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
                        Our Albums
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-2 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Photo Collections
                    </h2>
                    <p className="text-(--ngo-gray) text-lg max-w-2xl mx-auto">
                        Browse through our collection of memories from various events and activities
                    </p>
                </motion.div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search albums..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-(--ngo-orange) focus:border-transparent transition-shadow"
                        />
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {filteredAlbumsByYear.length === 0 && searchQuery && (
                    <div className="text-center py-16">
                        <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-(--ngo-gray)">No albums match &quot;{searchQuery}&quot;</p>
                    </div>
                )}

                {/* Albums by Year */}
                {filteredAlbumsByYear.map((yearGroup, yearIndex) => (
                    <div key={yearGroup.year} className="mb-12">
                        {/* Year Header */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: yearIndex * 0.1 }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <h3 className="text-3xl font-bold text-(--ngo-dark)" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {yearGroup.year}
                            </h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-(--ngo-orange)/50 to-transparent" />
                            <span className="text-sm text-(--ngo-gray)">{yearGroup.albums.length} albums</span>
                        </motion.div>

                        {/* Albums Grid for this year */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {yearGroup.albums.map((album, index) => (
                                <motion.div
                                    key={album.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="group cursor-pointer"
                                    onClick={() => fetchPhotos(album)}
                                >
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                                        <Image
                                            src={album.coverPhotoUrl}
                                            alt={album.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h4 className="text-white text-xl font-bold mb-2">
                                                {album.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                                <Images className="w-4 h-4" />
                                                <span>{album.photoCount} photos</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Album Photos Modal */}
                <AnimatePresence>
                    {selectedAlbum && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/90 overflow-y-auto"
                            onClick={closeAlbum}
                        >
                            {/* Header */}
                            <div
                                className="sticky top-0 bg-black/80 backdrop-blur-sm z-10 px-4 py-4 flex items-center justify-between"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={closeAlbum}
                                    className="flex items-center gap-2 text-white hover:text-(--ngo-orange) transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Back to Albums</span>
                                </button>
                                <h2 className="text-white text-xl font-semibold truncate max-w-[50%]">
                                    {selectedAlbum.title}
                                </h2>
                                <button
                                    onClick={closeAlbum}
                                    className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Photos Grid */}
                            <div
                                className="max-w-7xl mx-auto px-4 py-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {loadingPhotos ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <Loader2 className="w-12 h-12 animate-spin text-(--ngo-orange) mb-4" />
                                        <p className="text-white/70">Loading photos...</p>
                                    </div>
                                ) : photos.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Camera className="w-16 h-16 text-white/30 mx-auto mb-4" />
                                        <p className="text-white/70">No photos in this album</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                        {photos.map((photo, index) => (
                                            <motion.div
                                                key={photo.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.02 }}
                                                className="relative aspect-square cursor-pointer group"
                                                onClick={() => openLightbox(index)}
                                            >
                                                <Image
                                                    src={photo.thumbnail}
                                                    alt={photo.title || "Photo"}
                                                    fill
                                                    className="object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Photo Lightbox */}
                <AnimatePresence>
                    {selectedPhoto !== null && photos[selectedPhoto] && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[110] bg-black flex items-center justify-center p-4"
                            onClick={closeLightbox}
                        >
                            <button
                                onClick={closeLightbox}
                                className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevPhoto();
                                }}
                                className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextPhoto();
                                }}
                                className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="relative max-w-5xl max-h-[85vh] w-full h-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={photos[selectedPhoto].large}
                                    alt={photos[selectedPhoto].title || "Photo"}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    priority
                                />
                            </motion.div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                                {selectedPhoto + 1} / {photos.length}
                            </div>
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

function CTASection({ images }: { images: PageImagesMap }) {
    const ctaSrc = getImageSrc(images, "cta", "background", "");

    return (
        <section className="py-24 bg-(--ngo-dark) relative overflow-hidden">
            {ctaSrc && (
                <div className="absolute inset-0">
                    <Image
                        src={ctaSrc}
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                    />
                </div>
            )}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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

export default function GalleryPageClient({ images }: { images: PageImagesMap }) {
    return (
        <>
            <PageHero images={images} />
            <AlbumsSection />
            <VideoSection />
            <CTASection images={images} />
        </>
    );
}
