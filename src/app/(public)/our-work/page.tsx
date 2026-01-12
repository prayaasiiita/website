import { Metadata } from "next";
import { getPageImages } from "@/src/lib/page-images";
import OurWorkPageClient from "./OurWorkPageClient";

export const metadata: Metadata = {
  title: "Our Programs | Prayaas",
  description: "Comprehensive programs designed to nurture every aspect of a child's development - Education, Recreation, Life Skills, and Community Service.",
  openGraph: {
    title: "Our Programs | Prayaas",
    description: "Comprehensive programs designed to nurture every aspect of a child's development.",
    type: "website",
  },
};

export default async function ProgramsPage() {
  const images = await getPageImages("programs");

  return <OurWorkPageClient images={images} />;
}