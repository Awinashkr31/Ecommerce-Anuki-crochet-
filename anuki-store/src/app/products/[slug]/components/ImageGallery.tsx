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
        className="relative aspect-square w-full bg-neutral-100 rounded-b-3xl sm:rounded-3xl overflow-hidden group shadow-sm"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -50) {
                nextImage();
              } else if (offset.x > 50) {
                prevImage();
              }
            }}
          >
              <Image
                src={mainImage}
                alt={images[activeIndex]?.altText || altText}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500"
                priority
                unoptimized
              />
          </motion.div>
        </AnimatePresence>

        {/* Badges - Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          <div className="bg-teal-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm w-fit border border-teal-600 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            35% OFF
          </div>
          <div className="bg-white text-rose-600 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm w-fit border border-rose-200 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            Bestseller
          </div>
          <div className="bg-white/80 backdrop-blur-sm text-neutral-800 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm w-fit border border-white/50 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            100% Handcrafted
          </div>
        </div>

        {/* Wishlist Button - Top Right */}
        <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-neutral-400 shadow-sm hover:text-rose-500 transition-colors z-10 border border-neutral-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>

        {/* Pinch to Inspect - Bottom Right */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-neutral-600 text-[9px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 z-10 border border-neutral-100">
          <Maximize2 size={10} strokeWidth={3} /> Pinch to inspect stitches
        </div>

      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 px-4 sm:px-0 hide-scrollbar snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 snap-start transition-all ${
                activeIndex === idx ? "ring-2 ring-rose-500 ring-offset-1 border-transparent" : "border border-neutral-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || altText}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
