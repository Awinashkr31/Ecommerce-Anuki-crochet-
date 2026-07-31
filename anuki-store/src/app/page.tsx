import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Revalidate every 60 seconds to keep it fast but fresh

export default async function Page() {
  // Fetch data on the server in parallel for maximum speed
  const [bestsellerProducts, latestProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED', bestseller: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { order: 'asc' } },
      }
    }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { order: 'asc' } },
      }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Preload the LCP hero image so the browser starts downloading it immediately
  const heroImageUrl = bestsellerProducts[0]?.images?.[0]?.url
    || "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp";
  // Build the Next.js optimized image URL for preloading
  const preloadHeroUrl = `/_next/image?url=${encodeURIComponent(heroImageUrl)}&w=828&q=75`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://anukicrochet.in/#website",
        "url": "https://anukicrochet.in/",
        "name": "Anuki Crochet",
        "description": "Handmade Crochet Gifts & Custom Bouquets",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://anukicrochet.in/search?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://anukicrochet.in/#organization",
        "name": "Anuki Crochet",
        "url": "https://anukicrochet.in/",
        "logo": "https://anukicrochet.in/logo.png",
        "sameAs": [
          "https://instagram.com/anukicrochet",
          "https://facebook.com/anukicrochet"
        ]
      }
    ]
  };

  return (
    <>
      <link
        rel="preload"
        as="image"
        href={preloadHeroUrl}
        type="image/webp"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient 
        featuredProducts={bestsellerProducts as any} 
        latestProducts={latestProducts.map(p => ({ ...p, isNew: true })) as any} 
        categories={categories as any} 
      />
    </>
  );
}
