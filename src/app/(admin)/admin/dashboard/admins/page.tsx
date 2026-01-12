"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Users,
    Shield,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    ChevronDown,
    AlertCircle,
    Loader2,
    RefreshCw,
} from "lucide-react";

type AdminRole = "super_admin" | "coordinator" | "treasurer" | "admin";
type Permission = string;

interface Admin {
    _id: string;
    username: string;
    email: string;
    role: AdminRole;
    permissions: Permission[];
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

interface AdminFormData {
    username: string;
    email: string;
    password: string;
    role: AdminRole;
    permissions: Permission[];
    isActive: boolean;
}

const ROLE_COLORS: Record<AdminRole, string> = {
    super_admin: "bg-purple-100 text-purple-800 border-purple-200",
    coordinator: "bg-blue-100 text-blue-800 border-blue-200",
    treasurer: "bg-green-100 text-green-800 border-green-200",
    admin: "bg-gray-100 text-gray-800 border-gray-200",
};

const ROLE_LABELS: Record<AdminRole, string> = {
    super_admin: "Super Admin",
    coordinator: "Coordinator",
    treasurer: "Treasurer",
    admin: "Admin",
};

const ALL_PERMISSIONS: Permission[] = [
    "manage_admins",
    "manage_roles",
    "manage_events",
    "manage_volunteers",
    "manage_team",
    "manage_content",
    "manage_empowerments",
    "manage_tags",
    "manage_contacts",
    "manage_settings",
    "manage_page_images",
    "view_audit_logs",
    "manage_uploads",
];

const PERMISSION_LABELS: Record<string, string> = {
    manage_admins: "Manage Admins",
    manage_roles: "Manage Roles",
    manage_events: "Manage Events",
    manage_volunteers: "Manage Volunteers",
    manage_team: "Manage Team",
    manage_content: "Manage Content",
    manage_empowerments: "Manage Empowerments",
    manage_tags: "Manage Tags",
    manage_contacts: "Manage Contacts",
    manage_settings: "Manage Settings",
    manage_page_images: "Manage Page Images",
    view_audit_logs: "View Audit Logs",
    manage_uploads: "Manage Uploads",
};

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [formData, setFormData] = useState<AdminFormData>({
        username: "",
        email: "",
        password: "",
        role: "admin",
        permissions: [],
        isActive: true,
    });
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [defaultPermissions, setDefaultPermissions] = useState<Record<AdminRole, Permission[]>>({} as Record<AdminRole, Permission[]>);

    const fetchAdmins = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/admins");
            if (!res.ok) {
                if (res.status === 403) {
                    setError("Access denied. Super Admin privileges required.");
                    return;
                }
                throw new Error("Failed to fetch admins");
            }
            const data = await res.json();
            setAdmins(data.admins || []);
            setDefaultPermissions(data.defaultPermissions || {});
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleRoleChange = (role: AdminRole) => {
        setFormData({
            ...formData,
            role,
            permissions: defaultPermissions[role] || [],
        });
    };

    const handlePermissionToggle = (permission: Permission) => {
        const newPermissions = formData.permissions.includes(permission)
            ? formData.permissions.filter((p) => p !== permission)
            : [...formData.permissions, permission];
        setFormData({ ...formData, permissions: newPermissions });
    };

    const openCreateModal = () => {
        setEditingAdmin(null);
        setFormData({
            username: "",
            email: "",
            password: "",
            role: "admin",
            permissions: defaultPermissions.admin || [],
            isActive: true,
        });
        setShowModal(true);
    };

    const openEditModal = (admin: Admin) => {
        setEditingAdmin(admin);
        setFormData({
            username: admin.username,
            email: admin.email,
            password: "",
            role: admin.role,
            permissions: admin.permissions,
            isActive: admin.isActive,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingAdmin
                ? `/api/admin/admins/${editingAdmin._id}`
                : "/api/admin/admins";
            const method = editingAdmin ? "PUT" : "POST";

            const body = editingAdmin
                ? {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                    permissions: formData.permissions,
                    isActive: formData.isActive,
                    ...(formData.password && { password: formData.password }),
                }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save admin");
            }

            setShowModal(false);
            fetchAdmins();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/admins/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete admin");
            }

            setDeleteConfirm(null);
            fetchAdmins();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error === "Access denied. Super Admin privileges required.") {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
                <p className="text-red-600">
                    Only Super Admins can access this page.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-7 h-7 text-orange-500" />
                        Admin Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage admin users and their permissions
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchAdmins}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Admin
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {error && error !== "Access denied. Super Admin privileges required." && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-500 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Admins Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Last Login
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {admins.map((admin) => (
                            <tr key={admin._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {admin.username}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {admin.email}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full border ${ROLE_COLORS[admin.role]
                                            }`}
                                    >
                                        {ROLE_LABELS[admin.role]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {admin.isActive ? (
                                        <span className="inline-flex items-center gap-1 text-green-700">
                                            <Check className="w-4 h-4" /> Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-700">
                                            <X className="w-4 h-4" /> Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {admin.lastLogin
                                        ? new Date(admin.lastLogin).toLocaleDateString()
                                        : "Never"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(admin)}
                                            className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {deleteConfirm === admin._id ? (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleDelete(admin._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(admin._id)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingAdmin ? "Edit Admin" : "Create Admin"}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {editingAdmin && "(leave blank to keep current)"}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    {...(!editingAdmin && { required: true, minLength: 8 })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.role}
                                        onChange={(e) =>
                                            handleRoleChange(e.target.value as AdminRole)
                                        }
                                        className="w-full px-3 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="coordinator">Coordinator</option>
                                        <option value="treasurer">Treasurer</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Active
                                    </span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Permissions
                                </label>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                                    {ALL_PERMISSIONS.map((permission) => (
                                        <label
                                            key={permission}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.includes(permission)}
                                                onChange={() => handlePermissionToggle(permission)}
                                                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                                disabled={formData.role === "super_admin"}
                                            />
                                            <span className="text-gray-700">
                                                {PERMISSION_LABELS[permission] || permission}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {formData.role === "super_admin" && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Super Admin has all permissions by default.
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingAdmin ? "Save Changes" : "Create Admin"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
