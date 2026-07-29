"use client";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost, apiGet } from "@/lib/api";
import { ArrowLeft, MapPin, Truck, ShieldCheck, Tag, Circle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AddressModal, { Address } from "@/components/AddressModal";
import CouponSection from "@/components/CouponSection";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, appliedCoupon } = useCartStore();
  const { profile } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // If cart is empty or user is not logged in, redirect
  useEffect(() => {
    if (!profile) {
      router.replace('/auth?redirect=/checkout');
      return;
    }
    if (items.length === 0 && !isProcessing) {
      router.replace('/cart');
    }
  }, [items.length, router, isProcessing, profile]);

  // Load Razorpay script safely
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Fetch default address on load
    const fetchDefaultAddress = async () => {
      try {
        const addresses = await apiGet<Address[]>('/addresses');
        if (addresses && addresses.length > 0) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          if (defaultAddr) setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDefaultAddress();
  }, []);

  if (items.length === 0) {
    return null;
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isGiftPacked = false; // Could read from store in a real app
  const giftCharge = isGiftPacked ? 29 : 0;
  const codCharge = paymentMethod === 'cod' ? 40 : 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, subtotal + giftCharge + codCharge - discount);

  const handlePay = async () => {
    if (paymentMethod === 'upi' || paymentMethod === 'cards') {
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        toast.error("Payment gateway is still loading. Please wait or refresh the page.");
        return;
      }
      await processOnlinePayment();
    } else {
      await processCodOrder();
    }
  };

  const processCodOrder = async () => {
    setIsProcessing(true);
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      setIsProcessing(false);
      return;
    }
    
    try {
      const address = { 
        firstName: selectedAddress.fullName.split(' ')[0], 
        lastName: selectedAddress.fullName.split(' ').slice(1).join(' ') || '', 
        street: selectedAddress.street, 
        city: selectedAddress.city, 
        state: selectedAddress.state, 
        pincode: selectedAddress.zipCode,
        phone: selectedAddress.phone
      };
      const payload = {
        userId: profile?.id,
        items: items.map(i => ({ variantId: i.variantId || i.id, quantity: i.quantity, price: i.price, customization: i.customization })),
        address, totalAmount, paymentMethod: 'cod',
        couponCode: appliedCoupon?.code,
        discountAmount: discount
      };
      await apiPost('/orders', payload);
      clearCart();
      toast.success("Order Placed Successfully!", { duration: 3000 });
      router.push('/account');
    } catch (err: any) {
      toast.error(err.message || "Failed to place order.");
      setIsProcessing(false);
    }
  };

  const processOnlinePayment = async () => {
    setIsProcessing(true);
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      setIsProcessing(false);
      return;
    }
    
    try {
      // 1. Create order internally and get Razorpay order_id
      const address = { 
        firstName: selectedAddress.fullName.split(' ')[0], 
        lastName: selectedAddress.fullName.split(' ').slice(1).join(' ') || '', 
        street: selectedAddress.street, 
        city: selectedAddress.city, 
        state: selectedAddress.state, 
        pincode: selectedAddress.zipCode,
        phone: selectedAddress.phone
      };
      
      // Wait, our backend doesn't have a dedicated "create-order" that also creates the database order yet. 
      // Wait, the backend /api/payments/create-order just calls Razorpay.
      // And our POST /orders creates the DB order.
      // We should first create the DB order as PENDING, then create the Razorpay order with that totalAmount, or vice versa.
      // Actually, POST /orders already creates an order with PENDING status!
      
      const orderPayload = {
        userId: profile?.id,
        items: items.map(i => ({ variantId: i.variantId || i.id, quantity: i.quantity, price: i.price, customization: i.customization })),
        address, totalAmount, paymentMethod: 'online',
        couponCode: appliedCoupon?.code,
        discountAmount: discount
      };
      
      const dbOrder = await apiPost('/orders', orderPayload);
      
      // Now create Razorpay order
      const rzpOrder = await apiPost('/payments/create-order', {
        amount: totalAmount,
        internalOrderId: dbOrder.id
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TIFdGVUKCE4VcF", // fallback for testing
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Anuki Crochet",
        description: "Order Payment",
        order_id: rzpOrder.id,
        handler: (response: any) => {
          // Razorpay payment success
          toast.loading("Verifying payment...", { id: "verify" });
          
          apiPost('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            internalOrderId: dbOrder.id
          }).then((verifyRes) => {
            // Verification logic
            toast.success("Payment Successful!", { id: "verify" });
            clearCart();
            router.push('/account');
          }).catch((err) => {
            console.error("Verify error:", err);
            toast.error("Payment Verification Failed", { id: "verify" });
            setIsProcessing(false);
          });
        },
        prefill: {
          name: "Awinash Kumar",
          email: "customer@anukicrochet.in",
          contact: "9999999999"
        },
        theme: {
          color: "#059669"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error("Payment Cancelled");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment Failed: " + response.error.description);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment.");
      setIsProcessing(false);
    }
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
              
              {selectedAddress ? (
                <div className="bg-neutral-50 rounded-xl p-4 flex items-start justify-between gap-4 border border-neutral-100">
                  <div>
                    <p className="text-sm text-neutral-900 font-medium">Deliver to: <span className="font-bold">{selectedAddress.fullName}, {selectedAddress.zipCode}</span></p>
                    <p className="text-sm text-neutral-500 mt-0.5">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Phone: {selectedAddress.phone}</p>
                  </div>
                  <button onClick={() => setIsAddressModalOpen(true)} className="px-4 py-1.5 border border-indigo-200 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50 transition-colors bg-white">
                    Change
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 border border-neutral-100 py-6">
                  <p className="text-sm text-neutral-500">No delivery address selected</p>
                  <button onClick={() => setIsAddressModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                    Add New Address
                  </button>
                </div>
              )}
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

                {/* COD Option */}
                <label className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-[#FFC107] bg-[#FFFBF0]' : 'border-neutral-100 hover:border-neutral-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {paymentMethod === 'cod' ? (
                        <CheckCircle2 className="text-[#FFC107]" size={20} fill="currentColor" stroke="white" />
                      ) : (
                        <Circle className="text-neutral-300" size={20} />
                      )}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-neutral-900">Cash on Delivery</span>
                        <p className="text-xs text-neutral-500 mt-1">Pay cash at doorstep (+₹40)</p>
                      </div>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                </label>
              </div>
            </div>

            <CouponSection subtotal={subtotal} />

          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-6">
              <h3 className="font-serif text-lg text-neutral-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-xl overflow-hidden shrink-0 relative">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />}
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
                {discount > 0 && (
                  <div className="flex justify-between border-b border-neutral-100 pb-4 text-[#059669]">
                    <span>Discount applied</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between border-b border-neutral-100 pb-4 text-[#E11D48]">
                    <span>COD Charge</span>
                    <span className="font-medium">₹40</span>
                  </div>
                )}
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
              paymentMethod === 'cod' ? "Place Order (COD)" : "Pay Securely"
            )}
          </button>
        </div>
      </div>

      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setIsAddressModalOpen(false);
        }}
        selectedAddressId={selectedAddress?.id}
      />
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
