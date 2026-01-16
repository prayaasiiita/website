"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Image as ImageIcon,
  FileText,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  Activity,
  Clock,
  RefreshCw,
  User
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";

// --- Types ---
interface DashboardStats {
  events: number;
  gallery: number;
  volunteers: number;
  content: number;
  empowerments: number;
}

interface AuditLog {
  _id: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  status: string;
}

// --- Components ---

function DashboardHeader({ adminName = "Admin" }: { adminName?: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-[--ngo-dark] mb-2"
        >
          {greeting}, <span className="text-[--ngo-orange]">{adminName}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[--ngo-gray]"
        >
          Here&apos;s what&apos;s happening across the Prayaas platform today.
        </motion.p>
      </div>
      <div className="flex items-center gap-2 text-sm text-[--ngo-gray] bg-white px-4 py-2 rounded-full border border-gray-200 shadow-xs">
        <Calendar className="w-4 h-4" />
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}

function StatCard({ title, count, icon: Icon, color, href, delay }: { title: string, count: number | string, icon: React.ElementType, color: string, href: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        href={href}
        className="block group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-current opacity-[0.03] group-hover:scale-110 transition-transform duration-500" style={{ color }} />

        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gray-50 group-hover:scale-110 transition-transform duration-300`} style={{ backgroundColor: `${color}10` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-[--ngo-dark] mb-1 group-hover:translate-x-1 transition-transform">{count}</h3>
          <p className="text-[--ngo-gray] font-medium text-sm flex items-center gap-1">
            {title}
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function RecentActivity({ logs, loading }: { logs: AuditLog[], loading: boolean }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-[--ngo-dark] mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[--ngo-orange]" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
        <h3 className="text-lg font-bold text-[--ngo-dark] mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[--ngo-orange]" />
          Recent Activity
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-12 h-12 text-gray-200 mb-2" />
          <p className="text-[--ngo-gray]">No recent activity found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[--ngo-dark] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[--ngo-orange]" />
          Recent Activity
        </h3>
        <Link href="/admin/dashboard/audit-logs" className="text-sm text-[--ngo-orange] hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {logs.map((log) => (
          <div key={log._id} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-100 last:border-0">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ring-4 ring-white"
              style={{ backgroundColor: getActionColor(log.action) }}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm text-[--ngo-dark] font-medium">
                <span className="text-gray-600">{log.adminName || 'System'}</span> {formatAction(log.action)} <span className="text-[--ngo-orange]">{log.resource}</span>
              </p>
              {log.details && (
                <p className="text-xs text-gray-500 truncate max-w-[250px]">{log.details}</p>
              )}
              <span className="text-[10px] text-gray-400 capitalize flex items-center gap-2 mt-1">
                {formatTimeAgo(new Date(log.timestamp))}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {log.status}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions
function getActionColor(action: string) {
  if (action.includes('create') || action.includes('add')) return '#22c55e'; // green
  if (action.includes('update') || action.includes('edit')) return '#eab308'; // yellow
  if (action.includes('delete') || action.includes('remove')) return '#ef4444'; // red
  return '#3b82f6'; // blue
}

function formatAction(action: string) {
  return action.replace(/_/g, ' ').toLowerCase();
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

// --- Main Page Component ---

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    events: 0,
    gallery: 0,
    volunteers: 0,
    content: 0,
    empowerments: 0,
  });
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchDashboardData() {
    try {
      const endpoints = [
        { url: "/api/admin/events", key: "events", countKey: "events" },
        { url: "/api/admin/gallery", key: "gallery", countKey: "all" }, // Gallery count key issue? Check gallery API. Assuming "all" from previous `counts` object
        { url: "/api/admin/volunteers", key: "volunteers", countKey: "volunteers" },
        { url: "/api/admin/content", key: "content", countKey: "content" },
        { url: "/api/admin/empowerments?limit=1", key: "empowerments", countKey: "total" },
        { url: "/api/admin/audit-logs?limit=5", key: "logs", countKey: "logs" },
      ];

      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const res = await fetch(endpoint.url);
            if (!res.ok) return endpoint.key === 'logs' ? [] : 0;
            const data = await res.json();

            if (endpoint.key === 'logs') return data.logs || [];
            if (endpoint.key === 'gallery') return data.counts?.all || 0; // Check gallery API response structure
            if (endpoint.key === 'empowerments') return data.total || 0;

            return data[endpoint.countKey]?.length || 0;
          } catch {
            return endpoint.key === 'logs' ? [] : 0;
          }
        })
      );

      setStats({
        events: results[0] as number,
        gallery: results[1] as number,
        volunteers: results[2] as number,
        content: results[3] as number,
        empowerments: results[4] as number,
      });
      setLogs(results[5] as AuditLog[]);

    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const quickActions = [
    {
      title: "Manage Events",
      desc: "Add upcoming events",
      icon: Calendar,
      color: "var(--ngo-orange)",
      href: "/admin/dashboard/events"
    },
    {
      title: "Update Gallery",
      desc: "Upload photos & albums",
      icon: ImageIcon,
      color: "var(--ngo-green)",
      href: "/admin/dashboard/gallery"
    },
    {
      title: "Manage Team",
      desc: "Edit faculty & students",
      icon: Users,
      color: "#3b82f6", // blue-500
      href: "/admin/dashboard/team"
    },
    {
      title: "Website Content",
      desc: "Edit pages text & info",
      icon: FileText,
      color: "var(--ngo-yellow)",
      href: "/admin/dashboard/content"
    },
    {
      title: "Empowerments",
      desc: "Share success stories",
      icon: Sparkles,
      color: "#ec4899", // pink-500
      href: "/admin/dashboard/empowerments"
    },
    {
      title: "Volunteers",
      desc: "View applications",
      icon: User,
      color: "#8b5cf6", // violet-500
      href: "/admin/dashboard/volunteers"
    },
    {
      title: "Site Settings",
      desc: "Contact info & address",
      icon: RefreshCw, // Using RefreshCw as a generic settings icon or change to Settings if available
      color: "#6b7280", // gray-500
      href: "/admin/dashboard/content/site-settings"
    },
    {
      title: "Security & Logs",
      desc: "Audit logs & alerts",
      icon: Shield,
      color: "#ef4444", // red-500
      href: "/admin/dashboard/audit-logs"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <DashboardHeader />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Events" count={loading ? "..." : stats.events} icon={Calendar} color="var(--ngo-orange)" href="/admin/dashboard/events" delay={0.1} />
        <StatCard title="Photo Albums" count={loading ? "..." : stats.gallery} icon={ImageIcon} color="var(--ngo-green)" href="/admin/dashboard/gallery" delay={0.2} />
        <StatCard title="Stories" count={loading ? "..." : stats.empowerments} icon={Sparkles} color="#ec4899" href="/admin/dashboard/empowerments" delay={0.3} />
        <StatCard title="Volunteers" count={loading ? "..." : stats.volunteers} icon={Users} color="#8b5cf6" href="/admin/dashboard/volunteers" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & More */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[--ngo-dark]">Quick Actions</h2>
              <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="p-2.5 rounded-lg bg-white shadow-xs group-hover:scale-110 transition-transform duration-300" style={{ color: action.color }}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[--ngo-dark] text-sm group-hover:text-[--ngo-orange] transition-colors">{action.title}</h3>
                    <p className="text-xs text-[--ngo-gray] mt-0.5">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Secondary Stats / Info (Optional - using Audit Logs count here?) */}
          {/* For now, just keeping Quick Actions dominant */}
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="h-full"
          >
            <RecentActivity logs={logs} loading={loading} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
