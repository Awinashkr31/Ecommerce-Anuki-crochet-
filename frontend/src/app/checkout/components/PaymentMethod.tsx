"use client";
import { CreditCard, Banknote, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentMethod({ selected, onChange, onNext, onBack }: { selected: string, onChange: (v: string) => void, onNext: () => void, onBack: () => void }) {
  const methods = [
    { id: "card", title: "Credit / Debit / UPI", desc: "Pay securely via Razorpay", icon: CreditCard, badges: ["VISA", "Mastercard", "UPI"] },
    { id: "cod", title: "Cash on Delivery", desc: "Pay when you receive the order", icon: Banknote, badges: [] },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-neutral-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <CreditCard className="text-rose-500" /> Payment Method
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Lock size={12} /> 256-bit SSL Secure
          </div>
        </div>

        <div className="space-y-4">
          {methods.map((method) => {
            const isSelected = selected === method.id;
            return (
              <motion.label
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                key={method.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-rose-500 bg-rose-50/50' : 'border-neutral-100 hover:border-neutral-200 bg-white'
                }`}
                onClick={() => onChange(method.id)}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${isSelected ? 'bg-rose-100 text-rose-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <method.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{method.title}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{method.desc}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 pl-16 sm:pl-0">
                  {method.badges.length > 0 && (
                    <div className="flex gap-2">
                      {method.badges.map(badge => (
                        <span key={badge} className="px-2 py-1 bg-white border border-neutral-200 rounded text-[10px] font-bold text-neutral-500">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="relative flex items-center justify-center w-6 h-6 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 transition-colors ${isSelected ? 'border-rose-500' : 'border-neutral-300'}`}></div>
                    {isSelected && <motion.div layoutId="payment-dot" className="absolute w-3 h-3 bg-rose-500 rounded-full" />}
                  </div>
                </div>
              </motion.label>
            )
          })}
        </div>

        <div className="mt-8 bg-neutral-50 p-4 rounded-xl flex items-start gap-3 border border-neutral-100">
          <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-neutral-900">100% Secure Payment</p>
            <p className="text-xs text-neutral-500 mt-1">We do not store any of your credit card details. All transactions are PCI DSS compliant and fully encrypted.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button onClick={onBack} className="px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl font-bold text-lg transition-colors">
          Back
        </button>
        <button onClick={onNext} className="flex-1 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_-8px_rgba(225,29,72,0.5)] active:scale-[0.98] transition-all">
          Review Order
        </button>
      </div>
    </div>
  );
}
