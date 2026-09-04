import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Valentine's Day Gifts | Handmade Crochet Valentine Gifts India",
  description: "Shop handmade Valentine's Day gifts! Romantic crochet flower bouquets, heart keychains, cute plush toys, and personalized gifts for her. Delivered across India.",
  alternates: { canonical: '/gifts/valentines-day' },
  openGraph: {
    title: "Valentine's Day Gifts | Handmade Crochet Valentine Gifts India",
    description: "Shop handmade Valentine's Day gifts! Romantic crochet flower bouquets and cute plush toys.",
    url: 'https://www.anukicrochet.in/gifts/valentines-day',
    type: 'website',
  },
};

export default async function ValentinesDayGiftsPage() {
  // Valentine's: bouquets, heart-themed, plushies, romantic keychains
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      category: {
        slug: { in: ['flower-bouquets', 'flower-pots', 'toys', 'keychains'] },
      },
    },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    },
    orderBy: { salePrice: 'asc' },
  });

  // Also include heart hair clips
  const hairAccessories = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      name: { contains: 'heart', mode: 'insensitive' },
    },
    include: {
      category: true,
      variants: true,
      images: { orderBy: { order: 'asc' } },
    },
  });

  const seen = new Set(products.map(p => p.id));
  const allProducts = [...products, ...hairAccessories.filter(p => !seen.has(p.id))];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Valentine's Day Gifts",
    description: "Handmade crochet Valentine's Day gifts for her and for him",
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
          { name: "Valentine's Day Gifts", item: '/gifts/valentines-day' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">❤️ Say It With Crochet</p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            Valentine&apos;s Day Gifts
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Skip the wilting roses! Gift a handmade crochet bouquet or a cute plush toy that&apos;ll 
            last as long as your love. Each piece is hand-crocheted with care and delivered across India.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Valentine&apos;s Day gift ideas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </main>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Why Crochet Gifts Make the Best Valentine&apos;s Day Presents</h2>
          <p>
            Real flowers wilt within a week. A crochet bouquet? It stays beautiful forever — just like your love. 
            Our handmade Valentine&apos;s gifts are crafted with premium yarn in romantic colors, making them the 
            perfect way to show someone you care.
          </p>
          <h3>Valentine Gift Ideas for Her</h3>
          <ul>
            <li><Link href="/categories/flower-bouquets">Crochet Tulip Bouquets</Link> — Romantic forever flowers</li>
            <li><Link href="/categories/hair-accessories">Heart Hair Clips</Link> — Wearable love tokens</li>
            <li><Link href="/categories/toys">Cute Plush Toys</Link> — Cuddly companions she&apos;ll adore</li>
          </ul>
          <h3>Valentine Gift Ideas for Him</h3>
          <ul>
            <li><Link href="/categories/keychains">Character Keychains</Link> — Fun, everyday carry reminders</li>
            <li><Link href="/custom">Custom Crochet</Link> — Design something with his favorite character or hobby</li>
          </ul>
        </article>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">More Gift Ideas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/gifts/anniversary" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Anniversary</p>
            <p className="text-xs text-neutral-500">For couples</p>
          </Link>
          <Link href="/gifts/birthday" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Birthday</p>
            <p className="text-xs text-neutral-500">Fun gifts</p>
          </Link>
          <Link href="/gifts/under-300" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹300</p>
            <p className="text-xs text-neutral-500">Budget picks</p>
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
