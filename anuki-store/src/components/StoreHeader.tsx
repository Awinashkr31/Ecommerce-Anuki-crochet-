"use client";

import Link from "next/link";
import Image from "next/image";
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] });
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { InstallPWAButton } from "./InstallPWAButton";
import { useAuthStore } from "../store/authStore";

export function StoreHeader() {
  const { profile } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileSearchExpanded(false);
  }



  const totalCartItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  useEffect(() => {
    let ticking = false;
    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
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

  if (pathname === '/checkout' || pathname === '/cart') return null;

  return (
    <>
      <header className={`fixed top-0 w-full z-50 pt-safe bg-white backdrop-blur-xl shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto w-full h-16 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 border-[1.5px] border-[#FCE4E8] rounded-[12px] flex items-center justify-center bg-[#FFF9FA] overflow-hidden p-1 shadow-sm shrink-0">
              <Image alt="Logo" width={640} height={640} className="w-full h-full object-contain" src="/logo2.webp" />
            </div>
            <div className="flex flex-col items-center sm:items-start justify-center leading-none mt-0.5">
              <div className="flex items-center gap-1.5 tracking-tight relative z-10">
                <span className={`${dancingScript.className} text-[#7A1D2E] text-[22px] md:text-[24px] drop-shadow-sm relative`}>
                  Anuki
                  <svg className="absolute -top-0.5 -right-2.5 w-[10px] h-[10px] text-[#ff8fa3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </span>
                <span className="text-[#FF6B8B] font-bold text-[18px] md:text-[20px] tracking-tight ml-2">Crochet</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#7A1D2E] opacity-90 -mt-0.5 relative z-0">
                <span className="w-5 sm:w-8 h-[1px] bg-[#7A1D2E]/40"></span>
                <span className="text-[6.5px] md:text-[7.5px] tracking-[0.2em] uppercase font-bold flex items-center gap-1">
                  HANDMADE <svg className="w-2 h-2 text-[#ff4d6d]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> WITH LOVE
                </span>
                <span className="w-5 sm:w-8 h-[1px] bg-[#7A1D2E]/40"></span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)} 
              aria-label="Search boutique" 
              className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
            
            <InstallPWAButton />

            <Link href="/cart" aria-label="Shopping Cart" className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-black relative transition-colors">
              <ShoppingCart size={22} strokeWidth={1.5} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E71644] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm border border-white">{totalCartItems}</span>
              )}
            </Link>

            <Link href="/account" aria-label="User Profile" className="hidden sm:flex w-8 h-8 items-center justify-center text-neutral-700 hover:text-black transition-colors">
              {profile?.avatarUrl ? (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-neutral-200 shadow-sm relative shrink-0">
                  <Image src={profile.avatarUrl} alt={profile.fullName || "User"} fill sizes="28px" className="object-cover" />
                </div>
              ) : (
                <User size={22} strokeWidth={1.5} />
              )}
            </Link>
          </div>
        </div>
        {isMobileSearchExpanded && (
          <div className="px-4 pb-3 animate-fade-in">
             <form onSubmit={(e) => {
               e.preventDefault();
               const query = new FormData(e.currentTarget).get('q')?.toString().trim();
               if (query) router.push(`/products?search=${encodeURIComponent(query)}`);
             }} className="flex items-center w-full bg-neutral-100 rounded-full shadow-sm overflow-hidden px-3">
               <Search size={18} className="text-neutral-500 shrink-0" />
               <input type="text" name="q" placeholder="Search bouquets, keychains, plushies..." className="flex-1 h-10 bg-transparent px-2 focus:outline-none text-sm text-neutral-900 placeholder:text-neutral-400" autoFocus />
             </form>
          </div>
        )}
      </header>
      <div className={`w-full transition-all duration-300 ${isMobileSearchExpanded ? 'h-[116px]' : 'h-[64px]'}`} aria-hidden="true" />
    </>
  );
}
