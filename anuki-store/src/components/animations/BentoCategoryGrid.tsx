"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useAnimationState } from "@/hooks/useAnimationState";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  bannerUrl?: string | null;
  products?: { images: { url: string }[] }[];
}

interface BentoCategoryGridProps {
  categories: CategoryItem[];
}

export default function BentoCategoryGrid({ categories }: BentoCategoryGridProps) {
  const canAnimate = useAnimationState();
  const [isVisible, setIsVisible] = useState(!canAnimate);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!canAnimate) {
      setIsVisible(true);
      return;
    }
    if (hasTriggeredRef.current) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [canAnimate]);

  // Fallback images
  const defaultBouquet = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp";
  const defaultPot = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/bf4cf952-311e-4294-b79f-129258fe612e.webp";
  const defaultPlushie = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp";

  const getCatImg = (slug: string, fallback: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (cat?.bannerUrl) return cat.bannerUrl;
    if (cat?.products?.[0]?.images?.[0]?.url) return cat.products[0].images[0].url;
    return fallback;
  };

  const tiles = [
    {
      id: "bouquets",
      title: "Flower Bouquets",
      href: "/products?category=flower-bouquets",
      img: getCatImg("flower-bouquets", defaultBouquet),
      className: "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-2 h-[220px] md:h-[340px]",
    },
    {
      id: "pots",
      title: "Flower Pots",
      href: "/products?category=flower-pots",
      img: getCatImg("flower-pots", defaultPot),
      className: "col-span-1 h-[155px] md:h-[162px]",
    },
    {
      id: "toys",
      title: "Plushies",
      href: "/products?category=toys",
      img: getCatImg("toys", defaultPlushie),
      className: "col-span-1 h-[155px] md:h-[162px]",
    },
    {
      id: "keychains",
      title: "Keychains",
      href: "/products?category=keychains",
      img: getCatImg("keychains", defaultBouquet),
      className: "col-span-1 h-[155px] md:h-[162px]",
    },
    {
      id: "hair-accessories",
      title: "Hair Clips",
      href: "/products?category=hair-accessories",
      img: getCatImg("hair-accessories", defaultPot),
      className: "col-span-1 h-[155px] md:h-[162px]",
    },
    {
      id: "custom",
      title: "Custom Orders",
      href: "/custom",
      isCustom: true,
      img: "/custom-portfolio/hero.webp",
      className: "col-span-2 md:col-span-2 h-[155px] md:h-[162px]",
    },
  ];

  return (
    <section ref={containerRef} className="py-4 sm:py-6 px-4 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg font-serif font-bold text-neutral-900">
          Handcrafted Collections
        </h2>
        <Link
          href="/products"
          className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:text-rose-800 transition-colors flex items-center gap-1"
        >
          View all
          <ArrowRight size={11} />
        </Link>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {tiles.map((tile, idx) => {
          const style = canAnimate
            ? {
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "scale(1)" : "scale(0.94)",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out",
                transitionDelay: `${idx * 65}ms`,
                willChange: "transform, opacity",
              }
            : undefined;

          if (tile.isCustom) {
            return (
              <Link
                key={tile.id}
                href={tile.href}
                style={style}
                className={`${tile.className} relative rounded-2xl overflow-hidden p-3.5 sm:p-4 md:p-5 flex flex-col justify-end group shadow-xs border border-neutral-100 text-white`}
              >
                <Image
                  src={tile.img || "/custom-portfolio/hero.webp"}
                  alt={tile.title}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-[#7A1D2E]/20 mix-blend-multiply" />

                <div className="z-10 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-white leading-tight drop-shadow-md">
                    {tile.title}
                  </h3>
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-rose-900 transition-all text-white border border-white/20 shrink-0">
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={tile.id}
              href={tile.href}
              style={style}
              className={`${tile.className} relative rounded-2xl overflow-hidden group shadow-xs border border-neutral-100 flex flex-col justify-end p-3 sm:p-4`}
            >
              {tile.img && (
                <Image
                  src={tile.img}
                  alt={tile.title}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              <div className="relative z-10 text-white flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-serif font-bold leading-tight drop-shadow-xs">
                  {tile.title}
                </h3>
                <ArrowRight
                  size={12}
                  className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
