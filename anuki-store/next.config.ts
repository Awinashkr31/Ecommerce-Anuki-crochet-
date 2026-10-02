import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
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
    deviceSizes: [640, 828, 1080],
    imageSizes: [16, 32, 48, 64, 96],
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
        permanent: true,
      },
      {
        source: '/policies/returns-and-exchanges',
        destination: '/policies/return-policy',
        permanent: true,
      },
      // Old Blog Posts Redirects
      { source: '/blog/amigurumi-vs-regular-plushies', destination: '/blog/what-is-amigurumi', permanent: true },
      { source: '/blog/crochet-flower-bouquets-vs-real-flowers-comparison', destination: '/blog/crochet-flowers-vs-real-flowers', permanent: true },
      { source: '/blog/crochet-gifts-for-every-occasion', destination: '/handmade-crochet-gifts', permanent: true },
      { source: '/blog/crochet-gifts-in-:city', destination: '/handmade-gifts-india', permanent: true },
      { source: '/blog/handmade-crochet-gifts-bihar', destination: '/handmade-gifts-india', permanent: true },
      { source: '/blog/perfect-crochet-amigurumi-india', destination: '/amigurumi', permanent: true },
      { source: '/blog/raksha-bandhan-gift-ideas-under-500', destination: '/gifts/raksha-bandhan', permanent: true },
      { source: '/blog/top-5-custom-crochet-gifts-for-birthdays', destination: '/gifts/birthday', permanent: true },
      { source: '/blog/ultimate-guide-crochet-flower-bouquets', destination: '/blog/how-to-choose-crochet-bouquet', permanent: true },
      // Old Gift Pages Redirects
      { source: '/gifts/under-1000', destination: '/gifts/under-999', permanent: true },
      { source: '/gifts/under-300', destination: '/gifts/under-299', permanent: true },
      { source: '/gifts/under-500', destination: '/gifts/under-499', permanent: true },
      { source: '/categories/flower-bouquets', destination: '/crochet-flower-bouquets', permanent: true },
      { source: '/categories/flower-pots', destination: '/crochet-flower-pots', permanent: true },
      { source: '/categories/hair-accessories', destination: '/crochet-hair-accessories', permanent: true },
      { source: '/categories/keychains', destination: '/crochet-keychains', permanent: true },
      { source: '/categories/toys', destination: '/amigurumi', permanent: true }
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
        source: '/:all*(svg|jpg|png|webp|avif|ico|woff|woff2|ttf|eot)',
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
