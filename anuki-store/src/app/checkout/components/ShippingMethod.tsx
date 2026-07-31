"use client";
import { Truck, Zap, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function ShippingMethod({ selected, onChange, onNext, onBack }: { selected: string, onChange: (v: string) => void, onNext: () => void, onBack: () => void }) {
  const methods = [
    { id: "standard", title: "Standard Delivery", time: "3-5 Business Days", price: "Free", icon: Truck },
    { id: "express", title: "Express Delivery", time: "1-2 Business Days", price: "₹150", icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-neutral-100">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
          <Truck className="text-rose-500" /> Shipping Method
        </h2>

        <div className="space-y-4">
          {methods.map((method) => {
            const isSelected = selected === method.id;
            return (
              <motion.label
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                key={method.id}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-rose-500 bg-rose-50/50' : 'border-neutral-100 hover:border-neutral-200 bg-white'
                }`}
                onClick={() => onChange(method.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isSelected ? 'bg-rose-100 text-rose-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <method.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{method.title}</h3>
                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1"><Calendar size={14} /> {method.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-neutral-900">{method.price}</span>
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <div className={`w-6 h-6 rounded-full border-2 transition-colors ${isSelected ? 'border-rose-500' : 'border-neutral-300'}`}></div>
                    {isSelected && <motion.div layoutId="shipping-dot" className="absolute w-3 h-3 bg-rose-500 rounded-full" />}
                  </div>
                </div>
              </motion.label>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button onClick={onBack} className="px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl font-bold text-lg transition-colors">
          Back
        </button>
        <button onClick={onNext} className="flex-1 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg shadow-[0_8px_20px_-8px_rgba(225,29,72,0.5)] active:scale-[0.98] transition-all">
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
