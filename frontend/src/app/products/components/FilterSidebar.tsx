"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Accordion = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 py-5">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between text-left outline-none group"
      >
        <span className="font-bold text-neutral-900 text-sm tracking-wide uppercase">{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-neutral-400 group-hover:text-rose-500 transition-colors" /> : <ChevronDown size={16} className="text-neutral-400 group-hover:text-rose-500 transition-colors" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FilterSidebar({
  categories,
  colors,
  sizes,
  categoryFilter, setCategoryFilter,
  colorFilter, setColorFilter,
  sizeFilter, setSizeFilter,
  inStockOnly, setInStockOnly,
  customizableOnly, setCustomizableOnly,
}: {
  categories: string[];
  colors: string[];
  sizes: string[];
  categoryFilter: string; setCategoryFilter: (v: string) => void;
  colorFilter: string; setColorFilter: (v: string) => void;
  sizeFilter: string; setSizeFilter: (v: string) => void;
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void;
  customizableOnly: boolean; setCustomizableOnly: (v: boolean) => void;
}) {
  
  const colorMap: Record<string, string> = {
    'yellow': '#FDE047', 'pink': '#F9A8D4', 'blue': '#93C5FD', 'green': '#86EFAC',
    'red': '#FCA5A5', 'black': '#1F2937', 'white': '#F9FAFB'
  };

  return (
    <div className="hidden lg:block w-full sticky top-24 pr-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-neutral-900">Filters</h2>
        <button 
          onClick={() => {
            setCategoryFilter("all");
            setColorFilter("all");
            setSizeFilter("all");
            setInStockOnly(false);
            setCustomizableOnly(false);
          }}
          className="text-xs font-bold text-neutral-400 hover:text-rose-600 transition-colors underline underline-offset-4"
        >
          Clear All
        </button>
      </div>

      <Accordion title="Category">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="category"
              checked={categoryFilter === "all"}
              onChange={() => setCategoryFilter("all")}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded-full border-2 border-neutral-300 peer-checked:border-rose-500 peer-checked:border-[6px] transition-all" />
            <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">All Categories</span>
          </label>
          {categories.map(c => (
            <label key={c} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                checked={categoryFilter === c}
                onChange={() => setCategoryFilter(c)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-full border-2 border-neutral-300 peer-checked:border-rose-500 peer-checked:border-[6px] transition-all" />
              <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors capitalize">{c}</span>
            </label>
          ))}
        </div>
      </Accordion>

      <Accordion title="Availability">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all ${inStockOnly ? 'bg-rose-500 border-rose-500 text-white' : 'border-neutral-300 text-transparent group-hover:border-neutral-400'}`}>
              <Check size={12} strokeWidth={3} />
            </div>
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="hidden" />
            <span className="text-sm text-neutral-600 group-hover:text-neutral-900">In Stock</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all ${customizableOnly ? 'bg-rose-500 border-rose-500 text-white' : 'border-neutral-300 text-transparent group-hover:border-neutral-400'}`}>
              <Check size={12} strokeWidth={3} />
            </div>
            <input type="checkbox" checked={customizableOnly} onChange={(e) => setCustomizableOnly(e.target.checked)} className="hidden" />
            <span className="text-sm text-neutral-600 group-hover:text-neutral-900">Made to Order</span>
          </label>
        </div>
      </Accordion>

      {colors.length > 0 && (
        <Accordion title="Colors">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setColorFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${colorFilter === 'all' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
            >
              All
            </button>
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColorFilter(c)}
                className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center transition-all ${colorFilter === c ? 'ring-2 ring-rose-500 ring-offset-2' : 'hover:scale-110'}`}
                style={{ backgroundColor: colorMap[c] || '#e5e7eb' }}
                title={c}
              />
            ))}
          </div>
        </Accordion>
      )}

      {sizes.length > 0 && (
        <Accordion title="Sizes">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSizeFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${sizeFilter === 'all' ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
            >
              All
            </button>
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => setSizeFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all uppercase ${sizeFilter === s ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </Accordion>
      )}
    </div>
  );
}
