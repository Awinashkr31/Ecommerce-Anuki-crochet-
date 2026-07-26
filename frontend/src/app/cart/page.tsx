"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, X, Minus, Plus, Tag, ShieldCheck, Truck, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isGiftPacked, setIsGiftPacked] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate mock total MRP based on some logic or assume MRP is price + 20%
  const totalMRP = items.reduce((sum, item) => {
    // Assuming basePrice was stored or just mocking it for the UI
    const originalPrice = item.price * 1.5; // Mocking a 33% discount
    return sum + (originalPrice * item.quantity);
  }, 0);

  const discounts = totalMRP - subtotal;
  const giftCharge = isGiftPacked ? 29 : 0;
  const totalAmount = subtotal + giftCharge;

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-8 tracking-tight">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-12 text-center">
            <h2 className="text-xl font-medium text-neutral-900 mb-4">Your cart is empty</h2>
            <Link href="/products" className="inline-block px-8 py-3 bg-[#FFC107] text-black font-bold rounded-xl shadow-sm hover:bg-[#F3B604] transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Address Block */}
              <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={20} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-900 font-medium">Deliver to: <span className="font-bold">Awinash Kumar, 813210</span></p>
                    <p className="text-sm text-neutral-500 mt-0.5">chandigarh</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 border border-indigo-200 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50 transition-colors">
                  Change
                </button>
              </div>

              {/* Cart Items */}
              {items.map((item) => {
                const originalPrice = Math.round(item.price * 1.5);
                return (
                  <div key={item.id} className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5 relative">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 transition-colors"
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>
                    
                    <div className="flex gap-5">
                      {/* Image */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-neutral-100 rounded-2xl overflow-hidden relative shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-neutral-200" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base text-neutral-800 font-medium pr-8">{item.name}</h3>
                          <div className="flex items-center gap-1.5 text-[#E77F38] text-xs font-semibold mt-1">
                            <Sparkles size={12} fill="currentColor" />
                            Handmade on order
                          </div>
                          <div className="text-sm text-neutral-500 mt-2">
                            {item.variantText ? item.variantText : 'Color: Original'}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-neutral-900">₹{item.price}</span>
                            <span className="text-sm text-neutral-400 line-through">₹{originalPrice}</span>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-4 bg-neutral-100/80 rounded-full px-2 py-1 border border-neutral-200/50">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-900"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-900"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Gift Packaging */}
              <div className="bg-[#FFF4F6] rounded-[20px] shadow-sm border border-[#FDE3E9] p-4 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    🎁
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Gift Packaging (+₹29)</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Wrapped beautifully with a handwritten note.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGiftPacked(!isGiftPacked)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isGiftPacked ? 'bg-neutral-900 text-white' : 'bg-[#E11D48] text-white hover:bg-rose-700 shadow-[0_4px_12px_-4px_rgba(225,29,72,0.5)]'
                  }`}
                >
                  {isGiftPacked ? 'ADDED' : 'ADD +'}
                </button>
              </div>

              {/* Apply Coupon */}
              <button className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors w-full text-left">
                <div className="flex items-center gap-3 text-neutral-800 font-medium">
                  <Tag size={20} className="text-neutral-400" />
                  Apply Coupon
                </div>
                <ChevronRightIcon />
              </button>

            </div>

            {/* Right Column (Sticky) */}
            <div className="lg:col-span-4 sticky top-24 flex flex-col gap-6">
              
              <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-6">
                <h3 className="text-lg font-serif text-neutral-900 mb-6">Price Details</h3>
                
                <div className="space-y-4 text-sm text-neutral-600">
                  <div className="flex justify-between pb-4 border-b border-neutral-100 border-dashed">
                    <span>MRP (incl. of all taxes)</span>
                    <span className="font-medium text-neutral-900">₹{Math.round(totalMRP)}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2">
                    <span>Delivery Charges</span>
                    <span className="text-[#059669] font-medium"><span className="text-neutral-400 line-through mr-1 font-normal">₹80</span> FREE</span>
                  </div>
                  <p className="text-xs text-[#059669] font-medium pb-2 border-b border-neutral-100 border-dashed">Free delivery unlocked!</p>

                  <div className="flex justify-between py-2 border-b border-neutral-100 border-dashed">
                    <span className="flex items-center gap-1">Discounts <ChevronDownIcon /></span>
                    <span className="text-[#059669] font-medium">- ₹{Math.round(discounts)}</span>
                  </div>
                  
                  {isGiftPacked && (
                    <div className="flex justify-between py-2 border-b border-neutral-100 border-dashed">
                      <span>Gift Packaging</span>
                      <span className="font-medium text-neutral-900">+ ₹29</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 text-base font-bold text-neutral-900">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <div className="mt-4 bg-[#ECFDF5] text-[#059669] text-sm font-semibold p-3 rounded-xl flex items-center justify-center gap-2 border border-[#D1FAE5]">
                  <Tag size={16} fill="currentColor" />
                  You'll save ₹{Math.round(discounts)} on this order!
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-6 bg-[#FFC107] text-black font-black text-lg py-4 rounded-xl shadow-[0_8px_20px_-8px_rgba(255,193,7,0.5)] active:scale-[0.98] transition-all"
                >
                  PLACE ORDER
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-6 flex justify-between items-center text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium w-16">Secure Payments</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <Truck size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium w-16">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <CheckCircle2 size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium w-16">100% Authentic</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
