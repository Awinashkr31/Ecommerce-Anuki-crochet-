import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import TrackViewItemList from '@/components/TrackViewItemList';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

const categoryDescriptions: Record<string, string> = {
  'flower-bouquets': 'Handmade crochet flower bouquets online in India. Everlasting yarn roses, sunflowers & tulips.',
  'flower-pots': 'Cute handmade crochet flower pots & mini succulents with pan-India delivery.',
  'keychains': 'Handmade crochet keychains with durable cotton yarn. Pan-India delivery.',
  'hair-accessories': 'Handmade crochet hair clips, scrunchies & bands for girls & women.',
  'toys': 'Handmade amigurumi crochet toys & plushies online in India.',
};

const categoryThumbnails: Record<string, string> = {
  'toys': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp',
  'flower-bouquets': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/e146f9cf-704c-4152-802b-a6f63335ca56.webp',
  'flower-pots': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/400b9afe-1528-40dd-89ea-4d2fca701da4.webp',
  'hair-accessories': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/b2f5985a-5495-43a0-ba97-cca9c951f5bd.webp',
  'keychains': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/78fa09b4-11ce-49f0-98f1-eddff6e0582e.webp',
};

const occasionGiftCards = [
  {
    title: 'Birthday Gifts',
    badge: 'Birthday',
    image: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/78fa09b4-11ce-49f0-98f1-eddff6e0582e.webp',
    href: '/gifts/birthday',
  },
  {
    title: 'Anniversary Gifts',
    badge: 'Anniversary',
    image: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/e146f9cf-704c-4152-802b-a6f63335ca56.webp',
    href: '/gifts/anniversary',
  },
  {
    title: 'Gifts Under ₹499',
    badge: 'Under ₹499',
    image: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/b2f5985a-5495-43a0-ba97-cca9c951f5bd.webp',
    href: '/gifts/under-499',
  },
  {
    title: 'Gifts Under ₹999',
    badge: 'Under ₹999',
    image: 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp',
    href: '/gifts/under-999',
  },
];

function getCategoryFaqs(categoryName: string) {
  return [
    {
      question: `How long do handmade crochet ${categoryName.toLowerCase()} last?`,
      answer: `Our crochet items are hand-stitched with premium cotton and soft yarn. They do not wilt, fade, or snap, remaining vibrant keepsakes for years.`
    },
    {
      question: `Can I customize colors, sizes, or designs?`,
      answer: `Yes! We offer full personalization via WhatsApp or our Custom Orders page.`
    },
    {
      question: `How long does delivery take across India?`,
      answer: `Ready-to-ship items are dispatched within 24 to 48 hours and typically arrive within 4 to 7 business days.`
    },
    {
      question: `What are the shipping charges?`,
      answer: `Free Shipping across India on all orders over ₹799.`
    }
  ];
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const category = await prisma.category.findUnique({
    where: { slug: decodedSlug },
  }).catch(() => null);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const metaDesc = category.seoDesc || categoryDescriptions[category.slug] || 
    `Buy ${category.name} online in India at Anuki Crochet.`;

  const pageTitle = category.seoTitle || `Buy ${category.name} Online India | Anuki Crochet`;
  const canonicalUrl = category.canonicalUrl || `https://www.anukicrochet.in/categories/${category.slug}`;

  return {
    title: { absolute: pageTitle },
    description: metaDesc,
    robots: category.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: pageTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: 'Anuki Crochet',
      locale: 'en_IN',
      type: 'website',
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let category: any = null;
  let products: any[] = [];

  try {
    category = await prisma.category.findUnique({
      where: { slug: decodedSlug },
    });

    if (category && category.isActive) {
      const childCategories = await prisma.category.findMany({
        where: { parentId: category.id, isActive: true },
        select: { id: true }
      });
      
      const categoryIds = [category.id, ...childCategories.map(c => c.id)];

      products = await prisma.product.findMany({
        where: {
          categoryId: { in: categoryIds },
          status: 'PUBLISHED'
        },
        include: {
          category: true,
          variants: true,
          images: { orderBy: { order: 'asc' } },
        }
      });
    }
  } catch (err) {
    console.error('Error loading category:', err);
  }

  if (!category || !category.isActive) {
    notFound();
  }

  const metaDesc = category.seoDesc || categoryDescriptions[category.slug] || 
    `Browse our collection of handmade crochet ${category.name.toLowerCase()}.`;

  const faqs = getCategoryFaqs(category.name);

  // SEO JSON-LD kept for Google crawlers without cluttering the screen
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Handmade ${category.name}`,
    description: metaDesc,
    numberOfItems: products.length,
    itemListElement: products.map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.anukicrochet.in/products/${p.slug}`,
      name: p.name,
    })),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  // Sibling categories for visual discovery
  const allCategories = await prisma.category.findMany({
    where: { isActive: true, id: { not: category.id } },
    select: { name: true, slug: true },
    take: 4
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-28 sm:pb-20">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Categories', item: '/categories' },
          { name: category.name, item: `/categories/${category.slug}` }
        ]} 
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Clean, Compact Category Header — Products Immediately Visible */}
      <section className="bg-white border-b border-neutral-100 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-neutral-900 capitalize">
              {category.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {products.length} {products.length === 1 ? 'Design' : 'Designs'} • 100% Handcrafted
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full font-medium">
            <CheckCircle2 size={13} className="text-emerald-600" /> Free delivery &gt; ₹799
          </span>
        </div>
      </section>

      {/* Product Grid — FRONT AND CENTER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <TrackViewItemList listName={category.name} products={products} />

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 mb-4">No products found in this category.</p>
            <Link href="/products" className="text-rose-600 font-medium hover:underline">
              View all products
            </Link>
          </div>
        )}
      </main>

      {/* Compact Custom Order Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div 
          className="rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
          style={{ background: 'linear-gradient(135deg, #881337 0%, #4c0519 100%)' }}
        >
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-rose-300" />
              Want a custom design or specific character?
            </h3>
            <p className="text-xs text-rose-100/90 mt-0.5">
              Send us a reference photo on WhatsApp and we’ll hand-stitch it for you.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/custom"
              className="bg-white text-rose-900 font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-rose-50 transition-colors shadow-xs"
            >
              Custom Orders
            </Link>
            <a
              href="https://wa.me/918434897767?text=Hi!%20I%20would%20like%20to%20order%20a%20custom%20crochet%20item"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-[#20ba59] transition-colors shadow-xs"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Visual Category Shortcuts (Photos Only, No Long Text) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-3">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            More Categories
          </h2>
          <Link href="/categories" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            See all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {allCategories.map(cat => {
            const thumb = categoryThumbnails[cat.slug] || 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/e146f9cf-704c-4152-802b-a6f63335ca56.webp';
            return (
              <Link 
                key={cat.slug} 
                href={`/categories/${cat.slug}`} 
                className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 hover:border-rose-300 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={thumb}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-106 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 sm:p-3 flex items-center justify-between bg-white">
                  <span className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-rose-700 transition-colors truncate">
                    {cat.name}
                  </span>
                  <ArrowRight size={13} className="text-neutral-400 group-hover:text-rose-600 shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Visual Gifts by Occasion (Photos Only, No Long Text) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Shop by Occasion &amp; Budget
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {occasionGiftCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 hover:border-rose-300 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-106 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-neutral-800 backdrop-blur-md shadow-xs">
                  {card.badge}
                </span>
              </div>
              <div className="p-2.5 sm:p-3 flex items-center justify-between bg-white">
                <span className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-rose-700 transition-colors truncate">
                  {card.title}
                </span>
                <ArrowRight size={13} className="text-neutral-400 group-hover:text-rose-600 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
