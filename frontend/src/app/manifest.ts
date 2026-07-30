import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Anuki Crochet E-Commerce',
    short_name: 'Anuki Crochet',
    description: 'Handmade crochet bouquets, flowers, and plushies',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f87171',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/x-icon',
      },
    ],
  };
}
