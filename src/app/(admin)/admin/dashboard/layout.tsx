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
  UserCog,
  ShieldAlert,
  ChevronDown,
  Settings,
} from "lucide-react";

interface User {
  username?: string;
  role?: string;
  permissions?: string[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

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

  const isSuperAdmin = user?.role === "super_admin";

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
      children: [
        {
          name: "Site Settings",
          href: "/admin/dashboard/content/site-settings",
          icon: Settings,
        },
      ],
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

  // Super Admin only nav items
  const superAdminNavItems = [
    {
      name: "Manage Admins",
      href: "/admin/dashboard/admins",
      icon: UserCog,
    },
    {
      name: "Security",
      href: "/admin/dashboard/security",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Fixed at top */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 safe-area-inset">
        <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
          <h1 className="text-lg font-bold text-(--ngo-dark) truncate">Prayaas Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors touch-manipulation"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 bg-white border-r border-gray-200 w-64 transition-transform duration-300 ease-in-out z-40 
          top-[56px] h-[calc(100vh-56px)] md:top-0 md:h-full
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden md:block p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-(--ngo-dark)">
            Prayaas Admin
          </h1>
          <p className="text-sm text-(--ngo-gray) mt-1 flex flex-wrap items-center gap-1">
            <span className="truncate max-w-[140px]">Welcome, {user?.username}</span>
            {isSuperAdmin && (
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
                Super Admin
              </span>
            )}
          </p>
        </div>
        {/* Mobile User Info - Shown only on Mobile */}
        <div className="md:hidden p-4 border-b border-gray-200 bg-gray-50">
          <p className="text-sm text-(--ngo-gray) flex flex-wrap items-center gap-2">
            <span className="truncate max-w-[160px]">Welcome, {user?.username}</span>
            {isSuperAdmin && (
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
                Super Admin
              </span>
            )}
          </p>
        </div>

        <nav className="p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.name);

            const toggleExpand = (e: React.MouseEvent) => {
              e.preventDefault();
              setExpandedMenus(prev =>
                prev.includes(item.name)
                  ? prev.filter(n => n !== item.name)
                  : [...prev, item.name]
              );
            };

            return (
              <div key={item.href}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={toggleExpand}
                      className={`w-full flex items-center justify-between gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all touch-manipulation ${isActive
                        ? "bg-(--ngo-orange) text-white shadow-sm"
                        : "text-(--ngo-gray) hover:bg-gray-100 active:bg-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm md:text-base">{item.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all touch-manipulation text-sm ${isChildActive
                                ? "bg-(--ngo-orange) text-white shadow-sm"
                                : "text-(--ngo-gray) hover:bg-gray-100 active:bg-gray-200"
                                }`}
                            >
                              <child.icon className="w-4 h-4 flex-shrink-0" />
                              <span className="font-medium">{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all touch-manipulation ${isActive
                      ? "bg-(--ngo-orange) text-white shadow-sm"
                      : "text-(--ngo-gray) hover:bg-gray-100 active:bg-gray-200"
                      }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">{item.name}</span>
                  </Link>
                )}
              </div>
            );
          })}

          {/* Super Admin Section */}
          {isSuperAdmin && (
            <>
              <div className="pt-4 pb-2">
                <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Super Admin
                </div>
              </div>
              {superAdminNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all touch-manipulation ${isActive
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-purple-700 hover:bg-purple-50 active:bg-purple-100"
                      }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm md:text-base">{item.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-all w-full touch-manipulation"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pt-[56px] md:pt-0">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

