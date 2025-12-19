import { getPageImages } from "@/src/lib/page-images";
import HomePageClient from "./HomePageClient";

export const metadata = {
  title: "Prayaas IIIT Allahabad | Empowering Lives Through Education",
  description:
    "Prayaas is a student-run social initiative at IIIT Allahabad dedicated to empowering underprivileged children through quality education and holistic development.",
};

export default async function Home() {
  // Fetch all images for the home page (cached)
  const images = await getPageImages("home");

  return <HomePageClient images={images} />;
}

