import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { PUBLIC_ISR_SECONDS } from "@/src/lib/cache-config";

export const revalidate = PUBLIC_ISR_SECONDS; // ISR window (env-driven)
export const dynamic = "force-static";
export const fetchCache = "force-cache";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
