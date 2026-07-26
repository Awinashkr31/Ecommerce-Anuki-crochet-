"use client";
import { useState } from "react";
import Image from "next/image";
import { Tag, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderSummary({ 
  items, 
  subtotal, 
  shippingCost, 
  discount, 
  total,
  couponCode,
  setCouponCode,
  onApplyCoupon,
  couponApplied
}: {
  items: any[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  couponCode: string;
  setCouponCode: (c: string) => void;
  onApplyCoupon: () => void;
  couponApplied: boolean;
}) {
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApply = () => {
    if (!couponCode) return;
    setLoadingCoupon(true);
    setTimeout(() => {
      onApplyCoupon();
      setLoadingCoupon(false);
    }, 600);
  };

  return (
    <div className="bg-neutral-50/50 rounded-[24px] p-6 sm:p-8 border border-neutral-100 lg:sticky lg:top-8">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex gap-4 group">
            <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden border border-neutral-100 flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-neutral-100" />
              )}
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 py-1">
              <h4 className="font-bold text-neutral-900 text-sm line-clamp-2">{item.name}</h4>
              <p className="text-xs text-neutral-500 mt-1 capitalize">{item.color} {item.size ? `/ ${item.size}` : ''}</p>
              <p className="text-sm font-bold text-rose-500 mt-2">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-neutral-200 my-6"></div>

      {/* Coupon Section */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-neutral-900 mb-2">Discount Code</label>
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            placeholder="e.g. WELCOME10" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied || loadingCoupon}
            className="w-full pl-4 pr-10 py-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-rose-500 transition-colors uppercase disabled:bg-neutral-100 disabled:text-neutral-500 font-medium"
          />
          <button 
            onClick={handleApply}
            disabled={!couponCode || couponApplied || loadingCoupon}
            className="absolute right-1 top-1 bottom-1 px-4 bg-neutral-900 text-white rounded-lg text-sm font-bold hover:bg-black disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors flex items-center justify-center min-w-[80px]"
          >
            {loadingCoupon ? <Loader2 size={16} className="animate-spin" /> : couponApplied ? <CheckCircle2 size={16} className="text-emerald-400" /> : 'Apply'}
          </button>
        </div>
        <AnimatePresence>
          {couponApplied && (
            <motion.p 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-1.5"
            >
              <Tag size={14} /> '{couponCode.toUpperCase()}' applied successfully!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Totals */}
      <div className="space-y-3 text-sm text-neutral-600">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-bold text-neutral-900">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="font-bold text-neutral-900">{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span>Discount</span>
            <span className="font-bold">-₹{discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-neutral-200 my-6"></div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-neutral-500">Total Amount</p>
          <p className="text-xs text-neutral-400">Including all taxes</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-neutral-900">₹{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
