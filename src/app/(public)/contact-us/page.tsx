import { Metadata } from "next";
import { getPageImages } from "@/src/lib/page-images";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Prayaas",
  description: "Get in touch with Prayaas IIITA. We'd love to hear from you about volunteering, donations, or partnerships.",
  openGraph: {
    title: "Contact Us | Prayaas",
    description: "Get in touch with Prayaas IIITA. We'd love to hear from you.",
    type: "website",
  },
};

export default async function ContactPage() {
  const images = await getPageImages("contact");

  return <ContactPageClient images={images} />;
}
