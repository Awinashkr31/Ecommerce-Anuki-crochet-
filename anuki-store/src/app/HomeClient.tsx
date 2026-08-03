/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Product } from "@/components/ProductCard";

const ProductCard = dynamic(() => import("@/components/ProductCard").then(mod => mod.ProductCard), { ssr: true });
const EpicDeals = dynamic(() => import("@/components/EpicDeals").then(mod => mod.EpicDeals), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: false });
import useSWR from 'swr';
import { apiGet } from '@/lib/api';
import { expandProductsByColor } from '@/utils/productUtils';

const InstagramEmbed = ({ url }: { url: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const process = () => {
      if ((window as unknown as { instgrm?: { Embeds?: { process: () => void } } })?.instgrm?.Embeds) {
        try {
          (window as unknown as { instgrm?: { Embeds?: { process: () => void } } }).instgrm?.Embeds?.process();
        } catch {
          // ignore
        }
      }
    };
    if (!(window as unknown as { instgrm?: { Embeds?: { process: () => void } } })?.instgrm?.Embeds) {
      if (!document.getElementById('instagram-embed-script')) {
        const script = document.createElement('script');
        script.id = 'instagram-embed-script';
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = process;
        document.body.appendChild(script);
      }
    } else {
      setTimeout(process, 100);
    }
  }, [url, isVisible]);

  return (
    <div ref={ref} className="w-full bg-white flex justify-center items-start overflow-hidden rounded-xl min-h-[400px]">
      {isVisible && (
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ background: '#FFF', border: 0, margin: '0', minWidth: '320px', padding: 0, width: '100%' }}
        />
      )}
    </div>
  );
};

interface HomeClientProps {
  featuredProducts: Product[];
  latestProducts: Product[];
  categories: any[];
}

export default function HomeClient({ featuredProducts, latestProducts, categories }: HomeClientProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) { // Swipe threshold
      if (diff > 0) {
        // Swiped left -> next
        setActiveSlide((prev) => (prev + 1) % heroBanners.length);
      } else {
        // Swiped right -> previous
        setActiveSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
      }
    }
    touchStartX.current = null;
  };

  const fallbackImage1 = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp";
  const fallbackImage2 = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/bf4cf952-311e-4294-b79f-129258fe612e.webp";

  const getCategoryImage = (slugs: string[], fallbackProdIndex: number) => {
    for (const slug of slugs) {
      const cat = categories.find(c => c.slug === slug);
      if (cat?.bannerUrl) return cat.bannerUrl;
      if (cat?.products?.[0]?.images?.[0]?.url) return cat.products[0].images[0].url;
    }
    return featuredProducts[fallbackProdIndex]?.images?.[0]?.url;
  };

  const flowerPotsImg = getCategoryImage(['flower-pots'], 1) || fallbackImage2;
  const plushToysImg = getCategoryImage(['amigurumi', 'plush-toys'], 2) || fallbackImage1;

  const heroBanners = [
    {
      id: 1,
      title: "Mega Sale! Up to 50% Off",
      subtitle: "Grab the best deals on our premium crochet bouquets and cuddly amigurumi plushies.",
      image: "/promo-banner.png",
      cta1: { text: "Shop the Sale", link: "/products" },
      cta2: { text: "Custom Orders", link: "/custom" },
    },
    {
      id: 2,
      title: "Vibrant Flower Pots",
      subtitle: "Add a splash of color to your desk with our never-fading cute potted plants.",
      image: flowerPotsImg,
      cta1: { text: "Shop Pots", link: "/products?category=flower-pots" },
    },
    {
      id: 3,
      title: "New Arrivals: Plushies",
      subtitle: "Cuddly companions designed to bring a smile to your face.",
      image: plushToysImg,
      cta1: { text: "View Toys", link: "/products?category=amigurumi" },
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const { data: settings } = useSWR('/settings/public', (url: string) => apiGet<Record<string, string>>(url));
  const instagramHandle = settings?.['instagram_handle'] || '@anuki_crochet';

  const getEmbedUrl = (input: string | undefined) => {
    if (!input) return null;
    const match = input.match(/(https:\/\/(?:www\.)?instagram\.com\/(?:p|reel|reels)\/[A-Za-z0-9_-]+)/);
    return match ? `${match[1]}/` : null;
  };

  const manualReels = [
    settings?.['instagram_reel_1'],
    settings?.['instagram_reel_2'],
    settings?.['instagram_reel_3'],
    settings?.['instagram_reel_4'],
  ].map(getEmbedUrl).filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-rose-200">
      <main>
        {/* Hero Section Carousel */}
        <section 
          className="relative h-[55vh] min-h-[400px] md:min-h-[600px] md:h-[600px] w-full flex flex-col md:flex-row items-center justify-center overflow-hidden bg-neutral-900"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Mobile Background Images (Hidden on md+) */}
          <div className="md:hidden">
            <div className={`absolute inset-0 z-0 ${activeSlide === 0 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
              <Image 
                src={heroBanners[0].image} 
                alt="Banner"
                fill
                priority
                fetchPriority="high"
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            </div>

            {activeSlide !== 0 && (
              <div
                key={activeSlide}
                className="absolute inset-0 z-0 animate-fade-in"
              >
                <Image 
                  src={heroBanners[activeSlide].image} 
                  alt="Banner"
                  fill
                  priority={false}
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              </div>
            )}
          </div>

          {/* Desktop Split Layout (Hidden on Mobile) */}
          <div className="hidden md:flex relative z-10 max-w-7xl mx-auto w-full h-full items-center justify-between px-8 lg:px-12 py-12">
            
            {/* Left side text */}
            <div className="w-1/2 pr-12 flex flex-col justify-center h-full relative">
              {heroBanners.map((banner, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${activeSlide === index ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}
                >
                  <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 text-white leading-tight drop-shadow-md">
                    {banner.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-neutral-300 mb-10 max-w-xl font-medium leading-relaxed drop-shadow">
                    {banner.subtitle}
                  </p>
                  
                  <div className="flex flex-row items-center justify-start gap-4">
                    {banner.cta1 && (
                      <Link href={banner.cta1.link} className="bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-700 transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap">
                        {banner.cta1.text} <ArrowRight size={20} />
                      </Link>
                    )}
                    {banner.cta2 && (
                      <Link href={banner.cta2.link} className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center whitespace-nowrap">
                        {banner.cta2.text}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right side image */}
            <div className="w-1/2 h-[90%] relative rounded-[2rem] overflow-hidden shadow-2xl bg-neutral-800 border border-white/10">
               {heroBanners.map((banner, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${activeSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <Image 
                    src={banner.image} 
                    alt={banner.title}
                    fill
                    priority={index === 0}
                    className="object-cover hover:scale-105 transition-transform duration-[10s]"
                    sizes="50vw"
                  />
                </div>
              ))}
              
              {/* Slider Indicators for Desktop */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
                {heroBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/40 w-2.5 hover:bg-white/60"}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
          </div>

          {/* Mobile layout container */}
          <div className="md:hidden relative w-full h-full flex flex-col justify-end z-10 pb-[24px] px-[20px]">
            <div
              key={activeSlide}
              className="w-full flex flex-col items-start text-left relative z-10 animate-fade-in-up-mobile"
            >
              {/* Text Content Container (Max Width 85%) */}
              <div className="w-[85%] flex flex-col items-start">
                
                <h2 className="text-[26px] font-[800] leading-[1.1] text-white w-full mb-[8px] [text-shadow:_0_2px_15px_rgb(0_0_0_/_80%)]">
                  {heroBanners[activeSlide].title}
                </h2>
                
                <p className="text-[13px] font-[600] leading-[1.5] text-white line-clamp-2 mb-[16px] [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]">
                  {heroBanners[activeSlide].subtitle}
                </p>
              </div>

              {/* Buttons Container (100% Width) */}
              <div className="flex flex-col w-full">
                {heroBanners[activeSlide].cta1 && (
                  <Link href={heroBanners[activeSlide].cta1.link} className="w-full h-[46px] bg-rose-600 text-white rounded-full font-[700] text-[15px] flex items-center justify-center gap-2 shadow-lg">
                    {heroBanners[activeSlide].cta1.text} <ArrowRight size={16} />
                  </Link>
                )}
                
                {heroBanners[activeSlide].cta2 && (
                  <Link href={heroBanners[activeSlide].cta2.link} className="mt-[10px] w-full h-[44px] bg-white/10 backdrop-blur-md border border-white/60 text-white rounded-full font-[600] text-[15px] flex items-center justify-center">
                    {heroBanners[activeSlide].cta2.text}
                  </Link>
                )}
              </div>
            </div>

            {/* Slider Indicators for Mobile */}
            <div className="w-full flex justify-center gap-2.5 mt-[24px] relative z-10">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-white w-6" : "bg-white/40 w-2"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-8 md:py-20 bg-neutral-50 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat) => {
                const catImage = cat.bannerUrl || cat.products?.[0]?.images?.[0]?.url || fallbackImage1;
                return (
                  <Link href={`/products?category=${cat.slug}`} key={cat.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-200">
                    <Image src={catImage} alt={cat.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Epic Deals Section (SWAG SAVINGS) */}
        <EpicDeals products={featuredProducts} categories={categories} />

        {/* Promotional Banners */}
        <section className="pt-2 pb-0 md:pt-12 md:pb-4 bg-white overflow-hidden">
          <div className="max-w-[100vw] px-4 md:px-6 xl:px-0 xl:max-w-7xl mx-auto">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 xl:mx-0 xl:px-0">
              
              {/* Banner 2 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[150px] md:h-[200px] rounded-3xl overflow-hidden relative flex bg-[#0d9488]">
                <div className="w-7/12 p-5 md:p-8 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-xl md:text-3xl font-black leading-tight mb-1 md:mb-2">FLOWER<br/>POTS</h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-widest mb-3 md:mb-4 uppercase">VIBRANT & CUTE</p>
                  <Link href="/products?category=flower-pots" className="bg-white text-[#0d9488] font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full self-start hover:bg-neutral-100 transition-colors text-xs md:text-sm shadow-sm">
                    Shop Pots
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d9488] via-[#0d9488]/50 to-transparent z-10"></div>
                  <Image src={flowerPotsImg} alt="Flower Pots" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

              {/* Banner 3 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[150px] md:h-[200px] rounded-3xl overflow-hidden relative flex bg-[#8b5cf6]">
                <div className="w-7/12 p-5 md:p-8 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-xl md:text-3xl font-black leading-tight mb-1 md:mb-2">PLUSH<br/>TOYS</h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-widest mb-3 md:mb-4 uppercase">CUDDLY FRIENDS</p>
                  <Link href="/products?category=amigurumi" className="bg-white text-[#8b5cf6] font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full self-start hover:bg-neutral-100 transition-colors text-xs md:text-sm shadow-sm">
                    Shop Toys
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] via-[#8b5cf6]/50 to-transparent z-10"></div>
                  <Image src={plushToysImg} alt="Plush Toys" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

              {/* Banner 4 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[150px] md:h-[200px] rounded-3xl overflow-hidden relative flex bg-[#f59e0b]">
                <div className="w-7/12 p-5 md:p-8 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-xl md:text-3xl font-black leading-tight mb-1 md:mb-2">CUSTOM<br/>ORDERS</h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-widest mb-3 md:mb-4 uppercase">YOUR DESIGN</p>
                  <Link href="/custom" className="bg-white text-[#f59e0b] font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full self-start hover:bg-neutral-100 transition-colors text-xs md:text-sm shadow-sm">
                    Order Now
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b] via-[#f59e0b]/50 to-transparent z-10"></div>
                  <Image src={featuredProducts[3]?.images?.[0]?.url || fallbackImage1} alt="Custom Orders" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}} />
        </section>



        {/* Latest Additions */}
        <section className="pt-4 pb-12 md:pt-10 md:pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="mb-4">
                <h2 className="text-[26px] md:text-4xl font-serif text-[#001738] tracking-tight">Latest Additions</h2>
              </div>
              <Link href="/products?sort=newest" className="flex items-center gap-0.5 text-[14px] md:text-[15px] text-[#e11d48] font-medium hover:text-[#be123c] transition-colors">
                See All <ChevronRight size={18} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {expandProductsByColor(latestProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-12 md:py-24 bg-rose-50/50 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="mb-4">
                <h2 className="text-[26px] md:text-4xl font-serif text-[#001738] tracking-tight">Bestsellers</h2>
              </div>
              <Link href="/products?sort=bestselling" className="flex items-center gap-0.5 text-[14px] md:text-[15px] text-[#e11d48] font-medium hover:text-[#be123c] transition-colors">
                See All <ChevronRight size={18} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {expandProductsByColor(featuredProducts.slice().reverse()).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators / Value Props */}
        <section className="py-12 md:py-24 bg-neutral-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🧶</span>
                </div>
                <h3 className="text-xl font-bold mb-3">100% Handmade</h3>
                <p className="text-neutral-400">Every single stitch is crafted by hand with premium, non-toxic yarn.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Bespoke Customization</h3>
                <p className="text-neutral-400">Want a different color? Adding a name? We build exactly what you envision.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Ready to Gift</h3>
                <p className="text-neutral-400">Premium unboxing experience with personalized gift notes included.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Personalized Gifts Section */}
        <section className="py-12 md:py-24 bg-rose-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div>
                  <h2 className="text-3xl md:text-5xl font-black mb-6 text-neutral-900">Make it <span className="text-rose-600">Yours.</span></h2>
                  <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                    Looking for a specific color palette? Want to add a name tag or a special accessory to a plushie? 
                    Our bespoke service lets you co-create the perfect handmade gift.
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-center gap-3 font-medium"><span className="text-rose-600">✓</span> Choose custom yarn colors</li>
                    <li className="flex items-center gap-3 font-medium"><span className="text-rose-600">✓</span> Add embroidered names or initials</li>
                    <li className="flex items-center gap-3 font-medium"><span className="text-rose-600">✓</span> Build-your-own bouquet combinations</li>
                  </ul>
                  <Link href="/custom" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors shadow-lg">
                    Start a Custom Order <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800" 
                  alt="Custom crochet process"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>



        {/* Testimonials */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Loved by Crafters &amp; Gifters</h2>
              <p className="text-neutral-500">Don&apos;t just take our word for it.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                  <div className="flex text-amber-400 mb-4">
                    {"★★★★★"}
                  </div>
                  <p className="text-neutral-700 italic mb-6">&quot;Absolutely stunning work! The custom bouquet I ordered for my mom&apos;s birthday arrived in perfect condition and she cried when she saw it.&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-sm">Sarah M.</div>
                      <div className="text-xs text-neutral-500">Verified Buyer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Feed */}
        <section className="py-12 md:py-24 bg-neutral-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Follow Our Journey</h2>
            <p className="text-neutral-400">Join our community on Instagram <a href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300">{instagramHandle}</a></p>
          </div>
          
          {/* A simple horizontal scrolling masonry-style grid simulation */}
          <div className="flex flex-nowrap gap-4 px-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {manualReels.length > 0 ? (
              manualReels.map((url, i) => (
                <div key={i} className="snap-center min-w-[320px] w-[320px] sm:min-w-[320px] relative rounded-2xl overflow-hidden group flex-shrink-0 bg-white shadow-md border border-neutral-100 flex items-center justify-center">
                  <InstagramEmbed url={url} />
                </div>
              ))
            ) : (
              [...featuredProducts, ...featuredProducts].slice(0, 5).map((product, i) => (
                <div key={i} className="snap-center min-w-[280px] sm:min-w-[320px] aspect-square relative rounded-2xl overflow-hidden group flex-shrink-0">
                  <Image src={product.images?.[0]?.url || fallbackImage1} alt="Instagram post" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <a href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-lg flex items-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      View on Instagram
                    </span>
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-24 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-6">

            <div>
              <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "How long do custom orders take?", a: "Most custom pieces take 5-7 business days to create before shipping. We'll provide a specific estimate at checkout based on current queue volume." },
                  { q: "Can I wash the amigurumi plushies?", a: "Yes! We recommend gentle spot cleaning or hand washing in cold water with mild detergent. Do not tumble dry." },
                  { q: "Do you ship internationally?", a: "Currently, we ship all across India. We are working on adding international shipping soon!" }
                ].map((faq, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 cursor-pointer hover:border-neutral-200 transition-colors">
                    <h3 className="font-bold text-neutral-900 mb-2">{faq.q}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
