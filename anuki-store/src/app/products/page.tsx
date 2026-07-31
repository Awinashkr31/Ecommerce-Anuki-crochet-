import { prisma } from '@/lib/prisma';
import ProductsClient from './ProductsClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 60; // ISR revalidation

export const metadata: Metadata = {
  title: 'Shop Collection - Anuki Crochet',
  description: 'Discover beautifully handcrafted crochet creations made with love, perfect for gifting or bringing warmth to your home.',
};

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
