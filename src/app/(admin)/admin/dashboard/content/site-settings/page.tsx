"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Save, Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SiteSettings {
    phone: string;
    phoneVisible: boolean;
    email: string;
    emailVisible: boolean;
    address: string;
    addressVisible: boolean;
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        phone: "",
        phoneVisible: true,
        email: "",
        emailVisible: true,
        address: "",
        addressVisible: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalSettings, setOriginalSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (originalSettings) {
            const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
            setHasChanges(changed);
        }
    }, [settings, originalSettings]);

    async function fetchSettings() {
        try {
            const res = await fetch("/api/admin/site-settings");
            if (res.ok) {
                const data = await res.json();
                if (data.settings) {
                    setSettings(data.settings);
                    setOriginalSettings(data.settings);
                }
            }
        } catch (err) {
            console.error("Failed to fetch settings:", err);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/site-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                const data = await res.json();
                setSettings(data.settings);
                setOriginalSettings(data.settings);
                setHasChanges(false);
                toast.success("Settings saved successfully! Changes will reflect on the website immediately.");
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to save settings");
            }
        } catch (err) {
            console.error("Failed to save settings:", err);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    }

    function handleChange(field: keyof SiteSettings, value: string | boolean) {
        setSettings(prev => ({ ...prev, [field]: value }));
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-(--ngo-orange) border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-(--ngo-gray)">Loading settings...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-(--ngo-dark) mb-2">
                        Site Settings
                    </h1>
                    <p className="text-(--ngo-gray)">
                        Manage contact information displayed on the website
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${hasChanges
                            ? "bg-(--ngo-orange) text-white hover:bg-(--ngo-orange-dark)"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {hasChanges && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800 text-sm">
                        You have unsaved changes. Click &quot;Save Changes&quot; to apply them.
                    </p>
                </div>
            )}

            <div className="space-y-6">
                {/* Phone Number */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--ngo-orange)/10 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-(--ngo-orange)" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-(--ngo-dark)">Phone Number</h3>
                                <p className="text-sm text-(--ngo-gray)">Contact phone displayed in Footer and Contact page</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange("phoneVisible", !settings.phoneVisible)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${settings.phoneVisible
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            {settings.phoneVisible ? (
                                <>
                                    <Eye className="w-4 h-4" />
                                    Visible
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    Hidden
                                </>
                            )}
                        </button>
                    </div>
                    <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                    />
                    {!settings.phoneVisible && (
                        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                            <EyeOff className="w-4 h-4" />
                            This phone number will not be displayed on the public website
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--ngo-green)/10 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-(--ngo-green)" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-(--ngo-dark)">Email Address</h3>
                                <p className="text-sm text-(--ngo-gray)">Contact email displayed in Footer and Contact page</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange("emailVisible", !settings.emailVisible)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${settings.emailVisible
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            {settings.emailVisible ? (
                                <>
                                    <Eye className="w-4 h-4" />
                                    Visible
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    Hidden
                                </>
                            )}
                        </button>
                    </div>
                    <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="prayaas@iiita.ac.in"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all"
                    />
                    {!settings.emailVisible && (
                        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                            <EyeOff className="w-4 h-4" />
                            This email will not be displayed on the public website
                        </p>
                    )}
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--ngo-yellow)/10 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-(--ngo-yellow)" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-(--ngo-dark)">Address</h3>
                                <p className="text-sm text-(--ngo-gray)">Physical address displayed in Footer and Contact page</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleChange("addressVisible", !settings.addressVisible)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${settings.addressVisible
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            {settings.addressVisible ? (
                                <>
                                    <Eye className="w-4 h-4" />
                                    Visible
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    Hidden
                                </>
                            )}
                        </button>
                    </div>
                    <textarea
                        value={settings.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="IIIT Allahabad, Jhalwa, Prayagraj, Uttar Pradesh 211015, India"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-orange) focus:ring-2 focus:ring-(--ngo-orange)/20 outline-none transition-all resize-none"
                    />
                    {!settings.addressVisible && (
                        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                            <EyeOff className="w-4 h-4" />
                            This address will not be displayed on the public website
                        </p>
                    )}
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-semibold text-(--ngo-dark) mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-(--ngo-green)" />
                        Preview (Visible to Public)
                    </h3>
                    <div className="space-y-3">
                        {settings.phoneVisible && settings.phone && (
                            <div className="flex items-center gap-2 text-(--ngo-gray)">
                                <Phone className="w-4 h-4 text-(--ngo-orange)" />
                                <span>{settings.phone}</span>
                            </div>
                        )}
                        {settings.emailVisible && settings.email && (
                            <div className="flex items-center gap-2 text-(--ngo-gray)">
                                <Mail className="w-4 h-4 text-(--ngo-green)" />
                                <span>{settings.email}</span>
                            </div>
                        )}
                        {settings.addressVisible && settings.address && (
                            <div className="flex items-center gap-2 text-(--ngo-gray)">
                                <MapPin className="w-4 h-4 text-(--ngo-yellow)" />
                                <span>{settings.address}</span>
                            </div>
                        )}
                        {!settings.phoneVisible && !settings.emailVisible && !settings.addressVisible && (
                            <p className="text-gray-400 italic">
                                No contact information is currently visible to the public.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
