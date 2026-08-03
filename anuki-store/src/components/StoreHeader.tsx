"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, User, ShoppingCart, ArrowLeft, Truck, Sparkles, ShoppingBag, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { apiGet } from "../lib/api";
import useSWR from 'swr';
import { InstallPWAButton } from "./InstallPWAButton";

export function StoreHeader() {
  const { profile } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(pathname !== "/");
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileSearchExpanded(pathname !== "/");
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: categories = [] } = useSWR('/categories', (url: string) => apiGet<any[]>(url));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeCategories = categories.filter((c: any) => c.isActive && !c.parentId);

  const { data: settings } = useSWR('/settings/public', (url: string) => apiGet<Record<string, string>>(url));
  const freeDeliveryThreshold = settings?.['free_delivery_threshold'] ? Number(settings['free_delivery_threshold']) : 499;

  const isLoggedIn = !!profile;
  const totalCartItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  useEffect(() => {
    let ticking = false;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down past 60px, hide it. If we scroll up, show it.
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);



  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (pathname === '/checkout') {
    return null;
  }

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${pathname === '/cart' ? 'hidden md:block' : 'block'}`}>
      
      {/* Top Shipping Banner */}
      <div className="bg-[#781f33] text-white py-2 px-4 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest">
        <Truck size={14} className="opacity-90" />
        FREE SHIPPING ON ORDERS OVER ₹{freeDeliveryThreshold}!
        <Sparkles size={14} className="absolute right-4 text-white/30 hidden sm:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        
        {/* --- MOBILE LAYOUT --- */}
        <div className="flex md:hidden items-center justify-between w-full relative h-full">
          <div className="flex w-full items-center gap-2">
            <div className="flex items-center shrink-0">
              {pathname !== "/" ? (
                <button onClick={() => router.back()} className="p-1 -ml-1 mr-2 text-neutral-700 active:scale-95 transition-transform">
                  <ArrowLeft size={24} strokeWidth={1.5} />
                </button>
              ) : (
                <Link href="/" className="flex-shrink-0 mr-2 flex items-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-200 blur-md opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo2.webp" alt="Anuki Logo" className={`relative h-9 w-9 object-contain rounded-xl border-[1.5px] border-rose-100 shadow-sm p-0.5 bg-white transition-transform group-hover:scale-105 ${isMobileSearchExpanded ? '' : 'mr-2.5'}`} />
                  </div>
                  <div className={`flex flex-col -gap-1 transition-all duration-300 overflow-hidden ${isMobileSearchExpanded ? 'w-0 opacity-0' : 'opacity-100'}`}>
                    <span className="font-black text-[#781f33] tracking-tighter text-[17px] leading-none whitespace-nowrap">
                      Anuki<span className="font-medium text-rose-400 tracking-tight ml-1.5">Crochet</span>
                    </span>
                  </div>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-end transition-all duration-300 flex-1 min-w-0">
              {isMobileSearchExpanded ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const query = new FormData(e.currentTarget).get('q')?.toString().trim();
                    if (query) {
                      router.push(`/products?search=${encodeURIComponent(query)}`);
                      setIsMobileSearchExpanded(false);
                    }
                  }}
                  className="flex-1 flex items-center bg-white border-[1.5px] border-[#3b82f6] rounded-full px-2 py-1.5 shadow-sm w-full min-w-0"
                >
                  <Search size={18} className="text-neutral-500 mx-1 shrink-0" strokeWidth={1.5} />
                  <input 
                    ref={mobileInputRef}
                    name="q"
                    type="text" 
                    placeholder="Search..." 
                    className="w-full bg-transparent text-sm focus:outline-none placeholder:text-neutral-500 text-neutral-900 min-w-0"
                  />
                  {pathname === "/" && (
                    <button type="button" onClick={() => setIsMobileSearchExpanded(false)} className="text-neutral-400 p-1 shrink-0 active:scale-95 transition-transform">
                      <X size={16} strokeWidth={2} />
                    </button>
                  )}
                </form>
              ) : (
                <button 
                  onClick={() => {
                    setIsMobileSearchExpanded(true);
                    setTimeout(() => mobileInputRef.current?.focus(), 50);
                  }} 
                  className="p-2 mr-1 text-neutral-700 active:scale-95 transition-transform"
                >
                  <Search size={22} strokeWidth={1.5} />
                </button>
              )}
            </div>

            <InstallPWAButton />

            <Link href="/cart" className="relative p-1 text-neutral-700 shrink-0">
              <ShoppingCart size={24} strokeWidth={1.5} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e11d48] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT --- */}
        <div className="hidden md:flex items-center w-full justify-between">
          
          <div className="flex items-center gap-3 relative z-10">
            <Link href="/" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Anuki Logo" className="h-12 w-auto object-contain" />
            </Link>
          </div>

          <nav className="flex items-center gap-8 font-bold text-sm text-neutral-600">
            <div className="group relative py-8">
              <Link href="/products" className="hover:text-rose-600 transition-colors">Shop All</Link>
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {activeCategories.slice(0, 4).map((category: any) => (
              <div key={category.id} className="group relative py-8">
                <Link href={`/products?category=${category.slug}`} className="hover:text-rose-600 transition-colors">
                  {category.name}
                </Link>
              </div>
            ))}
            <div className="group relative py-8">
              <Link href="/custom" className="hover:text-rose-600 transition-colors whitespace-nowrap text-[#991b1b]">
                Custom Design
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = new FormData(e.currentTarget).get('q')?.toString().trim();
                if (query) {
                  router.push(`/products?search=${encodeURIComponent(query)}`);
                }
              }}
              className="flex items-center bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full px-3 py-1.5 mr-2"
            >
              <Search size={18} className="text-neutral-500 mr-2" />
              <input
                type="text"
                name="q"
                placeholder="Search store..."
                className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all duration-300 text-neutral-800 placeholder:text-neutral-500"
              />
            </form>

            {isLoggedIn ? (
              <Link
                href="/account"
                className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
              >
                {profile.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-neutral-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center border-2 border-rose-200">
                    {getInitials(profile.fullName)}
                  </div>
                )}
              </Link>
            ) : (
              <Link href="/auth" className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors">
                <User size={16} />
                Log in
              </Link>
            )}
            
            <Link 
              href="/cart"
              className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ShoppingBag size={24} />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#781f33] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
