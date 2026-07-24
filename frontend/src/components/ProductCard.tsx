"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number;
  isMadeToOrder: boolean;
  images: { url: string; altText: string }[];
  category?: { name: string };
  variants?: any[];
  bestseller?: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]?.url || "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=600";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col gap-3"
    >
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden block">
        {product.isMadeToOrder && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-sm text-neutral-800">
            Made to Order
          </div>
        )}
        <Image 
          src={imageUrl} 
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button className="w-full bg-white/90 backdrop-blur-md text-neutral-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white shadow-lg">
            <ShoppingBag size={18} />
            Quick View
          </button>
        </div>
      </Link>
      
      <div>
        <div className="text-xs text-neutral-500 font-medium mb-1">
          {product.category?.name || "Handmade"}
        </div>
        <Link href={`/products/${product.slug}`} className="text-neutral-900 font-medium hover:text-rose-600 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-rose-600">₹{product.salePrice}</span>
              <span className="text-sm text-neutral-400 line-through">₹{product.basePrice}</span>
            </>
          ) : (
            <span className="text-lg font-bold">₹{product.basePrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
