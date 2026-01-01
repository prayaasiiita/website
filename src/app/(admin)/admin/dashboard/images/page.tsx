"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
    Image as ImageIcon,
    Plus,
    Edit,
    Trash2,
    X,
    Loader2,
    ChevronDown,
    ChevronRight,
    Search,
    RefreshCw,
    Info,
    Copy,
    Check,
    Upload,
    Images,
} from "lucide-react";
import { ImageUpload } from "@/src/components/admin/ImageUpload";

// Image keys reference guide
const IMAGE_KEYS_GUIDE = {
    home: {
        hero: [{ key: "main", description: "Main hero background image" }],
        about: [
            { key: "slide-1", description: "About carousel slide 1" },
            { key: "slide-2", description: "About carousel slide 2" },
            { key: "slide-3", description: "About carousel slide 3 (add more as slide-4, slide-5, etc.)" },
        ],
        gallery: [
            { key: "slide-1", description: "Home gallery image 1" },
            { key: "slide-2", description: "Home gallery image 2" },
            { key: "slide-3", description: "Home gallery image 3 (add more as slide-4, slide-5, etc.)" },
        ],
        cta: [{ key: "background", description: "Call-to-action section background" }],
    },
    about: {
        hero: [{ key: "main", description: "About page hero background" }],
        story: [
            { key: "slide-1", description: "Story carousel slide 1" },
            { key: "slide-2", description: "Story carousel slide 2" },
            { key: "slide-3", description: "Story carousel slide 3" },
            { key: "slide-4", description: "Story carousel slide 4 (add more as slide-5, slide-6, etc.)" },
        ],
        cta: [{ key: "background", description: "Call-to-action section background" }],
    },
    programs: {
        hero: [{ key: "main", description: "Programs page hero background" }],
        education: [
            { key: "slide-1", description: "Education program image 1" },
            { key: "slide-2", description: "Education program image 2" },
            { key: "slide-3", description: "Education program image 3 (add more as slide-4, slide-5, etc.)" },
        ],
        recreational: [
            { key: "slide-1", description: "Recreational program image 1" },
            { key: "slide-2", description: "Recreational program image 2" },
            { key: "slide-3", description: "Recreational program image 3 (add more as slide-4, slide-5, etc.)" },
        ],
        lifeskills: [
            { key: "slide-1", description: "Life Skills program image 1" },
            { key: "slide-2", description: "Life Skills program image 2" },
            { key: "slide-3", description: "Life Skills program image 3 (add more as slide-4, slide-5, etc.)" },
        ],
        community: [
            { key: "slide-1", description: "Community program image 1" },
            { key: "slide-2", description: "Community program image 2" },
            { key: "slide-3", description: "Community program image 3 (add more as slide-4, slide-5, etc.)" },
        ],
    },
    gallery: {
        hero: [{ key: "main", description: "Gallery page hero background" }],
    },
    impact: {
        hero: [{ key: "main", description: "Impact page hero background" }],
    },
    contact: {
        hero: [{ key: "main", description: "Contact page hero background" }],
    },
    "get-involved": {
        hero: [{ key: "main", description: "Get Involved page hero background" }],
    },
};

// Helpers to derive sections per page from the guide
function getSectionsForPage(page: string): string[] {
    const sections = (IMAGE_KEYS_GUIDE as Record<string, Record<string, { key: string; description: string }[]>>)[page];
    return sections ? Object.keys(sections) : [];
}

function getCarouselSectionsForPage(page: string): string[] {
    const sections = (IMAGE_KEYS_GUIDE as Record<string, Record<string, { key: string; description: string }[]>>)[page];
    if (!sections) return [];
    return Object.entries(sections)
        .filter(([, keys]) => keys.some((k) => k.key.startsWith("slide-")))
        .map(([name]) => name);
}

function getKeysGuide(page: string, section: string): { key: string; description: string }[] {
    const sections = (IMAGE_KEYS_GUIDE as Record<string, Record<string, { key: string; description: string }[]>>)[page];
    return sections?.[section] || [];
}

interface PageImage {
    _id: string;
    page: string;
    section: string;
    key: string;
    imageUrl: string;
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
    createdAt: string;
    updatedAt: string;
}

type GroupedImages = Record<string, Record<string, PageImage[]>>;

export default function ImagesManagement() {
    const [images, setImages] = useState<PageImage[]>([]);
    const [grouped, setGrouped] = useState<GroupedImages>({});
    const [loading, setLoading] = useState(true);
    const [allowedPages, setAllowedPages] = useState<string[]>([]);
    const [allowedSections, setAllowedSections] = useState<string[]>([]);
    const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [showGuide, setShowGuide] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<PageImage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bulk upload states
    const [bulkFiles, setBulkFiles] = useState<File[]>([]);
    const [bulkUploadProgress, setBulkUploadProgress] = useState<{ current: number; total: number } | null>(null);
    const [bulkCarouselConfig, setBulkCarouselConfig] = useState({
        page: "home",
        section: "about",
    });

    // Form states
    const [newImage, setNewImage] = useState({
        page: "",
        section: "",
        key: "",
    });

    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/page-images");
            const data = await res.json();

            if (res.ok) {
                setImages(data.images || []);
                setGrouped(data.grouped || {});
                setAllowedPages(data.allowedPages || []);
                setAllowedSections(data.allowedSections || []);

                // Auto-expand all pages on first load
                if (data.grouped) {
                    setExpandedPages(new Set(Object.keys(data.grouped)));
                }
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const togglePage = (page: string) => {
        setExpandedPages((prev) => {
            const next = new Set(prev);
            if (next.has(page)) {
                next.delete(page);
            } else {
                next.add(page);
            }
            return next;
        });
    };

    const toggleSection = (pageSection: string) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(pageSection)) {
                next.delete(pageSection);
            } else {
                next.add(pageSection);
            }
            return next;
        });
    };

    const handleAddImage = async (file: File, alt: string) => {
        if (!newImage.page || !newImage.section || !newImage.key) {
            alert("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("page", newImage.page);
            formData.append("section", newImage.section);
            formData.append("key", newImage.key);
            formData.append("alt", alt);

            const res = await fetch("/api/admin/page-images", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setShowAddModal(false);
                setNewImage({ page: "", section: "", key: "" });
                fetchImages();
            } else {
                alert(data.error || "Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateImage = async (file: File | null, alt: string) => {
        if (!selectedImage) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("id", selectedImage._id);
            formData.append("alt", alt);
            if (file) {
                formData.append("file", file);
            }

            const res = await fetch("/api/admin/page-images", {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setShowEditModal(false);
                setSelectedImage(null);
                fetchImages();
            } else {
                alert(data.error || "Failed to update image");
            }
        } catch (error) {
            console.error("Error updating image:", error);
            alert("Failed to update image");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteImage = async () => {
        if (!selectedImage) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/page-images?id=${selectedImage._id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setShowDeleteModal(false);
                setSelectedImage(null);
                fetchImages();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete image");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get existing slide numbers for a page/section
    const getExistingSlideNumbers = (page: string, section: string): number[] => {
        const existingImages = grouped[page]?.[section] || [];
        return existingImages
            .filter((img) => img.key.startsWith("slide-"))
            .map((img) => parseInt(img.key.replace("slide-", ""), 10))
            .filter((n) => !isNaN(n))
            .sort((a, b) => a - b);
    };

    // Handle bulk carousel upload
    const handleBulkCarouselUpload = async () => {
        if (bulkFiles.length === 0) {
            alert("Please select at least one image");
            return;
        }

        setIsSubmitting(true);
        setBulkUploadProgress({ current: 0, total: bulkFiles.length });

        try {
            const { page, section } = bulkCarouselConfig;

            // Get existing slide numbers to continue from
            const existingNumbers = getExistingSlideNumbers(page, section);
            const startNumber = existingNumbers.length > 0
                ? Math.max(...existingNumbers) + 1
                : 1;

            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < bulkFiles.length; i++) {
                const file = bulkFiles[i];
                const slideNumber = startNumber + i;
                const key = `slide-${slideNumber}`;

                const formData = new FormData();
                formData.append("file", file);
                formData.append("page", page);
                formData.append("section", section);
                formData.append("key", key);
                formData.append("alt", `${section} carousel slide ${slideNumber}`);

                try {
                    const res = await fetch("/api/admin/page-images", {
                        method: "POST",
                        body: formData,
                    });

                    if (res.ok) {
                        successCount++;
                    } else {
                        failCount++;
                        console.error(`Failed to upload ${file.name}`);
                    }
                } catch (error) {
                    failCount++;
                    console.error(`Error uploading ${file.name}:`, error);
                }

                setBulkUploadProgress({ current: i + 1, total: bulkFiles.length });
            }

            // Reset and close
            setBulkFiles([]);
            setBulkUploadProgress(null);
            setShowBulkUploadModal(false);
            fetchImages();

            if (failCount > 0) {
                alert(`Uploaded ${successCount} images. ${failCount} failed.`);
            } else {
                alert(`Successfully uploaded ${successCount} images!`);
            }
        } catch (error) {
            console.error("Error in bulk upload:", error);
            alert("Failed to upload images");
        } finally {
            setIsSubmitting(false);
            setBulkUploadProgress(null);
        }
    };

    // Handle bulk file selection
    const handleBulkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => {
            const isValidType = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
            return isValidType;
        });
        setBulkFiles((prev) => [...prev, ...validFiles]);
    };

    // Handle bulk drag and drop
    const handleBulkDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter((file) => {
            const isValidType = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
            return isValidType;
        });
        setBulkFiles((prev) => [...prev, ...validFiles]);
    };

    // Remove file from bulk selection
    const removeBulkFile = (index: number) => {
        setBulkFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const filteredGrouped = useCallback(() => {
        if (!searchQuery.trim()) return grouped;

        const query = searchQuery.toLowerCase();
        const result: GroupedImages = {};

        Object.entries(grouped).forEach(([page, sections]) => {
            Object.entries(sections).forEach(([section, imgs]) => {
                const filtered = imgs.filter(
                    (img) =>
                        img.key.includes(query) ||
                        img.alt.toLowerCase().includes(query) ||
                        img.page.includes(query) ||
                        img.section.includes(query)
                );

                if (filtered.length > 0) {
                    if (!result[page]) result[page] = {};
                    result[page][section] = filtered;
                }
            });
        });

        return result;
    }, [grouped, searchQuery]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(text);
            setTimeout(() => setCopiedKey(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Images</h1>
                <p className="text-gray-500">
                    Manage images across all website pages
                </p>
            </div>

            {/* Image Keys Reference Guide */}
            <div className="mb-6">
                <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                >
                    <Info className="w-5 h-5" />
                    {showGuide ? "Hide" : "Show"} Image Keys Reference Guide
                </button>

                {showGuide && (
                    <div className="mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-blue-50 border-b border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-900">📋 Image Keys Reference</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Use these keys when adding images. For carousels, add slide-1, slide-2, slide-3, etc. You can add as many slides as you want!
                            </p>
                        </div>
                        <div className="p-4 space-y-6">
                            {Object.entries(IMAGE_KEYS_GUIDE).map(([page, sections]) => (
                                <div key={page}>
                                    <h4 className="text-md font-semibold text-gray-900 capitalize mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        {page} Page
                                    </h4>
                                    <div className="grid gap-3 pl-4">
                                        {Object.entries(sections).map(([section, keys]) => (
                                            <div key={section} className="bg-gray-50 rounded-lg p-3">
                                                <h5 className="text-sm font-medium text-gray-700 capitalize mb-2">{section} Section</h5>
                                                <div className="space-y-2">
                                                    {keys.map(({ key, description }) => (
                                                        <div key={key} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => copyToClipboard(key)}
                                                                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-mono text-xs transition-colors"
                                                                >
                                                                    {copiedKey === key ? (
                                                                        <Check className="w-3 h-3 text-green-600" />
                                                                    ) : (
                                                                        <Copy className="w-3 h-3 text-gray-500" />
                                                                    )}
                                                                    {key}
                                                                </button>
                                                                <span className="text-gray-500">{description}</span>
                                                            </div>
                                                            <code className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                                {page}/{section}/{key}
                                                            </code>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-amber-50 border-t border-amber-100">
                            <p className="text-sm text-amber-800">
                                <strong>💡 Tip for Carousels:</strong> Add unlimited slides by using keys like <code className="bg-amber-100 px-1 rounded">slide-1</code>, <code className="bg-amber-100 px-1 rounded">slide-2</code>, <code className="bg-amber-100 px-1 rounded">slide-3</code>, etc. The website will automatically display all slides you add!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search images by key, alt text, page..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchImages}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowBulkUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                        <Images className="w-5 h-5" />
                        Bulk Carousel
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Image
                    </button>
                </div>
            </div>

            {/* Images List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : Object.keys(filteredGrouped()).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                    <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery ? "No images found" : "No images yet"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchQuery
                            ? "Try adjusting your search query"
                            : "Start by adding your first page image"}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Image
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(filteredGrouped()).map(([page, sections]) => (
                        <div
                            key={page}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                        >
                            {/* Page Header */}
                            <button
                                onClick={() => togglePage(page)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {expandedPages.has(page) ? (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                                        {page} Page
                                    </h2>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded-full">
                                        {Object.values(sections).flat().length} images
                                    </span>
                                </div>
                            </button>

                            {/* Sections */}
                            {expandedPages.has(page) && (
                                <div className="border-t border-gray-100">
                                    {Object.entries(sections).map(([section, sectionImages]) => {
                                        const sectionKey = `${page}:${section}`;
                                        return (
                                            <div key={sectionKey} className="border-b border-gray-100 last:border-b-0">
                                                <button
                                                    onClick={() => toggleSection(sectionKey)}
                                                    className="w-full flex items-center justify-between px-4 py-3 pl-12 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {expandedSections.has(sectionKey) ? (
                                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                                        )}
                                                        <span className="font-medium text-gray-700 capitalize">
                                                            {section}
                                                        </span>
                                                        <span className="text-sm text-gray-400">
                                                            ({sectionImages.length})
                                                        </span>
                                                    </div>
                                                </button>

                                                {/* Images Grid */}
                                                {expandedSections.has(sectionKey) && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pl-16 bg-gray-50">
                                                        {sectionImages.map((img) => (
                                                            <div
                                                                key={img._id}
                                                                className="bg-white rounded-xl border border-gray-200 overflow-hidden group"
                                                            >
                                                                <div className="relative aspect-video">
                                                                    <Image
                                                                        src={img.imageUrl}
                                                                        alt={img.alt}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedImage(img);
                                                                                setShowEditModal(true);
                                                                            }}
                                                                            className="p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedImage(img);
                                                                                setShowDeleteModal(true);
                                                                            }}
                                                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="p-3">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <p className="font-medium text-gray-900 text-sm truncate">
                                                                            {img.key}
                                                                        </p>
                                                                        <button
                                                                            onClick={() => copyToClipboard(`${img.page}/${img.section}/${img.key}`)}
                                                                            className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                                                                            title="Copy full path"
                                                                        >
                                                                            {copiedKey === `${img.page}/${img.section}/${img.key}` ? (
                                                                                <Check className="w-3 h-3 text-green-600" />
                                                                            ) : (
                                                                                <Copy className="w-3 h-3 text-gray-400" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    <code className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded block truncate">
                                                                        {img.page}/{img.section}/{img.key}
                                                                    </code>
                                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                                        {img.alt}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Image Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl !max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Image</h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewImage({ page: "", section: "", key: "" });
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Page <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newImage.page}
                                        onChange={(e) => setNewImage({ ...newImage, page: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    >
                                        <option value="">Select page</option>
                                        {allowedPages.map((p) => (
                                            <option key={p} value={p}>
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newImage.section}
                                        onChange={(e) => setNewImage({ ...newImage, section: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    >
                                        <option value="">Select section</option>
                                        {(newImage.page && getSectionsForPage(newImage.page).length > 0
                                            ? getSectionsForPage(newImage.page)
                                            : allowedSections
                                        ).map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newImage.key}
                                    onChange={(e) =>
                                        setNewImage({
                                            ...newImage,
                                            key: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
                                        })
                                    }
                                    placeholder="e.g., main-banner, slide-1"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Unique identifier (lowercase, no spaces)
                                </p>
                                {newImage.page && newImage.section && (
                                    (() => {
                                        const guide = getKeysGuide(newImage.page, newImage.section);
                                        const hasCarousel = guide.some((k) => k.key.startsWith("slide-"));
                                        if (guide.length === 0) return null;
                                        return (
                                            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2">
                                                <div className="text-xs text-blue-900">
                                                    <span className="font-semibold">Recommended keys: </span>
                                                    {guide.map((g) => g.key).join(", ")}
                                                </div>
                                                {hasCarousel && (
                                                    <div className="text-xs text-blue-800 mt-1">
                                                        Tip: For carousels, add keys like <span className="font-mono">slide-1</span>, <span className="font-mono">slide-2</span>, <span className="font-mono">slide-3</span> …
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                            <ImageUpload onUpload={handleAddImage} isLoading={isSubmitting} />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Image Modal */}
            {showEditModal && selectedImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl !max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Image</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedImage(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Location:</span>{" "}
                                    <span className="capitalize">{selectedImage.page}</span> /{" "}
                                    <span className="capitalize">{selectedImage.section}</span> /{" "}
                                    {selectedImage.key}
                                </p>
                            </div>
                            <ImageUpload
                                onUpload={(file, alt) => handleUpdateImage(file, alt)}
                                currentImage={selectedImage.imageUrl}
                                currentAlt={selectedImage.alt}
                                isLoading={isSubmitting}
                            />
                            <button
                                onClick={() => handleUpdateImage(null, selectedImage.alt)}
                                disabled={isSubmitting}
                                className="w-full mt-4 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Update Alt Text Only
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl !max-w-sm w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Delete Image?
                            </h3>
                            <p className="text-gray-500 text-center mb-2">
                                This will permanently delete the image from:
                            </p>
                            <p className="text-sm text-center font-medium text-gray-700 mb-4">
                                <span className="capitalize">{selectedImage.page}</span> /{" "}
                                <span className="capitalize">{selectedImage.section}</span> /{" "}
                                {selectedImage.key}
                            </p>
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                                <Image
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedImage(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteImage}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showBulkUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl !max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Images className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Bulk Carousel Upload
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Upload multiple images at once for carousel sections
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowBulkUploadModal(false);
                                        setBulkFiles([]);
                                        setBulkUploadProgress(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Page & Section Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Page
                                    </label>
                                    <select
                                        value={bulkCarouselConfig.page}
                                        onChange={(e) => {
                                            const newPage = e.target.value;
                                            const carouselSections = getCarouselSectionsForPage(newPage);
                                            setBulkCarouselConfig((prev) => ({
                                                ...prev,
                                                page: newPage,
                                                // Default section to first carousel-capable section for the selected page
                                                section: carouselSections.length > 0 ? carouselSections[0] : prev.section,
                                            }));
                                        }}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={isSubmitting}
                                    >
                                        <option value="home">Home</option>
                                        <option value="about">About</option>
                                        <option value="programs">Programs</option>
                                        <option value="gallery">Gallery</option>
                                        <option value="impact">Impact</option>
                                        <option value="contact">Contact</option>
                                        <option value="get-involved">Get Involved</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Section (Carousel)
                                    </label>
                                    <select
                                        value={bulkCarouselConfig.section}
                                        onChange={(e) =>
                                            setBulkCarouselConfig((prev) => ({
                                                ...prev,
                                                section: e.target.value,
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={isSubmitting}
                                    >
                                        {(getCarouselSectionsForPage(bulkCarouselConfig.page).length > 0
                                            ? getCarouselSectionsForPage(bulkCarouselConfig.page)
                                            : allowedSections
                                        ).map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Info about existing slides */}
                            {(() => {
                                const existingNumbers = getExistingSlideNumbers(
                                    bulkCarouselConfig.page,
                                    bulkCarouselConfig.section
                                );
                                const nextSlide = existingNumbers.length > 0
                                    ? Math.max(...existingNumbers) + 1
                                    : 1;
                                const keysGuide = getKeysGuide(bulkCarouselConfig.page, bulkCarouselConfig.section);
                                return (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                                        <div className="flex items-start gap-2">
                                            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="text-blue-900 font-medium">
                                                    {existingNumbers.length > 0
                                                        ? `${existingNumbers.length} existing slides: ${existingNumbers.map((n) => `slide-${n}`).join(", ")}`
                                                        : "No existing slides in this section"}
                                                </p>
                                                <p className="text-blue-700 mt-1">
                                                    New slides will start from <span className="font-mono font-semibold">slide-{nextSlide}</span>
                                                </p>
                                                {keysGuide.length > 0 && (
                                                    <p className="text-blue-800 mt-1">
                                                        Recommended keys for this section: {keysGuide.map(k => k.key).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Drop Zone */}
                            <div
                                onDrop={handleBulkDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 hover:bg-green-50/50 transition-colors mb-4"
                            >
                                <input
                                    type="file"
                                    id="bulk-file-input"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleBulkFileSelect}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="bulk-file-input"
                                    className="cursor-pointer"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">
                                        Drag & drop images here, or click to browse
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        PNG, JPG, WebP, GIF
                                    </p>
                                </label>
                            </div>

                            {/* Selected Files Preview */}
                            {bulkFiles.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900">
                                            Selected Images ({bulkFiles.length})
                                        </h4>
                                        <button
                                            onClick={() => setBulkFiles([])}
                                            className="text-sm text-red-600 hover:text-red-700"
                                            disabled={isSubmitting}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                                        {bulkFiles.map((file, index) => {
                                            const existingNumbers = getExistingSlideNumbers(
                                                bulkCarouselConfig.page,
                                                bulkCarouselConfig.section
                                            );
                                            const startNumber = existingNumbers.length > 0
                                                ? Math.max(...existingNumbers) + 1
                                                : 1;
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 group"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center shrink-0">
                                                            <ImageIcon className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {file.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                <span className="font-mono text-green-600">slide-{startNumber + index}</span>
                                                                {" · "}
                                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!isSubmitting && (
                                                        <button
                                                            onClick={() => removeBulkFile(index)}
                                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Upload Progress */}
                            {bulkUploadProgress && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Uploading...
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {bulkUploadProgress.current} / {bulkUploadProgress.total}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-300"
                                            style={{
                                                width: `${(bulkUploadProgress.current / bulkUploadProgress.total) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowBulkUploadModal(false);
                                        setBulkFiles([]);
                                        setBulkUploadProgress(null);
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkCarouselUpload}
                                    disabled={isSubmitting || bulkFiles.length === 0}
                                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5" />
                                            Upload {bulkFiles.length} Image{bulkFiles.length !== 1 ? "s" : ""}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
