import { Navbar } from "@/src/components/other/Navbar";
import { Footer } from "@/src/components/Footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-x-hidden w-full">
            <Navbar />
            <main className="w-full overflow-x-hidden">{children}</main>
            <Footer />
        </div>
    );
}
