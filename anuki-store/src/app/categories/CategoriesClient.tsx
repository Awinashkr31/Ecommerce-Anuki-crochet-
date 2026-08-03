"use client";

import useSWR from 'swr';
import { apiGet } from "../../lib/api";
import Link from 'next/link';

export default function CategoriesClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: categories = [], isLoading } = useSWR('/categories', (url: string) => apiGet<any[]>(url));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeCategories = categories.filter((c: any) => c.isActive && !c.parentId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8 text-neutral-900">Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-square bg-neutral-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-black mb-8 text-neutral-900">Categories</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <Link 
          href="/products" 
          className="group relative rounded-2xl overflow-hidden aspect-square bg-rose-50 border-2 border-rose-100 hover:border-rose-300 transition-all flex items-center justify-center flex-col shadow-sm hover:shadow-md"
        >
          <h3 className="text-xl font-bold text-rose-900 z-10 text-center px-2">Shop All</h3>
          <p className="text-rose-600/80 text-sm mt-1 z-10">View all products</p>
        </Link>
        
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {activeCategories.map((category: any) => {
          const fallbackImage = category.products?.[0]?.images?.[0]?.url;
          const displayImage = category.bannerUrl || fallbackImage;
          
          return (
            <Link 
              key={category.id}
              href={`/products?category=${category.slug}`} 
              className="group relative rounded-2xl overflow-hidden aspect-square bg-neutral-100 shadow-sm hover:shadow-lg transition-all border border-neutral-200 block"
            >
              {displayImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={displayImage} 
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 font-medium">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6">
                <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-md group-hover:-translate-y-1 transition-transform">
                  {category.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
