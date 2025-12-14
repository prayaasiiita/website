"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";

interface GalleryImage {
  _id: string;
  title: string;
  image: string;
  alt: string;
  order: number;
}

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    alt: "",
    order: 0,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(image?: GalleryImage) {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title,
        image: image.image,
        alt: image.alt,
        order: image.order,
      });
    } else {
      setEditingImage(null);
      setFormData({
        title: "",
        image: "",
        alt: "",
        order: 0,
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const url = editingImage
        ? `/api/admin/gallery/${editingImage._id}`
        : "/api/admin/gallery";
      const method = editingImage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchImages();
      }
    } catch (err) {
      console.error("Failed to save image:", err);
    }
  }

  async function deleteImage(id: string) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchImages();
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--ngo-dark) mb-2">
            Gallery Management
          </h1>
          <p className="text-(--ngo-gray)">
            Manage website gallery images
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-(--ngo-green) text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Image
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-(--ngo-green) border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="relative h-48">
                <Image
                  src={img.image}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-(--ngo-dark) mb-1 truncate">
                  {img.title}
                </h3>
                <p className="text-sm text-(--ngo-gray) mb-3 truncate">
                  {img.alt}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(img)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteImage(img._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-(--ngo-dark) mb-6">
              {editingImage ? "Edit Image" : "Add New Image"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--ngo-dark) mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--ngo-dark) mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--ngo-dark) mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) =>
                    setFormData({ ...formData, alt: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--ngo-dark) mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-green) focus:ring-2 focus:ring-(--ngo-green)/20 outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-(--ngo-gray) font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-(--ngo-green) text-white font-semibold hover:opacity-90 transition-all"
                >
                  {editingImage ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
