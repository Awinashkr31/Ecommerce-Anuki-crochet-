import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Raksha Bandhan Gifts | Handmade Crochet Rakhi Gifts India',
  description: 'Shop unique Raksha Bandhan gifts for sisters and brothers! Handmade crochet keychains, hair clips, flower bouquets, and more. Affordable rakhi gifts under ₹500 delivered across India.',
  alternates: { canonical: '/gifts/raksha-bandhan' },
  openGraph: {
    title: 'Raksha Bandhan Gifts | Handmade Crochet Rakhi Gifts India',
    description: 'Shop unique Raksha Bandhan gifts! Handmade crochet keychains, hair clips, and flower bouquets.',
    url: 'https://www.anukicrochet.in/gifts/raksha-bandhan',
    type: 'website',
  },
};

export default async function RakshaBandhanGiftsPage() {
  // Rakhi gifts: keychains, hair accessories, bouquets — items siblings would love
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      category: {
        slug: { in: ['keychains', 'hair-accessories', 'flower-bouquets'] },
      },
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
    name: 'Raksha Bandhan Gifts',
    description: 'Handmade crochet Raksha Bandhan gifts for brothers and sisters',
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
          { name: 'Raksha Bandhan Gifts', item: '/gifts/raksha-bandhan' },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">🪢 For Your Sibling</p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            Raksha Bandhan Gifts
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Celebrate the bond of love with a thoughtful handmade gift this Raksha Bandhan. 
            From cute keychains for bhaiya to pretty hair clips for didi — find the perfect rakhi gift here.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Raksha Bandhan gift ideas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </main>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Handmade Rakhi Gifts That Show You Care</h2>
          <p>
            Skip the generic chocolates and mass-produced gifts this Raksha Bandhan. A handmade crochet gift tells your 
            sibling they&apos;re truly special. Each piece is crafted with love, making it a keepsake they&apos;ll 
            cherish long after the festival is over.
          </p>
          <h3>Rakhi Gift Ideas for Sisters</h3>
          <ul>
            <li><Link href="/categories/hair-accessories">Crochet Hair Accessories</Link> — Daisy clips, heart clips, sunflower claw clips</li>
            <li><Link href="/categories/flower-bouquets">Mini Flower Bouquets</Link> — A tiny forever bouquet for her desk</li>
          </ul>
          <h3>Rakhi Gift Ideas for Brothers</h3>
          <ul>
            <li><Link href="/categories/keychains">Fun Crochet Keychains</Link> — Teddy bear, dinosaur, Pikachu keychains</li>
            <li><Link href="/custom">Custom Crochet</Link> — Get a keychain of his favorite character</li>
          </ul>
          <h3>Budget-Friendly Rakhi Gifts</h3>
          <p>
            Most of our Raksha Bandhan gifts are <Link href="/gifts/under-300">under ₹300</Link>, 
            making them perfect for gifting to multiple siblings without breaking the bank.
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
          <Link href="/gifts/under-300" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹300</p>
            <p className="text-xs text-neutral-500">Budget picks</p>
          </Link>
          <Link href="/gifts/under-500" className="bg-white border border-neutral-200 rounded-xl p-4 text-center hover:border-rose-300 hover:shadow-md transition-all">
            <p className="font-bold text-neutral-900">Under ₹500</p>
            <p className="text-xs text-neutral-500">More options</p>
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
