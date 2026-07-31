"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AccordionItem = ({ title, children, isOpen, onClick }: { title: string, children: React.ReactNode, isOpen: boolean, onClick: () => void }) => (
  <div className="border-b border-neutral-200">
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between py-6 text-left outline-none group"
    >
      <span className="text-lg font-bold text-neutral-900 group-hover:text-rose-600 transition-colors">{title}</span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-rose-50 text-rose-500' : 'bg-neutral-50 text-neutral-400 group-hover:bg-neutral-100'}`}>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pb-6 text-neutral-600 leading-relaxed text-base">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function ProductAccordions({ product }: { product: any }) {
  const [openSection, setOpenSection] = useState<string>("specs");

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="mt-8 border-t border-neutral-200">
      <AccordionItem 
        title="Specifications" 
        isOpen={openSection === "specs"} 
        onClick={() => toggle("specs")}
      >
        <ul className="space-y-3">
          {product.material && <li><strong>Material:</strong> {product.material}</li>}
          {product.countryOfOrigin && <li><strong>Origin:</strong> {product.countryOfOrigin}</li>}
          {product.weight && <li><strong>Weight:</strong> {product.weight}g</li>}
          {(product.length || product.width || product.height) && (
            <li><strong>Dimensions:</strong> {product.length || '-'} x {product.width || '-'} x {product.height || '-'} cm</li>
          )}
          <li><strong>Packaging:</strong> Premium Gift Wrap Available</li>
        </ul>
      </AccordionItem>

      <AccordionItem 
        title="Description" 
        isOpen={openSection === "description"} 
        onClick={() => toggle("description")}
      >
        <p className="whitespace-pre-wrap">{product.fullDesc || product.shortDesc}</p>
      </AccordionItem>

      <AccordionItem 
        title="Care Instructions" 
        isOpen={openSection === "care"} 
        onClick={() => toggle("care")}
      >
        <p className="whitespace-pre-wrap">{product.careInstructions || "Gently hand wash with cold water. Do not bleach. Dry flat in shade."}</p>
      </AccordionItem>

      <AccordionItem 
        title="Shipping & Returns" 
        isOpen={openSection === "shipping"} 
        onClick={() => toggle("shipping")}
      >
        <p><strong>Processing Time:</strong> Ships in {product.processingDays || 3} business days.</p>
        <p className="mt-2"><strong>Replacements:</strong> 7-day easy replacement policy for defective or incorrect items. (No Returns)</p>
      </AccordionItem>
    </div>
  );
}
