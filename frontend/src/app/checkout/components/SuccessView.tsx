"use client";
import { CheckCircle2, ChevronRight, Download, Package } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessView() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 12, stiffness: 100 }}
        >
          <CheckCircle2 size={48} />
        </motion.div>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-black text-neutral-900 mb-4 text-center"
      >
        Order Placed Successfully!
      </motion.h1>

      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-neutral-500 text-center max-w-lg mb-8"
      >
        Thank you for your purchase. We've received your order and will send you an email with the tracking details once your package ships.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
      >
        <Link href="/" className="flex-1 px-8 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl font-bold text-center transition-colors">
          Continue Shopping
        </Link>
        <Link href="/profile" className="flex-1 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_-8px_rgba(225,29,72,0.5)] active:scale-[0.98] transition-all">
          <Package size={20} /> Track Order
        </Link>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-2 transition-colors"
      >
        <Download size={16} /> Download Invoice
      </motion.button>
    </div>
  );
}
