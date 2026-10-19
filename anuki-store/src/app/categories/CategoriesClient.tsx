/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useSWR from 'swr';
import { apiGet } from "../../lib/api";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle, 
  Package, 
  Truck, 
  ArrowRight, 
  Heart,
  SlidersHorizontal
} from 'lucide-react';

const CATEGORY_META: Record<string, { badge: string; emoji: string; startingPrice: number; popularTag: string }> = {
  'flower-bouquets': {
    badge: 'Evergreen Bloomer',
    emoji: '💐',
    startingPrice: 499,
    popularTag: 'Most Gifted'
  },
  'flower-pots': {
    badge: 'Desk Decor Favorite',
    emoji: '🪴',
    startingPrice: 349,
    popularTag: 'Zero Water Needed'
  },
  'keychains': {
    badge: 'Everyday Keepsake',
    emoji: '🔑',
    startingPrice: 99,
    popularTag: 'Under ₹199'
  },
  'hair-accessories': {
    badge: 'Gentle & Cute',
    emoji: '🎀',
    startingPrice: 149,
    popularTag: 'Allergy-Safe Clips'
  },
  'toys': {
    badge: 'Amigurumi Plush',
    emoji: '🧸',
    startingPrice: 249,
    popularTag: 'Baby-Safe Cotton'
  }
};

const DEFAULT_CATEGORY_FALLBACKS: Record<string, string> = {
  'flower-bouquets': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/categories/9c84717b-f60d-4eb9-b511-04fae1fec5bd.webp',
  'flower-pots': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/categories/822ae450-00d6-43d7-bf07-e6f26ff113de.webp',
  'keychains': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/categories/3d08d091-caff-459c-98b5-2dd8acd5ea14.webp',
  'hair-accessories': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/categories/73b02eb3-b663-4d2c-8efc-810cdb4f1066.webp',
  'toys': 'https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/categories/34652fe6-19f2-4849-9455-283a54050dfc.webp'
};

export default function CategoriesClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { data: categories = [], isLoading } = useSWR('/categories', (url: string) => apiGet<any[]>(url), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Keep active categories (fallback to all if isActive not set)
  const activeCategories = useMemo(() => {
    return categories.filter((c: any) => c.isActive !== false && !c.parentId);
  }, [categories]);

  // Client-side filtering by search and quick tag
  const filteredCategories = useMemo(() => {
    return activeCategories.filter((cat: any) => {
      const matchesSearch = 
        !searchQuery.trim() ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'florals') return cat.slug === 'flower-bouquets' || cat.slug === 'flower-pots';
      if (selectedFilter === 'accessories') return cat.slug === 'keychains' || cat.slug === 'hair-accessories';
      if (selectedFilter === 'plushies') return cat.slug === 'toys';
      return true;
    });
  }, [activeCategories, searchQuery, selectedFilter]);

  const totalProductsCount = useMemo(() => {
    return activeCategories.reduce((acc: number, c: any) => acc + (c._count?.products || 0), 0);
  }, [activeCategories]);

  if (isLoading && categories.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-screen bg-[#fafaf9] px-4 py-8 pb-28">
        <div className="h-10 bg-neutral-200/60 rounded-2xl animate-pulse mb-6 max-w-md mx-auto"></div>
        <div className="h-20 bg-neutral-200/50 rounded-2xl animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/5] bg-neutral-200/60 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col pb-28 md:pb-16">
      
      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-rose-50/70 via-white to-[#fafaf9] border-b border-rose-100/60 pt-6 pb-8 md:pt-10 md:pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 bg-rose-100/80 text-rose-800 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 shadow-xs">
            <Sparkles size={14} className="text-rose-600" />
            <span>100% Handcrafted • Organic Milk Cotton</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-3">
            Handcrafted Collections
          </h1>

          <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Explore our curated crochet collections made loop by loop with love. Forever flowers, cuddly amigurumi, and charming accessories made to be treasured.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-5">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-neutral-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bouquets, keychains, plush toys..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200/90 rounded-full text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto hide-scrollbar py-1">
            <button 
              onClick={() => setSelectedFilter('all')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedFilter === 'all' 
                  ? 'bg-neutral-900 text-white shadow-sm' 
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              All ({activeCategories.length})
            </button>
            <button 
              onClick={() => setSelectedFilter('florals')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedFilter === 'florals' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-rose-50'
              }`}
            >
              🌸 Florals & Pots
            </button>
            <button 
              onClick={() => setSelectedFilter('plushies')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedFilter === 'plushies' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-rose-50'
              }`}
            >
              🧸 Amigurumi & Toys
            </button>
            <button 
              onClick={() => setSelectedFilter('accessories')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedFilter === 'accessories' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-rose-50'
              }`}
            >
              🔑 Keychains & Clips
            </button>
          </div>

          <div className="mt-3 text-xs text-neutral-500 font-medium">
            <span>{filteredCategories.length} collections matching</span>
            {totalProductsCount > 0 && <span> • {totalProductsCount}+ unique creations ready</span>}
          </div>

        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8 w-full flex-grow">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-sm max-w-lg mx-auto">
            <span className="text-4xl block mb-3">🧶</span>
            <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">No matching collection found</h3>
            <p className="text-sm text-neutral-600 mb-6">Try searching for bouquets, plush toys, keychains, or clear the search filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
              className="bg-rose-600 text-white font-semibold text-xs px-6 py-2.5 rounded-full hover:bg-rose-700 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredCategories.map((category: any) => {
              const meta = CATEGORY_META[category.slug] || {
                badge: 'Handmade Special',
                emoji: '✨',
                startingPrice: 199,
                popularTag: 'Handcrafted'
              };

              const displayImage = category.bannerUrl || 
                category.products?.[0]?.images?.[0]?.url || 
                DEFAULT_CATEGORY_FALLBACKS[category.slug];

              const productCount = category._count?.products || category.products?.length || 0;
              const startingPrice = category.products?.[0]?.salePrice || 
                category.products?.[0]?.basePrice || 
                meta.startingPrice;

              return (
                <article 
                  key={category.id}
                  className="group bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Banner */}
                    <Link 
                      href={`/products?category=${category.slug}`}
                      className="block relative aspect-[4/3] w-full overflow-hidden bg-rose-50/40"
                    >
                      {displayImage ? (
                        <Image 
                          src={displayImage}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
                          <span className="text-4xl mb-1">{meta.emoji}</span>
                          <span className="text-xs font-semibold">{category.name}</span>
                        </div>
                      )}
                      
                      {/* Gradient overlay for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="bg-white/95 backdrop-blur-md text-neutral-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white/50 flex items-center gap-1.5">
                          <span>{meta.emoji}</span>
                          <span>{meta.badge}</span>
                        </span>

                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                          {productCount} {productCount === 1 ? 'Design' : 'Designs'}
                        </span>
                      </div>

                      {/* Bottom Banner Title on Image */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-rose-200 drop-shadow-sm">
                          {meta.popularTag}
                        </span>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
                          {category.name}
                        </h2>
                      </div>
                    </Link>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5">
                      <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                        {category.description ? category.description.split('\n')[0] : 'Pure artisanal cotton creations handmade loop by loop.'}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                        <div>
                          <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                            Starting from
                          </span>
                          <span className="text-base font-bold text-neutral-900">
                            ₹{startingPrice}
                          </span>
                        </div>

                        <Link 
                          href={`/products?category=${category.slug}`}
                          className="inline-flex items-center gap-1.5 bg-neutral-900 text-white hover:bg-rose-600 font-semibold text-xs px-4 py-2 rounded-full transition-colors shadow-xs group/btn"
                        >
                          <span>Explore</span>
                          <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Spotlight: Custom Creations */}
      <section className="max-w-6xl mx-auto px-4 py-4 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-neutral-900 to-rose-950 text-white p-6 sm:p-8 md:p-10 shadow-lg">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-3 text-rose-100">
              <Sparkles size={12} /> Artisanal Commission Studio
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-2.5">
              Have a custom vision in mind?
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed mb-6">
              Choose your favorite yarn shades, personalized initials, and custom details. We hand-stitch bespoke crochet bouquets, amigurumi pets, and gifts crafted exclusively for your loved ones.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/custom" 
                className="inline-flex items-center gap-2 bg-white text-neutral-900 hover:bg-rose-50 text-xs sm:text-sm font-bold px-5 py-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <span>Request Custom Gift</span>
                <ArrowRight size={14} className="text-rose-600" />
              </Link>
              <a 
                href="https://wa.me/918434897767?text=Hi! I would like to request a custom crochet design."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-rose-200 hover:text-white px-3 py-2 font-medium transition-colors"
              >
                <span>Chat with Artisan on WhatsApp →</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Occasion Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600">Thoughtful Gifting</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">Popular Occasions</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-rose-600 hover:underline">
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link 
            href="/gifts/birthday"
            className="group flex flex-col p-4 bg-white rounded-2xl border border-neutral-200/80 hover:border-rose-300 hover:shadow-md transition-all text-center items-center"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎂</span>
            <h3 className="font-bold text-xs sm:text-sm text-neutral-900">Birthday Gifts</h3>
            <span className="text-[11px] text-neutral-500">Bouquets & Plush</span>
          </Link>

          <Link 
            href="/gifts/anniversary"
            className="group flex flex-col p-4 bg-white rounded-2xl border border-neutral-200/80 hover:border-rose-300 hover:shadow-md transition-all text-center items-center"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💍</span>
            <h3 className="font-bold text-xs sm:text-sm text-neutral-900">Anniversary</h3>
            <span className="text-[11px] text-neutral-500">Forever Roses</span>
          </Link>

          <Link 
            href="/gifts/under-499"
            className="group flex flex-col p-4 bg-white rounded-2xl border border-neutral-200/80 hover:border-rose-300 hover:shadow-md transition-all text-center items-center"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎁</span>
            <h3 className="font-bold text-xs sm:text-sm text-neutral-900">Under ₹499</h3>
            <span className="text-[11px] text-neutral-500">Pocket-Friendly</span>
          </Link>

          <Link 
            href="/custom"
            className="group flex flex-col p-4 bg-white rounded-2xl border border-neutral-200/80 hover:border-rose-300 hover:shadow-md transition-all text-center items-center"
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">✨</span>
            <h3 className="font-bold text-xs sm:text-sm text-neutral-900">Custom Orders</h3>
            <span className="text-[11px] text-neutral-500">Handmade For You</span>
          </Link>
        </div>
      </section>

      {/* Artisanal Guarantee Badges */}
      <section className="max-w-6xl mx-auto px-4 py-6 w-full">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">100% Milk Cotton Yarn</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">Soft, allergy-safe, hypoallergenic, and hand-stitched with love in India.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Package size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">Gift-Ready Packaging</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">Wrapped in tissue with custom handwritten message cards for your loved ones.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">PAN-India Express Shipping</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">Carefully boxed, insured, and tracked directly from our studio to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
