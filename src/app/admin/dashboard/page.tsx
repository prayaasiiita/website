"use client";

import { useEffect, useState } from "react";
import { Calendar, Image as ImageIcon, FileText, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    volunteers: 0,
    content: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [eventsRes, galleryRes, volunteersRes, contentRes] =
          await Promise.all([
            fetch("/api/admin/events"),
            fetch("/api/admin/gallery"),
            fetch("/api/admin/volunteers"),
            fetch("/api/admin/content"),
          ]);

        const [events, gallery, volunteers, content] = await Promise.all([
          eventsRes.json(),
          galleryRes.json(),
          volunteersRes.json(),
          contentRes.json(),
        ]);

        setStats({
          events: events.events?.length || 0,
          gallery: gallery.images?.length || 0,
          volunteers: volunteers.volunteers?.length || 0,
          content: content.content?.length || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Events",
      count: stats.events,
      icon: Calendar,
      color: "var(--ngo-orange)",
      href: "/admin/dashboard/events",
    },
    {
      title: "Gallery",
      count: stats.gallery,
      icon: ImageIcon,
      color: "var(--ngo-green)",
      href: "/admin/dashboard/gallery",
    },
    {
      title: "Content Items",
      count: stats.content,
      icon: FileText,
      color: "var(--ngo-yellow)",
      href: "/admin/dashboard/content",
    },
    {
      title: "Volunteers",
      count: stats.volunteers,
      icon: Users,
      color: "#8b5cf6",
      href: "/admin/dashboard/volunteers",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--ngo-dark) mb-2">
          Dashboard
        </h1>
        <p className="text-(--ngo-gray)">
          Manage your Prayaas website content
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
            >
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-8 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: card.color }}
              >
                {card.count}
              </div>
              <div className="text-(--ngo-gray) font-medium">
                {card.title}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-(--ngo-dark) mb-4">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/admin/dashboard/events"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-(--ngo-orange) hover:bg-(--ngo-orange)/5 transition-all"
          >
            <Calendar className="w-8 h-8 text-(--ngo-orange)" />
            <div>
              <h3 className="font-semibold text-(--ngo-dark)">
                Manage Events
              </h3>
              <p className="text-sm text-(--ngo-gray)">
                Add or edit events
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/gallery"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-(--ngo-green) hover:bg-(--ngo-green)/5 transition-all"
          >
            <ImageIcon className="w-8 h-8 text-(--ngo-green)" />
            <div>
              <h3 className="font-semibold text-(--ngo-dark)">
                Update Gallery
              </h3>
              <p className="text-sm text-(--ngo-gray)">
                Add new photos
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/content"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-(--ngo-yellow) hover:bg-(--ngo-yellow)/5 transition-all"
          >
            <FileText className="w-8 h-8 text-(--ngo-yellow)" />
            <div>
              <h3 className="font-semibold text-(--ngo-dark)">
                Edit Website Content
              </h3>
              <p className="text-sm text-(--ngo-gray)">
                Update text and info
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/volunteers"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-500/5 transition-all"
          >
            <Users className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="font-semibold text-(--ngo-dark)">
                View Volunteers
              </h3>
              <p className="text-sm text-(--ngo-gray)">
                Manage applications
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
