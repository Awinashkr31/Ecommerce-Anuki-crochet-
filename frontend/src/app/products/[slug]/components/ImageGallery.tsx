"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images, altText }: { images: { url: string, altText?: string }[], altText: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const mainImage = images[activeIndex]?.url || "https://images.unsplash.com/photo-1606228281437-dc2a9e3e020f?auto=format&fit=crop&q=80&w=800";



  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        ref={imageRef}
        className="relative aspect-square w-full bg-neutral-100 rounded-[24px] overflow-hidden group"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={mainImage}
              alt={images[activeIndex]?.altText || altText}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges / Overlay UI */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-neutral-900 shadow-sm hover:bg-white transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Mobile Navigation Arrows (visible only on small screens or when hover on desktop if multiple images) */}
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-neutral-900 shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <ChevronLeft size={20} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-neutral-900 shadow-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 snap-start transition-all ${
                activeIndex === idx ? 'ring-2 ring-rose-500 ring-offset-2' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt={img.altText || altText} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
