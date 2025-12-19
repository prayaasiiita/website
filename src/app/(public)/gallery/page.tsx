import { Metadata } from "next";
import { getPageImages } from "@/src/lib/page-images";
import GalleryPageClient from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery | Prayaas",
  description: "A visual journey through our activities, events, and the smiles we create every day at Prayaas.",
  openGraph: {
    title: "Gallery | Prayaas",
    description: "A visual journey through our activities, events, and the smiles we create every day.",
    type: "website",
  },
};

export default async function GalleryPage() {
  const images = await getPageImages("gallery");

  return <GalleryPageClient images={images} />;
}
