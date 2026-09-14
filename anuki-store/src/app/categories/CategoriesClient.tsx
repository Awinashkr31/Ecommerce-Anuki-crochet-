/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from 'swr';
import { apiGet } from "../../lib/api";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, CheckCircle, Package, Truck } from 'lucide-react';

export default function CategoriesClient() {
  const router = useRouter();
  const { data: categories = [], isLoading } = useSWR('/categories', (url: string) => apiGet<any[]>(url));
  const activeCategories = categories.filter((c: any) => c.isActive && !c.parentId);

  const fallbackImage1 = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp";
  const fallbackImage2 = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/bf4cf952-311e-4294-b79f-129258fe612e.webp";
  const fallbackImage3 = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp";
  
  const getCategoryImage = (slug: string, fallback: string) => {
    const cat = categories.find((c: any) => c.slug === slug);
    return cat?.bannerUrl || cat?.products?.[0]?.images?.[0]?.url || fallback;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto min-h-screen bg-[#faf5f4] flex flex-col relative pb-24">
        <section className="px-4 pt-4 pb-2">
          <div className="h-10 bg-white/50 rounded-2xl animate-pulse"></div>
        </section>
        <section className="px-4 pt-3 pb-3">
          <div className="h-10 w-48 bg-neutral-200 animate-pulse rounded-lg mb-2"></div>
          <div className="h-4 w-3/4 bg-neutral-200 animate-pulse rounded-lg"></div>
        </section>
        <section className="px-4 py-3">
          <div className="grid grid-cols-2 gap-3.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[3/4] bg-neutral-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[768px] mx-auto min-h-[80vh] bg-[#faf5f4] flex flex-col relative">
      <main className="flex-grow flex flex-col">
        {/* Search & Filter Bar */}
        <section className="px-4 pt-4 pb-2">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const query = new FormData(e.currentTarget).get('q')?.toString().trim();
              if (query) router.push(`/products?search=${encodeURIComponent(query)}`);
            }}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#e5989b]" />
              </div>
              <input 
                name="q"
                type="search" 
                placeholder="Search categories, plushies, flowers..." 
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#eddcd9] rounded-2xl text-xs text-[#2d2426] placeholder:text-[#5b4a4d]/50 focus:outline-none focus:border-[#be4b5c] focus:ring-1 focus:ring-[#be4b5c] shadow-sm transition-all"
              />
            </div>
            <button 
              type="button" 
              aria-label="Filter products" 
              className="w-10 h-10 rounded-2xl border border-[#eddcd9] bg-white flex items-center justify-center text-[#9f3647] hover:bg-[#fff0f0]/50 transition-colors shadow-sm active:scale-95 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* Page Header */}
        <section className="px-4 pt-3 pb-3">
          <div className="flex items-baseline justify-between mb-1">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#9f3647]">Categories</h1>
            <span className="text-[11px] font-semibold text-[#be4b5c]/90 bg-[#fff0f0] px-2.5 py-1 rounded-full border border-[#eddcd9]/70">
              {activeCategories.length} Collections
            </span>
          </div>
          <p className="text-xs text-[#5b4a4d] leading-relaxed max-w-[95%]">
            Explore our handcrafted world made loop by loop with love & organic milk cotton yarn.
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-[#5b4a4d]/70 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#be4b5c] inline-block"></span>
            <span>40+ unique creations in stock & custom-crafted</span>
          </div>
        </section>

        {/* Category Quick Filters */}
        <section className="px-4 py-2">
          <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
            <button className="shrink-0 px-3.5 py-1.5 bg-[#be4b5c] text-white text-xs font-semibold rounded-full shadow-sm shadow-[#be4b5c]/20 transition-transform active:scale-95">
              All ({activeCategories.length})
            </button>
            <button className="shrink-0 px-3.5 py-1.5 bg-white border border-[#eddcd9] text-[#2d2426] text-xs font-medium rounded-full hover:bg-[#fff0f0] active:scale-95 transition-colors">
              🔥 Bestsellers
            </button>
            <button className="shrink-0 px-3.5 py-1.5 bg-white border border-[#eddcd9] text-[#2d2426] text-xs font-medium rounded-full hover:bg-[#fff0f0] active:scale-95 transition-colors">
              🧸 Plushies
            </button>
            <button className="shrink-0 px-3.5 py-1.5 bg-white border border-[#eddcd9] text-[#2d2426] text-xs font-medium rounded-full hover:bg-[#fff0f0] active:scale-95 transition-colors">
              🌸 Florals
            </button>
          </nav>
        </section>

        {/* Primary Category Grid */}
        <section className="px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 md:gap-5">
            {activeCategories.map((category: any, i: number) => {
              const fallbackImage = category.products?.[0]?.images?.[0]?.url;
              const displayImage = category.bannerUrl || fallbackImage;
              
              // Mock tags and prices based on index for the artisanal feel
              const tags = ['Bestseller', 'Popular', 'Bridal & Gift', 'Under ₹300', 'New', 'Made to Order', 'Evergreen Accents', 'Luxury Hamper'];
              const prices = ['249', '499', '1,199', '99', '119', '349', '399', '799'];
              const tag = tags[i % tags.length];
              const price = prices[i % prices.length];
              
              return (
                <article key={category.id} className="bg-white rounded-2xl overflow-hidden border border-[#eddcd9] shadow-[0_2px_10px_rgba(45,36,38,0.04)] flex flex-col justify-between group hover:border-[#e5989b] transition-all active:scale-[0.98]">
                  <Link href={`/products?category=${category.slug}`} className="block relative aspect-square w-full overflow-hidden bg-[#fff8f7]">
                    {displayImage ? (
                      <Image 
                        src={displayImage}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#fff0f0] text-[#e5989b] text-3xl">🧶</div>
                    )}
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[#2d2426] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#eddcd9]/50 shadow-sm">
                      {tag}
                    </span>
                  </Link>
                  <div className="p-3 flex flex-col flex-grow justify-between">
                    <Link href={`/products?category=${category.slug}`}>
                      <h2 className="font-serif font-bold text-sm text-[#2d2426] group-hover:text-[#be4b5c] transition-colors leading-tight line-clamp-2">
                        {category.name}
                      </h2>
                      <p className="text-[11px] text-[#5b4a4d]/75 mt-0.5">{category.products?.length || 0} items</p>
                    </Link>
                    <div className="mt-2.5 pt-2 border-t border-[#eddcd9]/50 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#9f3647]">From ₹{price}</span>
                      <Link href={`/products?category=${category.slug}`} className="text-[#be4b5c] text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                        →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Featured Spotlight Banner */}
        <section className="px-4 py-4 mt-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#be4b5c] to-[#9f3647] text-white p-5 shadow-[0_4px_20px_-2px_rgba(190,75,92,0.08)]">
            <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
              <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
              </svg>
            </div>
            <div className="relative z-10">
              <span className="inline-block uppercase tracking-wider text-[10px] font-bold bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full mb-2">
                Artisanal Studio
              </span>
              <h3 className="font-serif text-xl font-bold leading-tight mb-1.5">
                Co-Create Your Custom Amigurumi or Bouquet
              </h3>
              <p className="text-xs text-[#fff0f0]/90 leading-relaxed mb-4 max-w-[90%]">
                Choose your favorite yarn shades, personalized tags, and custom details crafted exclusively for your loved ones.
              </p>
              <Link href="/custom" className="inline-flex items-center gap-2 bg-white text-[#2d2426] hover:bg-[#fff0f0] text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-sm transition-all active:scale-95">
                <span>Design Bespoke Gift</span>
                <span className="text-[#be4b5c] font-bold">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Shop by Occasion */}
        <section className="px-4 py-3 mt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg font-bold text-[#9f3647]">Shop by Occasion</h2>
            <Link href="/products" className="text-xs font-semibold text-[#be4b5c] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
            <Link href="/products?category=toys" className="flex items-center p-3 bg-white border border-[#eddcd9] rounded-2xl hover:border-[#e5989b] transition-colors active:scale-[0.98] shadow-sm group">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shrink-0 border border-neutral-100 shadow-sm relative group-hover:scale-105 transition-transform">
                <Image src={getCategoryImage('toys', fallbackImage1)} alt="Birthday Keepsakes" fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#2d2426]">Birthday Keepsakes</span>
                <span className="block text-[10px] text-[#5b4a4d]/70">Plush & Cards</span>
              </div>
            </Link>
            <Link href="/products?category=flower-pots" className="flex items-center p-3 bg-white border border-[#eddcd9] rounded-2xl hover:border-[#e5989b] transition-colors active:scale-[0.98] shadow-sm group">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shrink-0 border border-neutral-100 shadow-sm relative group-hover:scale-105 transition-transform">
                <Image src={getCategoryImage('flower-pots', fallbackImage2)} alt="Anniversary Flowers" fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#2d2426]">Anniversary Flowers</span>
                <span className="block text-[10px] text-[#5b4a4d]/70">Never-Wilting Roses</span>
              </div>
            </Link>
            <Link href="/products?category=toys" className="flex items-center p-3 bg-white border border-[#eddcd9] rounded-2xl hover:border-[#e5989b] transition-colors active:scale-[0.98] shadow-sm group">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shrink-0 border border-neutral-100 shadow-sm relative group-hover:scale-105 transition-transform">
                <Image src={fallbackImage3} alt="Baby & Nursery" fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#2d2426]">Baby & Nursery</span>
                <span className="block text-[10px] text-[#5b4a4d]/70">Safe Milk Cotton</span>
              </div>
            </Link>
            <Link href="/products?category=keychains" className="flex items-center p-3 bg-white border border-[#eddcd9] rounded-2xl hover:border-[#e5989b] transition-colors active:scale-[0.98] shadow-sm group">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shrink-0 border border-neutral-100 shadow-sm relative group-hover:scale-105 transition-transform">
                <Image src={getCategoryImage('keychains', fallbackImage1)} alt="Budget Treats" fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-[#2d2426]">Budget Treats</span>
                <span className="block text-[10px] text-[#5b4a4d]/70">Gifts Under ₹300</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Artisanal Guarantee */}
        <section className="mt-6 mb-8 px-4 py-6 bg-white/70 border-y border-[#eddcd9]/80">
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fff0f0] flex items-center justify-center shrink-0 text-[#be4b5c]">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2d2426]">100% Handcrafted with Milk Cotton</h4>
                <p className="text-[11px] text-[#5b4a4d] leading-snug mt-0.5">Soft, allergy-safe, and carefully hand-stitched one stitch at a time.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fff0f0] flex items-center justify-center shrink-0 text-[#be4b5c]">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2d2426]">Plastic-Free Eco Packaging</h4>
                <p className="text-[11px] text-[#5b4a4d] leading-snug mt-0.5">Wrapped in biodegradable tissue, ribbons, and hand-written notes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fff0f0] flex items-center justify-center shrink-0 text-[#be4b5c]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2d2426]">PAN-India Express Delivery</h4>
                <p className="text-[11px] text-[#5b4a4d] leading-snug mt-0.5">Safely boxed and tracked from our boutique workshop to your door.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
