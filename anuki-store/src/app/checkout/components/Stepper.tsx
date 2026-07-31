"use client";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function Stepper({ currentStep, setStep }: { currentStep: number, setStep: (s: number) => void }) {
  const steps = ["Address", "Shipping", "Payment", "Review"];

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-100 rounded-full z-0 overflow-hidden">
          <motion.div 
            className="h-full bg-rose-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {steps.map((stepLabel, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={stepLabel} className="relative z-10 flex flex-col items-center group">
              <button
                onClick={() => isCompleted && setStep(stepNumber)}
                disabled={!isCompleted && !isActive}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-rose-500 text-white shadow-[0_0_0_4px_rgba(225,29,72,0.2)]' 
                    : isCompleted 
                      ? 'bg-rose-500 text-white cursor-pointer hover:bg-rose-600' 
                      : 'bg-white border-2 border-neutral-200 text-neutral-400'
                }`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNumber}
              </button>
              <span className={`absolute -bottom-6 text-xs font-bold whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-neutral-900' : isCompleted ? 'text-rose-500' : 'text-neutral-400'}`}>
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
