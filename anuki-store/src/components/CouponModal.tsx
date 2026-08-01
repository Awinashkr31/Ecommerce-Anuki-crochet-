"use client";

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableCoupons: any[];
  subtotal: number;
  onApply: (couponCode: string) => Promise<void>;
  isApplying: boolean;
}

export default function CouponModal({
  isOpen,
  onClose,
  availableCoupons,
  subtotal,
  onApply,
  isApplying
}: CouponModalProps) {
  const [manualCode, setManualCode] = useState('');
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCode(null);
      setManualCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Split coupons into applicable and locked
  const applicableCoupons = availableCoupons.filter(c => subtotal >= c.minOrderValue);
  const lockedCoupons = availableCoupons.filter(c => subtotal < c.minOrderValue);

  // Calculate maximum savings for the preview
  const getMaximumSavings = () => {
    if (!selectedCode) return 0;
    const coupon = availableCoupons.find(c => c.code === selectedCode);
    if (!coupon) return 0; // Might be a manual code
    
    if (coupon.type === 'PERCENTAGE') {
      const calculated = subtotal * (coupon.value / 100);
      return Math.round(coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated);
    } else if (coupon.type === 'FLAT') {
      return coupon.value;
    } else if (coupon.type === 'FREE_SHIPPING') {
      return subtotal >= 500 ? 0 : 50; // Mock delivery charge
    }
    return 0;
  };

  const maxSavings = getMaximumSavings();

  const handleApplyClick = () => {
    if (selectedCode) {
      onApply(selectedCode);
    } else if (manualCode.trim()) {
      onApply(manualCode.trim());
    }
  };

  const handleCheckboxChange = (code: string) => {
    if (selectedCode === code) {
      setSelectedCode(null);
    } else {
      setSelectedCode(code);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minStr = minutes < 10 ? '0' + minutes : minutes;
    
    const nth = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    };

    return `${day}${nth(day)} ${month} ${year} | ${hours}:${minStr} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-[85vh] sm:rounded-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in duration-150 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-neutral-100 bg-white sm:rounded-t-2xl shrink-0">
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-full transition-colors active:scale-95">
            <X size={24} strokeWidth={1.5} className="text-[#282c3f]" />
          </button>
          <h2 className="text-[13px] font-bold text-[#282c3f] tracking-wide">COUPONS</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-white pb-[80px]">
          
          {/* Manual Input */}
          <div className="p-4 border-b border-neutral-100">
            <div className="flex items-center justify-between border border-neutral-300 rounded overflow-hidden p-3">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value);
                  if (selectedCode) setSelectedCode(null);
                }}
                className="flex-1 text-sm outline-none text-[#282c3f] placeholder:text-[#535766]"
              />
              <button 
                onClick={() => handleApplyClick()}
                disabled={!manualCode.trim() || isApplying}
                className="text-[#ff3f6c] font-bold text-xs uppercase tracking-wider disabled:opacity-50"
              >
                CHECK
              </button>
            </div>
          </div>

          {/* Applicable Coupons */}
          {applicableCoupons.length > 0 && (
            <div className="flex flex-col">
              {applicableCoupons.map((coupon) => (
                <div key={coupon.id} className="flex gap-4 p-5 border-b border-neutral-100">
                  <div className="pt-1 shrink-0">
                    <input 
                      type="checkbox" 
                      checked={selectedCode === coupon.code}
                      onChange={() => handleCheckboxChange(coupon.code)}
                      className="w-[18px] h-[18px] rounded-[3px] border-2 border-neutral-300 text-[#ff3f6c] focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-[#ff3f6c] checked:border-[#ff3f6c] relative before:content-[''] before:absolute before:hidden checked:before:block before:w-[5px] before:h-[9px] before:border-r-2 before:border-b-2 before:border-white before:rotate-45 before:left-[5px] before:top-[1px]"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex border border-dashed border-[#282c3f] font-bold text-xs px-3 py-1.5 uppercase text-[#282c3f]">
                      {coupon.code}
                    </div>
                    
                    <div className="mt-3 font-bold text-[13px] text-[#282c3f]">
                      Save ₹{coupon.type === 'PERCENTAGE' ? Math.round(subtotal * (coupon.value / 100)) : coupon.value}
                    </div>
                    
                    <div className="mt-1 text-[13px] text-[#535766] leading-relaxed">
                      {coupon.description || (coupon.type === 'PERCENTAGE' ? `${coupon.value}% off on eligible items` : `Flat Rs. ${coupon.value} off`)}
                      <span className="text-[#ff3f6c] font-bold ml-1 cursor-pointer">more</span>
                    </div>
                    
                    {coupon.validTo && (
                      <div className="mt-2 text-[11px] text-[#7e818c]">
                        Expires on: {formatDate(coupon.validTo)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Locked Coupons */}
          {lockedCoupons.length > 0 && (
            <div className="flex flex-col bg-white">
              <div className="bg-[#f5f5f6] px-5 py-3 text-[11px] font-bold text-[#696e79] tracking-widest uppercase">
                UNLOCK MORE COUPONS
              </div>
              
              {lockedCoupons.map((coupon) => (
                <div key={coupon.id} className="flex gap-4 p-5 border-b border-neutral-100 opacity-60">
                  <div className="pt-1 shrink-0">
                    <div className="w-[18px] h-[18px] rounded-[3px] border-2 border-neutral-300 bg-neutral-100 cursor-not-allowed"></div>
                  </div>
                  <div className="flex-1">
                    <div className="inline-flex border border-dashed border-[#7e818c] font-bold text-xs px-3 py-1.5 uppercase text-[#7e818c]">
                      {coupon.code}
                    </div>
                    
                    <div className="mt-3 font-bold text-[13px] text-[#7e818c]">
                      Save ₹{coupon.value}
                    </div>
                    
                    <div className="mt-1 text-[13px] text-[#7e818c] leading-relaxed">
                      {coupon.description || `On minimum purchase of Rs. ${coupon.minOrderValue}`}
                    </div>
                    
                    {coupon.validTo && (
                      <div className="mt-2 text-[11px] text-[#7e818c]">
                        Expires on: {formatDate(coupon.validTo)}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-dashed border-neutral-200">
                      <div className="text-[13px] text-[#282c3f]">
                        Shop for Rs. {coupon.minOrderValue - subtotal} more to apply.
                      </div>
                      <div className="text-[#ff3f6c] font-bold text-xs mt-1 cursor-pointer">
                        View applicable items &gt;
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#282c3f]">Maximum savings:</span>
            <span className="text-lg font-bold text-[#282c3f]">₹{maxSavings}</span>
          </div>
          <button 
            onClick={handleApplyClick}
            disabled={(!selectedCode && !manualCode.trim()) || isApplying}
            className="bg-[#ff3f6c] text-white font-bold text-sm px-10 py-3 rounded hover:bg-[#ff3f6c]/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
          >
            {isApplying ? <Loader2 size={18} className="animate-spin" /> : 'APPLY'}
          </button>
        </div>
      </div>
    </div>
  );
}
