import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    unoptimized: false,
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://salesiq.zohopublic.com 
                https://*.zoho.com 
                https://js.zohocdn.com 
                https://static.zohocdn.com 
                https://www.googletagmanager.com 
                https://www.google-analytics.com 
                https://cdnjs.cloudflare.com;
              style-src 'self' 'unsafe-inline' 
                https://*.zoho.com 
                https://css.zohocdn.com 
                https://static.zohocdn.com 
                https://cdnjs.cloudflare.com;
              img-src 'self' data: blob: 
                https://*.zoho.com 
                https://res.cloudinary.com 
                https://static.zohocdn.com 
                https://css.zohocdn.com 
                https://api.cloudinary.com;
              connect-src 'self' 
                https://*.zoho.com 
                https://salesiq.zohopublic.com 
                https://static.zohocdn.com 
                https://api.cloudinary.com 
                https://res.cloudinary.com
                wss://*.zoho.com;
              font-src 'self' https: 
                https://static.zohocdn.com 
                https://cdnjs.cloudflare.com;
              media-src 'self' 
                https://*.zoho.com 
                https://static.zohocdn.com 
                https://res.cloudinary.com;
              frame-src 'self'
                https://*.zoho.com 
                https://salesiq.zohopublic.com 
                https://www.google.com 
                https://maps.google.com;
              form-action 'self';
              object-src 'none';
              base-uri 'self';
              child-src 'self' blob:;
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      // More permissive CSP for admin routes
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://salesiq.zohopublic.com 
                https://*.zoho.com 
                https://js.zohocdn.com 
                https://static.zohocdn.com 
                https://www.googletagmanager.com 
                https://www.google-analytics.com 
                https://cdnjs.cloudflare.com;
              style-src 'self' 'unsafe-inline' 
                https://*.zoho.com 
                https://css.zohocdn.com 
                https://static.zohocdn.com 
                https://cdnjs.cloudflare.com;
              img-src 'self' data: blob: 
                https://*.zoho.com 
                https://res.cloudinary.com 
                https://static.zohocdn.com 
                https://css.zohocdn.com 
                https://api.cloudinary.com;
              connect-src 'self' 
                https://*.zoho.com 
                https://salesiq.zohopublic.com 
                https://static.zohocdn.com 
                https://api.cloudinary.com 
                https://res.cloudinary.com
                wss://*.zoho.com;
              font-src 'self' https: data: 
                https://static.zohocdn.com 
                https://cdnjs.cloudflare.com;
              media-src 'self' data: blob:
                https://*.zoho.com 
                https://static.zohocdn.com 
                https://res.cloudinary.com;
              frame-src 'self' data: blob:
                https://*.zoho.com 
                https://salesiq.zohopublic.com 
                https://www.google.com 
                https://maps.google.com;
              form-action 'self';
              object-src 'self' data: blob:;
              base-uri 'self';
              child-src 'self' blob: data:;
              worker-src 'self' blob: data:;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
      // Even more permissive for API routes (if needed)
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https:;
              connect-src 'self' https:;
              font-src 'self' https: data:;
              media-src 'self' data: blob: https:;
              frame-src 'self' data: blob:;
              form-action 'self';
              object-src 'self' data: blob:;
              base-uri 'self';
              child-src 'self' blob: data:;
              worker-src 'self' blob: data:;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;