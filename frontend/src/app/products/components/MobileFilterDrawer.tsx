"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  categories,
  colors,
  sizes,
  categoryFilter, setCategoryFilter,
  colorFilter, setColorFilter,
  sizeFilter, setSizeFilter,
  inStockOnly, setInStockOnly,
  customizableOnly, setCustomizableOnly,
  resultCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  colors: string[];
  sizes: string[];
  categoryFilter: string; setCategoryFilter: (v: string) => void;
  colorFilter: string; setColorFilter: (v: string) => void;
  sizeFilter: string; setSizeFilter: (v: string) => void;
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void;
  customizableOnly: boolean; setCustomizableOnly: (v: boolean) => void;
  resultCount: number;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[100] lg:hidden"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 h-[85vh] bg-white rounded-t-3xl z-[101] flex flex-col lg:hidden shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-neutral-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-neutral-100">
              <h2 className="text-xl font-black text-neutral-900">Filters</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content (reusing the desktop sidebar but making it visible here) */}
            <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar">
              {/* Force the block layout instead of hidden on mobile */}
              <div className="[&>div:first-child]:hidden [&>div]:!block [&>div]:!w-full [&>div]:!pr-0 mt-4">
                <FilterSidebar 
                  categories={categories}
                  colors={colors}
                  sizes={sizes}
                  categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                  colorFilter={colorFilter} setColorFilter={setColorFilter}
                  sizeFilter={sizeFilter} setSizeFilter={setSizeFilter}
                  inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                  customizableOnly={customizableOnly} setCustomizableOnly={setCustomizableOnly}
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-neutral-100 pb-safe">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Show {resultCount} Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
