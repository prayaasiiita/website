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
        <section className="relative py-32 sm:py-40 overflow-hidden">
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
            
            {/* Floating polaroid frames decoration */}
            <motion.div 
                className="absolute top-20 left-10 w-24 h-28 bg-white rounded-sm shadow-2xl rotate-[-12deg] opacity-20 hidden lg:block"
                animate={{ y: [0, -10, 0], rotate: [-12, -8, -12] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="m-1.5 h-[70%] bg-gray-300 rounded-sm" />
            </motion.div>
            <motion.div 
                className="absolute top-32 right-16 w-20 h-24 bg-white rounded-sm shadow-2xl rotate-[8deg] opacity-20 hidden lg:block"
                animate={{ y: [0, 8, 0], rotate: [8, 12, 8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <div className="m-1.5 h-[70%] bg-gray-300 rounded-sm" />
            </motion.div>
            <motion.div 
                className="absolute bottom-24 left-20 w-16 h-20 bg-white rounded-sm shadow-2xl rotate-[15deg] opacity-15 hidden lg:block"
                animate={{ y: [0, -8, 0], rotate: [15, 18, 15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <div className="m-1 h-[70%] bg-gray-300 rounded-sm" />
            </motion.div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.span 
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Camera className="w-4 h-4" />
                        Gallery
                    </motion.span>
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Moments of{" "}
                        <span className="relative inline-block">
                            Joy
                            <motion.div 
                                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-linear-to-r from-(--ngo-orange) to-(--ngo-yellow) rounded-full"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                            />
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
                        A visual journey through our activities, events, and the smiles we
                        create every day.
                    </p>
                    
                    {/* Stats row */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-6 sm:gap-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white">500+</div>
                            <div className="text-white/70 text-sm">Photos</div>
                        </div>
                        <div className="w-px h-12 bg-white/20 hidden sm:block" />
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white">20+</div>
                            <div className="text-white/70 text-sm">Albums</div>
                        </div>
                        <div className="w-px h-12 bg-white/20 hidden sm:block" />
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white">10+</div>
                            <div className="text-white/70 text-sm">Years</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 50L48 45.8C96 41.7 192 33.3 288 35.2C384 37 480 49 576 54.2C672 59.3 768 57.7 864 50C960 42.3 1056 28.7 1152 26.8C1248 25 1344 35 1392 40L1440 45V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white"/>
                </svg>
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
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-(--ngo-orange)/5 blur-3xl" />
            <div className="absolute bottom-40 left-0 w-80 h-80 rounded-full bg-(--ngo-green)/5 blur-3xl" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2 justify-center">
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                        Our Albums
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Photo{" "}
                        <span className="relative inline-block">
                            Collections
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-orange)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto">
                        Browse through our collection of memories from various events and activities
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    className="max-w-md mx-auto mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search albums..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-5 py-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-(--ngo-orange)/20 focus:border-(--ngo-orange) transition-all duration-300"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-(--ngo-orange)/10 flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-(--ngo-orange)"
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
                </motion.div>

                {filteredAlbumsByYear.length === 0 && searchQuery && (
                    <div className="text-center py-16">
                        <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-(--ngo-gray)">No albums match &quot;{searchQuery}&quot;</p>
                    </div>
                )}

                {/* Albums by Year */}
                {filteredAlbumsByYear.map((yearGroup, yearIndex) => (
                    <div key={yearGroup.year} className="mb-16">
                        {/* Year Header */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: yearIndex * 0.1 }}
                            className="flex items-center gap-4 mb-8"
                        >
                            <div className="relative">
                                <span className="absolute -top-1 -left-1 text-6xl font-bold text-(--ngo-orange)/10" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {yearGroup.year}
                                </span>
                                <h3 className="relative text-3xl font-bold text-(--ngo-dark)" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {yearGroup.year}
                                </h3>
                            </div>
                            <div className="flex-1 h-px bg-linear-to-r from-(--ngo-orange)/40 via-(--ngo-orange)/20 to-transparent" />
                            <span className="px-3 py-1 rounded-full bg-(--ngo-orange)/10 text-(--ngo-orange) text-sm font-medium">
                                {yearGroup.albums.length} {yearGroup.albums.length === 1 ? 'album' : 'albums'}
                            </span>
                        </motion.div>

                        {/* Albums Grid for this year */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                                    <motion.div 
                                        className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
                                        whileHover={{ y: -8 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Image
                                            src={album.coverPhotoUrl}
                                            alt={album.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                                        
                                        {/* Photo count badge */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                            <Images className="w-3.5 h-3.5 text-white" />
                                            <span className="text-white text-xs font-medium">{album.photoCount}</span>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h4 className="text-white text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                                                {album.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span>Click to view</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                        
                                        {/* Corner accent */}
                                        <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute top-3 left-3 w-6 h-0.5 bg-(--ngo-orange)" />
                                            <div className="absolute top-3 left-3 w-0.5 h-6 bg-(--ngo-orange)" />
                                        </div>
                                    </motion.div>
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
    const videos = [
        {
            title: "Our Journey Documentary",
            description: "A glimpse into 10 years of Prayaas",
            duration: "12:45",
            color: "var(--ngo-orange)",
            gradient: "from-orange-400 to-red-500",
            icon: "🎬"
        },
        {
            title: "Annual Day Highlights",
            description: "Celebrations and performances by our students",
            duration: "8:30",
            color: "var(--ngo-green)",
            gradient: "from-green-400 to-emerald-500",
            icon: "🎉"
        }
    ];

    return (
        <section className="py-24 sm:py-28 relative overflow-hidden">
            {/* Background with pattern */}
            <div className="absolute inset-0 bg-linear-to-b from-white via-(--ngo-cream)/50 to-white" />
            
            {/* Decorative film reel pattern */}
            <div className="absolute top-0 left-0 right-0 h-2 flex overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <motion.div 
                        key={i} 
                        className="flex-shrink-0 w-8 h-2 mx-1 rounded-full"
                        style={{ backgroundColor: i % 2 === 0 ? 'var(--ngo-orange)' : 'var(--ngo-green)', opacity: 0.2 }}
                    />
                ))}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-(--ngo-orange) font-semibold uppercase tracking-wider text-xs sm:text-sm inline-flex items-center gap-2 justify-center">
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                        Videos
                        <span className="w-8 h-[2px] bg-(--ngo-orange)" />
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mt-3 mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Watch Our{" "}
                        <span className="relative inline-block">
                            Story
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-orange)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg max-w-2xl mx-auto">
                        Experience the joy and impact of Prayaas through our videos
                    </p>
                </motion.div>
                
                {/* Video Cards - Creative Layout */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.title}
                            initial={{ opacity: 0, y: 40, rotate: index === 0 ? -2 : 2 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative"
                        >
                            {/* Card shadow/border effect */}
                            <div 
                                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                                style={{ background: `linear-gradient(135deg, ${video.color}40, transparent)` }}
                            />
                            
                            <motion.div 
                                className="relative bg-white rounded-3xl overflow-hidden shadow-xl"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {/* Video thumbnail area */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    {/* Gradient background */}
                                    <div className={`absolute inset-0 bg-linear-to-br ${video.gradient} opacity-90`} />
                                    
                                    {/* Pattern overlay */}
                                    <div className="absolute inset-0 opacity-10" style={{
                                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                        backgroundSize: '20px 20px'
                                    }} />
                                    
                                    {/* Decorative circles */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
                                    
                                    {/* Icon in corner */}
                                    <motion.div 
                                        className="absolute top-4 left-4 text-4xl"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        {video.icon}
                                    </motion.div>
                                    
                                    {/* Duration badge */}
                                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
                                        <span className="text-white text-sm font-medium">{video.duration}</span>
                                    </div>
                                    
                                    {/* Center play button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div 
                                            className="relative"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {/* Pulsing rings */}
                                            <motion.div 
                                                className="absolute inset-0 rounded-full bg-white/30"
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <motion.div 
                                                className="absolute inset-0 rounded-full bg-white/20"
                                                animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
                                                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                            />
                                            
                                            {/* Play button */}
                                            <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-2xl">
                                                <svg
                                                    className="w-8 h-8 ml-1"
                                                    style={{ color: video.color }}
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    {/* Bottom gradient overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/40 to-transparent" />
                                </div>
                                
                                {/* Content area */}
                                <div className="p-6 relative">
                                    {/* Accent line */}
                                    <div 
                                        className="absolute top-0 left-6 right-6 h-1 rounded-full -translate-y-1/2"
                                        style={{ backgroundColor: video.color }}
                                    />
                                    
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-(--ngo-dark) mb-2 group-hover:text-opacity-80 transition-colors">
                                                {video.title}
                                            </h3>
                                            <p className="text-(--ngo-gray) text-sm">
                                                {video.description}
                                            </p>
                                        </div>
                                        
                                        {/* Watch button */}
                                        <motion.button 
                                            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors"
                                            style={{ backgroundColor: video.color }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Watch
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
                
                {/* Bottom decoration */}
                <motion.div 
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {['🎥', '📹', '🎬'].map((emoji, i) => (
                                <motion.div 
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg border-2 border-white"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                                >
                                    {emoji}
                                </motion.div>
                            ))}
                        </div>
                        <span className="text-(--ngo-gray) text-sm">More videos coming soon!</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function CTASection({ images }: { images: PageImagesMap }) {
    const ctaSrc = getImageSrc(images, "cta", "background", "");

    return (
        <section className="py-24 sm:py-28 relative overflow-hidden">
            {/* Light gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-(--ngo-cream) via-white to-orange-50" />
            
            {/* Decorative blurred shapes */}
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-(--ngo-orange)/10 blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-(--ngo-green)/10 blur-3xl" />
            
            {/* Floating camera icons */}
            <motion.div 
                className="absolute top-20 left-[15%] text-4xl opacity-20"
                animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                📸
            </motion.div>
            <motion.div 
                className="absolute bottom-24 right-[20%] text-3xl opacity-20"
                animate={{ y: [0, 8, 0], rotate: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                🎬
            </motion.div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Icon */}
                    <motion.div 
                        className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--ngo-orange) to-(--ngo-yellow) flex items-center justify-center mx-auto mb-6 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Camera className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--ngo-dark) mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Be Part of These{" "}
                        <span className="relative inline-block">
                            <span className="text-(--ngo-orange)">Moments</span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7 Q 25 0, 50 7 T 100 7" stroke="var(--ngo-green)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
                            </svg>
                        </span>
                    </h2>
                    <p className="text-(--ngo-gray) text-base sm:text-lg mb-10 max-w-2xl mx-auto">
                        Join us as a volunteer or supporter and help create more beautiful
                        memories for our children.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/get-involved#volunteer"
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                <Users className="w-5 h-5" />
                                Volunteer With Us
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/get-involved#donate"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-(--ngo-dark) text-(--ngo-dark) font-semibold hover:bg-(--ngo-dark) hover:text-white transition-colors duration-300"
                            >
                                <Heart className="w-5 h-5" />
                                Support Our Work
                            </Link>
                        </motion.div>
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
