import { Metadata } from "next";
import { getPageImages } from "@/src/lib/page-images";
import GetInvolvedPageClient from "./GetInvolvedPageClient";

export const metadata: Metadata = {
  title: "Get Involved | Prayaas",
  description: "Join our cause! There are many ways you can contribute to making a difference in the lives of underprivileged children.",
  openGraph: {
    title: "Get Involved | Prayaas",
    description: "Join our cause and make a difference in the lives of underprivileged children.",
    type: "website",
  },
};

export default async function GetInvolvedPage() {
  const images = await getPageImages("get-involved");

  return <GetInvolvedPageClient images={images} />;
}
