"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff, Loader2, Heart, Users, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify");
        if (res.ok) {
          router.push("/admin/dashboard");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--ngo-cream]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[--ngo-orange]" />
          <p className="text-[--ngo-gray]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-[#fff8f5] via-white to-[#fef3f0]">
      {/* Left Side - Image & Branding (Hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <Image
          src="/p1.jpg"
          alt="Prayaas - Empowering through education"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          {/* Logo & Branding */}
          <div>
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <Image src="/logo.png" alt="Prayaas Logo" width={150} height={150} className="drop-shadow-2xl" />
            </Link>

          </div>

          {/* Main Message */}
          <div className="space-y-8">
            <div>
              <h1
                className="text-4xl xl:text-5xl font-bold leading-tight mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Empowering Lives,<br />
                <span className="text-[#fbbf24]">One Child at a Time</span>
              </h1>
              <p className="text-lg text-white/90 max-w-md leading-relaxed drop-shadow-md">
                Manage and monitor the impact of your initiatives. Together, we&apos;re building
                a brighter future through education.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Prayaas IIIT Allahabad. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile Header with gradient background */}
        <div className="lg:hidden relative overflow-hidden">
          {/* Mobile Background Pattern */}
          <Image
            src="/p1.jpg"
            alt="Prayaas - Empowering through education"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10 px-6 pt-8 pb-12 sm:px-8 sm:pt-10 sm:pb-16 text-center">
            <Link href="/" className="inline-block mb-4 transition-transform duration-300 hover:scale-105">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white rounded-2xl p-2 shadow-xl">
                <Image
                  src="/logo.png"
                  alt="Prayaas Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Prayaas
            </h2>
            <p className="text-white/90 text-sm sm:text-base">IIIT Allahabad</p>
          </div>

          {/* Curved bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-br from-[#fff8f5] via-white to-[#fef3f0] rounded-t-4xl" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-0">
          <div className="w-full max-w-sm sm:max-w-md">
            {/* Form Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-black/5 p-5 sm:p-8 lg:p-10 border border-gray-100/50">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-[#e85a4f] to-[#c94a40] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h1
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Welcome Back
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-[#e85a4f] focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 sm:py-3.5 pr-12 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:border-[#e85a4f] focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#e85a4f] to-[#c94a40] hover:from-[#d64a3f] hover:to-[#b93a30] text-white font-semibold py-3.5 sm:py-4 px-6 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Footer Note */}
              <p className="text-center text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6">
                Authorized personnel only. Contact admin for access.
              </p>
            </div>

            {/* Mobile Footer */}
            <p className="lg:hidden text-center text-gray-400 text-xs mt-6 sm:mt-8">
              © {new Date().getFullYear()} Prayaas IIIT Allahabad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
