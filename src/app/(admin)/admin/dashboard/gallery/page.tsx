"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import {
    RefreshCw,
    Check,
    X,
    Eye,
    EyeOff,
    Clock,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    History,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    Plus,
    Edit3,
    Search,
} from "lucide-react";
import { toast } from "sonner";

interface Album {
    _id: string;
    flickrId: string;
    title: string;
    customTitle?: string;
    description?: string;
    customDescription?: string;
    coverPhotoUrl: string;
    photoCount: number;
    flickrUrl: string;
    status: "pending" | "approved" | "rejected" | "hidden";
    displayOrder: number;
    dateCreated: string;
    dateUpdated: string;
    lastSyncedAt: string;
    approvedBy?: { username: string; email: string };
    approvedAt?: string;
    rejectionReason?: string;
}

interface LatestSync {
    status: string;
    startedAt: string;
    completedAt?: string;
    albumsFound: number;
    albumsAdded: number;
    albumsUpdated: number;
}

interface SyncLog {
    _id: string;
    startedAt: string;
    completedAt?: string;
    status: "running" | "success" | "failed";
    triggeredBy: string;
    triggeredByEmail?: string;
    albumsFound: number;
    albumsAdded: number;
    albumsUpdated: number;
    albumsUnchanged: number;
    duration?: number;
    errorMessage?: string;
}

interface Counts {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
    hidden: number;
}

interface FlickrAlbumOption {
    flickrId: string;
    title: string;
    description: string;
    coverPhotoUrl: string;
    photoCount: number;
    flickrUrl: string;
    owner: string;
    dateCreated: string;
    isAdded: boolean;
    isPrayaas: boolean;
}

interface AlbumPhoto {
    id: string;
    title: string;
    thumbnail: string;
    medium: string;
    large: string;
}

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "hidden";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    hidden: "bg-gray-100 text-gray-800",
};

const STATUS_ICONS = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    hidden: EyeOff,
};

export default function GalleryManagementPage() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [counts, setCounts] = useState<Counts>({ all: 0, pending: 0, approved: 0, rejected: 0, hidden: 0 });
    const [latestSync, setLatestSync] = useState<LatestSync | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showSyncHistory, setShowSyncHistory] = useState(false);
    const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
    const [loadingSyncLogs, setLoadingSyncLogs] = useState(false);
    const [processingAlbum, setProcessingAlbum] = useState<string | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    // Add Album Modal states
    const [showAddAlbum, setShowAddAlbum] = useState(false);
    const [flickrAlbums, setFlickrAlbums] = useState<FlickrAlbumOption[]>([]);
    const [loadingFlickrAlbums, setLoadingFlickrAlbums] = useState(false);
    const [addingAlbum, setAddingAlbum] = useState<string | null>(null);
    const [flickrSearchQuery, setFlickrSearchQuery] = useState("");

    // Edit Album Modal states
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [savingEdit, setSavingEdit] = useState(false);
    const [showCoverPicker, setShowCoverPicker] = useState(false);
    const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(false);

    const fetchAlbums = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                status: statusFilter,
                page: page.toString(),
                limit: "12",
            });
            if (debouncedSearch) {
                params.set("search", debouncedSearch);
            }

            const response = await fetch(`/api/admin/gallery?${params}`);
            if (!response.ok) throw new Error("Failed to fetch albums");

            const data = await response.json();
            setAlbums(data.albums);
            setCounts(data.counts);
            setLatestSync(data.latestSync);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching albums:", error);
            toast.error("Failed to load albums");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page, debouncedSearch]);

    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums]);

    // Debounce search input
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const response = await fetch("/api/admin/gallery", { method: "POST" });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Sync failed");
            }

            toast.success(
                `Sync completed: ${data.albumsAdded} added, ${data.albumsUpdated} updated`
            );
            fetchAlbums();
        } catch (error) {
            console.error("Sync error:", error);
            toast.error(error instanceof Error ? error.message : "Sync failed");
        } finally {
            setSyncing(false);
        }
    };

    const handleStatusChange = async (albumId: string, newStatus: string, reason?: string) => {
        setProcessingAlbum(albumId);
        try {
            const body: Record<string, string> = { status: newStatus };
            if (reason) body.rejectionReason = reason;

            const response = await fetch(`/api/admin/gallery/${albumId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Failed to update album");

            toast.success(`Album ${newStatus}`);
            setSelectedAlbum(null);
            setRejectionReason("");
            fetchAlbums();
        } catch (error) {
            console.error("Error updating album:", error);
            toast.error("Failed to update album status");
        } finally {
            setProcessingAlbum(null);
        }
    };

    const fetchSyncLogs = async () => {
        setLoadingSyncLogs(true);
        try {
            const response = await fetch("/api/admin/gallery/sync-logs?limit=10");
            if (!response.ok) throw new Error("Failed to fetch sync logs");
            const data = await response.json();
            setSyncLogs(data.logs);
        } catch (error) {
            console.error("Error fetching sync logs:", error);
            toast.error("Failed to load sync history");
        } finally {
            setLoadingSyncLogs(false);
        }
    };

    useEffect(() => {
        if (showSyncHistory) {
            fetchSyncLogs();
        }
    }, [showSyncHistory]);

    // Fetch all Flickr albums for the Add Album modal
    const fetchFlickrAlbums = async () => {
        setLoadingFlickrAlbums(true);
        try {
            const response = await fetch("/api/admin/gallery/flickr-albums");
            if (!response.ok) throw new Error("Failed to fetch Flickr albums");
            const data = await response.json();
            setFlickrAlbums(data.albums);
        } catch (error) {
            console.error("Error fetching Flickr albums:", error);
            toast.error("Failed to load Flickr albums");
        } finally {
            setLoadingFlickrAlbums(false);
        }
    };

    useEffect(() => {
        if (showAddAlbum) {
            fetchFlickrAlbums();
        }
    }, [showAddAlbum]);

    // Add a Flickr album manually
    const handleAddAlbum = async (flickrId: string, owner: string) => {
        setAddingAlbum(flickrId);
        try {
            const response = await fetch("/api/admin/gallery/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flickrId, userId: owner }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to add album");
            }

            toast.success("Album added successfully");
            // Update the flickrAlbums list to mark this as added
            setFlickrAlbums(prev =>
                prev.map(a => a.flickrId === flickrId ? { ...a, isAdded: true } : a)
            );
            fetchAlbums();
        } catch (error) {
            console.error("Error adding album:", error);
            toast.error(error instanceof Error ? error.message : "Failed to add album");
        } finally {
            setAddingAlbum(null);
        }
    };

    // Open edit modal for an album
    const openEditModal = (album: Album) => {
        setEditingAlbum(album);
        setEditTitle(album.customTitle || album.title);
        setEditDescription(album.customDescription || album.description || "");
    };

    // Save album edits
    const handleSaveEdit = async () => {
        if (!editingAlbum) return;
        setSavingEdit(true);
        try {
            const response = await fetch(`/api/admin/gallery/${editingAlbum._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customTitle: editTitle || undefined,
                    customDescription: editDescription || undefined,
                }),
            });

            if (!response.ok) throw new Error("Failed to update album");

            toast.success("Album updated successfully");
            setEditingAlbum(null);
            fetchAlbums();
        } catch (error) {
            console.error("Error updating album:", error);
            toast.error("Failed to update album");
        } finally {
            setSavingEdit(false);
        }
    };

    // Fetch photos for cover picker
    const fetchPhotosForCover = async () => {
        if (!editingAlbum) return;
        setLoadingPhotos(true);
        try {
            const response = await fetch(`/api/admin/gallery/${editingAlbum._id}?perPage=50`);
            if (!response.ok) throw new Error("Failed to fetch photos");
            const data = await response.json();
            setAlbumPhotos(data.photos || []);
            setShowCoverPicker(true);
        } catch (error) {
            console.error("Error fetching photos:", error);
            toast.error("Failed to load photos");
        } finally {
            setLoadingPhotos(false);
        }
    };

    // Filter Flickr albums by search
    const filteredFlickrAlbums = useMemo(() => {
        if (!flickrSearchQuery) return flickrAlbums;
        return flickrAlbums.filter(a =>
            a.title.toLowerCase().includes(flickrSearchQuery.toLowerCase())
        );
    }, [flickrAlbums, flickrSearchQuery]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDuration = (ms?: number) => {
        if (!ms) return "-";
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    // Group albums by year
    const albumsByYear = useMemo(() => {
        const grouped: Record<string, Album[]> = {};
        albums.forEach((album) => {
            const year = new Date(album.dateCreated).getFullYear().toString();
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(album);
        });
        // Sort years descending (2026, 2025, 2024...)
        return Object.entries(grouped)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([year, yearAlbums]) => ({ year, albums: yearAlbums }));
    }, [albums]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                    <p className="text-gray-500 mt-1">
                        Manage Flickr albums and control what appears on the public gallery
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddAlbum(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Album</span>
                    </button>
                    <button
                        onClick={() => setShowSyncHistory(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <History className="w-4 h-4" />
                        <span className="hidden sm:inline">Sync History</span>
                    </button>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 px-4 py-2 bg-(--ngo-orange) text-white rounded-lg hover:bg-(--ngo-orange)/90 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                        {syncing ? "Syncing..." : "Sync Now"}
                    </button>
                </div>
            </div>

            {/* Latest Sync Info */}
            {latestSync && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        {latestSync.status === "success" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : latestSync.status === "failed" ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        )}
                        <span className="font-medium">Last sync:</span>
                        <span>{formatDate(latestSync.startedAt)}</span>
                    </div>
                    <div className="flex gap-4 text-gray-600">
                        <span>Found: {latestSync.albumsFound}</span>
                        <span>Added: {latestSync.albumsAdded}</span>
                        <span>Updated: {latestSync.albumsUpdated}</span>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2 flex-wrap">
                    {(["all", "pending", "approved", "rejected", "hidden"] as StatusFilter[]).map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusFilter(status);
                                    setPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${statusFilter === status
                                    ? "bg-(--ngo-orange) text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {status} ({counts[status]})
                            </button>
                        )
                    )}
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search albums..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--ngo-orange) focus:border-transparent"
                    />
                </div>
            </div>

            {/* Albums Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-(--ngo-orange)" />
                </div>
            ) : albums.length === 0 ? (
                <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                        {statusFilter === "all" && !searchQuery
                            ? "No albums found. Click 'Sync Now' to fetch albums from Flickr."
                            : "No albums match your filters."}
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {albumsByYear.map(({ year, albums: yearAlbums }) => (
                        <div key={year}>
                            {/* Year Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">{year}</h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-(--ngo-orange)/50 to-transparent" />
                                <span className="text-sm text-gray-500">{yearAlbums.length} albums</span>
                            </div>

                            {/* Albums Grid for this year */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {yearAlbums.map((album) => {
                                    const StatusIcon = STATUS_ICONS[album.status];
                                    return (
                                        <div
                                            key={album._id}
                                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={album.coverPhotoUrl}
                                                    alt={album.customTitle || album.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[album.status]}`}
                                                    >
                                                        <StatusIcon className="w-3 h-3" />
                                                        {album.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {album.customTitle || album.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {album.photoCount} photos
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Updated: {formatDate(album.dateUpdated)}
                                                </p>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 mt-4">
                                                    {album.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(album._id, "approved")}
                                                                disabled={processingAlbum === album._id}
                                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                            >
                                                                {processingAlbum === album._id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Check className="w-4 h-4" />
                                                                )}
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedAlbum(album)}
                                                                disabled={processingAlbum === album._id}
                                                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                <X className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {album.status === "approved" && (
                                                        <button
                                                            onClick={() => handleStatusChange(album._id, "hidden")}
                                                            disabled={processingAlbum === album._id}
                                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
                                                        >
                                                            {processingAlbum === album._id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <EyeOff className="w-4 h-4" />
                                                            )}
                                                            Hide
                                                        </button>
                                                    )}
                                                    {album.status === "rejected" && (
                                                        <button
                                                            onClick={() => handleStatusChange(album._id, "approved")}
                                                            disabled={processingAlbum === album._id}
                                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {processingAlbum === album._id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Check className="w-4 h-4" />
                                                            )}
                                                            Approve
                                                        </button>
                                                    )}
                                                    {album.status === "hidden" && (
                                                        <button
                                                            onClick={() => handleStatusChange(album._id, "approved")}
                                                            disabled={processingAlbum === album._id}
                                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                        >
                                                            {processingAlbum === album._id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Eye className="w-4 h-4" />
                                                            )}
                                                            Show
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => openEditModal(album)}
                                                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                                        title="Edit Album"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={album.flickrUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                        title="View on Flickr"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )
            }

            {/* Rejection Modal */}
            {
                selectedAlbum && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold mb-4">Reject Album</h3>
                            <p className="text-gray-600 mb-4">
                                Reject &quot;{selectedAlbum.title}&quot;? Optionally provide a reason:
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Rejection reason (optional)"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
                                rows={3}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedAlbum(null);
                                        setRejectionReason("");
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() =>
                                        handleStatusChange(selectedAlbum._id, "rejected", rejectionReason)
                                    }
                                    disabled={processingAlbum === selectedAlbum._id}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {processingAlbum === selectedAlbum._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                    ) : (
                                        "Reject"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Sync History Modal */}
            {
                showSyncHistory && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Sync History</h3>
                                <button
                                    onClick={() => setShowSyncHistory(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                                {loadingSyncLogs ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-(--ngo-orange)" />
                                    </div>
                                ) : syncLogs.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No sync history yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {syncLogs.map((log) => (
                                            <div
                                                key={log._id}
                                                className={`p-4 rounded-lg border ${log.status === "success"
                                                    ? "bg-green-50 border-green-200"
                                                    : log.status === "failed"
                                                        ? "bg-red-50 border-red-200"
                                                        : "bg-blue-50 border-blue-200"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {log.status === "success" ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        ) : log.status === "failed" ? (
                                                            <XCircle className="w-5 h-5 text-red-600" />
                                                        ) : (
                                                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                                        )}
                                                        <span className="font-medium capitalize">{log.status}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(log.startedAt)}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Found:</span> {log.albumsFound}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Added:</span> {log.albumsAdded}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Updated:</span> {log.albumsUpdated}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Duration:</span>{" "}
                                                        {formatDuration(log.duration)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Triggered: {log.triggeredBy}
                                                    {log.triggeredByEmail && ` by ${log.triggeredByEmail}`}
                                                </div>
                                                {log.errorMessage && (
                                                    <p className="text-sm text-red-600 mt-2">{log.errorMessage}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Add Album Modal */}
            {showAddAlbum && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Add Album from Flickr</h3>
                                <p className="text-sm text-gray-500">Select an album to add to your gallery</p>
                            </div>
                            <button
                                onClick={() => setShowAddAlbum(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search albums..."
                                    value={flickrSearchQuery}
                                    onChange={(e) => setFlickrSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                            {loadingFlickrAlbums ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-(--ngo-orange)" />
                                </div>
                            ) : filteredFlickrAlbums.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No albums found</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredFlickrAlbums.map((album) => (
                                        <div
                                            key={album.flickrId}
                                            className={`rounded-lg border overflow-hidden ${album.isAdded ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                                        >
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={album.coverPhotoUrl}
                                                    alt={album.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                                {album.isPrayaas && (
                                                    <span className="absolute top-2 left-2 px-2 py-1 bg-(--ngo-orange) text-white text-xs rounded-full">
                                                        Prayaas
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-medium text-gray-900 truncate">{album.title}</h4>
                                                <p className="text-sm text-gray-500">{album.photoCount} photos</p>
                                                <button
                                                    onClick={() => handleAddAlbum(album.flickrId, album.owner)}
                                                    disabled={album.isAdded || addingAlbum === album.flickrId}
                                                    className={`mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${album.isAdded
                                                        ? 'bg-green-100 text-green-700 cursor-default'
                                                        : 'bg-(--ngo-orange) text-white hover:bg-(--ngo-orange)/90 disabled:opacity-50'
                                                        }`}
                                                >
                                                    {addingAlbum === album.flickrId ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : album.isAdded ? (
                                                        <><CheckCircle className="w-4 h-4" /> Added</>
                                                    ) : (
                                                        <><Plus className="w-4 h-4" /> Add Album</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Album Modal */}
            {editingAlbum && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Edit Album</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custom Title
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder={editingAlbum.title}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--ngo-orange)"
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave empty to use original: {editingAlbum.title}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Custom Description
                                </label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder={editingAlbum.description || 'No description'}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-(--ngo-orange)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover Photo
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-24 h-16 rounded overflow-hidden border flex-shrink-0">
                                            <Image
                                                src={editingAlbum.coverPhotoUrl}
                                                alt="Current cover"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">Current cover photo</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={fetchPhotosForCover}
                                            disabled={loadingPhotos}
                                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 text-sm"
                                        >
                                            {loadingPhotos ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Select from Album'}
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Or enter URL directly:</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                id="coverUrlInput"
                                                placeholder="https://live.staticflickr.com/..."
                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--ngo-orange)"
                                            />
                                            <button
                                                onClick={async () => {
                                                    const input = document.getElementById('coverUrlInput') as HTMLInputElement;
                                                    const url = input?.value?.trim();
                                                    if (!url) {
                                                        toast.error('Please enter a URL');
                                                        return;
                                                    }
                                                    try {
                                                        await fetch(`/api/admin/gallery/${editingAlbum._id}`, {
                                                            method: 'PATCH',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ coverPhotoUrl: url }),
                                                        });
                                                        toast.success('Cover photo updated');
                                                        setEditingAlbum(null);
                                                        fetchAlbums();
                                                    } catch {
                                                        toast.error('Failed to update cover');
                                                    }
                                                }}
                                                className="px-4 py-2 bg-(--ngo-orange) text-white rounded-lg hover:bg-(--ngo-orange)/90 text-sm"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditingAlbum(null)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={savingEdit}
                                className="flex-1 px-4 py-2 bg-(--ngo-orange) text-white rounded-lg hover:bg-(--ngo-orange)/90 disabled:opacity-50"
                            >
                                {savingEdit ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cover Picker Modal */}
            {showCoverPicker && editingAlbum && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Select Cover Photo</h3>
                            <button
                                onClick={() => setShowCoverPicker(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                                {albumPhotos.map((photo) => (
                                    <button
                                        key={photo.id}
                                        onClick={async () => {
                                            try {
                                                await fetch(`/api/admin/gallery/${editingAlbum._id}`, {
                                                    method: 'PATCH',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ coverPhotoUrl: photo.large }),
                                                });
                                                toast.success('Cover photo updated');
                                                setShowCoverPicker(false);
                                                setEditingAlbum(null);
                                                fetchAlbums();
                                            } catch {
                                                toast.error('Failed to update cover');
                                            }
                                        }}
                                        className="relative aspect-square rounded overflow-hidden hover:ring-2 hover:ring-(--ngo-orange)"
                                    >
                                        <Image
                                            src={photo.thumbnail}
                                            alt={photo.title || 'Photo'}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
