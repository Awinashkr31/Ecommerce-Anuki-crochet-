import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Handmade Crochet Categories & Collections | Anuki Crochet India'
  },
  description: 'Explore all handmade crochet collections at Anuki Crochet. Forever flower bouquets, potted desk plants, cute amigurumi toys, hair clips, and personalized keychains delivered across India.',
  keywords: ['crochet categories', 'crochet flower bouquet', 'crochet plushies', 'crochet keychains', 'crochet hair accessories', 'handmade crochet India'],
  alternates: {
    canonical: 'https://www.anukicrochet.in/categories',
  },
  openGraph: {
    title: 'Handmade Crochet Collections | Anuki Crochet',
    description: 'Browse our forever flower bouquets, cute amigurumi plushies, hair accessories, and keychains crafted with love in India.',
    url: 'https://www.anukicrochet.in/categories',
    siteName: 'Anuki Crochet',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
