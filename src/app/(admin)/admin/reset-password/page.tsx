"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        // Validation
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            setError("Password must contain at least one letter and one number");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to reset password");
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin");
            }, 3000);
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#fff8f5] via-white to-[#fef3f0] p-4">
                <div className="max-w-105 w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been reset successfully. Redirecting to login...
                        </p>
                        <div className="flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-[#e85a4f]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#fff8f5] via-white to-[#fef3f0] px-4 py-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

            <div className="max-w-md mx-auto min-h-[calc(100vh-4rem)] flex items-center justify-center relative z-10">
                <div className="w-full">
                    {/* Logo */}
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-block group">
                            <div className="w-20 h-20 mx-auto bg-white rounded-2xl p-2 shadow-lg mb-3 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="Prayaas Logo"
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </Link>
                        <h2 className="text-xl font-semibold text-gray-800">Prayaas Admin</h2>
                    </div>

                    {/* Card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="w-16 h-16 bg-linear-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Lock className="w-8 h-8 text-[#e85a4f]" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Create New Password
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Choose a strong password to secure your account
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 sm:py-3.5 pr-12 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-[#e85a4f] focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                        placeholder="Enter new password"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-blue-600 mt-0.5">ℹ️</div>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        <strong>Password requirements:</strong><br />
                                        • Minimum 8 characters<br />
                                        • At least one letter<br />
                                        • At least one number
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-[#e85a4f] focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                        placeholder="Confirm new password"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>{error}</div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full bg-linear-to-r from-[#e85a4f] to-[#c94a40] hover:from-[#d64a3f] hover:to-[#b93a30] text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Reset Password
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/admin"
                                className="text-gray-600 hover:text-[#e85a4f] font-medium transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-400 text-xs mt-6">
                        © {new Date().getFullYear()} Prayaas IIIT Allahabad
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#fff8f5] via-white to-[#fef3f0]">
                <Loader2 className="w-10 h-10 animate-spin text-[#e85a4f]" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
