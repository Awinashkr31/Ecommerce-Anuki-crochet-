"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ProductCard, Product } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { EpicDeals } from "@/components/EpicDeals";
import useSWR from 'swr';
import { apiGet } from '@/lib/api';

const InstagramEmbed = ({ url }: { url: string }) => {
  useEffect(() => {
    const process = () => {
      if ((window as any).instgrm) {
        try {
          (window as any).instgrm.Embeds.process();
        } catch (e) {}
      }
    };
    if (!(window as any).instgrm) {
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
  }, [url]);

  return (
    <div className="w-full bg-white flex justify-center items-start overflow-hidden rounded-xl">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: '#FFF', border: 0, margin: '0', minWidth: '320px', padding: 0, width: '100%' }}
      />
    </div>
  );
};

interface HomeClientProps {
  featuredProducts: Product[];
  categories: any[];
}

export default function HomeClient({ featuredProducts, categories }: HomeClientProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const fallbackImage1 = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/ab49ce87-7429-4ee1-9f01-db2a8ceb9375.webp";
  const fallbackImage2 = "https://wzhxuzxfoayjzrhufyxw.supabase.co/storage/v1/object/public/product-images/products/bf4cf952-311e-4294-b79f-129258fe612e.webp";

  const heroBanners = [
    {
      id: 1,
      title: "Handmade with Love.",
      subtitle: "Premium crochet bouquets, amigurumi plushies, and bespoke gifts crafted to order.",
      image: featuredProducts[0]?.images?.[0]?.url || fallbackImage1,
      cta1: { text: "Shop the Collection", link: "/products" },
      cta2: { text: "Custom Orders", link: "/products?isMadeToOrder=true" },
    },
    {
      id: 2,
      title: "Vibrant Flower Pots",
      subtitle: "Add a splash of color to your desk with our never-fading cute potted plants.",
      image: featuredProducts[1]?.images?.[0]?.url || fallbackImage2,
      cta1: { text: "Shop Pots", link: "/products?category=flower-pots" },
    },
    {
      id: 3,
      title: "New Arrivals: Plushies",
      subtitle: "Cuddly companions designed to bring a smile to your face.",
      image: featuredProducts[2]?.images?.[0]?.url || fallbackImage1,
      cta1: { text: "View Toys", link: "/products?category=amigurumi" },
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://anukicrochet.in/#website",
        "url": "https://anukicrochet.in/",
        "name": "Anuki Crochet",
        "description": "Handmade Crochet Gifts & Custom Bouquets",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://anukicrochet.in/search?query={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://anukicrochet.in/#organization",
        "name": "Anuki Crochet",
        "url": "https://anukicrochet.in/",
        "logo": "https://anukicrochet.in/logo.png",
        "sameAs": [
          "https://instagram.com/anukicrochet",
          "https://facebook.com/anukicrochet"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-rose-200">
      <main>
        {/* Hero Section Carousel */}
        <section className="relative min-h-[450px] sm:min-h-[500px] md:h-[600px] w-full flex items-center justify-center overflow-hidden bg-neutral-900">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <Image 
                src={heroBanners[activeSlide].image} 
                alt="Banner"
                fill
                priority
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 md:bg-gradient-to-t md:from-black/80 md:via-black/40 md:to-black/10 bg-gradient-to-b from-black/10 via-black/40 to-black/95"></div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop layout container (hidden on mobile) */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 w-full hidden md:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                  {heroBanners[activeSlide].title}
                </h1>
                <p className="text-base md:text-xl text-neutral-200 mb-8 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow">
                  {heroBanners[activeSlide].subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                  {heroBanners[activeSlide].cta1 && (
                    <Link href={heroBanners[activeSlide].cta1.link} className="w-full sm:w-auto bg-rose-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-lg hover:bg-rose-700 transition-all shadow-lg flex items-center justify-center gap-2">
                      {heroBanners[activeSlide].cta1.text} <ArrowRight size={20} />
                    </Link>
                  )}
                  {heroBanners[activeSlide].cta2 && (
                    <Link href={heroBanners[activeSlide].cta2.link} className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-lg hover:bg-white/20 transition-all flex items-center justify-center">
                      {heroBanners[activeSlide].cta2.text}
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile layout container (visible only on mobile) */}
          <div className="absolute bottom-0 left-0 right-0 z-10 w-full px-6 pb-6 md:hidden flex flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full flex flex-col"
              >
                <div className="w-[75%]">
                  {/* Badge */}
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-wide">
                    Handmade Collection
                  </div>
                  
                  {/* Heading */}
                  <h1 className="text-[32px] font-[800] leading-[1.1] text-white w-[80%] text-left mb-3 drop-shadow-lg">
                    {heroBanners[activeSlide].title}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-[15px] font-[500] leading-[1.5] text-white line-clamp-2 text-left mb-[20px] drop-shadow-md">
                    {heroBanners[activeSlide].subtitle}
                  </p>
                </div>

                {/* Primary Button */}
                {heroBanners[activeSlide].cta1 && (
                  <Link href={heroBanners[activeSlide].cta1.link} className="w-full h-[52px] bg-rose-600 text-white rounded-full font-bold text-[16px] flex items-center justify-center gap-2 mb-[12px]">
                    {heroBanners[activeSlide].cta1.text} <ArrowRight size={18} />
                  </Link>
                )}
                
                {/* Secondary Button */}
                {heroBanners[activeSlide].cta2 && (
                  <Link href={heroBanners[activeSlide].cta2.link} className="w-full h-[50px] bg-white/10 backdrop-blur-md border border-white text-white rounded-full font-bold text-[16px] flex items-center justify-center mb-6">
                    {heroBanners[activeSlide].cta2.text}
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>


          </div>

          {/* Dots Indicator Desktop */}
          <div className="absolute bottom-8 left-0 right-0 hidden md:flex justify-center gap-2 z-20">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/80 w-2.5"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Slider Indicators for Mobile (Below Image) */}
        <div className="md:hidden flex justify-center gap-2.5 pt-6 pb-2 bg-white">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${activeSlide === index ? "bg-neutral-800 w-6" : "bg-neutral-300 w-2"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Epic Deals Section */}
        <EpicDeals products={featuredProducts} />

        {/* Shop by Category */}
        <section className="py-12 md:py-24 bg-neutral-50 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
              <p className="text-neutral-500 max-w-xl mx-auto">Explore our wide range of handcrafted items, made for every occasion.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat) => (
                <Link href={`/products?category=${cat.slug}`} key={cat.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-200">
                  <Image src={cat.bannerUrl || fallbackImage1} alt={cat.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banners */}
        <section className="py-8 md:py-16 bg-white overflow-hidden">
          <div className="max-w-[100vw] px-4 md:px-6 xl:px-0 xl:max-w-7xl mx-auto">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 hide-scrollbar -mx-4 px-4 md:-mx-6 md:px-6 xl:mx-0 xl:px-0">
              
              {/* Banner 2 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[200px] md:h-[240px] rounded-3xl overflow-hidden relative flex bg-[#0d9488]">
                <div className="w-7/12 p-6 md:p-10 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-2xl md:text-4xl font-black leading-tight mb-2">FLOWER<br/>POTS</h3>
                  <p className="text-xs md:text-sm font-bold tracking-widest mb-6 uppercase">VIBRANT & CUTE</p>
                  <Link href="/products?category=flower-pots" className="bg-white text-[#0d9488] font-bold px-5 md:px-6 py-2.5 md:py-3 rounded-full self-start hover:bg-neutral-100 transition-colors text-sm md:text-base shadow-sm">
                    Shop Pots
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d9488] via-[#0d9488]/50 to-transparent z-10"></div>
                  <Image src={featuredProducts[1]?.images?.[0]?.url || fallbackImage1} alt="Flower Pots" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

              {/* Banner 3 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[200px] md:h-[240px] rounded-3xl overflow-hidden relative flex bg-[#8b5cf6]">
                <div className="w-7/12 p-6 md:p-10 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-2xl md:text-4xl font-black leading-tight mb-2">PLUSH<br/>TOYS</h3>
                  <p className="text-xs md:text-sm font-bold tracking-widest mb-6 uppercase">CUDDLY FRIENDS</p>
                  <Link href="/products?category=amigurumi" className="bg-white text-[#8b5cf6] font-bold px-5 md:px-6 py-2.5 md:py-3 rounded-full self-start hover:bg-neutral-100 transition-colors text-sm md:text-base shadow-sm">
                    Shop Toys
                  </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] via-[#8b5cf6]/50 to-transparent z-10"></div>
                  <Image src={featuredProducts[2]?.images?.[0]?.url || fallbackImage2} alt="Plush Toys" fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
                </div>
              </div>

              {/* Banner 4 */}
              <div className="snap-center shrink-0 w-[85vw] md:w-[500px] lg:w-[600px] h-[200px] md:h-[240px] rounded-3xl overflow-hidden relative flex bg-[#f59e0b]">
                <div className="w-7/12 p-6 md:p-10 flex flex-col justify-center relative z-10 text-white">
                  <h3 className="text-2xl md:text-4xl font-black leading-tight mb-2">CUSTOM<br/>ORDERS</h3>
                  <p className="text-xs md:text-sm font-bold tracking-widest mb-6 uppercase">YOUR DESIGN</p>
                  <Link href="/products?isMadeToOrder=true" className="bg-white text-[#f59e0b] font-bold px-5 md:px-6 py-2.5 md:py-3 rounded-full self-start hover:bg-neutral-100 transition-colors text-sm md:text-base shadow-sm">
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

        {/* Featured Products (Latest Additions) */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Additions</h2>
                <p className="text-neutral-500">Fresh off the hook and ready for a new home.</p>
              </motion.div>
              <Link href="/products" className="hidden sm:flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center sm:hidden">
              <Link href="/products" className="inline-flex items-center gap-2 text-neutral-900 border border-neutral-200 px-6 py-3 rounded-full font-semibold hover:bg-neutral-50 transition-colors">
                View All Products <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-12 md:py-24 bg-rose-50/50 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Bestsellers</h2>
                <p className="text-neutral-500">The crowd favorites. Handcrafted perfection loved by everyone.</p>
              </div>
              <Link href="/products?sort=bestselling" className="hidden sm:flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice().reverse().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators / Value Props */}
        <section className="py-12 md:py-24 bg-neutral-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🧶</span>
                </div>
                <h3 className="text-xl font-bold mb-3">100% Handmade</h3>
                <p className="text-neutral-400">Every single stitch is crafted by hand with premium, non-toxic yarn.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Bespoke Customization</h3>
                <p className="text-neutral-400">Want a different color? Adding a name? We build exactly what you envision.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Ready to Gift</h3>
                <p className="text-neutral-400">Premium unboxing experience with personalized gift notes included.</p>
              </motion.div>
            </div>
          </div>
        </section>
        {/* Personalized Gifts Section */}
        <section className="py-12 md:py-24 bg-rose-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
                  <Link href="/products?isMadeToOrder=true" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors shadow-lg">
                    Start a Custom Order <ArrowRight size={18} />
                  </Link>
                </motion.div>
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

        {/* Limited Edition */}
        <section className="py-12 md:py-24 bg-white border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Limited Edition Drop</h2>
            <p className="text-neutral-500 mb-10 max-w-xl mx-auto">Exclusive seasonal designs available only while supplies last.</p>
            <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-left gap-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="z-10">
                <span className="bg-rose-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block">Dropping Now</span>
                <h3 className="text-3xl font-bold mb-4">The Autumn Harvest Collection</h3>
                <p className="text-neutral-400 mb-6 max-w-md">Cozy pumpkins, maple leaf coasters, and warm-toned amigurumi perfect for the season.</p>
                <div className="flex gap-4 items-center">
                  <div className="text-center bg-white/10 rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-neutral-400">Hours</div>
                  </div>
                  <div className="text-xl font-bold">:</div>
                  <div className="text-center bg-white/10 rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs text-neutral-400">Mins</div>
                  </div>
                </div>
              </div>
              <div className="z-10 w-full md:w-auto">
                <Link href="/products?collection=autumn" className="block w-full text-center bg-white text-neutral-900 px-8 py-4 rounded-full font-bold hover:bg-neutral-100 transition-colors">
                  Shop the Drop
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Loved by Crafters & Gifters</h2>
              <p className="text-neutral-500">Don't just take our word for it.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100">
                  <div className="flex text-amber-400 mb-4">
                    {"★★★★★"}
                  </div>
                  <p className="text-neutral-700 italic mb-6">"Absolutely stunning work! The custom bouquet I ordered for my mom's birthday arrived in perfect condition and she cried when she saw it."</p>
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
