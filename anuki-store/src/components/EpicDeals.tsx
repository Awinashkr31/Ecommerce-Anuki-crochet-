"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const epicDeals = [
  {
    id: 1,
    category: "Hair Accessories",
    discount: "UP TO 50% OFF",
    href: "/products?category=hair-accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
    brands: ["HANDMADE", "CUTE"]
  },
  {
    id: 2,
    category: "Flower Pots",
    discount: "BESTSELLERS",
    href: "/products?category=flower-pots",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&h=400&fit=crop",
    brands: ["VIBRANT", "DECOR"]
  },
  {
    id: 3,
    category: "Amigurumi Toys",
    discount: "NEW ARRIVALS",
    href: "/products?category=amigurumi",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    brands: ["SOFT", "PLUSH"]
  },
  {
    id: 4,
    category: "Cozy Blankets",
    discount: "PREMIUM YARN",
    href: "/products",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
    brands: ["WARM", "SNUGGLY"]
  },
  {
    id: 5,
    category: "Keychains",
    discount: "PERFECT GIFTS",
    href: "/products",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop",
    brands: ["CHARMS", "MINI"]
  },
  {
    id: 6,
    category: "Custom Orders",
    discount: "MADE TO ORDER",
    href: "/products?isMadeToOrder=true",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=400&fit=crop",
    brands: ["BESPOKE", "UNIQUE"]
  }
];

export function EpicDeals({ products = [] }: { products?: any[] }) {
  const fallbackImage = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.scrollWidth / epicDeals.length;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const itemWidth = scrollWidth / epicDeals.length;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white pt-2 pb-8 md:py-8">
      {/* Banner */}
      <div className="max-w-[100vw] px-4 md:max-w-7xl mx-auto mb-6">
        <Link href="/products" className="bg-gradient-to-r from-[#e4f1d3] via-[#d0ebaf] to-[#e4f1d3] w-full rounded-md py-6 px-4 flex flex-col items-center justify-center relative overflow-hidden shadow-sm block hover:opacity-95 transition-opacity">
           <div className="flex items-center justify-center gap-6 md:gap-12 w-full">
             {/* Decorative Pot Left */}
             <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 hidden sm:block">
               <div className="absolute inset-0 bg-[#c35035] rounded-full flex items-center justify-center shadow-lg shadow-green-900/20">
                 <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                 {/* Spiky halo */}
                 <div className="absolute -inset-2 border-2 border-dashed border-[#178524] rounded-full opacity-30 animate-[spin_10s_linear_infinite]" />
               </div>
             </div>

             <div className="text-center">
               <h2 
                 className="text-[#0d6e35] font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight"
                 style={{ 
                   WebkitTextStroke: '1px white',
                   textShadow: '2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
                 }}
               >
                 SWAG <span className="text-2xl md:text-3xl inline-block -translate-y-2">से</span> SAVINGS
               </h2>
               <div className="flex items-center justify-center gap-2 text-[#4a3933] font-bold mt-1 text-sm md:text-lg tracking-wide">
                 Epic Deals All Day
                 <div className="bg-[#4a3933] text-white rounded-full p-0.5 shadow-sm">
                   <ChevronRight size={16} strokeWidth={3} />
                 </div>
               </div>
             </div>

             {/* Decorative Pot Right */}
             <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 hidden sm:block">
               <div className="absolute inset-0 bg-[#c35035] rounded-full flex items-center justify-center shadow-lg shadow-green-900/20">
                 <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                 {/* Spiky halo */}
                 <div className="absolute -inset-2 border-2 border-dashed border-[#178524] rounded-full opacity-30 animate-[spin_10s_linear_infinite]" />
               </div>
             </div>
           </div>
        </Link>
      </div>

      {/* Cards Scroll */}
      <div className="max-w-[100vw] xl:max-w-7xl mx-auto">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-0 md:gap-2 pb-6 hide-scrollbar px-2 md:px-4"
        >
          {epicDeals.map((deal, index) => {
            const productImg = products[index % products.length]?.images?.[0]?.url;
            const finalImage = productImg || fallbackImage;
            
            return (
            <div key={deal.id} className="snap-start shrink-0 w-[220px] md:w-[260px] relative group px-2 py-2"> 
              {/* Border Container */}
              <Link href={deal.href} className="border-[4px] border-[#178524] rounded-xl flex flex-col h-[280px] md:h-[320px] relative shadow-sm block group-hover:shadow-md transition-shadow">
                
                {/* Image Section */}
                <div className="relative flex-1 rounded-t-lg overflow-hidden">
                  <Image 
                    src={finalImage} 
                    alt={deal.category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 260px, 320px"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  
                  {/* Text Overlay */}
                  <div className="absolute bottom-2 left-0 right-0 text-center px-2">
                    <h3 className="text-white font-extrabold text-lg md:text-xl leading-tight drop-shadow-md">{deal.discount}</h3>
                    <p className="text-white/95 text-xs md:text-sm font-medium mt-0.5">{deal.category}</p>
                  </div>
                </div>

                {/* Brands Section */}
                <div className="h-[50px] bg-white rounded-b-lg flex items-center justify-center gap-3 px-2 relative shrink-0 border-t border-gray-100">
                  {deal.brands.map((brand, i) => (
                    <span key={i} className="text-[#0d6e35] font-black text-[10px] md:text-[11px] tracking-wide uppercase">
                      {brand}
                    </span>
                  ))}
                  
                  {/* & More Badge */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-sm text-[9px] font-bold px-1.5 py-0.5 text-gray-700 shadow-sm z-10 whitespace-nowrap">
                    & More
                  </div>
                </div>
                
              </Link>

              {/* Decorative Starburst Left */}
              <div className="absolute top-[45%] left-0 -translate-y-1/2 z-20 drop-shadow-sm">
                <svg width="22" height="22" viewBox="0 0 100 100" fill="white">
                  <polygon points="50,0 60,35 95,15 70,50 95,85 60,65 50,100 40,65 5,85 30,50 5,15 40,35" />
                </svg>
              </div>
              
              {/* Decorative Starburst Right */}
              <div className="absolute top-[45%] right-0 -translate-y-1/2 z-20 drop-shadow-sm">
                <svg width="22" height="22" viewBox="0 0 100 100" fill="white">
                  <polygon points="50,0 60,35 95,15 70,50 95,85 60,65 50,100 40,65 5,85 30,50 5,15 40,35" />
                </svg>
              </div>

            </div>
            );
          })}
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-1">
           {epicDeals.map((_, i) => (
             <button 
               key={i} 
               onClick={() => {
                 if(scrollRef.current) {
                   const itemWidth = scrollRef.current.scrollWidth / epicDeals.length;
                   scrollRef.current.scrollTo({ left: itemWidth * i, behavior: 'smooth' });
                 }
               }}
               className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-gray-600 w-4' : 'bg-gray-300 w-1.5'}`}
               aria-label={`Go to slide ${i + 1}`}
             />
           ))}
        </div>
      </div>
    </section>
  );
}
