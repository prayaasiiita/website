import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prayaas IIIT Allahabad | Enabling Young Futures",
  description:
    "Prayaas is a student-led initiative of IIIT Allahabad supporting education, recreation, and life-skills for children in nearby communities.",
  metadataBase: new URL("https://prayaas.iiita.ac.in"),
  openGraph: {
    title: "Prayaas IIIT Allahabad",
    description:
      "Student-led initiative enabling young futures through education, recreation, and life-skills.",
    url: "https://prayaas.iiita.ac.in",
    siteName: "Prayaas IIIT Allahabad",
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
        className={`${manrope.variable} ${playfair.variable} antialiased bg-forest-25 text-forest-900`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
