import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Metadata } from 'next';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

export const revalidate = 86400; // 24 hours - cached on edge, reduces daily ISR writes dramatically
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (err) {
    console.warn('Failed to pre-render products during build, falling back to on-demand ISR:', err);
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

const getProduct = cache(async (slug: string) => {
  const includeQuery = {
    category: true,
    variants: true,
    images: { orderBy: { order: 'asc' as const } },
    reviews: { 
      where: { approved: true },
      include: { user: { select: { fullName: true } } }
    },
  };

  // 1. Exact slug match
  let product = await prisma.product.findUnique({
    where: { slug },
    include: includeQuery,
  });

  if (product) return product;

  // 2. Case-insensitive slug match or ID match
  product = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: { equals: slug, mode: 'insensitive' } },
        { id: slug },
      ]
    },
    include: includeQuery,
  });

  if (product) return product;

  // 3. Fallback: partial word match on published products (e.g. legacy/short slugs)
  const cleanParts = slug.toLowerCase().split('-').filter(p => p.length > 2);
  if (cleanParts.length >= 2) {
    product = await prisma.product.findFirst({
      where: {
        status: 'PUBLISHED',
        AND: cleanParts.map(part => ({
          slug: { contains: part, mode: 'insensitive' as const }
        }))
      },
      include: includeQuery,
    });
  }

  return product;
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
  { revalidate: 86400 } // Cache for 24 hours
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getProduct(decodedSlug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  // Requirement 17: Product title template from Site Settings using {product_name} and {brand}
  let titleTemplate = '{product_name} | Anuki Crochet';
  try {
    const templateSetting = await prisma.storeSettings.findUnique({
      where: { key: 'product_title_template' }
    });
    if (templateSetting?.value) {
      titleTemplate = templateSetting.value;
    }
  } catch (err) {
    // fallback to default
  }

  const generatedTitle = titleTemplate
    .replace(/{product_name}/g, product.name)
    .replace(/{brand}/g, 'Anuki Crochet');

  let title = product.seoTitle || generatedTitle;
  if (!title.toLowerCase().includes('anuki crochet')) {
    title = `${title} | Anuki Crochet`;
  }

  const rawDesc = product.shortDesc || product.fullDesc || '';
  const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  const defaultDesc = cleanDesc.length > 20
    ? (cleanDesc.length > 155 ? `${cleanDesc.substring(0, 152)}...` : cleanDesc)
    : `Buy ${product.name} handcrafted with premium yarn by Anuki Crochet. Perfect handmade crochet gift delivered across India with free shipping over ₹799.`;

  const description = product.seoDesc || defaultDesc;

  const imageUrl = product.images?.length > 0 ? product.images[0].url : 'https://www.anukicrochet.in/logo.png';
  const productUrl = product.canonicalUrl || `https://www.anukicrochet.in/products/${product.slug}`;

  return {
    title: { absolute: title },
    description,
    robots: product.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      images: [imageUrl],
      url: productUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const [product, allProducts] = await Promise.all([
    getProduct(decodedSlug),
    getRelatedProducts()
  ]);

  // If found under an older slug, uppercase, or ID, redirect 301 to canonical product URL
  if (product && product.status === 'PUBLISHED' && product.slug !== decodedSlug) {
    redirect(`/products/${product.slug}`);
  }

  const otherProducts = allProducts.filter(p => p.id !== product?.id);
  const sameCat = otherProducts.filter(p => p.categoryId === product?.categoryId || p.category?.slug === product?.category?.slug);
  const diffCat = otherProducts.filter(p => p.categoryId !== product?.categoryId && p.category?.slug !== product?.category?.slug);

  const youMayAlsoLike = [
    ...sameCat.sort(() => 0.5 - Math.random()),
    ...diffCat.sort(() => 0.5 - Math.random())
  ].slice(0, 8);
  const completeTheGift = (diffCat.length >= 4 ? diffCat : otherProducts).sort(() => 0.5 - Math.random()).slice(0, 4);

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

  const structuredData: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.length > 0 ? product.images.map((img: any) => img.url) : ["https://www.anukicrochet.in/logo.png"],
    "description": product.seoDesc || product.shortDesc || product.fullDesc || `Shop ${product.name} – handmade with love by Anuki Crochet. Premium quality, unique handcrafted crochet product. Order now at anukicrochet.in`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Anuki Crochet"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.anukicrochet.in/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.salePrice || product.basePrice,
      "availability": product.stockStatus !== 'OUT_OF_STOCK' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": product.isMadeToOrder ? 14 : 5,
            "unitCode": "d"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "d"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
        "merchantReturnDays": 0
      }
    }
  };

  if (product.reviews && product.reviews.length > 0) {
    const totalRating = product.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
    const averageRating = (totalRating / product.reviews.length).toFixed(1);
    
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": product.reviews.length
    };
    
    structuredData.review = product.reviews.map((rev: any) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": rev.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": rev.user?.fullName || "Verified Buyer"
      }
    }));
  }

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
