"use client";
import { useState } from "react";
import { Tag, Loader2, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export default function CouponSection({ subtotal }: { subtotal: number }) {
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { appliedCoupon, setAppliedCoupon, items } = useCartStore();
  const { profile } = useAuthStore();

  const handleApply = async () => {
    if (!couponCode.trim()) return;
    
    if (!profile) {
      toast.error("Please login to apply coupon codes.", {
        icon: '🔒',
        duration: 4000
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiPost("/coupons/validate", { 
        code: couponCode.trim().toUpperCase(), 
        orderValue: subtotal,
        items: items
      });
      if (res.valid) {
        setAppliedCoupon({
          code: res.coupon.code,
          discount: res.discount,
          id: res.coupon.id,
        });
        setCouponCode("");
        toast.success(`Coupon ${res.coupon.code} applied successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid coupon code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  if (appliedCoupon) {
    return (
      <div className="bg-emerald-50 rounded-[20px] border border-emerald-100 p-5 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3 text-emerald-800 font-medium">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <div>
            <span className="font-bold">'{appliedCoupon.code}'</span> applied
            <p className="text-xs text-emerald-600 mt-0.5">You saved ₹{appliedCoupon.discount}</p>
          </div>
        </div>
        <button onClick={handleRemove} className="text-emerald-400 hover:text-emerald-600 p-1">
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-neutral-800 font-medium mb-1">
        <Tag size={18} className="text-neutral-400" />
        Apply Coupon
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 transition-all font-medium uppercase text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleApply();
          }}
        />
        <button
          onClick={handleApply}
          disabled={isLoading || !couponCode.trim()}
          className="px-6 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-xl hover:bg-black disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors flex items-center justify-center min-w-[90px]"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
        </button>
      </div>
    </div>
  );
}
