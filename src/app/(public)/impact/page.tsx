import { Metadata } from "next";
import { getPageImages } from "@/src/lib/page-images";
import ImpactPageClient from "./ImpactPageClient";

export const metadata: Metadata = {
  title: "Our Impact | Prayaas",
  description: "Every number tells a story. Explore the impact we've made in the lives of children and communities.",
  openGraph: {
    title: "Our Impact | Prayaas",
    description: "Every number tells a story. Explore the impact we've made in the lives of children and communities.",
    type: "website",
  },
};

export default async function ImpactPage() {
  const images = await getPageImages("impact");

  return <ImpactPageClient images={images} />;
}
