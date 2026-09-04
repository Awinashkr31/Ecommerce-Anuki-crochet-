import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Handmade Gifts Under ₹1000 | Premium Crochet Gifts India',
  description: 'Shop premium handmade crochet gifts under ₹1000. Amigurumi plush toys, flower pots, strawberry pillows, and more. Unique handcrafted gifts delivered across India.',
  alternates: { canonical: '/gifts/under-1000' },
  openGraph: {
    title: 'Handmade Gifts Under ₹1000 | Premium Crochet Gifts India',
    description: 'Shop premium handmade crochet gifts under ₹1000. Amigurumi plush toys, flower pots, and more.',
    url: 'https://www.anukicrochet.in/gifts/under-1000',
    type: 'website',
  },
};

export default async function GiftsUnder1000Page() {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { salePrice: { lte: 1000, gt: 0 } },
        { AND: [{ salePrice: null }, { basePrice: { lte: 1000 } }] },
      ],
    },
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
    name: 'Handmade Crochet Gifts Under ₹1000',
    description: 'Premium handmade crochet gifts under ₹1000',
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
          { name: 'Under ₹1000', item: '/gifts/under-1000' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">Premium Collection</p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            Handmade Gifts Under ₹1000
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Our premium collection features larger crochet creations — adorable amigurumi plush toys, 
            sunflower pot arrangements, and strawberry pillows. Perfect for meaningful milestones and celebrations.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Products under ₹1000</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 mb-4">No products found in this price range.</p>
            <Link href="/products" className="text-rose-600 font-medium hover:underline">View all products</Link>
          </div>
        )}
      </main>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Premium Handmade Gifts That Leave a Lasting Impression</h2>
          <p>
            When you want a gift that truly stands out, our premium crochet collection delivers. These larger pieces — 
            from huggable bunny plushies to detailed sunflower pot arrangements — take hours of skilled craftsmanship to create. 
            Each one is a unique work of art that your loved ones will treasure for years.
          </p>
          <h3>Featured in This Collection</h3>
          <ul>
            <li><Link href="/categories/toys">Amigurumi Plush Toys</Link> — Bunny, Pikachu, Strawberry pillows</li>
            <li><Link href="/categories/flower-pots">Crochet Flower Pots</Link> — Desk décor that lasts forever</li>
            <li><Link href="/categories/keychains">Premium Keychains</Link> — Detailed, larger keychain designs</li>
          </ul>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Explore More</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/gifts/under-300" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹300</p>
            <p className="text-xs text-neutral-500">Budget picks</p>
          </Link>
          <Link href="/gifts/under-500" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹500</p>
            <p className="text-xs text-neutral-500">Best sellers</p>
          </Link>
          <Link href="/gifts/birthday" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Birthday Gifts</p>
            <p className="text-xs text-neutral-500">By occasion</p>
          </Link>
          <Link href="/gifts/valentines-day" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Valentine Gifts</p>
            <p className="text-xs text-neutral-500">For your love</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
