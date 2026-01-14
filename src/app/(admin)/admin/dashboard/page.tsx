"use client";

import { useEffect, useState } from "react";
import { Calendar, Image as ImageIcon, FileText, Users, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    volunteers: 0,
    content: 0,
    empowerments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const endpoints = [
          { url: "/api/admin/events", key: "events", countKey: "events" },
          { url: "/api/admin/gallery", key: "gallery", countKey: "images" },
          { url: "/api/admin/volunteers", key: "volunteers", countKey: "volunteers" },
          { url: "/api/admin/content", key: "content", countKey: "content" },
          { url: "/api/admin/empowerments?limit=1000", key: "empowerments", countKey: "total" },
        ];

        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            try {
              const res = await fetch(endpoint.url);
              if (!res.ok) {
                console.error(`Failed to fetch ${endpoint.key}: ${res.status} ${res.statusText}`);
                return 0;
              }
              const text = await res.text();
              try {
                const data = JSON.parse(text);
                // Handle different response structures
                if (endpoint.key === "empowerments") {
                  return data.total || 0;
                }
                return data[endpoint.countKey]?.length || 0;
              } catch (e) {
                console.error(`Invalid JSON from ${endpoint.key}:`, text.substring(0, 100));
                return 0;
              }
            } catch (err) {
              console.error(`Error fetching ${endpoint.key}:`, err);
              return 0;
            }
          })
        );

        setStats({
          events: results[0],
          gallery: results[1],
          volunteers: results[2],
          content: results[3],
          empowerments: results[4],
        });
      } catch (err) {
        console.error("Failed to update stats:", err);
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
    {
      title: "Empowerments",
      count: stats.empowerments,
      icon: Sparkles,
      color: "#ec4899",
      href: "/admin/dashboard/empowerments",
    },
    {
      title: "Audit Logs",
      count: "🔒",
      icon: Shield,
      color: "#ef4444",
      href: "/admin/dashboard/audit-logs",
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-(--ngo-dark) mb-2">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-(--ngo-gray)">
          Manage your Prayaas website content
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 animate-pulse"
            >
              <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-lg md:rounded-xl mb-3 md:mb-4" />
              <div className="h-6 md:h-8 w-16 md:w-20 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 md:w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-all group touch-manipulation"
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: card.color }} />
              </div>
              <div
                className="text-2xl md:text-3xl font-bold mb-1 md:mb-2"
                style={{ color: card.color }}
              >
                {typeof card.count === 'number' ? card.count : card.count}
              </div>
              <div className="text-xs md:text-sm text-(--ngo-gray) font-medium">
                {card.title}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 md:mt-12 bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-(--ngo-dark) mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Link
            href="/admin/dashboard/events"
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-(--ngo-orange) hover:bg-(--ngo-orange)/5 transition-all touch-manipulation"
          >
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-(--ngo-orange) flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-(--ngo-dark)">
                Manage Events
              </h3>
              <p className="text-xs md:text-sm text-(--ngo-gray) truncate">
                Add or edit events
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/gallery"
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-(--ngo-green) hover:bg-(--ngo-green)/5 transition-all touch-manipulation"
          >
            <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-(--ngo-green) flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-(--ngo-dark)">
                Update Gallery
              </h3>
              <p className="text-xs md:text-sm text-(--ngo-gray) truncate">
                Add new photos
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/content"
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-(--ngo-yellow) hover:bg-(--ngo-yellow)/5 transition-all touch-manipulation"
          >
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-(--ngo-yellow) flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-(--ngo-dark)">
                Edit Website Content
              </h3>
              <p className="text-xs md:text-sm text-(--ngo-gray) truncate">
                Update text and info
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/volunteers"
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-500/5 transition-all touch-manipulation"
          >
            <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-500 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-(--ngo-dark)">
                View Volunteers
              </h3>
              <p className="text-xs md:text-sm text-(--ngo-gray) truncate">
                Manage applications
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/audit-logs"
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-500/5 transition-all touch-manipulation"
          >
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-red-500 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-medium text-sm md:text-base text-(--ngo-dark)">
                Security Audit Logs
              </h3>
              <p className="text-xs md:text-sm text-(--ngo-gray) truncate">
                Monitor admin activities
              </p>
            </div>
          </Link>
          <Link
            href="/admin/dashboard/empowerments"
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-pink-500 hover:bg-pink-500/5 transition-all touch-manipulation"
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-pink-500 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base text-(--ngo-dark)">
                Manage Empowerments
              </h3>
              <p className="text-xs md:text-sm text-(--ngo-gray) truncate">
                Create and publish stories
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
