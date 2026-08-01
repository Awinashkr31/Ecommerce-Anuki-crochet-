"use client";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost, apiGet } from "@/lib/api";
import { ArrowLeft, MapPin, Truck, ShieldCheck, Circle, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import AddressModal, { Address } from "@/components/AddressModal";
import CartOffers from "@/app/cart/CartOffers";
import { load } from "@cashfreepayments/cashfree-js";
import useSWR from 'swr';

export default function CheckoutClient({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlAddressId = searchParams?.get('addressId');
  const { items, clearCart, appliedCoupon } = useCartStore();
  const { profile, isLoading } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const processingRef = useRef(false); // Double-click protection

  // If cart is empty or user is not logged in, redirect
  useEffect(() => {
    if (isLoading) return; // Wait until auth state is loaded

    if (!profile) {
      router.replace('/auth?redirect=/checkout');
      return;
    }
    if (items.length === 0 && !isProcessing) {
      router.replace('/cart');
    }
  }, [items.length, router, isProcessing, profile, isLoading]);

  const { data: addresses } = useSWR<Address[]>('/addresses', apiGet);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      if (urlAddressId) {
        const found = addresses.find(a => a.id === urlAddressId);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (found) setSelectedAddress(found);
        else setSelectedAddress(addresses.find(a => a.isDefault) || addresses[0]);
      } else {
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }
    }
  }, [addresses, urlAddressId, selectedAddress]);

  // Browser beforeunload warning during payment
  useEffect(() => {
    if (isProcessing) {
      const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [isProcessing]);

  // Preload Cashfree SDK so it's ready instantly when user clicks pay
  useEffect(() => {
    load({
      mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "production" ? "production" : "sandbox",
    }).catch(console.error);
  }, []);

  if (items.length === 0) {
    return null;
  }

  const minOrderValue = Number(settings?.['min_order_value']) || 0;
  const freeDeliveryThreshold = Number(settings?.['free_delivery_threshold']) || 0;
  const deliveryCharge = Number(settings?.['delivery_charge']) || 0;
  const codExtraChargeConfig = Number(settings?.['cod_extra_charge']) || 0;
  const codPaymentStatus = settings?.['cod_payment_status'] || 'active';

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isGiftPacked = false; // Could read from store in a real app
  const giftCharge = isGiftPacked ? 29 : 0;
  
  const shippingCost = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const codCharge = paymentMethod === 'cod' ? codExtraChargeConfig : 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalAmount = Math.max(0, subtotal + giftCharge + shippingCost + codCharge - discount);

  const handlePay = async () => {
    // Double-click protection
    if (processingRef.current || isProcessing) return;
    processingRef.current = true;

    if (paymentMethod === 'upi' || paymentMethod === 'cards') {
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
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to place order.");
      setIsProcessing(false);
      processingRef.current = false;
    }
  };

  const processOnlinePayment = async () => {
    setIsProcessing(true);
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      setIsProcessing(false);
      return;
    }
    
    const loadingToastId = toast.loading("Securely initializing payment...");
    
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
      
      const orderPayload = {
        userId: profile?.id,
        items: items.map(i => ({ variantId: i.variantId || i.id, quantity: i.quantity, price: i.price, customization: i.customization })),
        address, totalAmount, paymentMethod: 'online',
        couponCode: appliedCoupon?.code,
        discountAmount: discount
      };
      
      const dbOrder = await apiPost('/orders', orderPayload);
      
      const paymentSessionId = dbOrder.payment_session_id;

      if (!paymentSessionId) {
        throw new Error("Failed to initialize secure payment session. Please try again.");
      }

      const cashfree = await load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "production" ? "production" : "sandbox",
      });

      if (!cashfree) {
        throw new Error("Cashfree initialization failed");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkoutOptions: any = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_modal",
      };

      toast.dismiss(loadingToastId);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          // User may have dropped — verify actual status
          toast.loading("Checking payment status...", { id: "verify" });
          apiPost('/payments/cashfree/verify', {
            order_id: dbOrder.cashfree_order_id,
            internalOrderId: dbOrder.id
          }).then(() => {
            toast.dismiss("verify");
            router.push(`/order-status/${dbOrder.id}`);
          }).catch(() => {
            toast.dismiss("verify");
            router.push(`/order-status/${dbOrder.id}`);
          });
          return;
        }
        if (result.paymentDetails) {
          toast.loading("Verifying payment...", { id: "verify" });
          apiPost('/payments/cashfree/verify', {
            order_id: dbOrder.cashfree_order_id,
            internalOrderId: dbOrder.id
          }).then(() => {
            toast.dismiss("verify");
            clearCart();
            router.push(`/order-status/${dbOrder.id}`);
          }).catch(() => {
            toast.dismiss("verify");
            router.push(`/order-status/${dbOrder.id}`);
          });
        } else {
          // Modal closed without completing — redirect to status page
          router.push(`/order-status/${dbOrder.id}`);
        }
        if (result.redirect) {
          console.log("Redirection");
        }
      });

    } catch (err: unknown) {
      toast.dismiss(loadingToastId);
      const error = err as { message?: string };
      toast.error(error.message || "Failed to initialize payment.");
      setIsProcessing(false);
      processingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col relative pb-32">
      
      
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
            
            {subtotal < minOrderValue && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2">
                <ShieldCheck size={18} />
                Minimum order value is ₹{minOrderValue}. Add items worth ₹{(minOrderValue - subtotal).toFixed(2)} more to proceed.
              </div>
            )}
            
            {/* Delivery Address */}
            <div className="bg-white rounded-[20px] shadow-sm border border-neutral-100 p-5 relative overflow-hidden flex items-start justify-between gap-4">
              {selectedAddress ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#FFF4F6] flex items-center justify-center text-[#E11D48]">
                        <MapPin size={12} />
                      </div>
                      <p className="text-sm text-neutral-900 font-medium">Deliver to: <span className="font-bold">{selectedAddress.fullName}, {selectedAddress.zipCode}</span></p>
                    </div>
                    <p className="text-sm text-neutral-500 mt-0.5 ml-8">{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}</p>
                    <p className="text-xs text-neutral-400 mt-0.5 ml-8">Phone: {selectedAddress.phone}</p>
                  </div>
                  <button onClick={() => setIsAddressModalOpen(true)} className="px-4 py-1.5 border border-indigo-200 text-indigo-600 font-medium text-sm rounded-lg hover:bg-indigo-50 transition-colors bg-white shrink-0 mt-1">
                    Change
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 w-full py-2">
                  <div className="w-10 h-10 rounded-full bg-[#FFF4F6] flex items-center justify-center text-[#E11D48]">
                    <MapPin size={20} />
                  </div>
                  <p className="text-sm text-neutral-500">No delivery address selected</p>
                  <button onClick={() => setIsAddressModalOpen(true)} className="px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                    Add New Address
                  </button>
                </div>
              )}
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
                      <div className="flex items-center gap-2 mt-2 bg-white/50 p-1.5 rounded-lg w-fit border border-neutral-100">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" width={40} height={14} className="h-3.5 w-auto object-contain" unoptimized />
                        <div className="w-px h-3 bg-neutral-200"></div>
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" width={40} height={14} className="h-3.5 w-auto object-contain" unoptimized />
                        <div className="w-px h-3 bg-neutral-200"></div>
                        <div className="flex font-black tracking-tight text-[11px] leading-none">
                          <span className="text-[#002970]">Pay</span><span className="text-[#00BAF2]">tm</span>
                        </div>
                        <div className="w-px h-3 bg-neutral-200"></div>
                        <div className="font-black italic text-[#1434CB] text-[11px] leading-none tracking-tighter">VISA</div>
                        <div className="w-px h-3 bg-neutral-200"></div>
                        <div className="flex font-black italic text-[11px] leading-none tracking-tight">
                          <span className="text-[#F37021]">Ru</span><span className="text-[#008C36]">Pay</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                </label>

                {/* COD Option */}
                {codPaymentStatus !== 'hide' && (
                  <label className={`block p-4 rounded-xl border-2 transition-all ${codPaymentStatus === 'coming_soon' ? 'opacity-50 cursor-not-allowed border-neutral-100 bg-neutral-50' : (paymentMethod === 'cod' ? 'border-[#FFC107] bg-[#FFFBF0] cursor-pointer' : 'border-neutral-100 hover:border-neutral-200 cursor-pointer')}`}>
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
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900">Cash on Delivery</span>
                            {codPaymentStatus === 'coming_soon' && (
                              <span className="bg-neutral-200 text-neutral-600 text-[10px] font-bold px-2 py-0.5 rounded">
                                COMING SOON
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">
                            Pay cash at doorstep {codExtraChargeConfig > 0 && `(+₹${codExtraChargeConfig})`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => { if (codPaymentStatus !== 'coming_soon') setPaymentMethod('cod'); }} 
                      disabled={codPaymentStatus === 'coming_soon'}
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>

            <CartOffers subtotal={subtotal} />

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
                  <span className={`font-medium ${shippingCost === 0 ? 'text-[#059669]' : 'text-neutral-900'}`}>
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between border-b border-neutral-100 pb-4 text-[#059669]">
                    <span>Discount applied</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                {paymentMethod === 'cod' && codExtraChargeConfig > 0 && (
                  <div className="flex justify-between border-b border-neutral-100 pb-4 text-[#E11D48]">
                    <span>COD Charge</span>
                    <span className="font-medium">₹{codExtraChargeConfig}</span>
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
            disabled={isProcessing || subtotal < minOrderValue}
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
        startInFormMode={!selectedAddress}
      />
    </div>
  );
}
