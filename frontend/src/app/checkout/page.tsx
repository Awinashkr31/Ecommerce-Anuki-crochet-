"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Truck, ShieldCheck, Tag, Circle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // If cart is empty, redirect
  if (items.length === 0) {
    if (typeof window !== 'undefined') router.replace('/cart');
    return null;
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isGiftPacked = false; // Could read from store in a real app
  const giftCharge = isGiftPacked ? 29 : 0;
  const totalAmount = subtotal + giftCharge;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate Razorpay or Payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      toast.success("Order Placed Successfully!", { duration: 3000 });
      router.push('/shop'); // Redirect to success page or shop
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col relative pb-32">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 py-4 px-4 md:px-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-neutral-50 rounded-full transition-colors -ml-2">
              <ArrowLeft size={20} className="text-neutral-700" />
            </button>
            <h1 className="text-xl font-bold text-neutral-900">Checkout</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Step 3/3</p>
            <p className="text-sm font-semibold text-[#059669] flex items-center gap-1">
              Secure Payment <ShieldCheck size={14} />
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Delivery Address */}
            <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#FFF4F6] flex items-center justify-center text-[#E11D48]">
                  <MapPin size={16} />
                </div>
                <h3 className="font-serif text-lg text-neutral-900">Delivery Address</h3>
              </div>
              
              <div className="bg-neutral-50 rounded-xl p-4 flex items-start justify-between gap-4 border border-neutral-100">
                <div>
                  <p className="text-sm text-neutral-900 font-medium">Deliver to: <span className="font-bold">Awinash Kumar, 813210</span></p>
                  <p className="text-sm text-neutral-500 mt-0.5">chandigarh</p>
                </div>
                <button className="px-4 py-1.5 border border-indigo-200 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50 transition-colors bg-white">
                  Change
                </button>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="bg-[#ECFDF5] rounded-[20px] shadow-sm border border-[#D1FAE5] p-5 flex gap-4 items-center">
              <div className="text-[#059669]">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-[#059669] font-bold">Delivery by Jul 29 - Jul 31</p>
                <p className="text-xs text-[#059669]/80 font-medium mt-0.5">Free shipping applied</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5">
              <h3 className="font-serif text-lg text-neutral-900 mb-4">Payment Method</h3>
              
              <div className="space-y-3">
                {/* UPI / Cards */}
                <label className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'upi' ? 'border-[#FFC107] bg-[#FFFBF0]' : 'border-neutral-100 hover:border-neutral-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {paymentMethod === 'upi' ? (
                        <CheckCircle2 className="text-[#FFC107]" size={20} fill="currentColor" stroke="white" />
                      ) : (
                        <Circle className="text-neutral-300" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">UPI & Cards</span>
                        <span className="bg-[#FFF4F6] text-[#E11D48] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          RECOMMENDED ⚡
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">GPay, PhonePe, Paytm, Visa, RuPay</p>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                </label>

                {/* COD (Unavailable) */}
                <label className="block p-4 rounded-xl border-2 border-neutral-100 bg-neutral-50/50 cursor-not-allowed opacity-60">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      <Circle className="text-neutral-300" size={20} />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-neutral-900">Cash on Delivery</span>
                        <p className="text-xs text-neutral-500 mt-1">Pay cash at doorstep (+₹40)</p>
                      </div>
                      <span className="bg-neutral-200 text-neutral-500 text-[10px] font-bold px-2 py-0.5 rounded">
                        Unavailable
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Apply Coupon Dropdown (Mock) */}
            <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
              <div className="flex items-center gap-3 text-neutral-800 font-medium">
                <Tag size={20} className="text-neutral-400" />
                Apply Coupon
              </div>
              <ChevronDownIcon />
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-6">
              <h3 className="font-serif text-lg text-neutral-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-xl overflow-hidden shrink-0 relative">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-serif text-neutral-800 leading-tight">{item.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-neutral-900">₹{item.price}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-neutral-600 border-t border-neutral-100 pt-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">₹{subtotal}</span>
                </div>
                {isGiftPacked && (
                  <div className="flex justify-between">
                    <span>Gift Packaging</span>
                    <span className="font-medium text-neutral-900">₹29</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-neutral-100 pb-4">
                  <span>Shipping</span>
                  <span className="font-medium text-[#059669]">Free</span>
                </div>
                <div className="flex justify-between pt-2 text-lg font-bold text-neutral-900">
                  <span>Total Pay</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        {/* Top small Trust line */}
        <div className="flex justify-center items-center gap-6 py-2 border-b border-neutral-100 text-[10px] text-neutral-500 font-medium">
          <span className="flex items-center gap-1"><ShieldCheck size={12} /> 100% Secure</span>
          <span className="flex items-center gap-1"><Truck size={12} /> Fast Delivery</span>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between pb-safe">
          <div>
            <div className="text-xl font-black text-neutral-900">₹{totalAmount}</div>
            <div className="text-[10px] text-neutral-500 font-medium">Total incl. taxes</div>
          </div>
          
          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className="px-12 py-3.5 bg-[#FFC107] text-black font-bold text-lg rounded-xl shadow-[0_8px_20px_-8px_rgba(255,193,7,0.5)] hover:bg-[#F3B604] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center min-w-[200px]"
          >
            {isProcessing ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Pay Securely"
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
