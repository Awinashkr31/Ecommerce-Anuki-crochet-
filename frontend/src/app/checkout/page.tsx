"use client";

import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { CheckCircle2, ChevronRight, Truck, Tag, CreditCard, ClipboardList } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiPost } from '@/lib/api';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [address, setAddress] = useState({ firstName: '', lastName: '', street: '', city: '', state: '', pincode: '' });
  const [isPincodeValid, setIsPincodeValid] = useState<boolean | null>(null);
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = getTotal();
  const shippingCost = shippingMethod === 'express' ? 150 : 0;
  const finalTotal = subtotal + shippingCost - discount;

  const handlePincodeChange = (val: string) => {
    setAddress({ ...address, pincode: val });
    if (val.length === 6) {
      // Mock validation logic
      if (['110001', '400001', '560001', '700001'].includes(val)) {
        setIsPincodeValid(true);
      } else {
        setIsPincodeValid(false);
      }
    } else {
      setIsPincodeValid(null);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
    } else {
      alert('Invalid Coupon');
      setCouponApplied(false);
      setDiscount(0);
    }
  };

  const { profile } = useAuthStore();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      if (paymentMethod === 'cod') {
        const orderData = {
          userId: profile?.id, // Will be undefined if guest, but schema might require it, so let's pass it. Wait, authStore uses profile.id or profile.userId? Let's check authStore later, but typically profile.id. 
          items: items,
          address: address, // sending just in case, but backend currently ignores it
          totalAmount: finalTotal
        };
        
        await apiPost('/orders', orderData);
        
        clearCart();
        setOrderComplete(true);
        setIsLoading(false);
        return;
      }

      // Razorpay Flow (mocked logic for now, but creating order in DB)
      const orderData = {
          userId: profile?.id,
          items: items,
          address: address,
          totalAmount: finalTotal
      };
      
      const order = await apiPost('/orders', orderData);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
        amount: finalTotal * 100, // Razorpay takes paise
        currency: "INR",
        name: "Handmade Crochet",
        description: "Order Payment",
        order_id: order.id, // Just mocking with our DB order ID
        handler: async function (response: any) {
          // Mock Verify
          clearCart();
          setOrderComplete(true);
        },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          email: profile?.email || "test@example.com",
          contact: "9999999999"
        },
        theme: { color: "#e11d48" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Error initiating payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md w-full border border-neutral-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight">Order Confirmed!</h1>
          <p className="text-neutral-500 mb-8 leading-relaxed">Your order #ORD-{Math.floor(Math.random() * 100000)} has been successfully placed. We'll send you a confirmation email shortly.</p>
          <Link href="/products" className="bg-neutral-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-neutral-800 transition-colors inline-block w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-neutral-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products" className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 selection:bg-rose-200">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-6xl mx-auto">
        
        {/* Checkout Header Progress */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-black mb-6 tracking-tight">Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <span className={`${step >= 1 ? 'text-rose-600 font-bold' : 'text-neutral-400'}`}>Address</span>
            <ChevronRight size={16} className="text-neutral-300" />
            <span className={`${step >= 2 ? 'text-rose-600 font-bold' : 'text-neutral-400'}`}>Shipping</span>
            <ChevronRight size={16} className="text-neutral-300" />
            <span className={`${step >= 3 ? 'text-rose-600 font-bold' : 'text-neutral-400'}`}>Payment</span>
            <ChevronRight size={16} className="text-neutral-300" />
            <span className={`${step >= 4 ? 'text-rose-600 font-bold' : 'text-neutral-400'}`}>Review</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Address */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl border transition-all ${step === 1 ? 'border-neutral-200 shadow-sm ring-1 ring-neutral-200' : 'border-neutral-100 opacity-60'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">1</div>
                  Shipping Address
                </h2>
                {step > 1 && <button onClick={() => setStep(1)} className="text-rose-600 text-sm font-bold hover:underline">Edit</button>}
              </div>
              
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} className="border border-neutral-200 rounded-xl p-3 w-full outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                    <input type="text" placeholder="Last Name" value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} className="border border-neutral-200 rounded-xl p-3 w-full outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                  </div>
                  <input type="text" placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="border border-neutral-200 rounded-xl p-3 w-full outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="border border-neutral-200 rounded-xl p-3 w-full outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                    <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="border border-neutral-200 rounded-xl p-3 w-full outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" />
                    <div>
                      <input 
                        type="text" 
                        placeholder="Pincode (e.g. 110001)" 
                        maxLength={6}
                        value={address.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        className={`border rounded-xl p-3 w-full outline-none transition-all ${
                          isPincodeValid === true ? 'border-emerald-500 bg-emerald-50 focus:ring-emerald-500' :
                          isPincodeValid === false ? 'border-rose-500 bg-rose-50 focus:ring-rose-500' :
                          'border-neutral-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        }`}
                      />
                      {isPincodeValid === false && <p className="text-xs text-rose-600 mt-1 font-medium">Sorry, we don't deliver to this pincode yet.</p>}
                      {isPincodeValid === true && <p className="text-xs text-emerald-600 mt-1 font-medium">Serviceable area!</p>}
                    </div>
                  </div>
                  <button 
                    disabled={!isPincodeValid}
                    onClick={() => setStep(2)} 
                    className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Shipping
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Shipping Method */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl border transition-all ${step === 2 ? 'border-neutral-200 shadow-sm ring-1 ring-neutral-200' : 'border-neutral-100 opacity-60'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">2</div>
                  Shipping Method
                </h2>
                {step > 2 && <button onClick={() => setStep(2)} className="text-rose-600 text-sm font-bold hover:underline">Edit</button>}
              </div>
              
              {step === 2 && (
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-rose-500 bg-rose-50' : 'border-neutral-100 hover:border-neutral-200'}`}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-5 h-5 text-rose-600 focus:ring-rose-500" />
                    <div className="flex-1">
                      <p className="font-bold flex items-center gap-2"><Truck size={16} /> Standard Delivery</p>
                      <p className="text-sm text-neutral-500 mt-1">5-7 Business Days</p>
                    </div>
                    <span className="font-bold">Free</span>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-rose-500 bg-rose-50' : 'border-neutral-100 hover:border-neutral-200'}`}>
                    <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-5 h-5 text-rose-600 focus:ring-rose-500" />
                    <div className="flex-1">
                      <p className="font-bold flex items-center gap-2"><Truck size={16} className="text-rose-600" /> Express Delivery</p>
                      <p className="text-sm text-neutral-500 mt-1">2-3 Business Days</p>
                    </div>
                    <span className="font-bold">₹150</span>
                  </label>
                  
                  <button onClick={() => setStep(3)} className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all mt-4">
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Payment */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl border transition-all ${step === 3 ? 'border-neutral-200 shadow-sm ring-1 ring-neutral-200' : 'border-neutral-100 opacity-60'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">3</div>
                  Payment
                </h2>
                {step > 3 && <button onClick={() => setStep(3)} className="text-rose-600 text-sm font-bold hover:underline">Edit</button>}
              </div>

              {step === 3 && (
                <div className="space-y-4">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-rose-500 bg-rose-50' : 'border-neutral-100 hover:border-neutral-200'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-rose-600 focus:ring-rose-500" />
                    <div className="flex-1">
                      <p className="font-bold flex items-center gap-2"><CreditCard size={16} /> Credit / Debit / UPI</p>
                      <p className="text-sm text-neutral-500 mt-1">Secure via Razorpay</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-rose-500 bg-rose-50' : 'border-neutral-100 hover:border-neutral-200'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-rose-600 focus:ring-rose-500" />
                    <div className="flex-1">
                      <p className="font-bold flex items-center gap-2">Cash on Delivery</p>
                      <p className="text-sm text-neutral-500 mt-1">Pay when your order arrives</p>
                    </div>
                  </label>
                  
                  <button onClick={() => setStep(4)} className="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all mt-4">
                    Review Order
                  </button>
                </div>
              )}
            </div>

            {/* Step 4: Review */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl border transition-all ${step === 4 ? 'border-neutral-200 shadow-sm ring-1 ring-neutral-200' : 'border-neutral-100 opacity-60'}`}>
              <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">4</div>
                Review & Place Order
              </h2>

              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-neutral-50 p-6 rounded-2xl">
                    <h3 className="font-bold flex items-center gap-2 mb-4"><ClipboardList size={18}/> Final Confirmation</h3>
                    <p className="text-sm text-neutral-600 mb-2"><strong>Shipping to:</strong> {address.firstName} {address.lastName}, {address.street}, {address.city}, {address.pincode}</p>
                    <p className="text-sm text-neutral-600 mb-2"><strong>Method:</strong> {shippingMethod === 'standard' ? 'Standard Delivery' : 'Express Delivery'}</p>
                    <p className="text-sm text-neutral-600"><strong>Payment:</strong> {paymentMethod === 'card' ? 'Online Payment' : 'Cash on Delivery'}</p>
                  </div>
                  
                  <button 
                    onClick={handlePayment} 
                    disabled={isLoading}
                    className="w-full bg-rose-600 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 disabled:bg-rose-400"
                  >
                    {isLoading ? 'Processing...' : `Place Order — ₹${finalTotal.toLocaleString()}`}
                  </button>
                </div>
              )}
            </div>
            
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 sticky top-6">
              <h2 className="text-xl font-black mb-6 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                      {item.customization && <p className="text-xs text-rose-600 mt-1 bg-rose-50 inline-block px-2 py-1 rounded">Note: {item.customization}</p>}
                    </div>
                    <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-b border-neutral-100 py-6 mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
                    />
                  </div>
                  <button 
                    onClick={couponApplied ? () => {setCouponApplied(false); setDiscount(0); setCouponCode('');} : applyCoupon}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${couponApplied ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                  >
                    {couponApplied ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {!couponApplied && <p className="text-xs text-neutral-500 mt-2">Hint: Use WELCOME10 for 10% off</p>}
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Shipping</span>
                  <span className="font-bold">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span className="font-bold">Discount</span>
                    <span className="font-bold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-6 flex justify-between items-center font-black text-2xl">
                <span>Total</span>
                <span className="text-rose-600">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
