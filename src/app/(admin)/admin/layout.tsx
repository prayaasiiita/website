import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Prayaas IIIT Allahabad",
    description: "Admin dashboard for managing Prayaas website content.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'none',
            'max-snippet': -1,
        },
    },
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}