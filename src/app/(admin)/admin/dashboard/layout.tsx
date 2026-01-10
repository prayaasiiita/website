"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  FileText,
  Users,
  UsersRound,
  LogOut,
  Menu,
  X,
  Shield,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        if (!res.ok) {
          router.push("/admin");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin");
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-(--ngo-orange) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-(--ngo-gray)">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Team",
      href: "/admin/dashboard/team",
      icon: UsersRound,
    },
    {
      name: "Events",
      href: "/admin/dashboard/events",
      icon: Calendar,
    },
    {
      name: "Gallery",
      href: "/admin/dashboard/gallery",
      icon: ImageIcon,
    },
    {
      name: "Page Images",
      href: "/admin/dashboard/images",
      icon: ImageIcon,
    },
    {
      name: "Content",
      href: "/admin/dashboard/content",
      icon: FileText,
    },
    {
      name: "Empowerments",
      href: "/admin/dashboard/empowerments",
      icon: Sparkles,
    },
    {
      name: "Volunteers",
      href: "/admin/dashboard/volunteers",
      icon: Users,
    },
    {
      name: "Contacts",
      href: "/admin/dashboard/contacts",
      icon: MessageSquare,
    },
    {
      name: "Audit Logs",
      href: "/admin/dashboard/audit-logs",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-(--ngo-dark)">Prayaas Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-(--ngo-dark)">
            Prayaas Admin
          </h1>
          <p className="text-sm text-(--ngo-gray) mt-1">
            Welcome, {user?.username}
          </p>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-(--ngo-orange) text-white"
                    : "text-(--ngo-gray) hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="md:ml-64 min-h-screen pt-20 md:pt-0">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
