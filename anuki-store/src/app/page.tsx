/* eslint-disable @typescript-eslint/no-explicit-any */
import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";

import { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds to keep it fast but fresh

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default async function Page() {
  // Fetch data on the server in parallel for maximum speed
  const [bestsellerProducts, latestProducts, categories, allProductsPool] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED', bestseller: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        salePrice: true,
        wholesalePrice: true,
        isMadeToOrder: true,
        bestseller: true,
        stockStatus: true,
        stock: true,
        status: true,
        images: {
          select: { url: true, altText: true, order: true },
          orderBy: { order: 'asc' }
        },
        category: {
          select: { name: true, slug: true }
        },
        variants: {
          select: { id: true, stock: true, color: true }
        }
      }
    }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        salePrice: true,
        wholesalePrice: true,
        isMadeToOrder: true,
        bestseller: true,
        stockStatus: true,
        stock: true,
        status: true,
        images: {
          select: { url: true, altText: true, order: true },
          orderBy: { order: 'asc' }
        },
        category: {
          select: { name: true, slug: true }
        },
        variants: {
          select: { id: true, stock: true, color: true }
        }
      }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, bannerUrl: true },
    }),
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        salePrice: true,
        wholesalePrice: true,
        isMadeToOrder: true,
        bestseller: true,
        stockStatus: true,
        stock: true,
        status: true,
        images: {
          select: { url: true, altText: true, order: true },
          orderBy: { order: 'asc' }
        },
        category: {
          select: { name: true, slug: true }
        },
        variants: {
          select: { id: true, stock: true, color: true }
        }
      }
    })
  ]);

  const existingProductIds = new Set([
    ...bestsellerProducts.map(p => p.id),
    ...latestProducts.map(p => p.id)
  ]);

  const filteredPool = allProductsPool.filter(p => !existingProductIds.has(p.id));
  const shuffled = filteredPool.sort(() => 0.5 - Math.random());
  const randomProducts = shuffled.slice(0, 4);
  const randomProducts2 = shuffled.slice(4, 8);

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
        "description": "Shop unique handmade crochet gifts online in India. Custom bouquets, cute plushies, and handcrafted gifts delivered from Bihar.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://anukicrochet.in/search?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": ["Organization", "Store"],
        "@id": "https://anukicrochet.in/#organization",
        "name": "Anuki Crochet",
        "url": "https://anukicrochet.in/",
        "logo": "https://anukicrochet.in/logo.png",
        "description": "Anuki Crochet is a top-rated handmade crochet brand in Bihar, India specializing in custom crochet gifts, including crochet flowers, crochet bouquets, amigurumi toys, and keychains.",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "Bihar",
          "addressCountry": "IN"
        },
        "areaServed": "IN",
        "knowsAbout": [
          "Handmade Crochet",
          "Crochet Gifts",
          "Crochet Flowers",
          "Amigurumi",
          "Custom Gifting"
        ],
        "offers": {
          "@type": "AggregateOffer",
          "itemOffered": [
            { "@type": "Product", "name": "Crochet Bouquets" },
            { "@type": "Product", "name": "Amigurumi Toys" },
            { "@type": "Product", "name": "Crochet Keychains" },
            { "@type": "Product", "name": "Crochet Hair Accessories" }
          ]
        },
        "sameAs": [
          "https://instagram.com/anukicrochet",
          "https://facebook.com/anukicrochet"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a crochet bouquet?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A crochet bouquet is a handcrafted arrangement of yarn flowers. Unlike real flowers, a crochet bouquet is a handmade gift that lasts forever, making it perfect for gifting."
            }
          },
          {
            "@type": "Question",
            "name": "How long does a crochet bouquet last?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our handmade crochet flower bouquets are crafted from premium yarn and never wilt. They are beautiful forever flowers that last a lifetime."
            }
          },
          {
            "@type": "Question",
            "name": "What is an amigurumi toy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An amigurumi toy is a small, stuffed yarn plushie made using the Japanese art of knitting or crocheting. You can explore our cuddly crochet plushies for unique gifts."
            }
          },
          {
            "@type": "Question",
            "name": "Are crochet plushies washable?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we recommend gentle spot cleaning or hand washing in cold water with a mild detergent. Lay flat to dry to keep your handmade stuffed toys looking perfect."
            }
          },
          {
            "@type": "Question",
            "name": "How long does a custom crochet order take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most custom crochet orders take 5-7 business days to create before shipping across India. Specific estimates are provided at checkout."
            }
          },
          {
            "@type": "Question",
            "name": "Does Anuki Crochet deliver across India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we deliver our affordable handmade gifts across India. International shipping is coming soon!"
            }
          }
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
        randomProducts={randomProducts as any}
        randomProducts2={randomProducts2 as any}
      />
    </>
  );
}
