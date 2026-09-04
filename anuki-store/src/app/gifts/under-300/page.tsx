import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Handmade Gifts Under ₹300 | Affordable Crochet Gifts India',
  description: 'Shop beautiful handmade crochet gifts under ₹300. Affordable keychains, hair clips, and cute accessories. Perfect budget-friendly gifts delivered across India.',
  alternates: { canonical: '/gifts/under-300' },
  openGraph: {
    title: 'Handmade Gifts Under ₹300 | Affordable Crochet Gifts India',
    description: 'Shop beautiful handmade crochet gifts under ₹300. Affordable keychains, hair clips, and cute accessories.',
    url: 'https://www.anukicrochet.in/gifts/under-300',
    type: 'website',
  },
};

export default async function GiftsUnder300Page() {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { salePrice: { lte: 300, gt: 0 } },
        { AND: [{ salePrice: null }, { basePrice: { lte: 300 } }] },
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
    name: 'Handmade Crochet Gifts Under ₹300',
    description: 'Affordable handmade crochet gifts under ₹300',
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
          { name: 'Under ₹300', item: '/gifts/under-300' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">Budget-Friendly Gifts</p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            Handmade Gifts Under ₹300
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Beautiful handcrafted crochet gifts that won&apos;t break the bank. Perfect for birthdays, 
            small celebrations, or just because. Each piece is lovingly made by hand in India.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Products under ₹300</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 mb-4">No products found in this price range.</p>
            <Link href="/products" className="text-rose-600 font-medium hover:underline">
              View all products
            </Link>
          </div>
        )}
      </main>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Affordable Handmade Gifts That Feel Special</h2>
          <p>
            Finding a meaningful gift on a budget doesn&apos;t have to be hard. Our collection of handmade crochet gifts under ₹300 
            includes adorable keychains, pretty hair clips, cute flower bouquets, and more. Each item is hand-crocheted with 
            premium yarn by skilled artisans, making every piece one-of-a-kind.
          </p>
          <h3>Perfect For</h3>
          <ul>
            <li>Birthday gifts for friends and classmates</li>
            <li>Return gifts and party favors</li>
            <li>Raksha Bandhan gifts for siblings</li>
            <li>Small gestures that make a big impact</li>
          </ul>
        </article>
      </section>

      {/* Internal Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Explore More</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/gifts/under-500" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹500</p>
            <p className="text-xs text-neutral-500">More options</p>
          </Link>
          <Link href="/gifts/under-1000" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹1000</p>
            <p className="text-xs text-neutral-500">Premium picks</p>
          </Link>
          <Link href="/gifts/birthday" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Birthday Gifts</p>
            <p className="text-xs text-neutral-500">By occasion</p>
          </Link>
          <Link href="/custom" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Custom Orders</p>
            <p className="text-xs text-neutral-500">Made for you</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
