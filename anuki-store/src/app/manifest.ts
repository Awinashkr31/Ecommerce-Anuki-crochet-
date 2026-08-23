import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnuKi Crochet',
    short_name: 'AnuKi Crochet',
    description: 'Handmade crochet bouquets, flowers, and plushies',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f87171',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
