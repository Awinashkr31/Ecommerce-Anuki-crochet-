import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 60; // ISR revalidation

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return categories.map((cat) => ({
    slug: cat.slug,
  }));
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

  return {
    title: `${category.name} - Anuki Crochet`,
    description: category.description || `Browse our beautiful collection of handmade crochet ${category.name.toLowerCase()}.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const category = await prisma.category.findUnique({
    where: { slug: decodedSlug },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  // Find all child categories to include their products
  const childCategories = await prisma.category.findMany({
    where: { parentId: category.id, isActive: true },
    select: { id: true }
  });
  
  const categoryIds = [category.id, ...childCategories.map(c => c.id)];

  const products = await prisma.product.findMany({
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-24 md:pb-0">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', item: '/' },
          { name: 'Categories', item: '/categories' },
          { name: category.name, item: `/categories/${category.slug}` }
        ]} 
      />
      
      {/* Category Hero / Answer-First Content */}
      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6 capitalize">{category.name}</h1>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-neutral-800 mb-2">What are {category.name}?</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              {category.description || `Browse our beautiful collection of handmade crochet ${category.name.toLowerCase()}. Each piece is carefully crafted with high-quality yarn to create a lasting keepsake.`}
            </p>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">Products in {category.name}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 mb-4">No products found in this category.</p>
            <Link href="/products" className="text-indigo-600 font-medium hover:underline">
              View all products
            </Link>
          </div>
        )}
      </main>
      
      {/* Category SEO Content / FAQ Block */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-rose max-w-none">
          <h2>Why Choose Our Crochet {category.name}?</h2>
          <p>
            Unlike mass-produced items, every piece in our {category.name.toLowerCase()} collection is hand-crocheted by skilled artisans in India. 
            We use premium, hypoallergenic yarn that retains its vibrant color and shape for years. Perfect for gifting on anniversaries, birthdays, or festivals.
          </p>
          <h3>Care Instructions</h3>
          <ul>
            <li>Keep away from direct sunlight to prevent color fading.</li>
            <li>Dust gently with a soft brush.</li>
            <li>Do not machine wash. Spot clean with a damp cloth if necessary.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
