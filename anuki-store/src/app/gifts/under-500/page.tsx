import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Handmade Gifts Under ₹500 | Crochet Gift Ideas India',
  description: 'Discover handmade crochet gifts under ₹500. Beautiful keychains, plushies, hair accessories, and flower bouquets. Unique handcrafted gifts delivered across India.',
  alternates: { canonical: '/gifts/under-500' },
  openGraph: {
    title: 'Handmade Gifts Under ₹500 | Crochet Gift Ideas India',
    description: 'Discover handmade crochet gifts under ₹500. Beautiful keychains, plushies, hair accessories, and flower bouquets.',
    url: 'https://www.anukicrochet.in/gifts/under-500',
    type: 'website',
  },
};

export default async function GiftsUnder500Page() {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { salePrice: { lte: 500, gt: 0 } },
        { AND: [{ salePrice: null }, { basePrice: { lte: 500 } }] },
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
    name: 'Handmade Crochet Gifts Under ₹500',
    description: 'Beautiful handmade crochet gifts under ₹500',
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
          { name: 'Under ₹500', item: '/gifts/under-500' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">Best Sellers</p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            Handmade Gifts Under ₹500
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Our most popular price range! From cute keychains to beautiful flower bouquets and stylish hair accessories — 
            find the perfect handmade gift without spending a fortune.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Products under ₹500</h2>
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

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Why Handmade Gifts Under ₹500 Are the Best Choice</h2>
          <p>
            In a world of mass-produced items, a handmade gift stands out. Our crochet gifts under ₹500 are crafted with care, 
            each stitch telling a story. Whether it&apos;s a cute crochet keychain for your bestie or a delicate daisy hair clip 
            for your sister, these gifts carry the warmth of something truly special.
          </p>
          <h3>Popular Categories in This Range</h3>
          <ul>
            <li><Link href="/categories/keychains">Crochet Keychains</Link> — Fun, portable, and utterly adorable</li>
            <li><Link href="/categories/hair-accessories">Hair Accessories</Link> — Handmade clips, ties, and claw clips</li>
            <li><Link href="/categories/flower-bouquets">Flower Bouquets</Link> — Flowers that never wilt</li>
            <li><Link href="/categories/flower-pots">Flower Pots</Link> — Desk décor that lasts forever</li>
          </ul>
        </article>
      </section>

      {/* Internal Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Explore More</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/gifts/under-300" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹300</p>
            <p className="text-xs text-neutral-500">Budget picks</p>
          </Link>
          <Link href="/gifts/under-1000" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹1000</p>
            <p className="text-xs text-neutral-500">Premium gifts</p>
          </Link>
          <Link href="/gifts/anniversary" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Anniversary Gifts</p>
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
