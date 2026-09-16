/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronDown, Play, Check } from "lucide-react";
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
 randomProducts = []
}: {
 featuredProducts: any[];
 latestProducts: any[];
 categories: any[];
 randomProducts?: any[];
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
 desktopImage: "/promo-banner.png",
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
 <Image src={slide.image} alt={slide.title} fill className="object-cover md:hidden" priority={index === 0} sizes="100vw" />
 <Image src={slide.desktopImage || slide.image} alt={slide.title} fill className="object-cover hidden md:block object-center" priority={index === 0} sizes="100vw" />

 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
 <div className="absolute inset-0 p-6 flex flex-col justify-end max-w-xl z-20">
 <div className={`transition-all duration-700 transform ${index === currentHeroSlide ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-4 opacity-0'}`}>
 <div className="bg-rose-600/95 text-white text-[9px] sm:text-[10px] font-bold px-3 py-1.5 rounded-full w-fit mb-4 border border-rose-400 tracking-wider uppercase">
 {slide.badge}
 </div>
 
 <div className="md:hidden">
 <h1 className="text-3xl lg:text-4xl font-serif text-white mb-3 leading-[1.15] drop-shadow-md">
 {slide.title}
 </h1>
 <p className="text-white/90 text-xs lg:text-sm mb-6 font-medium max-w-sm leading-relaxed drop-shadow-sm">
 {slide.description}
 </p>
 </div>
 
 <div className="hidden md:block">
 <h1 className="text-3xl lg:text-4xl font-serif text-white mb-3 leading-[1.15] drop-shadow-md">
 {slide.desktopTitle || slide.title}
 </h1>
 <p className="text-white/90 text-xs lg:text-sm mb-6 font-medium max-w-sm leading-relaxed drop-shadow-sm">
 {slide.desktopDescription || slide.description}
 </p>
 </div>
 
 <div className="flex gap-3 flex-wrap">
 <Link href={slide.link} className="bg-[#a43b46] hover:bg-[#8b2d37] text-white px-6 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-lg">
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
 className={`h-2 rounded-full transition-all duration-300 ${idx === currentHeroSlide ? 'w-6 bg-rose-500' : 'w-2 bg-white/50 hover:bg-white/80'}`}
 aria-label={`Go to slide ${idx + 1}`}
 />
 ))}
 </div>
 </div>
 </section>

  {/* Announcement Card */}
 <section className="px-4 mt-6 mb-2 max-w-4xl mx-auto">
 <Link href="/products" className="group relative w-full rounded-2xl bg-gradient-to-r from-rose-50 to-[#fff0f3] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-center justify-between p-3 px-4 md:p-5 md:px-8 border border-rose-100">
 {/* Sparkles */}
 <div className="absolute top-2 right-1/3 text-yellow-400 animate-pulse text-xs md:text-sm">✨</div>
 <div className="absolute bottom-1 right-1/4 text-yellow-400 animate-pulse delay-150 text-[10px] md:text-xs">✨</div>
 
 <div className="flex items-center gap-3 md:gap-5 z-10">
 {/* Truck Graphic */}
 <div className="relative shrink-0 flex items-center">
 <div className="text-2xl md:text-4xl drop-shadow-md group-hover:scale-110 transition-transform animate-[bounce_3s_infinite]">
 🚚
 </div>
 {/* Speed lines */}
 <div className="absolute top-1/2 -left-3 md:-left-4 w-4 md:w-6 h-[2px] bg-rose-300 rounded-full animate-[pulse_1s_infinite]"></div>
 <div className="absolute top-[60%] -left-5 md:-left-6 w-5 md:w-7 h-[2px] bg-rose-300 rounded-full animate-[pulse_1s_infinite] delay-100"></div>
 </div>

 {/* Content */}
 <div className="flex flex-col justify-center">
 <div className="flex items-center gap-2 md:gap-3">
 <span className="text-[#e11d48] font-bold text-[8px] md:text-[10px] tracking-wider uppercase bg-white px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-rose-100 hidden sm:block">
 Special Offer
 </span>
 <h3 className="font-serif text-base md:text-2xl font-black text-[#1a1a1a] tracking-tight leading-none">
 Free Shipping
 </h3>
 </div>
 <p className="text-[#4a4a4a] text-[11px] md:text-sm font-medium leading-tight mt-0.5 md:mt-1">
 on orders over <span className="text-[#e11d48] font-bold text-[13px] md:text-base ">₹{freeDeliveryThreshold}</span>
 </p>
 </div>
 </div>

 {/* Button */}
 <div className="z-10 shrink-0 ml-2">
 <div className="bg-gradient-to-r from-[#fc4a71] to-[#ff2a5f] text-white font-bold text-[11px] md:text-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-sm flex items-center gap-1.5 md:gap-2 group-hover:shadow-md transition-shadow">
 Shop Now <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform md:w-5 md:h-5" />
 </div>
 </div>
 </Link>
 </section>

 {/* Explore Categories */}
 <section className="py-6 px-4 bg-white">
 <div className="flex justify-between items-center mb-5">
 <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
 Explore Categories
 </h2>
 <Link href="/products" className="text-xs font-bold text-[#a43b46] hover:underline">View all</Link>
 </div>
 <div className="flex gap-4 md:gap-8 overflow-x-auto hide-scrollbar snap-x px-4 -mx-4 pb-4 md:[justify-content:safe_center]">
 {[...categories].sort((a, b) => a.slug === 'flower-pots' ? 1 : b.slug === 'flower-pots' ? -1 : 0).map((cat) => (
 <Link href={`/products?category=${cat.slug}`} key={cat.id} className="snap-start flex flex-col items-center gap-2 md:gap-3 min-w-[72px] md:min-w-[144px] group">
 <div className="w-16 h-16 md:w-36 md:h-36 shrink-0 rounded-full overflow-hidden relative border border-[#f0e8e6] shadow-sm group-hover:shadow-md transition-shadow">
 <Image src={cat.bannerUrl || cat.products?.[0]?.images?.[0]?.url || fallbackImage1} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 64px, 144px" />
 </div>
 <span className="text-[11px] font-bold text-neutral-700 text-center group-hover:text-[#a43b46] transition-colors">{cat.name}</span>
 </Link>
 ))}
 <Link href="/products" className="snap-start flex flex-col items-center gap-2 md:gap-3 min-w-[72px] md:min-w-[144px] group">
   <div className="w-16 h-16 md:w-36 md:h-36 shrink-0 rounded-full relative border border-rose-200 shadow-sm group-hover:shadow-md transition-all bg-rose-50 flex items-center justify-center text-[#a43b46]">
     <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform md:w-12 md:h-12" />
   </div>
   <span className="text-[11px] font-bold text-neutral-700 text-center group-hover:text-[#a43b46] transition-colors">All</span>
 </Link>
 </div>
 </section>


  {/* Trending Now */}
  <section className="py-6 px-4 bg-white border-t border-[#f0e8e6]">
  <div className="flex justify-between items-center mb-5">
  <h2 className="text-lg font-serif font-bold text-neutral-900 flex items-center gap-2">
  Trending Now
  </h2>
  <Link href="/products?sort=trending" className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hover:text-[#a43b46] transition-colors">View All</Link>
  </div>
  <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-4 snap-x">
  {randomProducts.slice(0, 12).map((product) => (
  <div key={product.id} className="snap-start min-w-[150px] w-[150px] ">
  <ProductCard product={product} />
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
 {expandProductsByColor(featuredProducts).slice(0,8).map(product => <ProductCard key={product.id} product={product} />)}
 </div>
 </section>

 {/* Latest Arrivals */}
 <section className="py-6 px-4 bg-white border-t border-[#f0e8e6]">
 <div className="flex justify-between items-end mb-6">
 <div>
 <p className="text-[10px] font-bold tracking-widest text-[#8c3a44] uppercase mb-1 flex items-center gap-0.5">
 <ChevronLeft size={12} strokeWidth={3} /> FRESH OFF THE HOOK
 </p>
 <h2 className="text-3xl font-serif font-bold text-neutral-900 leading-none tracking-tight">Latest Arrivals</h2>
 </div>
 <Link href="/products?sort=newest" className="border border-[#f0e8e6] rounded-full px-4 py-1.5 text-xs font-bold text-[#8c3a44] flex items-center gap-1 hover:bg-rose-50 transition-colors mb-1">
 Shop All <ArrowRight size={12} />
 </Link>
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
 {expandProductsByColor(latestProducts).slice(0,8).map(product => <ProductCard key={product.id} product={product} />)}
 </div>
 </section>

 {/* BEHIND THE HOOK & YARN */}
 <section className="py-8 px-4 bg-white">
 <Link href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="bg-[#2c2829] rounded-[2rem] p-5 flex items-center gap-4 relative overflow-hidden shadow-lg group block">
 <div className="w-14 h-14 bg-[#a43b46] rounded-full flex items-center justify-center shrink-0 z-10 shadow-md group-hover:scale-110 transition-transform">
 <Play fill="white" className="w-6 h-6 ml-1 text-white" />
 </div>
 <div className="z-10 text-white flex-1">
 <p className="text-[9px] font-bold tracking-widest text-neutral-400 mb-1 uppercase">BEHIND THE HOOK & YARN</p>
 <h3 className="text-sm font-bold mb-1 leading-tight text-[#fcfaf9]">How We Craft Anuki Plushies</h3>
 <p className="text-[10px] text-neutral-400 font-medium">Tap to watch the handmade process</p>
 </div>
 <div className="absolute right-0 top-0 bottom-0 w-32 z-0 opacity-20 pointer-events-none flex items-center justify-end pr-4">
 <div className="w-24 h-24 border-4 border-white rounded-full translate-x-8"></div>
 </div>
 </Link>
 </section>



 {/* CO-CREATE WITH US */}
 <section className="py-10 px-4 bg-[#fcf8f7]">
 <div className="max-w-4xl mx-auto bg-white border border-[#f0e8e6] rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
 
  {/* Text Content */}
  <div className="flex flex-col">
  <p className="text-[10px] font-bold tracking-widest text-[#a43b46] mb-3 uppercase">CO-CREATE WITH US</p>
  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3d2b2c] mb-3 leading-[1.15]">Make Your Handmade Gift Yours.</h2>
  <p className="text-[13px] md:text-sm text-neutral-600 leading-relaxed max-w-sm">
  Anuki isn&apos;t just a store; it&apos;s a celebration of artistry. Every product is lovingly handmade by artisans who pour their heart and soul into their craft, ensuring you get something truly unique.
  </p>
  </div>
 
  {/* Image (Middle on mobile, Right side on desktop) */}
  <div className="w-full relative h-[180px] md:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-inner md:col-start-2 md:row-span-2 md:row-start-1">
  <Image src="/crochet-flower-bouquet.png" alt="Custom Handmade Crochet Gift Bouquet" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
  </div>

  {/* Features & CTA */}
  <div className="flex flex-col w-full md:col-start-1 md:row-start-2">
  <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5 md:mb-6">
  <div className="bg-[#fcf8f7] border border-[#f0e8e6] rounded-xl p-2 md:p-3 flex flex-col items-center justify-center text-center shadow-sm">
  <span className="text-[#a43b46] mb-1.5 text-lg md:text-xl">🎨</span>
  <span className="text-[9px] md:text-[10px] font-bold text-[#3d2b2c] leading-tight">Custom Colors</span>
  </div>
  <div className="bg-[#fcf8f7] border border-[#f0e8e6] rounded-xl p-2 md:p-3 flex flex-col items-center justify-center text-center shadow-sm">
  <span className="text-[#a43b46] mb-1.5 text-lg md:text-xl">✨</span>
  <span className="text-[9px] md:text-[10px] font-bold text-[#3d2b2c] leading-tight">Add Initials</span>
  </div>
  <div className="bg-[#fcf8f7] border border-[#f0e8e6] rounded-xl p-2 md:p-3 flex flex-col items-center justify-center text-center shadow-sm">
  <span className="text-[#a43b46] mb-1.5 text-lg md:text-xl">🧵</span>
  <span className="text-[9px] md:text-[10px] font-bold text-[#3d2b2c] leading-tight">Handcrafted for You</span>
  </div>
  </div>
  <Link href="/custom" className="w-full bg-[#8c3a44] text-white py-3.5 md:py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#722e36] transition-colors shadow-lg active:scale-95">
  <span className="text-lg">✨</span> Design Custom Bouquet
  </Link>
  </div>
 </div>
 </section>

 {/* Why Shop Anuki Crochet? */}
 <section className="py-10 px-4 bg-white max-w-4xl mx-auto">
 <h2 className="text-[10px] font-bold tracking-widest text-neutral-400 text-center uppercase mb-2">Anuki Guarantee</h2>
 <h3 className="text-2xl font-serif font-bold text-center mb-8 text-neutral-900">Why Shop Anuki Crochet?</h3>
 <div className="space-y-4">
 <div className="bg-[#fdfaf9] rounded-[1.5rem] p-5 flex gap-4 items-start border border-[#f0e8e6] shadow-sm">
 <div className="w-12 h-12 bg-rose-100/80 rounded-full flex items-center justify-center shrink-0">
 <span className="text-rose-600 text-xl">🧶</span>
 </div>
 <div className="pt-1">
 <h4 className="font-bold text-[15px] text-[#3d2b2c] mb-1.5">100% Handcrafted</h4>
 <p className="text-[13px] text-neutral-600 leading-relaxed">Every single stitch is crafted by hand in India with the finest non-toxic yarn, zero factory mass production.</p>
 </div>
 </div>
 <div className="bg-[#fdfaf9] rounded-[1.5rem] p-5 flex gap-4 items-start border border-[#f0e8e6] shadow-sm">
 <div className="w-12 h-12 bg-rose-100/80 rounded-full flex items-center justify-center shrink-0">
 <span className="text-rose-600 text-xl">✨</span>
 </div>
 <div className="pt-1">
 <h4 className="font-bold text-[15px] text-[#3d2b2c] mb-1.5">Bespoke Customization</h4>
 <p className="text-[13px] text-neutral-600 leading-relaxed">Want a different color combination or special attachment? We bring your exact vision to life.</p>
 </div>
 </div>
 <div className="bg-[#fdfaf9] rounded-[1.5rem] p-5 flex gap-4 items-start border border-[#f0e8e6] shadow-sm">
 <div className="w-12 h-12 bg-rose-100/80 rounded-full flex items-center justify-center shrink-0">
 <span className="text-rose-600 text-xl">🎁</span>
 </div>
 <div className="pt-1">
 <h4 className="font-bold text-[15px] text-[#3d2b2c] mb-1.5">Ready-to-Gift Packaging</h4>
 <p className="text-[13px] text-neutral-600 leading-relaxed">Premium gift boxes with custom handwritten letters to make every handmade gift truly special.</p>
 </div>
 </div>
 </div>
 </section>

 {/* Shop By Occasion */}
 <section className="py-10 px-4 bg-white border-t border-[#f0e8e6] max-w-4xl mx-auto">
 <h2 className="text-[10px] font-bold tracking-widest text-[#a43b46] uppercase mb-2 text-center">Find Perfect Gifts</h2>
 <h3 className="text-2xl font-serif font-bold mb-8 text-neutral-900 text-center">Shop By Occasion</h3>
 <div className="grid grid-cols-2 gap-4">
 <Link href="/gifts/birthday" className="border border-[#f0e8e6] rounded-[1.25rem] p-3 flex gap-3 items-center hover:bg-rose-50 transition-colors shadow-sm group bg-[#fdfaf9]">
 <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative group-hover:scale-110 transition-transform shadow-sm">
 <Image src={getCategoryImage(['toys'], 0) || plushToysImg} alt="Birthday Gifts" fill className="object-cover" />
 </div>
 <div>
 <div className="font-bold text-[13px] text-[#3d2b2c] mb-0.5 leading-tight">Birthday</div>
 <div className="text-[10px] text-neutral-500 font-medium leading-tight">Perfect plushies</div>
 </div>
 </Link>
 <Link href="/gifts/anniversary" className="border border-[#f0e8e6] rounded-[1.25rem] p-3 flex gap-3 items-center hover:bg-rose-50 transition-colors shadow-sm group bg-[#fdfaf9]">
 <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative group-hover:scale-110 transition-transform shadow-sm">
 <Image src={getCategoryImage(['flower-pots'], 1) || flowerPotsImg} alt="Anniversary Gifts" fill className="object-cover" />
 </div>
 <div>
 <div className="font-bold text-[13px] text-[#3d2b2c] mb-0.5 leading-tight">Anniversary</div>
 <div className="text-[10px] text-neutral-500 font-medium leading-tight">Handmade bouquets</div>
 </div>
 </Link>
 <Link href="/gifts/valentines-day" className="border border-[#f0e8e6] rounded-[1.25rem] p-3 flex gap-3 items-center hover:bg-rose-50 transition-colors shadow-sm group bg-[#fdfaf9]">
 <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative group-hover:scale-110 transition-transform shadow-sm">
 <Image src={getCategoryImage(['keychains', 'hair-accessories'], 2) || fallbackImage1} alt="Valentine's Gifts" fill className="object-cover" />
 </div>
 <div>
 <div className="font-bold text-[13px] text-[#3d2b2c] mb-0.5 leading-tight">Valentine's</div>
 <div className="text-[10px] text-neutral-500 font-medium leading-tight">Forever roses</div>
 </div>
 </Link>
 <Link href="/gifts/baby-shower" className="border border-[#f0e8e6] rounded-[1.25rem] p-3 flex gap-3 items-center hover:bg-rose-50 transition-colors shadow-sm group bg-[#fdfaf9]">
 <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative group-hover:scale-110 transition-transform shadow-sm">
 <Image src={getCategoryImage(['toys'], 3) || fallbackImage2} alt="Baby Shower Gifts" fill className="object-cover" />
 </div>
 <div>
 <div className="font-bold text-[13px] text-[#3d2b2c] mb-0.5 leading-tight">Baby Shower</div>
 <div className="text-[10px] text-neutral-500 font-medium leading-tight">Baby-safe toys</div>
 </div>
 </Link>
 </div>
 </section>

 {/* Loved Across India */}
 <section className="py-10 bg-[#fdfaf9] border-y border-[#f0e8e6]">
 <div className="px-4 mb-6 flex justify-between items-end max-w-7xl mx-auto">
 <div>
 <h2 className="text-[10px] font-bold tracking-widest text-[#a43b46] uppercase mb-1.5">Real Reviews</h2>
 <h3 className="text-2xl font-serif font-bold text-neutral-900">Loved Across India</h3>
 </div>
 <div className="text-[#a43b46] font-bold text-sm flex items-center gap-1 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
 4.9/5 <span className="text-sm">⭐</span>
 </div>
 </div>
 <div className="flex overflow-x-auto hide-scrollbar gap-4 px-4 pb-4 snap-x max-w-7xl mx-auto">
 {[
 { name: "Priya Sharma", init: "P", text: "The custom bouquet I ordered for my mom's 50th birthday arrived in perfect packaging. She literally teared up seeing the forever crochet sunflowers! 🌻" },
 { name: "Ananya", init: "A", text: "The amigurumi toy I ordered was incredibly detailed. You can see the love put into it!" },
 { name: "Rohan M.", init: "R", text: "Ordered a sunflower pot for my desk. Craftsmanship is flawless and delivery was right on time. Brings so much joy to my workspace." },
 { name: "Sneha K.", init: "S", text: "I gifted a crochet rose bouquet to my wife for our anniversary. She absolutely loved it! Better than real flowers since these last forever." }
 ].map((r, i) => (
 <div key={i} className="snap-center min-w-[280px] w-[280px] bg-white rounded-3xl p-6 border border-[#f0e8e6] shadow-sm flex flex-col justify-between">
 <div>
 <div className="text-rose-500 text-sm mb-4 tracking-widest">★★★★★</div>
 <p className="text-[13px] text-neutral-700 italic leading-relaxed mb-6 font-medium">"{r.text}"</p>
 </div>
 <div className="flex gap-3 items-center pt-4 border-t border-neutral-100">
 <div className="w-10 h-10 bg-[#8c3a44] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner">{r.init}</div>
 <div>
 <div className="font-bold text-[13px] text-neutral-900 mb-0.5">{r.name}</div>
 <div className="text-[10px] text-neutral-500 flex items-center gap-1 font-medium"><Check size={12} className="text-green-500" /> Verified Buyer, India</div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* FAQ */}
 <section className="py-10 px-4 bg-white max-w-3xl mx-auto">
 <h2 className="text-[10px] font-bold tracking-widest text-neutral-400 text-center uppercase mb-2">Got Questions?</h2>
 <h3 className="text-2xl font-serif font-bold text-center mb-8 text-neutral-900">Frequently Asked Questions</h3>
 <div className="space-y-3">
 {[
 { q: "What is a crochet bouquet?", a: "A crochet bouquet is a handcrafted arrangement of yarn flowers. Unlike real flowers, a crochet bouquet is a handmade gift that lasts forever, making it perfect for gifting." },
 { q: "How long does a crochet bouquet last?", a: "Our handmade crochet flower bouquets are crafted from premium yarn and never wilt. They are beautiful forever flowers that last a lifetime." },
 { q: "Are crochet plushies washable?", a: "Yes, we recommend gentle spot cleaning or hand washing in cold water with a mild detergent. Lay flat to dry to keep your handmade stuffed toys looking perfect." },
 { q: "Does Anuki Crochet deliver across India?", a: "Yes, we deliver our affordable handmade gifts securely packaged across all of India." }
 ].map((faq, i) => (
 <div key={i} className="bg-[#fcf8f7] border border-[#f0e8e6] rounded-2xl overflow-hidden shadow-sm">
 <button 
 onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
 className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
 >
 <span className="font-bold text-[13px] text-[#3d2b2c]">{faq.q}</span>
 <ChevronDown size={18} className={`text-neutral-400 transition-transform duration-300 shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
 </button>
 {openFaqIndex === i && (
 <div className="px-5 pb-5 text-[13px] text-neutral-600 leading-relaxed animate-fade-in border-t border-[#f0e8e6]/50 pt-3">
 {faq.a}
 </div>
 )}
 </div>
 ))}
 </div>
 </section>





 {/* Two Large Category Cards */}
 <section className="px-4 pb-8 bg-white border-t border-[#f0e8e6] pt-8">
 <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 snap-x max-w-4xl mx-auto">
 <Link href="/products?category=flower-pots" className="snap-start min-w-[280px] w-[280px] h-[180px] relative rounded-3xl overflow-hidden group shadow-sm">
 <Image src={flowerPotsImg} alt="Shop Crochet Flower Pots" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
 <div className="absolute bottom-5 left-5 text-white">
 <p className="text-[9px] font-bold tracking-widest uppercase mb-1.5 text-white/90">MOST LOVED</p>
 <h3 className="text-2xl font-serif font-bold mb-1.5">Flower Pots</h3>
 <span className="text-xs font-medium underline underline-offset-4 decoration-white/50 group-hover:decoration-white transition-colors">Shop Online</span>
 </div>
 </Link>
 <Link href="/products?category=toys" className="snap-start min-w-[280px] w-[280px] h-[180px] relative rounded-3xl overflow-hidden group shadow-sm">
 <Image src={plushToysImg} alt="Shop Amigurumi Plush Toys" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
 <div className="absolute bottom-5 left-5 text-white">
 <p className="text-[9px] font-bold tracking-widest uppercase mb-1.5 text-white/90">CUDDLY FRIENDS</p>
 <h3 className="text-2xl font-serif font-bold mb-1.5">Plush Toys</h3>
 <span className="text-xs font-medium underline underline-offset-4 decoration-white/50 group-hover:decoration-white transition-colors">Shop Online</span>
 </div>
 </Link>
 </div>
 </section>

 </main>
 <Footer />
 </div>
 );
}
