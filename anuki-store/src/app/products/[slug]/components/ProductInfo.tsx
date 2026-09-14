"use client";
import { Star, Share2 } from "lucide-react";
import useSWR from "swr";
import { apiGet } from "@/lib/api";

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
  const { data: reviews = [] } = useSWR<any[]>(`/reviews/product/${product.id}`, apiGet);
  
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-4 mb-6">
      
      {/* Reviews & Hot Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#8c3a44]">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={10} className={i <= Math.round(Number(averageRating)) ? "fill-[#8c3a44]" : "text-neutral-200 fill-neutral-100"} />
            ))}
          </div>
          {reviews.length > 0 ? (
            <span className="text-[10px] font-bold text-neutral-500 ml-1">{averageRating} <span className="font-normal text-neutral-400">({reviews.length} reviews)</span></span>
          ) : (
            <span className="text-[10px] text-neutral-500 font-medium ml-1">No reviews</span>
          )}
        </div>
      </div>

      {/* Title & Share */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#333333] tracking-tight leading-tight">
          {product.name}
        </h1>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: product.name,
                text: `Check out this handmade ${product.name}!`,
                url: window.location.href
              }).catch(console.error);
            }
          }}
          className="w-10 h-10 shrink-0 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors mt-1"
        >
          <Share2 size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Pricing */}
      <div className="space-y-1">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-[#8c3a44]">
            ₹{displayPrice}
          </span>
          {originalPrice && (
            <span className="text-sm font-semibold text-neutral-400 line-through mb-1.5">
              ₹{originalPrice}
            </span>
          )}
          {originalPrice && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm mb-2 ml-1">
              Save ₹{originalPrice - displayPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
          <span>Inclusive of all taxes</span>
          <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>
            Free Express Delivery
          </span>
        </div>
      </div>

    </div>
  );
}
