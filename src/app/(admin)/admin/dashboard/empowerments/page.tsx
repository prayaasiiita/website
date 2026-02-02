"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { empowermentCreateSchema, slugify, tagCreateSchema } from "@/src/lib/validations/empowerment";
import { ImageUpload } from "@/src/components/admin/ImageUpload";
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react";

type Tag = { _id: string; name: string; color: string };

type Item = {
    _id: string;
    title: string;
    status: "draft" | "published";
    slug: string;
    createdAt: string;
    tags?: Tag[];
};

const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
];

export default function EmpowermentPage() {
    const [view, setView] = useState<"list" | "edit">("list");
    const [editingId, setEditingId] = useState<string | null>(null);

    // List view state
    const [items, setItems] = useState<Item[]>([]);
    const [q, setQ] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "draft" | "published">("");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Form state
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [content, setContent] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
    const [coverImageAlt, setCoverImageAlt] = useState<string>("");
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [slug, setSlug] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // New Tag form
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#F97316");
    const [creatingTag, setCreatingTag] = useState(false);

    const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

    // Load tags
    useEffect(() => {
        let cancelled = false;
        async function loadTags() {
            try {
                const res = await fetch("/api/admin/tags", { credentials: "include" });
                const data = await res.json();
                if (!cancelled) setTags(data.tags || []);
            } catch {
                // ignore
            }
        }
        loadTags();
        return () => { cancelled = true; };
    }, []);

    // Load list
    const loadList = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (q.trim()) params.set("q", q.trim());
        if (statusFilter) params.set("status", statusFilter);
        const res = await fetch(`/api/admin/empowerments?${params.toString()}`, { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
            setItems(data.items || []);
            setTotal(data.total || 0);
        }
        setLoading(false);
    }, [page, limit, q, statusFilter]);

    useEffect(() => {
        if (view === "list") {
            loadList();
        }
    }, [loadList, view]);

    const autoSlug = useMemo(() => slugify(title), [title]);
    useEffect(() => {
        setSlug((prev) => (prev.trim().length === 0 ? autoSlug : prev));
    }, [autoSlug]);

    function toggleTag(id: string) {
        setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
    }

    async function handleCreateTag() {
        setFormError(null);
        setFormSuccess(null);
        const parsed = tagCreateSchema.safeParse({ name: newTagName, color: newTagColor });
        if (!parsed.success) {
            setFormError(parsed.error.issues[0]?.message || "Invalid tag");
            return;
        }
        setCreatingTag(true);
        try {
            const res = await fetch("/api/admin/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                setFormError(data.error || "Failed to create tag");
                return;
            }
            setTags((prev) => [...prev, data.tag]);
            setSelectedTagIds((prev) => [...prev, data.tag._id]);
            setNewTagName("");
            setNewTagColor("#F97316");
            setFormSuccess("Tag created");
        } catch {
            setFormError("Failed to create tag");
        } finally {
            setCreatingTag(false);
        }
    }

    async function handleDeleteTag(tagId: string) {
        if (!confirm("Delete this tag?")) return;
        try {
            const res = await fetch(`/api/admin/tags/${tagId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                setTags((prev) => prev.filter((t) => t._id !== tagId));
                setSelectedTagIds((prev) => prev.filter((id) => id !== tagId));
                setFormSuccess("Tag deleted");
            }
        } catch {
            setFormError("Failed to delete tag");
        }
    }

    async function onUpload(file: File, alt: string) {
        setFormError(null);
        setFormSuccess(null);
        const form = new FormData();
        form.append("file", file);
        form.append("folder", "empowerments");
        const res = await fetch("/api/upload", {
            method: "POST",
            body: form,
            credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
            setFormError(data.error || "Failed to upload image");
            return;
        }
        setCoverImageUrl(data.url);
        setCoverImageAlt(alt);
        setFormSuccess("Image uploaded");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        if (status === "published") {
            const ok = confirm("Are you sure you want to publish this entry?");
            if (!ok) return;
        }

        const candidate = {
            title,
            shortDescription,
            content: content || undefined,
            coverImageUrl,
            coverImageAlt: coverImageAlt || undefined,
            tagIds: selectedTagIds,
            status,
            slug: slug || autoSlug,
            metaTitle: metaTitle || undefined,
            metaDescription: metaDescription || undefined,
        };

        const parsed = empowermentCreateSchema.safeParse(candidate);
        if (!parsed.success) {
            const first = parsed.error.issues[0];
            setFormError(first?.message || "Please fix the errors in the form");
            return;
        }

        setSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/admin/empowerments/${editingId}` : "/api/admin/empowerments";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                setFormError(data.error || "Failed to save");
                return;
            }
            setFormSuccess(editingId ? "Updated successfully" : "Created successfully");
            resetForm();
            setView("list");
            await loadList();
        } catch {
            setFormError("Failed to save");
        } finally {
            setSaving(false);
        }
    }

    function resetForm() {
        setEditingId(null);
        setTitle("");
        setShortDescription("");
        setContent("");
        setCoverImageUrl(undefined);
        setCoverImageAlt("");
        setSelectedTagIds([]);
        setStatus("draft");
        setSlug("");
        setMetaTitle("");
        setMetaDescription("");
        setFormError(null);
        setFormSuccess(null);
    }

    async function handleEdit(id: string) {
        const res = await fetch(`/api/admin/empowerments/${id}`, { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
            const item = data.item;
            setEditingId(id);
            setTitle(item.title);
            setShortDescription(item.shortDescription);
            setContent(item.content || "");
            setCoverImageUrl(item.coverImageUrl);
            setCoverImageAlt(item.coverImageAlt || "");
            setSelectedTagIds((item.tags || []).map((t: Tag) => t._id));
            setStatus(item.status);
            setSlug(item.slug);
            setMetaTitle(item.metaTitle || "");
            setMetaDescription(item.metaDescription || "");
            setView("edit");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this entry?")) return;
        const res = await fetch(`/api/admin/empowerments/${id}`, { method: "DELETE", credentials: "include" });
        if (res.ok) {
            await loadList();
        }
    }

    // LIST VIEW
    if (view === "list") {
        return (
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold">Empowerments</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setView("edit");
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--ngo-orange) text-white hover:opacity-90"
                    >
                        <Plus className="w-4 h-4" />
                        New Empowerment
                    </button>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 shadow space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search title..."
                                className="pl-8 pr-3 py-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as "" | "draft" | "published")}
                            className="px-3 py-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                        >
                            <option value="">All</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        <button onClick={() => { setPage(1); loadList(); }} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                            Apply
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b">
                                <tr className="text-gray-500">
                                    <th className="py-2 pr-3">Title</th>
                                    <th className="py-2 pr-3">Status</th>
                                    <th className="py-2 pr-3">Tags</th>
                                    <th className="py-2 pr-3">Slug</th>
                                    <th className="py-2 pr-3 w-28 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-gray-500">
                                            <Loader2 className="w-5 h-5 inline animate-spin mr-2" /> Loading...
                                        </td>
                                    </tr>
                                )}
                                {!loading && items.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-gray-500">
                                            No entries found
                                        </td>
                                    </tr>
                                )}
                                {items.map((it) => (
                                    <tr key={it._id} className="border-b last:border-b-0">
                                        <td className="py-2 pr-3">{it.title}</td>
                                        <td className="py-2 pr-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${it.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                                {it.status}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-3">
                                            <div className="flex flex-wrap gap-1">
                                                {(it.tags || []).map((t, i) => (
                                                    <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium text-[${t.color}]`} style={{ backgroundColor: t.color }}>
                                                        {t.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-2 pr-3">{it.slug}</td>
                                        <td className="py-2 pr-3">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(it._id)} className="p-2 rounded-md border hover:bg-gray-50" title="Edit">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(it._id)} className="p-2 rounded-md border hover:bg-red-50" title="Delete">
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-2 rounded-lg border disabled:opacity-50">
                                Prev
                            </button>
                            <span className="text-sm text-gray-500">
                                Page {page} / {pages}
                            </span>
                            <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-2 rounded-lg border disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // EDIT/CREATE VIEW
    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <button onClick={() => { resetForm(); setView("list"); }} className="mb-4 px-3 py-2 rounded-lg border hover:bg-gray-50">
                ← Back
            </button>
            <h1 className="text-2xl font-bold text-(--ngo-dark) mb-4">{editingId ? "Edit" : "Add"} Empowerment</h1>

            {formError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2">{formError}</div>}
            {formSuccess && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-700 px-3 py-2">{formSuccess}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white rounded-xl p-4 sm:p-6 shadow">
                    <h2 className="font-semibold text-lg mb-4">Basic Info</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title<span className="text-red-500"> *</span>
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                maxLength={160}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {title.length}/160
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder={autoSlug}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                            />
                            <p className="text-xs text-gray-400 mt-1">Auto from title; you may edit.</p>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description<span className="text-red-500"> *</span>
                            </label>
                            <textarea
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                required
                                maxLength={300}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none min-h-20"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {shortDescription.length}/300
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="bg-white rounded-xl p-4 sm:p-6 shadow">
                    <h2 className="font-semibold text-lg mb-4">Content</h2>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write content (Markdown supported)"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 min-h-55 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">You can paste Markdown. Rendering is handled on the public page.</p>
                </section>

                {/* Media */}
                <section className="bg-white rounded-xl p-4 sm:p-6 shadow">
                    <h2 className="font-semibold text-lg mb-4">Media</h2>
                    <ImageUpload onUpload={onUpload} currentImage={coverImageUrl} currentAlt={coverImageAlt} />
                </section>

                {/* Tags */}
                <section className="bg-white rounded-xl p-4 sm:p-6 shadow">
                    <div className="mb-4">
                        <h2 className="font-semibold text-lg mb-2">Tags</h2>
                        <p className="text-xs text-gray-500">Click to select/deselect. Delete button appears only for unused tags.</p>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b">
                        {tags.length === 0 && (
                            <div className="w-full py-6 text-center">
                                <div className="inline-block px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
                                    <span className="text-sm text-gray-500">No tags yet. Create one below.</span>
                                </div>
                            </div>
                        )}
                        {tags.map((t) => {
                            const active = selectedTagIds.includes(t._id);
                            const isUsed = items.some(item => item.tags?.some(tag => tag._id === t._id));
                            return (
                                <button
                                    key={t._id}
                                    type="button"
                                    onClick={() => toggleTag(t._id)}
                                    className="group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full text-sm font-bold transition-all duration-200 relative"
                                    style={{ 
                                        backgroundColor: active ? t.color : `${t.color}50`,
                                        border: `2px solid ${t.color}100}`,
                                        boxShadow: active ? `0 4px 12px ${t.color}30` : 'none',
                                        transform: active ? 'scale(1.02)' : 'scale(1)'
                                    }}
                                    title={active ? 'Click to deselect' : 'Click to select'}
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        <span>{t.name}</span>
                                    </div>
                                    
                                    {!isUsed && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTag(t._id);
                                            }}
                                            className="ml-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/30"
                                            title="Delete unused tag"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 items-end">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Tag Name</label>
                            <input
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="e.g. Education"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <div className="relative">
                                <div 
                                    className="w-full h-10 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-(--ngo-orange)"
                                    style={{ backgroundColor: newTagColor }}
                                    onClick={() => document.getElementById("tagColorPicker")?.click()}
                                />
                                <input 
                                    id="tagColorPicker"
                                    type="color" 
                                    value={newTagColor} 
                                    onChange={(e) => setNewTagColor(e.target.value)} 
                                    className="w-0 h-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{newTagColor}</p>
                        </div>
                        <div className="sm:col-span-3">
                            <button
                                type="button"
                                onClick={handleCreateTag}
                                disabled={creatingTag || !newTagName.trim()}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-(--ngo-orange) text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {creatingTag ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Create Tag
                            </button>
                        </div>
                    </div>
                </section>

                {/* SEO */}
                <section className="bg-white rounded-xl p-4 sm:p-6 shadow">
                    <h2 className="font-semibold text-lg mb-4">SEO</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                            <input
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}
                                maxLength={160}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                            <input
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                maxLength={200}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Publishing */}
                <section className="bg-white rounded-xl p-4 sm:p-6 shadow">
                    <h2 className="font-semibold text-lg mb-4">Publishing</h2>
                    <div className="grid sm:grid-cols-2 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-(--ngo-orange)/30 focus:border-(--ngo-orange) outline-none"
                            >
                                {statusOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">You will be asked to confirm before publishing.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--ngo-orange) text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Save
                            </button>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}
