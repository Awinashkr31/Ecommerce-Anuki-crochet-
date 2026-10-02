"use client";
import { useState } from "react";
import { CheckCircle2, Info, ShieldCheck, Heart, Truck, Lock } from "lucide-react";
import Image from "next/image";

export default function ProductAccordions({ product }: { product: any }) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  return (
    <div className="mt-8 space-y-8 pb-4">
      
      {/* The Story Behind the Stitch */}
      <div>
        <h2 className="text-lg font-bold font-serif text-[#8c3a44] flex items-center gap-2 mb-3">
          <Heart size={18} /> The Story Behind the Stitch
        </h2>
        <p className={`text-xs text-neutral-600 leading-relaxed ${isDescExpanded ? '' : 'line-clamp-5'}`}>
          {product.fullDesc || product.shortDesc || "A soft handmade crochet amigurumi plush. This beautiful crochet animal toy is a perfect crochet plush toy gift for kids, birthdays, anniversaries, or heartfelt Valentine gifting. Lovingly crocheted over 6 hours by passionate women artisans."}
        </p>
        <button 
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="text-xs font-bold text-[#8c3a44] mt-2 underline"
        >
          {isDescExpanded ? 'Read Less' : 'See More'}
        </button>
      </div>

      {/* Product Details & Materials */}
      <div>
        <h2 className="text-lg font-bold font-serif text-neutral-800 flex items-center gap-2 mb-3">
          <Info size={18} /> Product Details & Materials
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#fcf8f7] rounded-2xl p-3 border border-rose-50/50">
            <span className="text-[10px] text-neutral-600 block mb-1">Yarn Type</span>
            <span className="text-xs font-bold text-neutral-900 leading-tight block">{product.material || "Plush Chenille & Milk Cotton"}</span>
          </div>
          <div className="bg-[#fcf8f7] rounded-2xl p-3 border border-rose-50/50">
            <span className="text-[10px] text-neutral-600 block mb-1">Inner Stuffing</span>
            <span className="text-xs font-bold text-neutral-900 leading-tight block">Hypoallergenic Polyfill</span>
          </div>
          <div className="bg-[#fcf8f7] rounded-2xl p-3 border border-rose-50/50">
            <span className="text-[10px] text-neutral-600 block mb-1">Dimensions</span>
            <span className="text-xs font-bold text-neutral-900 leading-tight block">
              {(product.length || product.width || product.height) ? `${product.length || '-'} x ${product.width || '-'} x ${product.height || '-'} cm` : "20cm x 14cm x 28cm"}
            </span>
          </div>
          <div className="bg-[#fcf8f7] rounded-2xl p-3 border border-rose-50/50">
            <span className="text-[10px] text-neutral-600 block mb-1">Weight & Origin</span>
            <span className="text-xs font-bold text-neutral-900 leading-tight block">{product.weight ? `${product.weight}g` : '317g'} • Handcrafted in {product.countryOfOrigin || 'India'}</span>
          </div>
        </div>
      </div>

      {/* Artisan Care Guide */}
      <div className="bg-[#fcf8f7] rounded-2xl p-4 border border-rose-100/50 flex gap-4 items-start">
        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
          <Heart size={18} className="text-[#8c3a44]" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-neutral-900 mb-1">Artisan Care Guide</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {product.careInstructions || "Spot clean gently with a damp microfiber cloth. If required, hand wash in cold water using baby shampoo and dry flat in the shade to preserve fluffiness."}
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex justify-between items-center py-4 border-t border-neutral-100">
        <div className="flex flex-col items-center gap-1.5 text-center w-1/3 px-1">
          <Truck size={18} className="text-[#8c3a44]" />
          <span className="text-[9px] font-bold text-neutral-900">24-48h Dispatch</span>
          <span className="text-[10px] text-neutral-500 leading-tight">Express tracking</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center w-1/3 px-1 border-x border-neutral-100">
          <ShieldCheck size={18} className="text-[#8c3a44]" />
          <span className="text-[9px] font-bold text-neutral-900">100% Baby-Safe</span>
          <span className="text-[10px] text-neutral-500 leading-tight">Non-toxic yarns</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center w-1/3 px-1">
          <Lock size={18} className="text-[#8c3a44]" />
          <span className="text-[9px] font-bold text-neutral-900">Safe Checkout</span>
          <span className="text-[10px] text-neutral-500 leading-tight">UPI, Cards, COD</span>
        </div>
      </div>

    </div>
  );
}
