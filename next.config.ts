import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads in API routes
  serverExternalPackages: ['cloudinary'],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://vercel.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live https://vercel.com",
              "img-src 'self' data: https: http: https://vercel.live https://vercel.com",
              "font-src 'self' data: https://fonts.gstatic.com https://vercel.live https://vercel.com",
              "connect-src 'self' http://ip-api.com https: https://vercel.live https://vercel.com",
              "frame-src 'self' https://www.google.com https://maps.google.com https://vercel.live https://vercel.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      }
    ];
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
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
      },
      {
        protocol: "https",
        hostname: "*.staticflickr.com",
      },
    ],
  },
};

export default nextConfig;
