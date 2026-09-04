/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";


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

export default function HomeClient({
  featuredProducts,
  latestProducts,
  categories,
  randomProducts = [],
  randomProducts2 = []
}: {
  featuredProducts: any[];
  latestProducts: any[];
  categories: any[];
  randomProducts?: any[];
  randomProducts2?: any[];
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeReviewSlide, setActiveReviewSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const container = categoriesScrollRef.current;
      if (!container) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const itemWidth = container.firstElementChild?.clientWidth || 300;
      
      // Check if we are at the end (allowing 20px tolerance)
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 4500); // cycle every 4.5 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const container = reviewsScrollRef.current;
      if (!container) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const itemWidth = container.firstElementChild?.clientWidth || 280;
      
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 4000); // cycle every 4 seconds
    return () => clearInterval(timer);
  }, []);

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
  const plushToysImg = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp";

  const heroBanners = [
    {
      id: 1,
      title: "Handmade Crochet Gifts Sale!",
      subtitle: "Up to 50% off on premium crochet bouquets & amigurumi plushies.",
      image: "/hero-banner-1.webp",
      cta1: { text: "Shop the Sale", link: "/products" },
      cta2: { text: "Custom Orders", link: "/custom" },
    },
    {
      id: 2,
      title: "Crochet Flower Pots",
      subtitle: "Vibrant handmade pots that never fade.",
      image: "/hero-banner-2.webp",
      cta1: { text: "Shop Pots", link: "/products?category=flower-pots" },
    },
    {
      id: 3,
      title: "Cute Crochet Plushies",
      subtitle: "Handcrafted cuddly companions for loved ones.",
      image: "/hero-banner-3.webp",
      cta1: { text: "View Toys", link: "/products?category=toys" },
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
          className="relative h-[45vh] min-h-[320px] md:min-h-[400px] md:h-[400px] w-full flex flex-col md:flex-row items-center justify-center overflow-hidden bg-neutral-900"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* Mobile Background Images (Hidden on md+) */}
          <div className="md:hidden">
            <div className={`absolute inset-0 z-0 ${activeSlide === 0 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
              <Image
                src={heroBanners[0].image}
                alt="Handmade crochet gifts India - promotional banner"
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
                  alt="Handmade crochet gifts India - promotional banner"
                  fill
                  priority={false}
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              </div>
            )}
          </div>

          {/* Desktop Full-Bleed Layout (Hidden on Mobile) */}
          <div className="hidden md:block absolute inset-0 z-0">
            {heroBanners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${activeSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <Image
                  src={banner.image}
                  alt="Handmade crochet gifts India"
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ))}
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-20"></div>
          </div>

          {/* Desktop Text Content */}
          <div className="hidden md:flex relative z-30 max-w-7xl mx-auto w-full h-full items-center px-8 lg:px-16">
            <div className="w-1/2 flex flex-col justify-center h-full relative">
              {heroBanners.map((banner, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${activeSlide === index ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'}`}
                >
                  {index === 0 ? (
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-4 text-white leading-[1.1]">
                      {banner.title}
                    </h1>
                  ) : (
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-4 text-white leading-[1.1]">
                      {banner.title}
                    </h2>
                  )}
                  <p className="text-base lg:text-lg text-white/80 mb-8 max-w-md font-medium leading-relaxed">
                    {banner.subtitle}
                  </p>

                  <div className="flex flex-row items-center gap-3">
                    {banner.cta1 && (
                      <Link href={banner.cta1.link} className="bg-rose-600 text-white px-6 py-3 rounded-full font-bold text-sm lg:text-base hover:bg-rose-700 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap">
                        {banner.cta1.text} <ArrowRight size={16} />
                      </Link>
                    )}
                    {banner.cta2 && (
                      <Link href={banner.cta2.link} className="bg-white text-neutral-900 px-6 py-3 rounded-full font-bold text-sm lg:text-base hover:bg-neutral-100 transition-all shadow-md flex items-center whitespace-nowrap">
                        {banner.cta2.text}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Slider Indicators */}
          <div className="hidden md:flex absolute bottom-6 left-0 right-0 justify-center gap-2.5 z-30">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-white w-7 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/40 w-2 hover:bg-white/60"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile layout container */}
          <div className="md:hidden relative w-full h-full flex flex-col justify-end z-10 pb-[24px] px-[20px]">
            <div
              key={activeSlide}
              className="w-full flex flex-col items-start text-left relative z-10 animate-fade-in-up-mobile"
            >
              {/* Text Content */}
              <div className="w-full flex flex-col items-start">

                <h2 className="text-[24px] font-[800] leading-[1.15] text-white w-[80%] mb-[6px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {heroBanners[activeSlide].title}
                </h2>

                <p className="text-[12px] font-[500] leading-[1.4] text-white/90 line-clamp-1 mb-[14px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                  {heroBanners[activeSlide].subtitle}
                </p>
              </div>

              {/* Buttons Side by Side */}
              <div className="flex flex-row gap-2 w-full mt-1">
                {heroBanners[activeSlide].cta1 && (
                  <Link href={heroBanners[activeSlide].cta1.link} className="flex-1 h-[36px] bg-rose-600 text-white rounded-full font-[700] text-[12px] flex items-center justify-center gap-1.5 shadow-lg">
                    {heroBanners[activeSlide].cta1.text} <ArrowRight size={12} />
                  </Link>
                )}

                {heroBanners[activeSlide].cta2 && (
                  <Link href={heroBanners[activeSlide].cta2.link} className="flex-1 h-[36px] bg-white text-neutral-900 rounded-full font-[600] text-[12px] flex items-center justify-center shadow-md">
                    {heroBanners[activeSlide].cta2.text}
                  </Link>
                )}
              </div>
            </div>

            {/* Slider Indicators for Mobile */}
            <div className="w-full flex justify-center gap-2 mt-[16px] relative z-10">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-white w-5" : "bg-white/40 w-1.5"}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-8 md:py-20 bg-neutral-50 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8">
            <div className="text-center mb-6 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">Shop Handmade Crochet Gifts by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat) => {
                const catImage = cat.bannerUrl || cat.products?.[0]?.images?.[0]?.url || fallbackImage1;
                return (
                  <Link href={`/products?category=${cat.slug}`} title={`Shop handmade crochet ${cat.name.toLowerCase()} India`} key={cat.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-200">
                    <Image src={catImage} alt={`Handmade crochet ${cat.name.toLowerCase()} gift`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 md:mt-14 flex justify-center">
              <Link href="/products" className="group inline-flex items-center justify-center gap-2 bg-neutral-900 text-white border-2 border-neutral-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg hover:bg-neutral-800 hover:border-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-95 active:shadow-sm w-[260px] md:w-[320px] max-w-full">
                View All Categories <ArrowRight className="w-4 h-4 md:w-5 md:h-5 animate-bounce-x" />
              </Link>
            </div>
          </div>
        </section>

        {/* Epic Deals Section (SWAG SAVINGS) */}
        <EpicDeals products={featuredProducts} categories={categories} />

        {/* Promotional Banners */}
        <section className="pt-2 pb-0 md:pt-12 md:pb-4 bg-white overflow-hidden">
          <div className="max-w-[100vw] px-4 md:px-6 xl:px-0 xl:max-w-7xl mx-auto">
            <div ref={categoriesScrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 xl:mx-0 xl:px-0">

              {/* Banner 2 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[150px] md:h-[200px] rounded-3xl overflow-hidden relative flex bg-[#0d9488]">
                <div className="w-7/12 p-5 md:p-8 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-xl md:text-3xl font-black leading-tight mb-1 md:mb-2">FLOWER<br />POTS</h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-widest mb-3 md:mb-4 uppercase">VIBRANT & CUTE</p>
                  <Link href="/products?category=flower-pots" title="Shop handmade crochet flower pots" className="bg-white text-[#0d9488] font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full self-start hover:bg-neutral-100 transition-colors text-xs md:text-sm shadow-sm">
                    Shop Pots
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d9488] via-[#0d9488]/50 to-transparent z-10"></div>
                  <Image src={flowerPotsImg} alt="Handmade crochet flower pots - unique gifts" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

              {/* Banner 3 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[150px] md:h-[200px] rounded-3xl overflow-hidden relative flex bg-[#8b5cf6]">
                <div className="w-7/12 p-5 md:p-8 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-xl md:text-3xl font-black leading-tight mb-1 md:mb-2">PLUSH<br />TOYS</h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-widest mb-3 md:mb-4 uppercase">CUDDLY FRIENDS</p>
                  <Link href="/products?category=toys" title="Shop handmade amigurumi and crochet toys India" className="bg-white text-[#8b5cf6] font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full self-start hover:bg-neutral-100 transition-colors text-xs md:text-sm shadow-sm">
                    Shop Toys
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] via-[#8b5cf6]/50 to-transparent z-10"></div>
                  <Image src={plushToysImg} alt="Handmade amigurumi crochet plush toys India" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

              {/* Banner 4 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[150px] md:h-[200px] rounded-3xl overflow-hidden relative flex bg-[#f59e0b]">
                <div className="w-7/12 p-5 md:p-8 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-xl md:text-3xl font-black leading-tight mb-1 md:mb-2">CUSTOM<br />ORDERS</h3>
                  <p className="text-[10px] md:text-xs font-bold tracking-widest mb-3 md:mb-4 uppercase">YOUR DESIGN</p>
                  <Link href="/custom" title="Order custom crochet flower bouquet" className="bg-white text-[#f59e0b] font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full self-start hover:bg-neutral-100 transition-colors text-xs md:text-sm shadow-sm">
                    Order Now
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b] via-[#f59e0b]/50 to-transparent z-10"></div>
                  <Image src={featuredProducts[3]?.images?.[0]?.url || fallbackImage1} alt="Custom handmade crochet gifts India" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

            </div>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
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
        <section className="pt-4 pb-4 md:pt-10 md:pb-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-xl md:text-3xl font-serif text-[#001738] tracking-tight">Latest Handmade Gifts</h2>
                <p className="hidden md:block text-sm md:text-base text-neutral-500 mt-2 font-medium">Buy <Link href="/products" className="text-[#e11d48] hover:underline font-bold">crochet gifts online</Link> in India. Shop affordable <Link href="/products?category=keychains" className="text-[#e11d48] hover:underline font-bold">handmade gifts</Link> starting under ₹300.</p>
              </div>
              <Link href="/products?sort=newest" className="group inline-flex items-center gap-1.5 md:gap-2 bg-neutral-900 text-white border-2 border-neutral-900 px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-800 hover:border-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-95 active:shadow-sm shrink-0">
                Shop All <ArrowRight size={16} className="animate-bounce-x" />
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
        <section className="py-6 md:py-10 bg-rose-50/50 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-xl md:text-3xl font-serif text-[#001738] tracking-tight">Bestselling Crochet Gifts India</h2>
              </div>
              <Link href="/products?sort=bestselling" className="group inline-flex items-center gap-1.5 md:gap-2 bg-neutral-900 text-white border-2 border-neutral-900 px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-sm md:text-base hover:bg-neutral-800 hover:border-neutral-800 transition-all shadow-md hover:shadow-lg active:scale-95 active:shadow-sm shrink-0">
                Shop All <ArrowRight size={16} className="animate-bounce-x" />
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
        <section className="py-8 md:py-12 bg-neutral-900 text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-800 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <span className="text-xl">🧶</span>
                </div>
                <h3 className="text-lg font-bold mb-1.5 md:mb-2">100% Handmade</h3>
                <p className="text-sm text-neutral-400">Every single stitch is crafted by hand with premium, non-toxic yarn to create the best <Link href="/products" className="text-rose-400 hover:underline">handmade crochet gifts</Link> in India.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-800 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="text-lg font-bold mb-1.5 md:mb-2">Bespoke Customization</h3>
                <p className="text-sm text-neutral-400">Want a different color? Adding a name? We build exactly what you envision for your <Link href="/custom" className="text-rose-400 hover:underline">custom crochet gifts</Link> online.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-800 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <span className="text-xl">🎁</span>
                </div>
                <h3 className="text-lg font-bold mb-1.5 md:mb-2">Ready to Gift</h3>
                <p className="text-sm text-neutral-400">Premium unboxing experience with personalized gift notes included. The perfect crochet gift shop experience.</p>
              </div>
            </div>
          </div>
        </section>


        {/* Personalized Gifts Section */}
        <section className="py-4 md:py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-rose-50 border border-rose-100 flex flex-row items-stretch shadow-sm">
              
              {/* Text Side */}
              <div className="w-7/12 md:w-1/2 lg:w-7/12 p-4 sm:p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center">
                  <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1.5 md:mb-3 text-neutral-900">Make Your Handmade Gift <span className="text-rose-600">Yours.</span></h2>
                  <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-2 md:mb-6 leading-relaxed max-w-lg">
                    Co-create the perfect <Link href="/products" className="text-rose-600 hover:underline font-medium">handmade crochet gift</Link>. Choose colors, add initials & design your dream bouquet.
                  </p>
                  <div className="hidden sm:flex items-center gap-4 mb-4 md:mb-5 text-sm font-medium text-neutral-700">
                    <span className="flex items-center gap-1"><span className="text-rose-600">✓</span> Custom colors</span>
                    <span className="flex items-center gap-1"><span className="text-rose-600">✓</span> Add initials</span>
                  </div>
                  <Link href="/custom" className="inline-flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full font-bold text-[10px] sm:text-sm hover:bg-neutral-800 transition-colors w-fit">
                    Custom Order <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
                  </Link>
              </div>

              {/* Image Side - always visible on the right */}
              <div className="w-5/12 md:w-1/2 lg:w-5/12 relative min-h-[140px] md:min-h-[320px]">
                  <Image
                    src="/crochet-flower-bouquet.png"
                    alt="Custom Handmade Crochet Gifts"
                    fill
                    sizes="(max-width: 768px) 40vw, 33vw"
                    className="object-cover md:object-contain md:object-right"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-rose-50/40 to-transparent w-1/3"></div>
              </div>

            </div>
          </div>
        </section>





        {/* Testimonials */}
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Loved by Handmade Gift Shoppers in India</h2>
              <p className="text-neutral-500 text-sm">Don&apos;t just take our word for it.</p>
            </div>
            
            <div className="-mx-6">
              <div ref={reviewsScrollRef} className="flex flex-nowrap gap-4 md:gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar px-6">
                {[
                  { name: "Priya Sharma", initial: "P", text: "Absolutely stunning work! The custom bouquet I ordered for my mom's birthday arrived in perfect condition and she cried when she saw it." },
                  { name: "Ananya", initial: "A", text: "The amigurumi bunny is so soft and well-made. My niece won't sleep without it now. Highly recommended for handmade gifts!" },
                  { name: "Rohan Mehta", initial: "R", text: "Ordered a sunflower pot for my desk and it brings so much joy. The craftsmanship is flawless and delivery was right on time." },
                  { name: "Sneha Kapoor", initial: "S", text: "The keychain I got is incredibly cute. You can really tell how much love and effort goes into every single stitch." },
                  { name: "Neha", initial: "N", text: "I gifted a crochet rose bouquet to my wife for our anniversary. She absolutely loved it! Better than real flowers since these last forever." },
                  { name: "Kavya Tiwari", initial: "K", text: "I requested a custom color combination for a plushie, and they nailed it perfectly. Very professional and friendly service." },
                  { name: "Aarti", initial: "A", text: "Such beautiful packaging! It felt like opening a premium gift. The crochet teddy inside was just as perfect." },
                  { name: "Vikas Patel", initial: "V", text: "Bought some crochet hair clips for my daughter and they are her absolute favorites now. Great quality and very durable." },
                  { name: "Megha", initial: "M", text: "I'm amazed by the intricate details on the amigurumi dolls. This is true artistry. Will definitely be ordering more!" },
                  { name: "Pooja Bansal", initial: "P", text: "Thank you for the beautiful flower pot. It sits on my window sill and completely brightens up the room. Wonderful handmade product." }
                ].map((review, idx) => (
                <div key={idx} className="snap-center min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] shrink-0">
                  <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 h-full flex flex-col">
                    <div className="flex text-amber-400 mb-3 text-sm md:text-base">
                      {"★★★★★"}
                    </div>
                    <p className="text-neutral-700 italic mb-5 text-sm md:text-base flex-grow">&quot;{review.text}&quot;</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-700 font-bold shrink-0 text-sm md:text-base">
                        {review.initial}
                      </div>
                      <div>
                        <div className="font-bold text-xs md:text-sm">{review.name}</div>
                        <div className="text-[10px] md:text-xs text-neutral-500">Verified Buyer</div>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Instagram Feed */}
        <section className="py-8 md:py-10 bg-neutral-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 mb-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Follow Our Handmade Crochet Journey</h2>
            <p className="text-sm md:text-base text-neutral-400">Join our community on Instagram <a href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300">{instagramHandle}</a></p>
          </div>

          {/* A simple horizontal scrolling masonry-style grid simulation */}
          <div className="flex flex-nowrap gap-4 px-6 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {manualReels.length > 0 ? (
              manualReels.map((url, i) => (
                <div key={i} className="snap-center min-w-[240px] w-[240px] sm:min-w-[280px] sm:w-[280px] relative rounded-2xl overflow-hidden group flex-shrink-0 bg-white shadow-md border border-neutral-100 flex items-center justify-center">
                  <InstagramEmbed url={url} />
                </div>
              ))
            ) : (
              [...featuredProducts, ...featuredProducts].slice(0, 5).map((product, i) => (
                <div key={i} className="snap-center min-w-[240px] sm:min-w-[280px] aspect-square relative rounded-2xl overflow-hidden group flex-shrink-0">
                  <Image src={product.images?.[0]?.url || fallbackImage1} alt="Instagram post" fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <a href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-lg flex items-center gap-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                      View on Instagram
                    </span>
                  </a>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 md:py-12 bg-neutral-50 border-t border-neutral-200">
          <div className="max-w-4xl mx-auto px-6">

            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">Handmade Crochet Gifts FAQ</h2>
              <div className="space-y-2">
                {[
                  { q: "What is a crochet bouquet?", a: <>A crochet bouquet is a handcrafted arrangement of yarn flowers. Unlike real flowers, a crochet bouquet is a <Link href="/products" className="text-rose-600 hover:underline font-medium">handmade gift</Link> that lasts forever, making it perfect for gifting.</> },
                  { q: "How long does a crochet bouquet last?", a: "Our handmade crochet flower bouquets are crafted from premium yarn and never wilt. They are beautiful forever flowers that last a lifetime." },
                  { q: "What is an amigurumi toy?", a: <>An amigurumi toy is a small, stuffed yarn plushie made using the Japanese art of knitting or crocheting. You can explore our cuddly <Link href="/products?category=toys" className="text-rose-600 hover:underline font-medium">crochet plushies</Link> for unique gifts.</> },
                  { q: "Are crochet plushies washable?", a: "Yes, we recommend gentle spot cleaning or hand washing in cold water with a mild detergent. Lay flat to dry to keep your handmade stuffed toys looking perfect." },
                  { q: "How long does a custom crochet order take?", a: <>Most <Link href="/custom" className="text-rose-600 hover:underline font-medium">custom crochet orders</Link> take 5-7 business days to create before shipping across India. Specific estimates are provided at checkout.</> },
                  { q: "Does Anuki Crochet deliver across India?", a: "Yes, we deliver our affordable handmade gifts across India. International shipping is coming soon!" }
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-xl border border-neutral-100 cursor-pointer hover:border-neutral-200 transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm md:text-base text-neutral-900 mb-0">{faq.q}</h3>
                      <div className={`transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-neutral-500" />
                      </div>
                    </div>
                    {openFaqIndex === i && (
                      <div className="mt-3 text-neutral-600 text-sm leading-relaxed animate-fade-in">
                        {faq.a}
                      </div>
                    )}
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
