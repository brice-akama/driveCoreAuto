
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 60, // Cache images for 60 seconds
    dangerouslyAllowSVG: true,
    unoptimized: false, // Set to false to keep Next.js optimization
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  

  async headers() {
    return [
      {
        source: '/(.*)', // Apply these headers globally to all routes
        headers: [
       // next.config.js or headers() in middleware
    {
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';

    script-src 'self' 'unsafe-inline' 'unsafe-eval'
      https://www.smartsuppchat.com
      https://*.smartsuppcdn.com
      https://www.googletagmanager.com
      https://www.google-analytics.com;

    style-src 'self' 'unsafe-inline' https://*.smartsuppcdn.com;

    img-src 'self' data: blob: https://*.smartsuppchat.com https://*.smartsuppcdn.com https://res.cloudinary.com;

    connect-src 'self' 
      https://*.smartsuppchat.com 
      https://*.smartsuppcdn.com 
      wss://*.smartsuppchat.com 
      wss://websocket-visitors.smartsupp.com;

    font-src 'self' https:;

    media-src 'self' https://*.smartsuppchat.com;

    frame-src https://*.smartsuppchat.com https://www.google.com https://maps.google.com;
  `.replace(/\s{2,}/g, ' ').trim(),
},

          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },

          
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', 
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
        ],
      },
    ];
  }
};

export default nextConfig;


