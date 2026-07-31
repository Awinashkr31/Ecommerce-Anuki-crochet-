"use client";
import { motion } from "framer-motion";
import { PackageX } from "lucide-react";

export default function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-20 px-4 w-full h-full min-h-[50vh] bg-neutral-50/50 rounded-3xl border border-neutral-100"
    >
      <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
        <PackageX size={40} className="text-neutral-300" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-black text-neutral-900 mb-2">No Products Found</h3>
      <p className="text-neutral-500 max-w-sm mx-auto mb-8">
        We couldn't find any products matching your current filters. Try adjusting your search or category.
      </p>
      <button 
        onClick={onReset}
        className="px-8 py-3.5 bg-neutral-900 text-white font-bold rounded-xl shadow-lg hover:bg-neutral-800 active:scale-[0.98] transition-all"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
}
