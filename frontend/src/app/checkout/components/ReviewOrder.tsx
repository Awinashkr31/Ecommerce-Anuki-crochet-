"use client";
import { ClipboardList, Edit2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AddressFormData } from "./AddressForm";

export default function ReviewOrder({ 
  address, 
  shippingMethod, 
  paymentMethod, 
  onEdit, 
  onPlaceOrder,
  isLoading
}: { 
  address: AddressFormData | null, 
  shippingMethod: string, 
  paymentMethod: string, 
  onEdit: (step: number) => void,
  onPlaceOrder: () => void,
  isLoading: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-neutral-100">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
          <ClipboardList className="text-rose-500" /> Review Your Order
        </h2>

        <div className="space-y-6">
          {/* Address Summary */}
          <div className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-neutral-900">Shipping Address</h3>
              <button onClick={() => onEdit(1)} className="text-sm font-bold text-rose-500 flex items-center gap-1 hover:text-rose-600 transition-colors">
                <Edit2 size={14} /> Edit
              </button>
            </div>
            {address ? (
              <p className="text-sm text-neutral-600 leading-relaxed">
                <span className="font-bold text-neutral-900">{address.firstName} {address.lastName}</span><br/>
                {address.street}, {address.apartment && `${address.apartment},`} {address.landmark && `${address.landmark},`}<br/>
                {address.city}, {address.state} - {address.pincode}<br/>
                {address.country}<br/>
                <span className="inline-block mt-1 font-medium">{address.phone}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500">Address missing</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Shipping Summary */}
            <div className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-neutral-900">Shipping Method</h3>
                <button onClick={() => onEdit(2)} className="text-sm font-bold text-rose-500 flex items-center gap-1 hover:text-rose-600 transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
              </div>
              <p className="text-sm text-neutral-600">
                {shippingMethod === 'standard' ? 'Standard Delivery (3-5 Days)' : 'Express Delivery (1-2 Days)'}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-neutral-900">Payment Method</h3>
                <button onClick={() => onEdit(3)} className="text-sm font-bold text-rose-500 flex items-center gap-1 hover:text-rose-600 transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
              </div>
              <p className="text-sm text-neutral-600">
                {paymentMethod === 'card' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (COD)'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
              <input type="checkbox" required className="peer appearance-none w-5 h-5 border-2 border-neutral-300 rounded focus:ring-2 focus:ring-rose-500/20 checked:border-rose-500 checked:bg-rose-500 transition-colors" />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="text-sm text-neutral-600 font-medium group-hover:text-neutral-900 transition-colors">
              I agree to the <a href="#" className="text-rose-500 hover:underline">Terms & Conditions</a>, <a href="#" className="text-rose-500 hover:underline">Privacy Policy</a>, and <a href="#" className="text-rose-500 hover:underline">Return Policy</a>.
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button onClick={() => onEdit(3)} className="px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl font-bold text-lg transition-colors">
          Back
        </button>
        <button 
          onClick={onPlaceOrder}
          disabled={isLoading}
          className="flex-1 px-8 py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_-8px_rgba(225,29,72,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck size={20} /> Place Order
            </>
          )}
        </button>
      </div>
    </div>
  );
}
