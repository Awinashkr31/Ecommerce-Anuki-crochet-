"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MobileLoginSheet } from "./MobileLoginSheet";
import { Home, Search, LayoutGrid, User, Shield, Wand2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

export function BottomNav() {
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { items } = useCartStore();
  const { profile } = useAuthStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = !!profile;
  const isAdmin = isLoggedIn && ADMIN_ROLES.includes(profile.role);

  // Don't show bottom nav in admin area, product detail page, cart, or checkout
  // (Product detail, cart, and checkout have their own sticky buy bars on mobile)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout") || pathname === "/cart" || pathname?.startsWith("/products/")) {
    return null;
  }

  return (
    <div className={`md:hidden fixed z-50 left-0 right-0 flex justify-center items-end pointer-events-none transition-all duration-300 ease-in-out ${
      isScrolled ? "bottom-[calc(0.5rem+env(safe-area-inset-bottom))] px-2 gap-2" : "bottom-0 px-0 gap-0"
    }`}>
      
      {/* Navigation Pill/Bar */}
      <nav className={`bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out pointer-events-auto flex items-center justify-center shrink-0 ${
        isScrolled 
          ? "border border-neutral-200 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-max h-14" 
          : "border-t border-neutral-200 rounded-none w-full shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe"
      }`}>
        <div className={`flex items-center w-full h-14 px-1 sm:px-2 gap-0.5 sm:gap-1 transition-all duration-300 ${
          isScrolled ? "justify-center" : "justify-around"
        }`}>
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center w-12 sm:w-14 h-full transition-colors ${pathname === "/" ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <Home size={20} className="mb-1" />
            <span className="text-[9px] font-bold">Home</span>
          </Link>
          <Link 
            href="/products" 
            className={`flex flex-col items-center justify-center w-12 sm:w-14 h-full transition-colors ${pathname?.startsWith("/products") && !pathname.startsWith("/products/") ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <ShoppingBag size={20} className="mb-1" />
            <span className="text-[9px] font-bold">Shop</span>
          </Link>
          <Link 
            href="/categories"
            className={`flex flex-col items-center justify-center w-12 sm:w-14 h-full transition-colors ${pathname === "/categories" ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <LayoutGrid size={20} className="mb-1" />
            <span className="text-[9px] font-bold">Category</span>
          </Link>
          <Link 
            href="/custom"
            className={`flex flex-col items-center justify-center w-12 sm:w-14 h-full transition-colors ${pathname === "/custom" ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <Wand2 size={20} className="mb-1" />
            <span className="text-[9px] font-bold">Custom</span>
          </Link>

          {/* Show Admin link for staff, Account link for others */}
          {isAdmin ? (
            <Link 
              href="/admin" 
              className={`flex flex-col items-center justify-center w-12 sm:w-14 h-full transition-colors ${pathname?.startsWith("/admin") ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              <Shield size={20} className="mb-1" />
              <span className="text-[9px] font-bold">Admin</span>
            </Link>
          ) : isLoggedIn ? (
            <Link 
              href="/account"
              className={`flex flex-col items-center justify-center w-12 sm:w-14 h-full transition-colors ${pathname?.startsWith("/account") ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              {profile?.avatarUrl ? (
                <Image 
                  src={profile.avatarUrl} 
                  alt="Avatar" 
                  width={20}
                  height={20}
                  className={`w-5 h-5 rounded-full object-cover mb-1 border ${pathname?.startsWith("/account") ? "border-rose-600" : "border-neutral-200"}`} 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 border ${pathname?.startsWith("/account") ? "border-rose-600 bg-rose-100 text-rose-700" : "border-neutral-200 bg-neutral-100 text-neutral-700"} ${profile?.avatarUrl ? 'hidden' : ''}`}>
                {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-[9px] font-bold">Account</span>
            </Link>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className={`flex flex-col items-center justify-center w-12 sm:w-14 h-full transition-colors ${isLoginOpen ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              <User size={20} className="mb-1" />
              <span className="text-[9px] font-bold">Log in</span>
            </button>
          )}
        </div>
        <MobileLoginSheet isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </nav>

      {/* Floating WhatsApp Button */}
      <div className={`transition-all duration-300 ease-in-out flex items-center justify-center ${
        isScrolled ? "w-12 opacity-100 scale-100 pointer-events-auto" : "w-0 opacity-0 scale-50 pointer-events-none overflow-hidden"
      }`}>
        <a 
          href="https://wa.me/918434897767?text=Hi! I would like to order on WhatsApp." 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative group shrink-0"
        >
          {/* Floating Tooltip above the button */}
          <div className="absolute -top-12 right-0 sm:-top-12 sm:-right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-[#25D366]/20 animate-pulse group-hover:animate-none w-max">
            <span className="text-[10px] font-bold text-[#128C7E]">Order on WhatsApp</span>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-[#25D366]/20 transform rotate-45"></div>
          </div>
          
          <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform relative border border-white/50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </a>
      </div>
    </div>
  );
}
