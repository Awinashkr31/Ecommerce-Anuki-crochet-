"use client";
import { useState } from "react";
import { Scissors, Tag, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import CouponModal from "@/components/CouponModal";
import useSWR from "swr";

export default function CartOffers({ subtotal }: { subtotal: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applyingCode, setApplyingCode] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: availableCoupons = [] } = useSWR('/coupons/available/cart', (url: string) => apiGet<any[]>(url));
  
  const { appliedCoupon, setAppliedCoupon, items } = useCartStore();
  const { profile } = useAuthStore();
  

  const handleApply = async (couponCode: string) => {
    if (!profile) {
      toast.error("Please login to apply coupon codes.", {
        icon: '🔒',
        duration: 4000
      });
      return;
    }

    setApplyingCode(couponCode);
    try {
      const res = await apiPost("/coupons/validate", { 
        code: couponCode, 
        orderValue: subtotal,
        items: items
      });
      if (res.valid) {
        setAppliedCoupon({
          code: res.coupon.code,
          discount: res.discount,
          id: res.coupon.id,
        });
        toast.success(`Coupon ${res.coupon.code} applied successfully!`);
        setIsModalOpen(false);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Invalid coupon code");
    } finally {
      setApplyingCode(null);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  return (
    <>
      <div className="bg-white mb-2 pb-1 rounded-xl overflow-hidden shadow-sm border border-neutral-100">
        <div className="bg-[#f5f5f6] px-3 py-2 text-[11px] font-bold text-[#696e79] tracking-wider mb-1 uppercase">
          OFFERS
        </div>
        
        <div className="px-3 py-1">
          {!appliedCoupon ? (
            <div 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-between p-2.5 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-[#282c3f]" />
                <span className="text-xs font-bold text-[#282c3f]">Apply Coupon</span>
              </div>
              <ChevronRight size={16} className="text-neutral-400" />
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 pb-2">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-[#282c3f]">Coupon & Bank Offers</h3>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#ff3f6c] text-[11px] font-bold hover:underline"
                >
                  All Offers &gt;
                </button>
              </div>

              <div className="border border-[#03a685] bg-white rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative border border-dashed border-[#03a685] bg-[#e6f6f3] text-[#282c3f] font-bold text-xs px-3 py-1.5 inline-flex items-center uppercase">
                      <Scissors size={10} className="absolute -top-1.5 -left-1.5 text-[#03a685] transform -rotate-90 bg-white" />
                      {appliedCoupon.code}
                    </div>
                    <span className="text-[#03a685] font-bold text-sm">Saved ₹{appliedCoupon.discount}</span>
                  </div>
                  <button 
                    onClick={handleRemove}
                    className="text-[#ff3f6c] text-xs font-bold hover:underline transition-colors uppercase"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CouponModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableCoupons={availableCoupons}
        subtotal={subtotal}
        onApply={handleApply}
        isApplying={applyingCode !== null}
      />
    </>
  );
}
