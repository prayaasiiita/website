"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  type: "upcoming" | "completed";
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    type: "upcoming" as "upcoming" | "completed",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(event?: Event) {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        image: event.image,
        date: new Date(event.date).toISOString().split("T")[0],
        type: event.type,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        date: "",
        type: "upcoming",
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const url = editingEvent
        ? `/api/admin/events/${editingEvent._id}`
        : "/api/admin/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchEvents();
      }
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--ngo-dark) mb-2">
            Events Management
          </h1>
          <p className="text-(--ngo-gray)">
            Add and manage upcoming and completed events
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-(--ngo-orange) text-white px-6 py-3 rounded-xl font-semibold hover:bg-(--ngo-orange-dark) transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-(--ngo-orange) border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${event.type === "upcoming"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {event.type}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-(--ngo-gray) mb-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-bold text-(--ngo-dark) mb-2">
                  {event.title}
                </h3>
                <p className="text-(--ngo-gray) text-sm line-clamp-2 mb-4">
                  {event.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
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
          <div className="bg-white rounded-2xl p-8 max-w-lg! w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-(--ngo-dark) mb-6">
              {editingEvent ? "Edit Event" : "Add New Event"}
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--ngo-dark) mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none resize-none"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--ngo-dark) mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--ngo-dark) mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "upcoming" | "completed",
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
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
                  className="flex-1 px-6 py-3 rounded-xl bg-(--ngo-orange) text-white font-semibold hover:bg-(--ngo-orange-dark) transition-all"
                >
                  {editingEvent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
