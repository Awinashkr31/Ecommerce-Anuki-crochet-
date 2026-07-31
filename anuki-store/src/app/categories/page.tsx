import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: 'Categories | Anuki Store',
  description: 'Browse all product categories at Anuki Store.',
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
