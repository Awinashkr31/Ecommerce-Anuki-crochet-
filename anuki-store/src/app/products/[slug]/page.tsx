import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

export const revalidate = 60; // ISR revalidation

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

const getProduct = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    }
  });
});

const getRelatedProducts = unstable_cache(
  async () => {
    return prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      take: 16,
      include: {
        category: true,
        variants: true,
        images: { orderBy: { order: 'asc' } },
      }
    });
  },
  ['related-products-cache'],
  { revalidate: 3600 } // Cache for 1 hour
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getProduct(decodedSlug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} - Anuki Crochet`,
    description: (product.shortDesc || product.fullDesc || '').substring(0, 160),
    openGraph: {
      images: ['/logo.png'],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const [product, allProducts] = await Promise.all([
    getProduct(decodedSlug),
    getRelatedProducts()
  ]);

  const otherProducts = allProducts.filter(p => p.id !== product?.id);

  // Basic random shuffle
  const shuffled = otherProducts.sort(() => 0.5 - Math.random());
  const youMayAlsoLike = shuffled.slice(0, 8);
  const completeTheGift = shuffled.slice(8, 12);

  if (!product || product.status !== 'PUBLISHED') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Product Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-md text-lg">We couldn't find the product you're looking for. It might have been removed or the link is incorrect.</p>
        <Link href="/products" className="px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg active:scale-[0.98]">
          Return to Shop
        </Link>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.length > 0 ? product.images.map(img => img.url) : ["https://anukicrochet.in/logo.png"],
    "description": product.shortDesc || product.fullDesc || '',
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Anuki Crochet"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": `https://anukicrochet.in/products/${product.slug}`,
      "priceCurrency": "INR",
      "lowPrice": product.salePrice || product.basePrice,
      "highPrice": product.basePrice,
      "offerCount": product.variants?.length || 1,
      "availability": product.stockStatus !== 'OUT_OF_STOCK' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Products', item: '/products' },
          { name: product.name, item: `/products/${product.slug}` }
        ]} 
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient 
        product={product as any} 
        youMayAlsoLike={youMayAlsoLike as any}
        completeTheGift={completeTheGift as any}
      />
    </>
  );
}
