"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import React from "react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  wholesalePrice?: number;
  isMadeToOrder: boolean;
  images: { url: string; altText: string }[];
  category?: { name: string; slug?: string };
  variants?: any[];
  bestseller?: boolean;
  isNew?: boolean;
  status?: string;
  stockStatus?: string;
}

const ProductCardComponent = ({ product }: { product: Product }) => {
  const { profile } = useAuthStore();
  const isB2B = profile?.role === 'B2B_CUSTOMER';

  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=600";
  const secondaryImage = product.images?.[1]?.url || primaryImage; // Fallback to zoom on hover if no second image

  let displayPrice = product.salePrice || product.basePrice;
  let originalPrice = product.salePrice ? product.basePrice : null;

  if (isB2B && product.wholesalePrice) {
    displayPrice = product.wholesalePrice;
    originalPrice = product.basePrice;
  }

  const discount = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : null;
  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = hasVariants 
    ? product.variants!.some(v => v.stock > 0) 
    : product.stockStatus !== 'OUT_OF_STOCK';

  // Extract unique colors for swatches
  const colors = Array.from(new Set((product.variants || []).filter(v => v.color).map(v => v.color)));
  const colorMap: Record<string, string> = {
    'Yellow': '#FDE047', 'Pink': '#F9A8D4', 'Blue': '#93C5FD', 'Green': '#86EFAC',
    'Red': '#FCA5A5', 'Black': '#1F2937', 'White': '#F9FAFB'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col gap-4 relative w-full"
    >
      <div className="relative aspect-[4/5] bg-neutral-100 rounded-[20px] overflow-hidden block">
        
        {/* Badges */}
        <div className="absolute top-0 left-0 z-20 flex flex-col items-start gap-1">
          {product.bestseller && (
            <span className="bg-orange-100 text-orange-600 text-[11px] font-bold capitalize tracking-wide px-4 py-1.5 rounded-br-[20px]">
              Bestseller
            </span>
          )}
          {product.isNew && !product.bestseller && (
            <span className="bg-orange-100 text-orange-600 text-[11px] font-bold capitalize tracking-wide px-4 py-1.5 rounded-br-[20px]">
              New
            </span>
          )}
          {product.isMadeToOrder && (
            <span className="bg-white/90 backdrop-blur text-neutral-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-br-[20px] shadow-sm">
              Handmade
            </span>
          )}
          {discount && !product.bestseller && (
            <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-br-[20px] shadow-sm">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-br-[20px] shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Images */}
        <Link href={`/products/${product.slug}`} prefetch={false} className="relative block w-full h-full">
            <Image 
              src={primaryImage} 
              alt={product.name} 
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${product.images?.length > 1 ? 'group-hover:opacity-0' : ''}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {product.images?.length > 1 && (
              <Image 
                src={secondaryImage} 
                alt={`${product.name} alternate view`}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
          )}
        </Link>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none lg:pointer-events-auto">
          <button className="w-full bg-white/95 backdrop-blur-md text-neutral-900 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-transform active:scale-[0.98]">
            <ShoppingBag size={16} />
            Quick Add
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <div className="text-xs text-neutral-500 font-medium">
            {product.category?.name || "Premium Craft"}
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-neutral-900">4.9</span>
          </div>
        </div>
        
        <Link href={`/products/${product.slug}`} prefetch={false} className="text-neutral-900 font-bold hover:text-rose-600 transition-colors line-clamp-1 text-base">
          {product.name}
        </Link>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {originalPrice ? (
              <>
                <span className="text-base font-black text-rose-600">₹{displayPrice}</span>
                <span className="text-sm font-semibold text-neutral-400 line-through">₹{originalPrice}</span>
              </>
            ) : (
              <span className="text-base font-black text-neutral-900">₹{displayPrice}</span>
            )}
          </div>

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.slice(0, 3).map((c, i) => (
                <div 
                  key={i} 
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: colorMap[c] || '#e5e7eb' }}
                />
              ))}
              {colors.length > 3 && (
                <span className="text-[10px] font-bold text-neutral-400 ml-0.5">+{colors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
