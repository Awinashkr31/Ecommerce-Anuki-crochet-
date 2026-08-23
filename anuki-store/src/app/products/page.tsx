import { prisma } from '@/lib/prisma';
import ProductsClient from './ProductsClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 60; // ISR revalidation

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  if (params?.category === 'keychains') {
    return {
      title: 'Cute Handmade Crochet Keychains & Bag Charms India | Anuki Crochet',
      description: 'Shop affordable handmade crochet keychains in India. Perfect as cute keychain gifts, bag charms, and small handmade gifts under ₹300.',
      alternates: { canonical: '/categories/keychains' },
    };
  }
  if (params?.category === 'toys') {
    return {
      title: 'Handmade Amigurumi & Crochet Plush Toys India | Anuki Crochet',
      description: 'Shop adorable handmade amigurumi and crochet plush toys in India. Perfect as cute crochet plushies, stuffed animals, and crochet gifts for kids.',
      alternates: { canonical: '/categories/toys' },
    };
  }
  if (params?.category === 'hair-accessories') {
    return {
      title: 'Handmade Crochet Hair Accessories & Cute Hair Clips India | Anuki Crochet',
      description: 'Shop adorable handmade crochet hair accessories in India. Perfect as aesthetic hair accessories, cute crochet hair clips, and beautiful crochet gifts.',
      alternates: { canonical: '/categories/hair-accessories' },
    };
  }
  return {
    title: 'Shop Handmade Crochet Flowers & Gifts Online India | Anuki Crochet',
    description: 'Shop our beautiful collection of handmade crochet flowers, custom bouquets, and cute plushies. Find the perfect crochet bouquet gift online in India.',
    alternates: { canonical: '/products' },
  };
}

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    }
  });

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>}>
      <ProductsClient initialProducts={products as any} />
    </Suspense>
  );
}
