import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all product categories at Anuki Crochet.',
  alternates: {
    canonical: '/categories',
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
