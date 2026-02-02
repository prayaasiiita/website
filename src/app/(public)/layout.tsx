import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { PUBLIC_ISR_SECONDS } from "@/src/lib/cache-config";

export const revalidate = PUBLIC_ISR_SECONDS; // ISR window (env-driven)

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-clip w-full">
      <Navbar />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
