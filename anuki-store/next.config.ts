import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  generateEtags: true,
  serverExternalPackages: ['firebase-admin', 'jwks-rsa', 'jose', 'sharp', 'multer'],
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'wzhxuzxfoayjzrhufyxw.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'anukicrochet.in' }],
        destination: 'https://www.anukicrochet.in/:path*',
        statusCode: 301,
      },
      {
        source: '/policies/returns-and-exchanges',
        destination: '/policies/return-policy',
        statusCode: 301,
      },
      // Old Gift Pages Redirects to standardized 99 price points
      { source: '/gifts/under-1000', destination: '/gifts/under-999', statusCode: 301 },
      { source: '/gifts/under-300', destination: '/gifts/under-299', statusCode: 301 },
      { source: '/gifts/under-500', destination: '/gifts/under-499', statusCode: 301 },
      // Redirect removed Rakhi pages
      { source: '/gifts/raksha-bandhan', destination: '/gifts', statusCode: 301 },
      { source: '/gifts/raksha-bandhan-for-sister', destination: '/gifts/for-sister', statusCode: 301 },
      { source: '/gifts/raksha-bandhan-for-brother', destination: '/gifts/for-brother', statusCode: 301 },
      { source: '/raksha-bandhan', destination: '/gifts', statusCode: 301 },
      { source: '/rakhi', destination: '/gifts', statusCode: 301 },
      // Redirect all custom-related pages to /custom
      { source: '/custom-crochet-india', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet-gifts', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet-bouquet', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet-plushie', destination: '/custom', statusCode: 301 },
      { source: '/custom-order-process', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet-gifts-for-couples', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet-wedding-gifts', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet-baby-gifts', destination: '/custom', statusCode: 301 },
      { source: '/custom-crochet-bulk-orders', destination: '/custom', statusCode: 301 },
      { source: '/custom-color-crochet-gifts', destination: '/custom', statusCode: 301 },
      { source: '/custom-:slug(.*)', destination: '/custom', statusCode: 301 },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Immutable cache for all files in the public directory (Edge Cache)
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withAnalyzer(withSerwist(nextConfig));
