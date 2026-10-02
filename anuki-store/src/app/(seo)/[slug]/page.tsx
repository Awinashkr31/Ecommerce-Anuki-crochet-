import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MoreSeoIdeas from '@/components/MoreSeoIdeas';
import { type SeoArticleSection, type GiftPageConfig } from '@/lib/gift-pages';
import { getSeoPageBySlug, getAllSeoSlugs } from '@/lib/seo-pages';

export const revalidate = 60;

// ──────────────────────────────────────────────
// Static Params (ISR for all SEO pages)
// ──────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSeoSlugs().map((slug) => ({ slug }));
}

// ──────────────────────────────────────────────
// Dynamic Metadata
// ──────────────────────────────────────────────

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.ogDescription,
      url: `https://www.anukicrochet.in/${page.slug}`,
      type: 'website',
    },
  };
}

// ──────────────────────────────────────────────
// Product Fetching
// ──────────────────────────────────────────────

const productInclude = {
  category: true,
  variants: true,
  images: { orderBy: { order: 'asc' as const } },
};

async function fetchProducts(page: GiftPageConfig) {
  const filter = page.productFilter;
  const orderBy = page.orderBy === 'price_asc' ? { salePrice: 'asc' as const } : { salePrice: 'desc' as const };

  if (filter.type === 'price') {
    const priceConditions: any[] = [];

    if (filter.maxPrice) {
      priceConditions.push(
        { salePrice: { lte: filter.maxPrice, gt: 0 } },
        { AND: [{ salePrice: null }, { basePrice: { lte: filter.maxPrice } }] },
      );
    }

    if (filter.minPrice) {
      priceConditions.push(
        { salePrice: { gte: filter.minPrice } },
        { AND: [{ salePrice: null }, { basePrice: { gte: filter.minPrice } }] },
      );
    }

    return prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        ...(priceConditions.length > 0 ? { OR: priceConditions } : {}),
      },
      include: productInclude,
      orderBy,
    });
  }

  if (filter.type === 'category') {
    const mainProducts = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        category: { slug: { in: filter.slugs } },
      },
      include: productInclude,
      orderBy,
    });

    if (filter.extraCategorySlugs?.length) {
      const extraProducts = await prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          category: { slug: { in: filter.extraCategorySlugs } },
        },
        include: productInclude,
      });

      const seen = new Set(mainProducts.map((p) => p.id));
      return [...mainProducts, ...extraProducts.filter((p) => !seen.has(p.id))];
    }

    return mainProducts;
  }

  if (filter.type === 'combo') {
    const priceConditions: any[] = [];
    if (filter.maxPrice) {
      priceConditions.push(
        { salePrice: { lte: filter.maxPrice, gt: 0 } },
        { AND: [{ salePrice: null }, { basePrice: { lte: filter.maxPrice } }] }
      );
    }
    if (filter.minPrice) {
      priceConditions.push(
        { salePrice: { gte: filter.minPrice } },
        { AND: [{ salePrice: null }, { basePrice: { gte: filter.minPrice } }] }
      );
    }

    return prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        category: { slug: { in: filter.slugs } },
        ...(priceConditions.length > 0 ? { OR: priceConditions } : {}),
      },
      include: productInclude,
      orderBy,
    });
  }

  // type === 'all'
  return prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: productInclude,
    orderBy,
  });
}

// ──────────────────────────────────────────────
// SEO Article Renderer
// ──────────────────────────────────────────────

function SeoArticle({ sections }: { sections: SeoArticleSection[] }) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="prose prose-rose max-w-none">
        {sections.map((section, i) => {
          const HeadingTag = section.level;
          return (
            <div key={i}>
              {section.heading && <HeadingTag>{section.heading}</HeadingTag>}

              {section.paragraphs?.map((p, j) => (
                <p key={j}>{p}</p>
              ))}

              {section.bullets && section.bullets.length > 0 && (
                <ul>
                  {section.bullets.map((bullet, k) =>
                    bullet.href ? (
                      <li key={k}>
                        <Link href={bullet.href}>{bullet.text}</Link>
                      </li>
                    ) : (
                      <li key={k}>{bullet.text}</li>
                    ),
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </article>
    </section>
  );
}

// ──────────────────────────────────────────────
// Page Component
// ──────────────────────────────────────────────

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPageBySlug(slug);
  if (!page) notFound();

  const products = await fetchProducts(page);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.itemListName,
    description: page.description,
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
          { name: page.breadcrumbLabel, item: `/${page.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-rose-600 font-bold text-sm tracking-wide uppercase mb-3">
            {page.hero.badge}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
            {page.hero.heading}
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {page.hero.subheading}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="sr-only">{page.gridLabel}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
            <p className="text-neutral-500 mb-4">No products found in this collection yet.</p>
            <Link href="/products" className="text-rose-600 font-medium hover:underline">
              View all products
            </Link>
          </div>
        )}
      </main>

      {/* SEO Content Article */}
      <SeoArticle sections={page.seoArticle} />

      {/* Cross-links */}
      <MoreSeoIdeas currentSlug={page.slug} relatedSlugs={page.relatedSlugs} />
    </div>
  );
}
