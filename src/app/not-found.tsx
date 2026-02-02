import Link from "next/link";
import { Navbar } from "@/src/components/other/Navbar";
import { Footer } from "@/src/components/Footer";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="overflow-x-hidden w-full">
            <Navbar />
            <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24">
                <h1
                    className="text-6xl sm:text-7xl md:text-8xl font-bold text-(--ngo-orange) mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    404
                </h1>
                <h2
                    className="text-2xl sm:text-3xl font-bold text-(--ngo-dark) mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Page Not Found
                </h2>
                <p className="text-(--ngo-gray) text-base sm:text-lg mb-8 text-center max-w-md">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="btn-primary flex items-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    Go to Home
                </Link>
            </main>
            <Footer />
        </div>
    );
}
