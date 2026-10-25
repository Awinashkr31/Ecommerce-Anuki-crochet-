"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface CategoryTile {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  subtitleColor: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    title: "Flower Bouquets",
    subtitle: "Everlasting yarn blooms",
    image: "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/e146f9cf-704c-4152-802b-a6f63335ca56.webp",
    href: "/categories/flower-bouquets",
    bgColor: "bg-[#FDE8ED]",
    borderColor: "border-[#FECDD3]",
    textColor: "text-[#881337]",
    subtitleColor: "text-[#9F1239]/80",
  },
  {
    title: "Flower Pots",
    subtitle: "Evergreen desk flora",
    image: "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/400b9afe-1528-40dd-89ea-4d2fca701da4.webp",
    href: "/categories/flower-pots",
    bgColor: "bg-[#E6F4EA]",
    borderColor: "border-[#BBF7D0]",
    textColor: "text-[#065F46]",
    subtitleColor: "text-[#047857]/80",
  },
  {
    title: "Hair Accessories",
    subtitle: "Daisy clips & scrunchies",
    image: "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/b2f5985a-5495-43a0-ba97-cca9c951f5bd.webp",
    href: "/categories/hair-accessories",
    bgColor: "bg-[#F3E8FF]",
    borderColor: "border-[#E9D5FF]",
    textColor: "text-[#6B21A8]",
    subtitleColor: "text-[#7E22CE]/80",
  },
  {
    title: "Keychains",
    subtitle: "Pocket charms & tags",
    image: "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/78fa09b4-11ce-49f0-98f1-eddff6e0582e.webp",
    href: "/categories/keychains",
    bgColor: "bg-[#FFEDD5]",
    borderColor: "border-[#FED7AA]",
    textColor: "text-[#9A3412]",
    subtitleColor: "text-[#C2410C]/80",
  },
  {
    title: "Toys",
    subtitle: "Cuddly amigurumi plushies",
    image: "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp",
    href: "/categories/toys",
    bgColor: "bg-[#FEF3C7]",
    borderColor: "border-[#FDE68A]",
    textColor: "text-[#92400E]",
    subtitleColor: "text-[#B45309]/80",
  },
  {
    title: "Custom Orders",
    subtitle: "Handmade to your design",
    image: "/custom-portfolio/wedding.webp",
    href: "/custom",
    bgColor: "bg-[#E0F2FE]",
    borderColor: "border-[#BAE6FD]",
    textColor: "text-[#0369A1]",
    subtitleColor: "text-[#0284C7]/80",
  },
];

export default function GiftFinderHub() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  return (
    <section 
      aria-label="Find the Perfect Handmade Gift"
      className="py-10 md:py-14 bg-gradient-to-b from-[#fffafb] via-rose-50/20 to-white border-t border-[#f0e8e6] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header (No filter pills as per specification) */}
        <div className="px-4 sm:px-6 mb-5 sm:mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/80 mb-2 shadow-2xs">
            <Sparkles size={12} className="text-rose-600" />
            CURATED GIFTING GUIDE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
            Find the Perfect Handmade Gift
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mt-1.5 leading-relaxed">
            Thoughtfully crafted crochet keepsakes for every celebration, recipient, and budget.
          </p>
        </div>

        {/* Swipeable Category Slider Container */}
        <div className="relative group/slider">
          {/* Desktop Navigation Arrow - Left */}
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous categories"
            className="hidden md:flex absolute -left-3 lg:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-neutral-700 hover:text-rose-800 hover:scale-105 shadow-md border border-neutral-200/80 items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>

          {/* Desktop Navigation Arrow - Right */}
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next categories"
            className="hidden md:flex absolute -right-3 lg:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-neutral-700 hover:text-rose-800 hover:scale-105 shadow-md border border-neutral-200/80 items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight size={20} className="stroke-[2.5]" />
          </button>

          {/* Native Scroll-Snap Slider Track */}
          <div
            ref={sliderRef}
            className="flex gap-3.5 sm:gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-4 sm:px-6 py-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {CATEGORY_TILES.map((tile, idx) => (
              <Link
                key={idx}
                href={tile.href}
                className={`snap-start shrink-0 w-[240px] sm:w-[260px] md:w-[280px] rounded-3xl p-4 sm:p-5 flex flex-col justify-between ${tile.bgColor} border ${tile.borderColor} shadow-2xs hover:shadow-md transition-all duration-300 group cursor-pointer active:scale-[0.98]`}
              >
                {/* Tile Header: BOLD Category Label + Small Subtitle */}
                <div className="min-w-0">
                  <h3 className={`font-serif font-bold text-lg sm:text-xl tracking-tight leading-tight ${tile.textColor}`}>
                    {tile.title}
                  </h3>
                  <p className={`text-xs sm:text-[13px] font-medium leading-snug mt-1 ${tile.subtitleColor}`}>
                    {tile.subtitle}
                  </p>
                </div>

                {/* One Large Product Image filling most of the tile */}
                <div className="relative w-full aspect-square mt-3 sm:mt-4 rounded-2xl overflow-hidden bg-white/70 shadow-xs border border-black/5">
                  <Image
                    src={tile.image}
                    alt={tile.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 240px, 280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* "See all" link at bottom-right (with mobile safe margin to avoid floating WhatsApp button) */}
        <div className="flex justify-end items-center mt-3 sm:mt-4 px-4 sm:px-6 pr-16 sm:pr-6">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-rose-800 hover:text-rose-950 transition-colors py-1 px-2 rounded-lg hover:bg-rose-50/80 active:scale-95"
          >
            <span>See all categories</span>
            <ChevronsRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
