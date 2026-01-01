import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Prayaas IIIT Allahabad",
    description: "Admin dashboard for managing Prayaas website content.",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}