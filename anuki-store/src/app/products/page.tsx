import { prisma } from '@/lib/prisma';
import ProductsClient from './ProductsClient';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 86400; // 24 hours - cached on edge, reduces daily ISR writes dramatically

type Props = {
  searchParams: Promise<{ category?: string; product?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  if (params?.category) {
    const catSlug = params.category;
    if (catSlug === 'flower-pots') {
      return {
        title: { absolute: 'Handmade Crochet Flower Pots & Botanical Desk Decor | Anuki Crochet India' },
        description: 'Shop handmade crochet flower pots and evergreen desk plants in India. Zero watering needed, hypoallergenic yarn decor delivered across India.',
        alternates: { canonical: `https://www.anukicrochet.in/categories/${catSlug}` },
      };
    }
    if (catSlug === 'flower-bouquets') {
      return {
        title: { absolute: 'Buy Handmade Crochet Flower Bouquets Online India | Anuki Crochet' },
        description: 'Shop forever crochet flower bouquets handcrafted in India. Beautiful rose, tulip & sunflower arrangements with free shipping over ₹799.',
        alternates: { canonical: `https://www.anukicrochet.in/categories/${catSlug}` },
      };
    }
    if (catSlug === 'keychains') {
      return {
        title: { absolute: 'Cute Handmade Crochet Keychains & Bag Charms India | Anuki Crochet' },
        description: 'Shop affordable handmade crochet keychains in India. Perfect as cute keychain gifts, bag charms, and small handmade gifts under ₹300.',
        alternates: { canonical: `https://www.anukicrochet.in/categories/${catSlug}` },
      };
    }
    if (catSlug === 'toys') {
      return {
        title: { absolute: 'Handmade Amigurumi & Crochet Plush Toys India | Anuki Crochet' },
        description: 'Shop adorable handmade amigurumi and crochet plush toys in India. Perfect as cute crochet plushies, stuffed animals, and crochet gifts for kids.',
        alternates: { canonical: `https://www.anukicrochet.in/categories/${catSlug}` },
      };
    }
    if (catSlug === 'hair-accessories') {
      return {
        title: { absolute: 'Handmade Crochet Hair Accessories & Cute Hair Clips India | Anuki Crochet' },
        description: 'Shop adorable handmade crochet hair accessories in India. Perfect as aesthetic hair accessories, cute crochet hair clips, and beautiful crochet gifts.',
        alternates: { canonical: `https://www.anukicrochet.in/categories/${catSlug}` },
      };
    }
    return {
      title: { absolute: `Handmade Crochet ${catSlug.replace(/-/g, ' ')} | Anuki Crochet` },
      description: `Explore our collection of handcrafted crochet ${catSlug.replace(/-/g, ' ')} made with love in India. Delivered across India.`,
      alternates: { canonical: `https://www.anukicrochet.in/categories/${catSlug}` },
    };
  }
  return {
    title: { absolute: 'Shop All Handmade Crochet Gifts & Products | Anuki Crochet India' },
    description: 'Explore our complete collection of handmade crochet flower bouquets, cute plushies, hair accessories, and keychains with delivery across India.',
    alternates: { canonical: 'https://www.anukicrochet.in/products' },
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
