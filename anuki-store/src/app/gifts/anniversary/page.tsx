import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Handmade Anniversary Gifts | Crochet Gifts for Couples India',
  description: 'Celebrate your love with unique handmade anniversary gifts. Crochet flower bouquets, flower pots, and custom gifts that last forever. Delivered across India.',
  alternates: { canonical: '/gifts/anniversary' },
  openGraph: {
    title: 'Handmade Anniversary Gifts | Crochet Gifts for Couples India',
    description: 'Celebrate your love with unique handmade crochet anniversary gifts that last forever.',
    url: 'https://www.anukicrochet.in/gifts/anniversary',
    type: 'website',
  },
};

export default async function AnniversaryGiftsPage() {
  // Anniversary: focus on bouquets, flower pots, premium items
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      category: {
        slug: { in: ['flower-bouquets', 'flower-pots', 'keychains'] },
      },
    },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    },
    orderBy: { salePrice: 'desc' },
  });

  // Also include plushies for "gift for her" angle
  const plushies = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      category: { slug: 'toys' },
    },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    },
  });

  const allProducts = [...products, ...plushies];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Handmade Anniversary Gifts',
    description: 'Unique handmade crochet anniversary gifts for couples',
    numberOfItems: allProducts.length,
    itemListElement: allProducts.map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.anukicrochet.in/products/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 md:pb-0">
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Gifts', item: '/gifts' },
          { name: 'Anniversary Gifts', item: '/gifts/anniversary' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">💕 Celebrate Your Love</p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            Handmade Anniversary Gifts
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Mark your special milestone with a handcrafted gift that lasts as long as your love. 
            Our crochet bouquets and flower arrangements never wilt — just like your bond.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Anniversary gift ideas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </main>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Why Crochet Anniversary Gifts Are Special</h2>
          <p>
            An anniversary celebrates a love that endures — and what better way to honor that than with a gift that lasts forever? 
            Unlike real flowers that wilt in days, our <Link href="/categories/flower-bouquets">crochet flower bouquets</Link> stay 
            vibrant and beautiful for a lifetime. They&apos;re a daily reminder of your love story.
          </p>
          <h3>Anniversary Gift Ideas</h3>
          <ul>
            <li><strong>For Wife/Girlfriend:</strong> A romantic <Link href="/categories/flower-bouquets">crochet tulip bouquet</Link> or a cute <Link href="/categories/toys">amigurumi plush toy</Link></li>
            <li><strong>For Husband/Boyfriend:</strong> A personalized <Link href="/categories/keychains">crochet keychain</Link> he can carry every day</li>
            <li><strong>For the Home:</strong> A beautiful <Link href="/categories/flower-pots">crochet flower pot arrangement</Link> for the couple&apos;s living room</li>
          </ul>
          <p>
            Looking for something truly one-of-a-kind? <Link href="/custom">Design a custom crochet gift</Link> with their favorite colors, flowers, or characters.
          </p>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">More Gift Ideas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/gifts/birthday" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Birthday</p>
            <p className="text-xs text-neutral-500">Fun gifts</p>
          </Link>
          <Link href="/gifts/valentines-day" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Valentine&apos;s Day</p>
            <p className="text-xs text-neutral-500">Romantic gifts</p>
          </Link>
          <Link href="/gifts/under-500" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹500</p>
            <p className="text-xs text-neutral-500">Best sellers</p>
          </Link>
          <Link href="/custom" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Custom Gifts</p>
            <p className="text-xs text-neutral-500">Made to order</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
