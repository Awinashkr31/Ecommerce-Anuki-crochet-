import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import TrackViewItemList from '@/components/TrackViewItemList';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Sparkles, Truck, Gift, Palette, HelpCircle, ArrowRight, ChevronDown } from 'lucide-react';

export const revalidate = 86400; // 24 hours - cached on edge, reduces daily ISR writes dramatically
export const dynamicParams = true;

const categoryDescriptions: Record<string, string> = {
  'flower-bouquets': 'Shop handmade crochet flower bouquets online in India. Everlasting yarn roses, sunflowers & tulips handcrafted for gifting. Free delivery over ₹799.',
  'flower-pots': 'Buy cute handmade crochet flower pots & mini succulents online in India. Everlasting yarn desk decor & thoughtful gifts with pan-India delivery.',
  'keychains': 'Shop handmade crochet keychains online in India. Cute strawberry, daisy & animal bag charms crafted with durable cotton yarn. Pan-India delivery.',
  'hair-accessories': 'Buy handmade crochet hair clips, scrunchies & bands online in India. Gentle, hypoallergenic yarn accessories crafted for girls & women. Pan-India delivery.',
  'toys': 'Shop handmade amigurumi crochet toys & plushies online in India. Soft, hypoallergenic yarn stuffed companions crafted with love. Fast shipping.',
};

function getCategoryFaqs(categoryName: string) {
  return [
    {
      question: `How long do handmade crochet ${categoryName.toLowerCase()} last?`,
      answer: `Unlike fresh flowers or delicate plastic trinkets, our crochet ${categoryName.toLowerCase()} are hand-stitched with premium cotton and soft yarn. They do not wilt, fade, or snap, remaining vibrant keepsakes for years.`
    },
    {
      question: `Can I customize colors, sizes, or designs for ${categoryName.toLowerCase()}?`,
      answer: `Yes! We offer full personalization. You can request custom colors, bouquet combinations, or personalized message tags by visiting our Custom Orders page.`
    },
    {
      question: `How long does delivery take across India?`,
      answer: `Ready-to-ship items are dispatched within 24 to 48 hours and typically arrive within 4 to 7 business days across India. Custom or made-to-order creations usually take 3 to 5 crafting days before shipping.`
    },
    {
      question: `What are the shipping charges for ${categoryName.toLowerCase()}?`,
      answer: `We provide Free Shipping across India on all orders over ₹799. For smaller orders under ₹799, standard courier charges apply at checkout.`
    },
    {
      question: `How should I clean and care for my crochet items?`,
      answer: `Keep them in a dry indoor space away from harsh direct sunlight. To dust, use a soft brush or a cool hairdryer setting. For small spots, dab gently with a damp cloth and mild soap; do not machine wash.`
    }
  ];
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    });

    return categories.map((cat) => ({
      slug: cat.slug,
    }));
  } catch (err) {
    console.warn('Failed to pre-render categories during build, falling back to on-demand ISR:', err);
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
  });

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const metaDesc = category.seoDesc || categoryDescriptions[category.slug] || 
    `Shop handcrafted crochet ${category.name.toLowerCase()} online in India at Anuki Crochet. Premium artisan gifts handmade with soft yarn and delivered pan-India.`;

  const pageTitle = category.seoTitle || `Buy ${category.name} Online India | Anuki Crochet`;
  const canonicalUrl = category.canonicalUrl || `https://www.anukicrochet.in/categories/${category.slug}`;

  return {
    title: { absolute: pageTitle },
    description: metaDesc,
    robots: category.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl
    },
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

  const metaDesc = categoryDescriptions[category.slug] || 
    `Browse our beautiful collection of handmade crochet ${category.name.toLowerCase()}.`;

  const faqs = getCategoryFaqs(category.name);

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

  // Fetch sibling active categories for related links (excluding current)
  const allCategories = await prisma.category.findMany({
    where: { isActive: true, id: { not: category.id } },
    select: { name: true, slug: true },
    take: 6
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 md:pb-0">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Categories', item: '/categories' },
          { name: category.name, item: `/categories/${category.slug}` }
        ]} 
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      
      {/* Category Hero / Header */}
      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> 100% Handcrafted in India
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 mb-4 capitalize">
            {category.name}
          </h1>
          <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {metaDesc}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-900">
            Available Designs ({products.length})
          </h2>
          <span className="text-xs text-neutral-500 font-medium">
            Pan-India Delivery • Free shipping over ₹799
          </span>
        </div>

        <TrackViewItemList listName={category.name} products={products} />

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 mb-4">No products currently listed in this category.</p>
            <Link href="/products" className="text-rose-600 font-medium hover:underline">
              View all handcrafted products
            </Link>
          </div>
        )}
      </main>
      
      {/* Category Buying Guide / Key Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-10">
          <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
            Why Choose Our Handcrafted {category.name}?
          </h2>
          <p className="text-neutral-600 mb-8 max-w-3xl">
            Every creation at Anuki Crochet is meticulously hand-stitched by skilled women artisans in Patna, Bihar. We use skin-safe, premium yarns to ensure everlasting softness and vivid color retention.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <Gift className="w-6 h-6 text-rose-600 mb-3" />
              <h3 className="font-bold text-neutral-900 text-sm mb-1">Best Gift Occasions</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Perfect for birthdays, anniversaries, Valentine's Day, Mother's Day, and thoughtful heartfelt gestures.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <Sparkles className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-bold text-neutral-900 text-sm mb-1">Everlasting Keepsakes</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Unlike real flowers or cheap plastic trinkets, our crochet creations never wilt or decay over time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <Palette className="w-6 h-6 text-purple-600 mb-3" />
              <h3 className="font-bold text-neutral-900 text-sm mb-1">Custom Orders</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Want custom colors or a special combination? Explore our{' '}
                <Link href="/custom" className="text-rose-600 font-semibold underline">
                  Custom Orders
                </Link>{' '}
                service.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <Truck className="w-6 h-6 text-emerald-600 mb-3" />
              <h3 className="font-bold text-neutral-900 text-sm mb-1">Pan-India Delivery</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Safe, protective boxed packaging with free standard shipping on all orders over ₹799 across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category FAQ Accordion (Rendered directly in initial server HTML for crawlers & AEO) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-rose-600" />
          <h2 className="text-2xl font-serif font-bold text-neutral-900">
            Frequently Asked Questions about {category.name}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-xl border border-neutral-200 p-4 transition-all duration-200 open:border-rose-200 open:shadow-sm"
              {...(idx === 0 ? { open: true } : {})}
            >
              <summary className="flex items-center justify-between font-semibold text-neutral-800 cursor-pointer list-none select-none text-base">
                <span>{faq.question}</span>
                <ChevronDown className="w-4 h-4 text-neutral-400 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Popular Gifts By Occasion & Budget (Internal Crawl Graph) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">
          Shop Crochet Gifts by Occasion & Budget
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/gifts/birthday"
            className="group p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm group-hover:text-rose-600 transition-colors">
              Birthday Gifts
            </p>
            <p className="text-xs text-neutral-500 mt-1">Unique handmade keepsakes</p>
            <span className="inline-flex items-center text-xs text-rose-600 font-medium mt-3">
              Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/gifts/anniversary"
            className="group p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm group-hover:text-rose-600 transition-colors">
              Anniversary Gifts
            </p>
            <p className="text-xs text-neutral-500 mt-1">Everlasting romantic blooms</p>
            <span className="inline-flex items-center text-xs text-rose-600 font-medium mt-3">
              Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/gifts/under-499"
            className="group p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm group-hover:text-rose-600 transition-colors">
              Gifts Under ₹499
            </p>
            <p className="text-xs text-neutral-500 mt-1">Pocket-friendly charms</p>
            <span className="inline-flex items-center text-xs text-rose-600 font-medium mt-3">
              Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/gifts/under-999"
            className="group p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm group-hover:text-rose-600 transition-colors">
              Gifts Under ₹999
            </p>
            <p className="text-xs text-neutral-500 mt-1">Popular bouquets & plushies</p>
            <span className="inline-flex items-center text-xs text-rose-600 font-medium mt-3">
              Explore <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Explore Related Crochet Topics (Root SEO Pages Crawl Graph) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">
          Popular Crochet Collections
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/custom-crochet-gifts"
            className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm">Custom Crochet Gifts</p>
            <p className="text-xs text-neutral-500 mt-1">Tailored for your special ones</p>
          </Link>

          <Link
            href="/crochet-flower-bouquets"
            className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm">Crochet Flower Bouquets</p>
            <p className="text-xs text-neutral-500 mt-1">Everlasting floral arrangements</p>
          </Link>

          <Link
            href="/amigurumi-gifts"
            className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm">Amigurumi Gifts</p>
            <p className="text-xs text-neutral-500 mt-1">Soft cute yarn plushies</p>
          </Link>

          <Link
            href="/crochet-plushies"
            className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-rose-300 hover:shadow-sm transition-all"
          >
            <p className="font-bold text-neutral-900 text-sm">Crochet Plushies</p>
            <p className="text-xs text-neutral-500 mt-1">Handmade cuddly companions</p>
          </Link>
        </div>
      </section>

      {/* Internal Links / Sibling Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
        <h2 className="text-xl font-serif font-bold text-neutral-900 mb-6">
          Explore Other Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allCategories.map(cat => (
            <Link 
              key={cat.slug} 
              href={`/categories/${cat.slug}`} 
              className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all"
            >
              <p className="font-bold text-neutral-900">{cat.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Shop collection</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
