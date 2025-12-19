import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads in API routes
  serverExternalPackages: ['cloudinary'],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.iiita.ac.in",
      },
    ],
  },
};

export default nextConfig;
