"use client";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, X, Minus, Plus, Tag, ShieldCheck, Truck, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import AddressModal from "@/components/AddressModal";
import { useAddressStore } from "@/store/addressStore";
import CartRecommendations from "./CartRecommendations";
import { apiGet } from "@/lib/api";
import CartOffers from "./CartOffers";
import { MobileLoginSheet } from "@/components/MobileLoginSheet";
import useSWR from 'swr';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CartClient({ crossSellProducts = [] }: { crossSellProducts?: any[] }) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, appliedCoupon } = useCartStore();
  const [isGiftPacked, setIsGiftPacked] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);

  const { profile } = useAuthStore();
  const { selectedAddress, setSelectedAddress, fetchAddressesOnce, hydrate } = useAddressStore();

  // Hydrate address from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Fetch addresses once when user is logged in
  useEffect(() => {
    if (profile) {
      fetchAddressesOnce();
    }
  }, [profile, fetchAddressesOnce]);

  useEffect(() => {
    if (isLoginSheetOpen && profile) {
      const timer = setTimeout(() => {
        setIsLoginSheetOpen(false);
        if (!selectedAddress) {
          setIsAddressModalOpen(true);
        } else {
          router.push(`/checkout?addressId=${selectedAddress.id}`);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile, isLoginSheetOpen, router, selectedAddress]);

  const handlePlaceOrder = () => {
    if (!profile) {
      setIsLoginSheetOpen(true);
    } else if (!selectedAddress) {
      setIsAddressModalOpen(true);
    } else {
      router.push(`/checkout?addressId=${selectedAddress.id}`);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate mock total MRP based on some logic or assume MRP is price + 20%
  const totalMRP = items.reduce((sum, item) => {
    // Assuming basePrice was stored or just mocking it for the UI
    const originalPrice = item.price * 1.5; // Mocking a 33% discount
    return sum + (originalPrice * item.quantity);
  }, 0);

  const discounts = totalMRP - subtotal;
  const giftCharge = isGiftPacked ? 29 : 0;
  const { data: settings } = useSWR('/settings/public', (url: string) => apiGet<Record<string, string>>(url));
  const freeDeliveryThreshold = settings ? (Number(settings['free_delivery_threshold']) || 0) : 500;
  const deliveryChargeSetting = settings ? (Number(settings['delivery_charge']) || 0) : 50;
  
  const deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : deliveryChargeSetting;
  const amountToFreeDelivery = freeDeliveryThreshold - subtotal;
  const appliedDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, subtotal + giftCharge + deliveryCharge - appliedDiscount);

  return (
    <div className="min-h-screen bg-[#fff8f7] pb-28 lg:pb-8 pt-0 lg:pt-6 px-0 lg:px-4">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col sticky top-0 z-50 bg-[#fff8f7]/90 backdrop-blur-xl shadow-[0_2px_12px_rgba(92,54,48,0.04)] pb-3">
        <div className="bg-[#F6ECE8] text-[#be4b5c] text-center py-1.5 flex items-center justify-center gap-1.5">
          <Truck size={14} />
          <span className="text-[11px] font-semibold tracking-wider uppercase">FREE SHIPPING ON ORDERS OVER ₹{freeDeliveryThreshold} 🧶</span>
        </div>
        <div className="flex items-center justify-between px-4 mt-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-[#faeaea] flex items-center justify-center text-[#221a1a] hover:bg-[#efdfde] transition-colors">
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#221a1a] leading-tight">Your Shopping Bag</h2>
              <p className="text-xs text-[#564243] flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-[#6c8a74]"></span>
                {items.length} Handcrafted {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#F6ECE8] px-3 py-1.5 rounded-full text-[#be4b5c]">
            <ShieldCheck size={16} />
            <span className="text-[11px] font-semibold tracking-wide uppercase">100% Safe</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-4 lg:mt-0 lg:px-0">
        <h1 className="hidden lg:block text-3xl md:text-4xl font-serif text-neutral-900 mb-8 tracking-tight">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-3">
              
              {/* Address Block */}
              {!selectedAddress ? (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 py-2 px-3 flex items-center justify-between gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                      <MapPin size={18} className="text-neutral-500" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-neutral-900 text-base">Delivery Address</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="px-4 py-1.5 border border-rose-200 text-rose-600 font-semibold text-sm rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    + Add Address
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 py-2 px-3 flex items-start justify-between gap-3 relative">
                  <div className="flex gap-2 pl-1">
                    <div className="mt-1 shrink-0">
                      <MapPin size={20} className="text-neutral-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-0.5">Deliver to: <span className="font-bold text-neutral-900">{selectedAddress.fullName}, {selectedAddress.zipCode}</span></p>
                      <p className="text-xs text-neutral-500 leading-relaxed pr-2 line-clamp-2">
                        {selectedAddress.street}, {selectedAddress.landmark ? `${selectedAddress.landmark}, ` : ''}{selectedAddress.city}, {selectedAddress.state}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="px-3 py-1.5 border border-blue-200 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors shrink-0 bg-white shadow-sm"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Cart Items */}
              {items.map((item) => {
                const originalPrice = Math.round(item.price * 1.5);
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-[#EFE5DE] p-3.5 relative">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 text-[#897173] hover:text-[#ba1a1a] transition-colors p-1"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                    
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="w-24 h-28 bg-[#FBF8F5] rounded-xl overflow-hidden relative shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-[#efdfde]" />
                        )}
                        <span className="absolute bottom-1 left-1 bg-white/90 text-[#be4b5c] text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm">Handstitched</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="text-sm font-semibold text-[#221a1a] pr-6 line-clamp-2 leading-snug">{item.name}</h3>
                          <div className="text-xs text-[#564243] mt-0.5">
                            Color: <span className="text-[#221a1a] font-medium">{item.variantText ? item.variantText : 'Original'}</span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between mt-2 pt-2">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-[#221a1a] leading-none">₹{item.price}</span>
                              <span className="text-[12px] text-[#897173] line-through">₹{originalPrice}</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#486551]">33% OFF</span>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center bg-[#FBF8F5] rounded-full px-1 py-0.5 shadow-sm border border-[#EFE5DE]">
                            <button 
                              onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#564243] hover:text-[#221a1a]"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="text-sm font-bold w-6 text-center text-[#221a1a]">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#564243] hover:text-[#221a1a]"
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
              <div className="bg-[#FFF8FA] rounded-xl shadow-sm border border-[#FDE3E9] p-3 flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="text-lg">
                    🎁
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 flex items-center gap-1">Gift Packaging <span className="text-neutral-500 font-medium">(+₹29)</span></p>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">Wrapped beautifully with a handwritten note.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGiftPacked(!isGiftPacked)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-all shadow-sm ${
                    isGiftPacked ? 'bg-neutral-900 text-white border-transparent' : 'bg-[#E11D48] text-white border-transparent hover:bg-rose-700'
                  }`}
                >
                  {isGiftPacked ? 'ADDED' : 'ADD +'}
                </button>
              </div>

              {/* Apply Coupon */}
              <CartOffers subtotal={subtotal} />

              <CartRecommendations products={crossSellProducts} />

            </div>

            {/* Right Column (Sticky) */}
            <div className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
              
              <div className="bg-white rounded-2xl shadow-[0_4px_16px_-2px_rgba(92,54,48,0.05)] border border-[#EFE5DE] p-4.5 lg:p-6">
                <h3 className="text-xl font-serif text-[#221a1a] mb-4 font-semibold">Order Summary</h3>
                
                <div className="space-y-3.5 text-sm text-[#564243]">
                  <div className="flex justify-between pb-3.5 border-b border-[#EFE5DE] border-dashed">
                    <span>Bag Subtotal</span>
                    <span className="font-medium text-[#221a1a]">₹{Math.round(totalMRP)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span className={deliveryCharge === 0 ? "text-[#486551] font-medium" : "text-[#221a1a] font-medium"}>
                      {deliveryCharge === 0 ? <><span className="text-[#897173] line-through mr-1 font-normal">₹{deliveryChargeSetting}</span> FREE</> : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {deliveryCharge > 0 ? (
                    <p className="text-xs text-[#486551] font-medium pb-3.5 border-b border-[#EFE5DE] border-dashed">
                      Add ₹{amountToFreeDelivery} more to unlock free delivery!
                    </p>
                  ) : (
                    <p className="text-xs text-[#486551] font-medium pb-3.5 border-b border-[#EFE5DE] border-dashed">Qualified for complimentary PAN-India delivery</p>
                  )}

                  <div className="flex justify-between py-1">
                    <span>Store Discounts</span>
                    <span className="text-[#486551] font-medium">- ₹{Math.round(discounts)}</span>
                  </div>
                  
                  {isGiftPacked && (
                    <div className="flex justify-between py-1">
                      <span>Artisanal Gift Packaging</span>
                      <span className="font-medium text-[#221a1a]">+ ₹29</span>
                    </div>
                  )}

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between py-1 text-[#be4b5c]">
                      <span>Coupon ({appliedCoupon?.code})</span>
                      <span className="font-medium">- ₹{appliedDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3.5 mt-2 border-t border-[#EFE5DE] border-dashed text-lg font-bold text-[#221a1a]">
                    <span>Grand Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <div className="mt-4 bg-[#F6ECE8] text-[#be4b5c] text-xs font-semibold p-3 rounded-xl flex items-center justify-center gap-1.5 border border-[#ddc0c1]">
                  <Tag size={14} fill="currentColor" />
                  You&apos;re saving ₹{Math.round(discounts + appliedDiscount)} on this lovely order!
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  className="hidden lg:flex w-full mt-5 bg-[#be4b5c] text-white font-bold text-base py-3.5 rounded-full shadow-[0_8px_20px_-4px_rgba(190,75,92,0.3)] active:scale-[0.98] transition-all items-center justify-center gap-2 hover:bg-[#9e3345]"
                >
                  <ShieldCheck size={18} />
                  Proceed to Checkout
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-3 flex justify-between items-center text-center">
                <div className="flex flex-col items-center gap-1.5">
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

      {/* Mobile Sticky Checkout Bar */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EFE5DE] py-3.5 px-4 pb-safe flex items-center justify-between z-50 shadow-[0_-6px_20px_-2px_rgba(45,26,23,0.08)]">
          <div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xl font-bold text-[#221a1a] tracking-tight">₹{totalAmount}</span>
            </div>
            <div className="text-[10px] font-bold text-[#486551] bg-[#EAF0EA] px-2 py-0.5 rounded-full mt-1 inline-block">
              {deliveryCharge === 0 ? 'Free Shipping' : '+ Delivery'}
            </div>
          </div>
          
          <button 
            onClick={handlePlaceOrder}
            className="bg-[#be4b5c] text-white font-bold text-sm px-6 py-3.5 rounded-full active:scale-95 transition-transform shadow-[0_4px_12px_rgba(190,75,92,0.3)] flex items-center gap-2 hover:bg-[#9e3345]"
          >
            Checkout
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        selectedAddressId={selectedAddress?.id}
        startInFormMode={!selectedAddress}
        hideDelete={true}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setIsAddressModalOpen(false);
          router.push(`/checkout?addressId=${addr.id}`);
        }}
      />
      <MobileLoginSheet 
        isOpen={isLoginSheetOpen} 
        onClose={() => setIsLoginSheetOpen(false)} 
      />
    </div>
  );
}
