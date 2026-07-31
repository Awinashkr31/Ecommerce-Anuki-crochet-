"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard, Product } from '@/components/ProductCard';
import { apiGet } from '@/lib/api';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    Promise.all([
      apiGet<any>(`/categories/slug/${slug}`),
      apiGet<Product[]>('/products')
    ]).then(([catData, prodsData]) => {
      setCategory(catData);
      if (prodsData) {
        const filtered = prodsData.filter(p => 
          p.status === 'PUBLISHED' && 
          p.category?.slug === slug
        );
        setProducts(filtered);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <Link href="/products" className="text-rose-600 hover:underline">Browse all products</Link>
      </div>
    );
  }

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
            {/* Answer Engine Optimization Block */}
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
              <ProductCard key={product.id} product={product} />
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
