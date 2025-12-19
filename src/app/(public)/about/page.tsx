import { getPageImages } from "@/src/lib/page-images";
import AboutPageClient from "./AboutPageClient";

export const metadata = {
  title: "About Us | Prayaas IIIT Allahabad",
  description:
    "Learn about Prayaas, a student-run social initiative at IIIT Allahabad dedicated to empowering underprivileged children through education.",
};

export default async function AboutPage() {
  // Fetch all images for the about page (cached)
  const images = await getPageImages("about");

  return <AboutPageClient images={images} />;
}

