"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to send reset email");
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f5] via-white to-[#fef3f0] p-4">
                <div className="max-w-[420px] w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                        <p className="text-gray-600 mb-6">
                            We&apos;ve sent a password reset link to <strong>{email}</strong>.
                            The link will expire in 1 hour.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push("/admin")}
                                className="w-full bg-gradient-to-r from-[#e85a4f] to-[#c94a40] hover:from-[#d64a3f] hover:to-[#b93a30] text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                            >
                                Back to Login
                            </button>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
                            >
                                Send Another Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff8f5] via-white to-[#fef3f0] px-4 py-8 relative overflow-hidden">
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
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Mail className="w-8 h-8 text-[#e85a4f]" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Forgot Password?
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                No worries! Enter your email and we&apos;ll send you reset instructions.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-[#e85a4f] focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="admin@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#e85a4f] to-[#c94a40] hover:from-[#d64a3f] hover:to-[#b93a30] text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e85a4f] font-medium transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
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
