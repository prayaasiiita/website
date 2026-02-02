"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Shield,
    AlertTriangle,
    Lock,
    UserX,
    Activity,
    Clock,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Loader2,
    CheckCircle,
    XCircle,
} from "lucide-react";

interface SecurityEvent {
    _id: string;
    action: string;
    resource?: string;
    adminId?: string;
    adminUsername?: string;
    ipAddress?: string;
    severity?: string;
    status?: string;
    errorMessage?: string;
    createdAt: string;
}

interface Stats {
    failedLogins: number;
    rateLimits: number;
    unauthorizedAttempts: number;
    successfulLogins: number;
}

interface SecurityData {
    events: SecurityEvent[];
    stats: Stats;
    severityDistribution: Record<string, number>;
    hourlyLogins: { _id: { hour: number; action: string }; count: number }[];
    period: string;
}

const ACTION_LABELS: Record<string, string> = {
    login: "Login Success",
    login_failed: "Login Failed",
    logout: "Logout",
    rate_limit_exceeded: "Rate Limit Hit",
    password_changed: "Password Changed",
    unauthorized_access: "Unauthorized Access",
    security_event: "Security Event",
};

const SEVERITY_COLORS: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
};

export default function SecurityDashboardPage() {
    const [data, setData] = useState<SecurityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState("24h");

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/security-events?period=${period}`);
            if (!res.ok) {
                if (res.status === 401) {
                    setError("Access denied. Insufficient permissions.");
                    return;
                }
                throw new Error("Failed to fetch security events");
            }
            const result = await res.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-7 h-7 text-orange-500" />
                        Security Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Monitor security events and system health
                    </p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Failed Logins"
                    value={data?.stats.failedLogins ?? 0}
                    icon={UserX}
                    color="red"
                    trend={(data?.stats.failedLogins ?? 0) > 5 ? "up" : "down"}
                />
                <StatCard
                    title="Rate Limits Hit"
                    value={data?.stats.rateLimits ?? 0}
                    icon={AlertTriangle}
                    color="yellow"
                    trend={(data?.stats.rateLimits ?? 0) > 0 ? "up" : "down"}
                />
                <StatCard
                    title="Unauthorized Attempts"
                    value={data?.stats.unauthorizedAttempts ?? 0}
                    icon={Lock}
                    color="orange"
                    trend={(data?.stats.unauthorizedAttempts ?? 0) > 0 ? "up" : "down"}
                />
                <StatCard
                    title="Successful Logins"
                    value={data?.stats.successfulLogins ?? 0}
                    icon={Activity}
                    color="green"
                />
            </div>

            {/* Severity Distribution */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">Severity Distribution</h2>
                <div className="flex gap-4">
                    {["info", "warning", "error"].map((severity) => (
                        <div
                            key={severity}
                            className="flex-1 text-center py-4 rounded-lg bg-gray-50"
                        >
                            <div
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${SEVERITY_COLORS[severity]}`}
                            >
                                {severity.charAt(0).toUpperCase() + severity.slice(1)}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {data?.severityDistribution[severity] || 0}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Security Events */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        Recent Security Events
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    IP Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Severity
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data?.events.slice(0, 20).map((event) => (
                                <tr key={event._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(event.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">
                                            {ACTION_LABELS[event.action] || event.action}
                                        </span>
                                        {event.resource && (
                                            <span className="text-gray-500 text-sm ml-2">
                                                ({event.resource})
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {event.adminUsername || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                        {event.ipAddress || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {event.status === "success" ? (
                                            <span className="inline-flex items-center gap-1 text-green-700">
                                                <CheckCircle className="w-4 h-4" /> Success
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-700">
                                                <XCircle className="w-4 h-4" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${SEVERITY_COLORS[event.severity || "info"]
                                                }`}
                                        >
                                            {event.severity || "info"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!data?.events || data.events.length === 0) && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        No security events in the selected period
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    color: "red" | "yellow" | "orange" | "green";
    trend?: "up" | "down";
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
    const colorClasses = {
        red: "bg-red-50 text-red-600 border-red-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        green: "bg-green-50 text-green-600 border-green-100",
    };

    const iconColors = {
        red: "text-red-500",
        yellow: "text-yellow-500",
        orange: "text-orange-500",
        green: "text-green-500",
    };

    return (
        <div className={`rounded-xl border p-6 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <Icon className={`w-8 h-8 ${iconColors[color]}`} />
                {trend && (
                    <div
                        className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-red-600" : "text-green-600"
                            }`}
                    >
                        {trend === "up" ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm opacity-80 mt-1">{title}</div>
            </div>
        </div>
    );
}
