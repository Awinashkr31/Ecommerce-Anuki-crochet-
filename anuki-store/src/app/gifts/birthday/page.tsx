import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';
import { StoreHeader } from '@/components/StoreHeader';
import MoreGiftIdeas from '@/components/MoreGiftIdeas';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Handmade Birthday Gifts | Unique Crochet Birthday Gift Ideas India',
  description: 'Find the perfect handmade birthday gift! Cute crochet plushies, keychains, flower bouquets, and hair accessories. Unique birthday gifts for her delivered across India.',
  alternates: { canonical: '/gifts/birthday' },
  openGraph: {
    title: 'Handmade Birthday Gifts | Unique Crochet Birthday Gift Ideas India',
    description: 'Find the perfect handmade birthday gift! Cute crochet plushies, keychains, and flower bouquets.',
    url: 'https://www.anukicrochet.in/gifts/birthday',
    type: 'website',
  },
};

export default async function BirthdayGiftsPage() {
  // Birthday gifts: a mix of all categories — plushies, keychains, bouquets, hair accessories
  const products = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    },
    orderBy: { salePrice: 'asc' },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Handmade Birthday Gifts',
    description: 'Unique handmade crochet birthday gifts for her, for friends, and for family',
    numberOfItems: products.length,
    itemListElement: products.map((p: any, i: number) => ({
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
          { name: 'Birthday Gifts', item: '/gifts/birthday' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">🎂 For Their Special Day</p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            Handmade Birthday Gifts
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Make their birthday unforgettable with a one-of-a-kind handmade crochet gift. 
            From cuddly amigurumi toys to flower bouquets that last forever — each piece is crafted with love.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Birthday gift ideas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </main>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Why Choose Handmade Birthday Gifts?</h2>
          <p>
            A handmade gift carries a personal touch that no store-bought item can match. When you gift a crochet plush toy, 
            keychain, or bouquet, you&apos;re giving something that was made with hours of care and creativity. It shows the 
            birthday person that you put real thought into their gift.
          </p>
          <h3>Birthday Gift Ideas by Budget</h3>
          <ul>
            <li><Link href="/gifts/under-300">Under ₹300</Link> — Cute keychains, hair clips, and mini bouquets</li>
            <li><Link href="/gifts/under-500">Under ₹500</Link> — Flower pots, premium keychains, and hair accessories</li>
            <li><Link href="/gifts/under-1000">Under ₹1000</Link> — Amigurumi plush toys and strawberry pillows</li>
          </ul>
          <h3>Birthday Gift Ideas by Type</h3>
          <ul>
            <li><strong>For Her:</strong> <Link href="/categories/hair-accessories">Crochet hair accessories</Link>, <Link href="/categories/flower-bouquets">flower bouquets</Link></li>
            <li><strong>For Friends:</strong> <Link href="/categories/keychains">Cute keychains</Link>, small plushies</li>
            <li><strong>For Kids:</strong> <Link href="/categories/toys">Amigurumi plush toys</Link> — Pikachu, Bunny, and more</li>
          </ul>
          <p>
            Want something truly unique? <Link href="/custom">Order a custom crochet gift</Link> made just for them!
          </p>
        </article>
      </section>

      <MoreGiftIdeas currentPath="/gifts/birthday" />
    </div>
  );
}
