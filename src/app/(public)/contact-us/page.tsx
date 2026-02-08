import { Metadata } from "next";
import { getPageImages } from "@/src/lib/page-images";
import dbConnect from "@/src/lib/mongodb";
import SiteSettings from "@/src/models/SiteSettings";
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

async function getSiteSettings() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      const created = await SiteSettings.create({});
      settings = created.toObject();
    }
    return {
      phone: settings.phoneVisible ? settings.phone : null,
      phoneVisible: settings.phoneVisible,
      email: settings.emailVisible ? settings.email : null,
      emailVisible: settings.emailVisible,
      address: settings.addressVisible ? settings.address : null,
      addressVisible: settings.addressVisible,
    };
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return null;
  }
}

export default async function ContactPage() {
  const [images, siteSettings] = await Promise.all([
    getPageImages("contact"),
    getSiteSettings(),
  ]);

  return <ContactPageClient images={images} siteSettings={siteSettings} />;
}

