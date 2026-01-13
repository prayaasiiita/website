import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorReporter from "@/src/components/ErrorReporter";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Prayaas",
    description: "Prayaas is a student-run initiative at IIIT Allahabad dedicated to making quality education accessible to underprivileged children and creating lasting positive change.",
    keywords: [
        "Prayaas",
        "IIIT Allahabad",
        "NGO",
        "Education",
        "Volunteer",
        "Social Initiative",
    ],
    openGraph: {
        title: "Prayaas",
        description: "A student-run initiative dedicated to making quality education accessible to underprivileged children.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ErrorReporter />
                <Toaster richColors position="top-center" />
                {children}
            </body>
        </html>
    );
}
