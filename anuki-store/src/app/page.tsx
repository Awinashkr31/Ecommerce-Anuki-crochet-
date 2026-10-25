/* eslint-disable @typescript-eslint/no-explicit-any */
import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";

import { Metadata } from "next";

export const revalidate = 86400; // 24 hours - cached on edge, reduces daily ISR writes dramatically

export const metadata: Metadata = {
  title: 'Handmade Crochet Gifts India | Forever Bouquets & Amigurumi | Anuki Crochet',
  description: 'Shop handmade crochet gifts in India. Buy forever flower bouquets, custom amigurumi plushies, keychains & hair accessories handcrafted in Patna, Bihar with free shipping over ₹799.',
  alternates: {
    canonical: 'https://www.anukicrochet.in',
  },
};

export default async function Page() {
  // Fetch data on the server in parallel for maximum speed
  let bestsellerProducts: any[] = [];
  let latestProducts: any[] = [];
  let categories: any[] = [];
  let allProductsPool: any[] = [];
  let dbFaqs: any[] = [];
  let storeAddress = 'Maurya Vihar Colony, Kumhrar, Patna, Bihar 800026';
  let storePhone = '+91-8434897767';
  let storeEmail = 'support@anukicrochet.in';

  try {
    const results = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED', bestseller: true },
      take: 8,
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
      take: 8,
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
    }),
    prisma.faq.findMany({
      where: { section: 'home', isActive: true },
      orderBy: { order: 'asc' },
      select: { question: true, answer: true },
    }),
    prisma.storeSettings.findMany({
      where: { key: { in: ['store_address', 'store_phone', 'store_email'] } }
    })
    ]);
    bestsellerProducts = results[0];
    latestProducts = results[1];
    categories = results[2];
    allProductsPool = results[3];
    dbFaqs = results[4];
    const settingsList = results[5] || [];
    const settingsMap = settingsList.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    if (settingsMap.store_address) storeAddress = settingsMap.store_address;
    if (settingsMap.store_phone) storePhone = settingsMap.store_phone;
    if (settingsMap.store_email) storeEmail = settingsMap.store_email;
  } catch (err) {
    console.warn('Failed to fetch homepage data during prerender, falling back gracefully for ISR:', err);
  }

  function parseStoreAddress(rawAddress: string) {
    const postalMatch = rawAddress.match(/\b\d{6}\b/);
    const postalCode = postalMatch ? postalMatch[0] : '800026';
    const withoutPostal = rawAddress.replace(/\b\d{6}\b/, '').replace(/,\s*$/, '').trim();
    const parts = withoutPostal.split(',').map((p) => p.trim()).filter(Boolean);

    let streetAddress = rawAddress;
    let locality = 'Patna';
    let region = 'Bihar';

    if (parts.length >= 3) {
      region = parts[parts.length - 1];
      locality = parts[parts.length - 2];
      streetAddress = parts.slice(0, parts.length - 2).join(', ');
    } else if (parts.length === 2) {
      locality = parts[0];
      region = parts[1];
      streetAddress = parts[0];
    }

    return {
      streetAddress: streetAddress || rawAddress,
      addressLocality: locality,
      addressRegion: region,
      postalCode,
      addressCountry: 'IN'
    };
  }

  const parsedAddress = parseStoreAddress(storeAddress);

  const defaultFaqs = [
    { question: "What is a crochet bouquet?", answer: "A crochet bouquet is a handcrafted arrangement of yarn flowers. Unlike real flowers, a crochet bouquet is a handmade gift that lasts forever, making it perfect for gifting." },
    { question: "How long does a crochet bouquet last?", answer: "Our handmade crochet flower bouquets are crafted from premium yarn and never wilt. They are beautiful forever flowers that last a lifetime." },
    { question: "What is an amigurumi toy?", answer: "An amigurumi toy is a small, stuffed yarn plushie made using the Japanese art of knitting or crocheting. You can explore our cuddly crochet plushies for unique gifts." },
    { question: "Are crochet plushies washable?", answer: "Yes, we recommend gentle spot cleaning or hand washing in cold water with a mild detergent. Lay flat to dry to keep your handmade stuffed toys looking perfect." },
    { question: "How long does a custom crochet order take?", answer: "Most custom crochet orders take 5-7 business days to create before shipping across India. Specific estimates are provided at checkout." },
    { question: "Does Anuki Crochet deliver across India?", answer: "Yes, we deliver our affordable handmade gifts across India. International shipping is coming soon!" }
  ];
  const activeFaqs = dbFaqs && dbFaqs.length > 0 ? dbFaqs : defaultFaqs;

  const existingProductIds = new Set([
    ...bestsellerProducts.map(p => p.id),
    ...latestProducts.map(p => p.id)
  ]);

  const filteredPool = allProductsPool.filter(p => !existingProductIds.has(p.id));
  
  // Deterministic shuffle-like behavior for Server Component
  const shuffled = [...filteredPool].sort((a, b) => a.id.localeCompare(b.id));
  const randomProducts = shuffled.slice(0, 12);

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
        "@id": "https://www.anukicrochet.in/#website",
        "url": "https://www.anukicrochet.in/",
        "name": "Anuki Crochet",
        "description": "Shop unique handmade crochet gifts online in India. Custom bouquets, cute plushies, and handcrafted gifts delivered from Bihar.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.anukicrochet.in/search?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": ["Organization", "Store", "LocalBusiness"],
        "@id": "https://www.anukicrochet.in/#organization",
        "name": "Anuki Crochet",
        "url": "https://www.anukicrochet.in/",
        "logo": "https://www.anukicrochet.in/logo.png",
        "image": "https://www.anukicrochet.in/logo.png",
        "telephone": storePhone,
        "email": storeEmail,
        "priceRange": "₹₹",
        "description": "Anuki Crochet is a top-rated handmade crochet brand in Bihar, India specializing in custom crochet gifts, including crochet flowers, crochet bouquets, amigurumi toys, and keychains.",
        "address": {
          "@type": "PostalAddress",
          ...parsedAddress
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "25.6174",
          "longitude": "85.1588"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "18:00"
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
          "https://instagram.com/anuki_crochet",
          "https://facebook.com/anukicrochet",
          "https://pinterest.com/anukicrochet"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": activeFaqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
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
        faqs={activeFaqs}
      />
    </>
  );
}
