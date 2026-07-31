"use client";
import { Star, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductInfo({ 
  product, 
  displayPrice, 
  originalPrice, 
  discount, 
  inStock 
}: { 
  product: any, 
  displayPrice: number, 
  originalPrice: number | null, 
  discount: number | null, 
  inStock: boolean 
}) {
  return (
    <div className="space-y-6">
      {/* Badges & Breadcrumb (Mobile only, hidden on desktop if moved to top) */}
      <div className="flex flex-wrap gap-2">
        {product.isHandmade && (
          <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-100">
            Handmade
          </span>
        )}
        {product.bestseller && (
          <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">
            Best Seller
          </span>
        )}
        {product.limitedEdition && (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
            Limited Edition
          </span>
        )}
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
            <span className="text-sm font-bold text-neutral-900 ml-1">4.9</span>
            <span className="text-sm text-neutral-500 font-medium ml-1">(128 Reviews)</span>
          </div>
          <div className="w-1 h-1 bg-neutral-300 rounded-full"></div>
          <span className="text-sm font-medium text-emerald-600">300+ Sold</span>
        </div>
      </div>

      <div className="flex items-end gap-3">
        <motion.span 
          key={displayPrice}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-rose-600"
        >
          ₹{displayPrice}
        </motion.span>
        {originalPrice && (
          <span className="text-lg font-bold text-neutral-400 line-through mb-1">
            ₹{originalPrice}
          </span>
        )}
        {discount && (
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-1.5 ml-2">
            {discount}% OFF
          </span>
        )}
      </div>

      <p className="text-base text-neutral-600 leading-relaxed max-w-xl">
        {product.shortDesc}
      </p>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-bold ${inStock ? 'text-emerald-700' : 'text-red-600'}`}>
          {inStock ? 'In Stock & Ready to Ship' : 'Out of Stock'}
        </span>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100 mt-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" size={24} />
          <div className="text-sm">
            <p className="font-bold text-neutral-900">Secure Payment</p>
            <p className="text-neutral-500">256-bit SSL</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Heart className="text-rose-500" size={24} />
          <div className="text-sm">
            <p className="font-bold text-neutral-900">Made with Love</p>
            <p className="text-neutral-500">100% Quality</p>
          </div>
        </div>
      </div>
    </div>
  );
}
