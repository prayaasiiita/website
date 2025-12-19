import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../layout";
import ErrorReporter from "@/src/components/ErrorReporter";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Prayaas IIIT Allahabad - Empowering Through Education",
    description: "Prayaas is a student-run initiative at IIIT Allahabad dedicated to making quality education accessible to underprivileged children and creating lasting positive change.",
    keywords: ["Prayaas", "IIIT Allahabad", "NGO", "Education", "Volunteer", "Social Initiative"],
    openGraph: {
        title: "Prayaas IIIT Allahabad - Empowering Through Education",
        description: "A student-run initiative dedicated to making quality education accessible to underprivileged children.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ErrorReporter />
                <main>{children}</main>
            </body>
        </html>
    );
}