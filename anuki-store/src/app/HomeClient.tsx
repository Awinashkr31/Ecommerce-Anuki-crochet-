/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronDown, Play, Check } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const ProductCard = dynamic(() => import("@/components/ProductCard").then(mod => mod.ProductCard), { ssr: true });
const EpicDeals = dynamic(() => import("@/components/EpicDeals").then(mod => mod.EpicDeals), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer").then(mod => mod.Footer), { ssr: true });
import useSWR from 'swr';
import { apiGet } from '@/lib/api';
import { expandProductsByColor } from '@/utils/productUtils';
import WordRotator from "@/components/animations/WordRotator";
import StatsStrip from "@/components/animations/StatsStrip";
import BentoCategoryGrid from "@/components/animations/BentoCategoryGrid";
import ReviewShuffle from "@/components/animations/ReviewShuffle";
import ProcessDraw from "@/components/animations/ProcessDraw";
import GiftFinderHub from "@/components/GiftFinderHub";

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
 if ((window as any)?.instgrm?.Embeds) {
 try {
 (window as any).instgrm?.Embeds?.process();
 } catch {
 // ignore
 }
 }
 };
 if (!(window as any)?.instgrm?.Embeds) {
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

const SectionHeader = ({ title, linkText, linkUrl }: { title: string, icon?: string, linkText: string, linkUrl: string }) => (
 <div className="flex justify-between items-center mb-4">
 <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
 {title}
 </h2>
 <Link href={linkUrl} className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full hover:bg-rose-100 flex items-center gap-1 transition-colors border border-rose-100">
 {linkText} <ArrowRight size={12} />
 </Link>
 </div>
);

export default function HomeClient({
 featuredProducts,
 latestProducts,
 categories,
 randomProducts = [],
 faqs = []
}: {
 featuredProducts: any[];
 latestProducts: any[];
 categories: any[];
 randomProducts?: any[];
 faqs?: { question: string; answer: string }[];
}) {
 const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

 const { data: settings } = useSWR('/settings/public', (url: string) => apiGet<Record<string, string>>(url));
 const freeDeliveryThreshold = settings?.['free_delivery_threshold'] ? Number(settings['free_delivery_threshold']) : 799;

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
 const flowerBouquetsImg = getCategoryImage(['flower-bouquets', 'bouquets'], 0) || fallbackImage1;
 const plushToysImg = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/811a8439-4e35-4013-a535-250ac8c8cda2.webp";

 const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

 const heroSlides = [
 {
 id: 1,
 image: "/hero-banner-1.webp",
 desktopImage: "/hero-banner-1.webp",
 badge: "NEW COLLECTION",
 title: "Up to 20% Off",
 desktopTitle: "Up to 20% Off",
 description: "Premium bouquets & plushies.",
 desktopDescription: "Premium bouquets & plushies.",
 link: "/products",
 btnText: "Shop Sale"
 },
 {
 id: 2,
 image: plushToysImg,
 desktopImage: "/hero-banner-2.webp",
 badge: "CUTE & CUDDLY",
 title: "Amigurumi Plushies",
 desktopTitle: "New Arrivals",
 description: "Custom companions starting at ₹300.",
 desktopDescription: "Discover our latest collection.",
 link: "/products?category=toys",
 btnText: "Explore Toys"
 },
 {
 id: 3,
 image: flowerBouquetsImg,
 desktopImage: "/hero-banner-3.webp",
 badge: "ELEGANT GIFTS",
 title: "Flower Bouquets",
 desktopTitle: "Perfect Gifts",
 description: "Handcrafted beauties for loved ones.",
 desktopDescription: "Handcrafted with love for every occasion.",
 link: "/products?category=flower-bouquets",
 btnText: "Shop Bouquets"
 },
 {
 id: 4,
 image: flowerPotsImg,
 desktopImage: "/promo-banner.webp",
 badge: "EVERLASTING",
 title: "Flower Pots",
 desktopTitle: "Special Promo",
 description: "Flowers that never fade.",
 desktopDescription: "Grab our special deals today.",
 link: "/products?category=flower-pots",
 btnText: "Shop Decor"
 }
 ];

 // Trending section uses randomProducts directly, no local storage needed

 useEffect(() => {
 const timer = setInterval(() => {
 setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
 }, 4000);
 return () => clearInterval(timer);
 }, [heroSlides.length]);

 const instagramHandle = settings?.['instagram_handle'] || '@anuki_crochet';


 return (
 <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-rose-200 flex flex-col w-full overflow-x-hidden">
 <main>

 {/* Hero Banner Carousel */}
 <section className="px-4 pt-2 pb-4 bg-white">
 <div className="relative rounded-[2rem] overflow-hidden min-h-[420px] flex flex-col justify-end shadow-sm group">
 {heroSlides.map((slide, index) => (
 <div 
 key={slide.id}
 className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
 > 
  {slide.desktopImage && slide.desktopImage !== slide.image ? (
    <>
      <Image 
        src={slide.image} 
        alt={slide.title} 
        fill 
        className="object-cover md:hidden" 
        priority={index === 0} 
        fetchPriority={index === 0 ? "high" : "auto"}
        loading={index === 0 ? "eager" : "lazy"}
        sizes="100vw" 
      />
      <Image 
        src={slide.desktopImage} 
        alt={slide.title} 
        fill 
        className="object-cover hidden md:block object-center" 
        priority={index === 0} 
        fetchPriority={index === 0 ? "high" : "auto"}
        loading={index === 0 ? "eager" : "lazy"}
        sizes="100vw" 
      />
    </>
  ) : (
    <Image 
      src={slide.image} 
      alt={slide.title} 
      fill 
      className="object-cover object-center" 
      priority={index === 0} 
      fetchPriority={index === 0 ? "high" : "auto"}
      loading={index === 0 ? "eager" : "lazy"}
      sizes="100vw" 
    />
  )}

 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
 <div className="absolute inset-0 p-6 flex flex-col justify-end max-w-xl z-20">
 <div className={`transition-all duration-700 transform ${index === currentHeroSlide ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'}`}>
 <div className="bg-rose-600/95 text-white text-[10px] font-bold px-3 py-1.5 rounded-full w-fit mb-4 border border-rose-400 tracking-wider uppercase drop-shadow-md">
 {slide.badge}
 </div>
 
 <div className="mb-3">
 {index === 0 ? (
 <h1 className="anim-hero-headline text-3xl lg:text-4xl font-serif text-white mb-3 leading-[1.15] drop-shadow-md">
 Handcrafted Crochet <WordRotator />
 </h1>
 ) : (
 <h2 className="text-3xl lg:text-4xl font-serif text-white mb-3 leading-[1.15] drop-shadow-md">
 {slide.desktopTitle && slide.desktopTitle !== slide.title ? (
 <>
 <span className="md:hidden">{slide.title}</span>
 <span className="hidden md:inline">{slide.desktopTitle}</span>
 </>
 ) : (
 slide.title
 )}
 </h2>
 )}
 <p className="anim-hero-subtext text-white/90 text-xs lg:text-sm mb-6 font-medium max-w-sm leading-relaxed drop-shadow-sm">
 {slide.desktopDescription && slide.desktopDescription !== slide.description ? (
 <>
 <span className="md:hidden">{slide.description}</span>
 <span className="hidden md:inline">{slide.desktopDescription}</span>
 </>
 ) : (
 slide.description
 )}
 </p>
 </div>
 
 <div className="anim-hero-cta flex gap-3 flex-wrap">
 <Link href={slide.link} className="bg-rose-800 hover:bg-rose-900 text-white px-6 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-lg">
 {slide.btnText} <ArrowRight size={16} />
 </Link>
 {index === 0 && (
 <Link href="/custom" className="bg-white/95 hover:bg-white text-neutral-900 px-6 py-3.5 rounded-full text-sm font-bold transition-colors shadow-md">
 Custom Orders
 </Link>
 )}
 </div>
 </div>
 </div>
 </div>
 ))}
 
 {/* Dots Indicator */}
 <div className="absolute bottom-6 right-6 z-20 flex gap-2">
 {heroSlides.map((_, idx) => (
 <button 
 key={idx}
 onClick={() => setCurrentHeroSlide(idx)}
 className="min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full transition-all duration-300"
 aria-label={`Go to slide ${idx + 1}`}
 >
 <span className={`block rounded-full transition-all duration-300 ${idx === currentHeroSlide ? 'w-6 h-2 bg-rose-500' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`} />
 </button>
 ))}
 </div>
 </div>
 </section>

 {/* Stats Strip */}
 <StatsStrip />



 {/* Placement 3: Category Grid — Bento Build */}
 <BentoCategoryGrid categories={categories} />



  {/* Trending Now */}
  <section className="py-6 px-4 bg-white border-t border-[#f0e8e6]">
  <div className="flex justify-between items-center mb-5">
  <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
  Trending Now
  </h2>
  <Link href="/products?sort=trending" className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:text-rose-800 transition-colors">View All</Link>
  </div>
  <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4 snap-x" role="region" aria-label="Trending products" tabIndex={0}>
  {randomProducts.slice(0, 12).map((product) => (
  <div key={product.id} className="snap-start min-w-[150px] w-[150px] ">
  <ProductCard product={product} hideAddToCart={true} href={`/products?product=${product.slug}`} />
  </div>
  ))}
  </div>
  </section>



 {/* Epic Deals Section */}
 <div className="hidden">
 <EpicDeals products={featuredProducts} categories={categories} />
 </div>

 {/* Bestselling Gifts */}
 <section className="py-6 px-4 bg-white border-t border-[#f0e8e6]">
 <SectionHeader title="Bestselling Gifts" icon="🤍" linkText="See All" linkUrl="/products?sort=bestselling" />
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
 {expandProductsByColor(featuredProducts).slice(0,8).map(product => <ProductCard key={product.id} product={product} hideAddToCart={true} href={`/products?product=${product.slug}`} />)}
 </div>
 </section>

 {/* Latest Arrivals */}
 <section className="py-6 px-4 bg-white border-t border-[#f0e8e6]">
 <div className="flex justify-between items-end mb-6">
 <div>
 <p className="text-[10px] font-bold tracking-widest text-rose-800 mb-1 flex items-center gap-0.5">
 <ChevronLeft size={12} strokeWidth={3} /> Fresh Off The Hook
 </p>
 <h2 className="text-3xl font-serif font-bold text-neutral-900 leading-none tracking-tight">Latest Arrivals</h2>
 </div>
 <Link href="/products?sort=newest" className="border border-[#f0e8e6] rounded-full px-4 py-1.5 text-xs font-bold text-rose-800 flex items-center gap-1 hover:bg-rose-50 transition-colors mb-1">
 Shop All <ArrowRight size={12} />
 </Link>
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
 {expandProductsByColor(latestProducts).slice(0,8).map(product => <ProductCard key={product.id} product={product} hideAddToCart={true} href={`/products?product=${product.slug}`} />)}
 </div>
 </section>

 {/* BEHIND THE HOOK & YARN */}
 <section className="py-8 px-4 bg-white">
 <Link href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#2c2829] rounded-[2rem] p-5 flex items-center gap-4 relative overflow-hidden shadow-lg group block">
 <div className="w-14 h-14 bg-[#a43b46] rounded-full flex items-center justify-center shrink-0 z-10 shadow-md group-hover:scale-110 transition-transform">
 <Play fill="white" className="w-6 h-6 ml-1 text-white" />
 </div>
 <div className="z-10 text-white flex-1">
 <p className="text-xs font-bold tracking-widest text-neutral-400 mb-1">Behind the hook & yarn</p>
 <h3 className="text-sm font-bold mb-1 leading-tight text-white">How We Craft Anuki Plushies</h3>
 <p className="text-xs text-neutral-400 font-medium">Tap to watch the handmade process</p>
 </div>
 <div className="absolute right-0 top-0 bottom-0 w-32 z-0 opacity-20 pointer-events-none flex items-center justify-end pr-4">
 <div className="w-24 h-24 border-4 border-white rounded-full translate-x-8"></div>
 </div>
 </Link>
 </section>



 {/* CO-CREATE / CUSTOM SECTION - Compact & Beautiful */}
  <section className="py-6 px-4 bg-[#fcf8f7]">
  <div className="max-w-4xl mx-auto bg-white border border-[#f0e8e6] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-sm">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
      {/* Photo: Top on Mobile, Right on Desktop */}
      <div 
        className="w-full relative rounded-xl sm:rounded-2xl overflow-hidden shadow-inner border border-rose-100/60 md:order-2"
        style={{ minHeight: '210px', height: '230px' }}
      >
        <Image
          src="/crochet-flower-bouquet.webp"
          alt="Custom Handmade Crochet Gift Bouquet"
          fill
          priority={false}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
        />
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-rose-900 border border-rose-100 shadow-2xs flex items-center gap-1">
          <span>🧶</span>
          <span>100% Handcrafted</span>
        </div>
      </div>

      {/* Text & CTA: Under Photo on Mobile, Left on Desktop */}
      <div className="flex flex-col justify-center md:order-1">
        <span className="text-[10px] font-bold tracking-widest uppercase text-rose-800 mb-1">
          Custom Creations
        </span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-neutral-900 leading-snug">
          Make Your Handmade Gift Yours
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 mb-3">
          Choose custom colors, add initials, or craft a unique keepsake.
        </p>

        {/* Quick pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          <span className="text-[11px] font-medium bg-rose-50 text-rose-900 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
            🎨 Custom Colors
          </span>
          <span className="text-[11px] font-medium bg-rose-50 text-rose-900 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
            ✨ Add Initials
          </span>
          <span className="text-[11px] font-medium bg-rose-50 text-rose-900 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
            🧵 Handcrafted
          </span>
        </div>

        <Link
          href="/custom"
          className="inline-flex items-center justify-center gap-2 bg-rose-800 hover:bg-rose-900 text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full transition-all shadow-sm active:scale-95 w-full sm:w-fit"
        >
          <span>Design Custom Gift</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
  </section>

 {/* Why Shop Anuki Crochet? */}
 <section className="py-10 px-4 bg-white max-w-4xl mx-auto">
 <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 text-center uppercase mb-2">Anuki Guarantee</h2>
 <h3 className="text-2xl font-serif font-bold text-center mb-8 text-neutral-900">Why Shop Anuki Crochet?</h3>
 <div className="space-y-4">
 <div className="bg-[#fdfaf9] rounded-[1.5rem] p-5 flex gap-4 items-start border border-[#f0e8e6] shadow-sm">
 <div className="w-12 h-12 bg-rose-100/80 rounded-full flex items-center justify-center shrink-0">
 <span className="text-rose-600 text-xl">🧶</span>
 </div>
 <div className="pt-1">
 <h4 className="font-bold text-base text-neutral-900 mb-1.5">100% Handcrafted</h4>
 <p className="text-sm text-neutral-600 leading-relaxed">Every single stitch is crafted by hand in India with the finest non-toxic yarn, zero factory mass production.</p>
 </div>
 </div>
 <div className="bg-[#fdfaf9] rounded-[1.5rem] p-5 flex gap-4 items-start border border-[#f0e8e6] shadow-sm">
 <div className="w-12 h-12 bg-rose-100/80 rounded-full flex items-center justify-center shrink-0">
 <span className="text-rose-600 text-xl">✨</span>
 </div>
 <div className="pt-1">
 <h4 className="font-bold text-base text-neutral-900 mb-1.5">Custom Orders</h4>
 <p className="text-sm text-neutral-600 leading-relaxed">Want a different color combination or special attachment? We bring your exact vision to life.</p>
 </div>
 </div>
 <div className="bg-[#fdfaf9] rounded-[1.5rem] p-5 flex gap-4 items-start border border-[#f0e8e6] shadow-sm">
 <div className="w-12 h-12 bg-rose-100/80 rounded-full flex items-center justify-center shrink-0">
 <span className="text-rose-600 text-xl">🎁</span>
 </div>
 <div className="pt-1">
 <h4 className="font-bold text-base text-neutral-900 mb-1.5">Ready-to-Gift Packaging</h4>
 <p className="text-sm text-neutral-600 leading-relaxed">Premium gift boxes with custom handwritten letters to make every handmade gift truly special.</p>
 </div>
 </div>
 </div>
 </section>

 {/* Placement 5: How It Is Made — Process Draw (SVG Self-Drawing Stroke) */}
 <ProcessDraw />

 {/* Curated Gift Finder Hub */}
 <GiftFinderHub />

 {/* Placement 4: Loved Across India — Review Shuffle (~6s cross-fade, pause on hover/touch, dot indicators) */}
 <ReviewShuffle />

 {/* FAQ */}
 <section className="py-10 px-4 bg-white max-w-3xl mx-auto">
 <h2 className="text-[10px] font-bold tracking-widest text-neutral-500 text-center uppercase mb-2">Got Questions?</h2>
 <h3 className="text-2xl font-serif font-bold text-center mb-8 text-neutral-900">Frequently Asked Questions</h3>
 <div className="space-y-3">
 {(faqs && faqs.length > 0 ? faqs : [
 { question: "What is a crochet bouquet?", answer: "A crochet bouquet is a handcrafted arrangement of yarn flowers. Unlike real flowers, a crochet bouquet is a handmade gift that lasts forever, making it perfect for gifting." },
 { question: "How long does a crochet bouquet last?", answer: "Our handmade crochet flower bouquets are crafted from premium yarn and never wilt. They are beautiful forever flowers that last a lifetime." },
 { question: "What is an amigurumi toy?", answer: "An amigurumi toy is a small, stuffed yarn plushie made using the Japanese art of knitting or crocheting. You can explore our cuddly crochet plushies for unique gifts." },
 { question: "Are crochet plushies washable?", answer: "Yes, we recommend gentle spot cleaning or hand washing in cold water with a mild detergent. Lay flat to dry to keep your handmade stuffed toys looking perfect." },
 { question: "How long does a custom crochet order take?", answer: "Most custom crochet orders take 5-7 business days to create before shipping across India. Specific estimates are provided at checkout." },
 { question: "Does Anuki Crochet deliver across India?", answer: "Yes, we deliver our affordable handmade gifts securely packaged across all of India." }
 ]).map((faq, i) => (
 <details key={i} open={openFaqIndex === i} className="bg-[#fcf8f7] border border-[#f0e8e6] rounded-2xl overflow-hidden shadow-sm">
 <summary 
 onClick={(e) => {
   e.preventDefault();
   setOpenFaqIndex(openFaqIndex === i ? null : i);
 }}
 className="w-full text-left p-5 flex justify-between items-center cursor-pointer list-none focus:outline-none"
 >
 <span className="font-bold text-sm text-neutral-900">{faq.question}</span>
 <ChevronDown size={18} className={`text-neutral-400 transition-transform duration-300 shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
 </summary>
 <div className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed border-t border-[#f0e8e6]/50 pt-3">
 {faq.answer}
 </div>
 </details>
 ))}
 </div>
 </section>


 {/* Category & Custom Showcase Cards */}
 <section className="px-4 pb-8 bg-white border-t border-[#f0e8e6] pt-8">
 <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 snap-x max-w-5xl mx-auto">
 <Link href="/custom" className="snap-start min-w-[280px] w-[280px] h-[180px] relative rounded-3xl overflow-hidden group shadow-sm p-5 flex flex-col justify-between">
 <Image 
 src="/custom-portfolio/wedding.webp" 
 alt="Custom Crochet Orders India" 
 fill 
 loading="lazy" 
 className="object-cover group-hover:scale-105 transition-transform duration-700" 
 sizes="(max-width: 768px) 280px, 280px" 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>
 <div className="absolute inset-0 bg-[#7A1D2E]/20 mix-blend-multiply"></div>
 <div className="relative z-10">
 <span className="text-[10px] font-bold tracking-widest uppercase text-rose-100 bg-black/40 px-2.5 py-1 rounded-full inline-block backdrop-blur-sm border border-white/15">
 Custom Crafts
 </span>
 <h3 className="text-2xl font-serif font-bold text-white mt-2 leading-tight drop-shadow-md">Custom Crochet Orders</h3>
 </div>
 <div className="relative z-10 text-white text-xs font-semibold flex items-center gap-1.5 underline underline-offset-4 decoration-rose-300 group-hover:decoration-white transition-colors drop-shadow-sm">
 Custom Crochet India <ArrowRight size={14} />
 </div>
 </Link>
 <Link href="/categories/flower-pots" className="snap-start min-w-[280px] w-[280px] h-[180px] relative rounded-3xl overflow-hidden group shadow-sm">
 <Image src={flowerPotsImg} alt="Shop Crochet Flower Pots" fill loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 280px, 280px" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
 <div className="absolute bottom-5 left-5 text-white">
 <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5 text-white/90 drop-shadow-sm">MOST LOVED</p>
 <h3 className="text-2xl font-serif font-bold mb-1.5 drop-shadow-md">Flower Pots</h3>
 <span className="text-xs font-medium underline underline-offset-4 decoration-white/50 group-hover:decoration-white transition-colors drop-shadow-sm">Shop Online</span>
 </div>
 </Link>
 <Link href="/categories/toys" className="snap-start min-w-[280px] w-[280px] h-[180px] relative rounded-3xl overflow-hidden group shadow-sm">
 <Image src={plushToysImg} alt="Shop Amigurumi Plush Toys" fill loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 280px, 280px" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
 <div className="absolute bottom-5 left-5 text-white">
 <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5 text-white/90 drop-shadow-sm">CUDDLY FRIENDS</p>
 <h3 className="text-2xl font-serif font-bold mb-1.5 drop-shadow-md">Plush Toys</h3>
 <span className="text-xs font-medium underline underline-offset-4 decoration-white/50 group-hover:decoration-white transition-colors drop-shadow-sm">Shop Online</span>
 </div>
 </Link>
 </div>
 </section>

 </main>
 <Footer />
 </div>
 );
}
