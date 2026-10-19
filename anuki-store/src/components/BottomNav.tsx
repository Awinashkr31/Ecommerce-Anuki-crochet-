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

  const isCustomPage = pathname === "/custom";
  const whatsappUrl = isCustomPage
    ? `https://wa.me/918434897767?text=${encodeURIComponent("Hi! I would like to request a custom crochet design.")}`
    : `https://wa.me/918434897767?text=${encodeURIComponent("Hi! I would like to order on WhatsApp.")}`;
  const whatsappTooltip = isCustomPage ? "Chat on WhatsApp" : "Order on WhatsApp";

  return (
    <>
      {/* Floating WhatsApp FAB - Positioned comfortably above the bottom navigation bar */}
      <div className="fixed z-40 right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-8 md:right-8 pointer-events-auto transition-transform duration-300 hover:scale-105">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label={whatsappTooltip}
          className="relative group flex items-center justify-center"
        >
          {/* Floating Tooltip above the button */}
          <div className="absolute -top-10 right-0 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-[#25D366]/20 pointer-events-none whitespace-nowrap animate-pulse group-hover:animate-none">
            <span className="text-[10px] font-bold text-[#128C7E]">{whatsappTooltip}</span>
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white border-b border-r border-[#25D366]/20 transform rotate-45"></div>
          </div>
          
          <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all relative border-2 border-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-ping"></span>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </div>
        </a>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`md:hidden fixed z-50 left-0 right-0 flex justify-center pointer-events-none transition-all duration-300 ease-in-out ${
        isScrolled 
          ? "bottom-[calc(0.5rem+env(safe-area-inset-bottom))] px-3" 
          : "bottom-0 px-0"
      }`}>
        <nav className={`bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out pointer-events-auto flex items-center justify-center w-full ${
          isScrolled 
            ? "max-w-md border border-neutral-200/90 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-14" 
            : "border-t border-neutral-200/80 rounded-none shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
        }`}>
          <div className="flex items-center justify-around w-full h-14 px-1">
            <Link 
              href="/" 
              className={`flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors ${pathname === "/" ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              <Home size={20} className="mb-0.5 shrink-0" />
              <span className="text-[10px] leading-tight truncate">Home</span>
            </Link>
            <Link 
              href="/products" 
              className={`flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors ${pathname?.startsWith("/products") && !pathname.startsWith("/products/") ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              <ShoppingBag size={20} className="mb-0.5 shrink-0" />
              <span className="text-[10px] leading-tight truncate">Shop</span>
            </Link>
            <Link 
              href="/categories"
              className={`flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors ${pathname === "/categories" ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              <LayoutGrid size={20} className="mb-0.5 shrink-0" />
              <span className="text-[10px] leading-tight truncate">Category</span>
            </Link>
            <Link 
              href="/custom"
              className={`flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors ${pathname === "/custom" ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              <Wand2 size={20} className="mb-0.5 shrink-0" />
              <span className="text-[10px] leading-tight truncate">Custom</span>
            </Link>

            {/* Show Admin link for staff, Account link for others */}
            {isAdmin ? (
              <Link 
                href="/admin" 
                className={`flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors ${pathname?.startsWith("/admin") ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                <Shield size={20} className="mb-0.5 shrink-0" />
                <span className="text-[10px] leading-tight truncate">Admin</span>
              </Link>
            ) : isLoggedIn ? (
              <Link 
                href="/account"
                className={`flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors ${pathname?.startsWith("/account") ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                {profile?.avatarUrl ? (
                  <Image 
                    src={profile.avatarUrl} 
                    alt="Avatar" 
                    width={20}
                    height={20}
                    className={`w-5 h-5 rounded-full object-cover mb-0.5 shrink-0 border ${pathname?.startsWith("/account") ? "border-rose-600" : "border-neutral-200"}`} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-0.5 shrink-0 border ${pathname?.startsWith("/account") ? "border-rose-600 bg-rose-100 text-rose-700" : "border-neutral-200 bg-neutral-100 text-neutral-700"} ${profile?.avatarUrl ? 'hidden' : ''}`}>
                  {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-[10px] leading-tight truncate">Account</span>
              </Link>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className={`flex-1 flex flex-col items-center justify-center h-full min-w-0 transition-colors ${isLoginOpen ? "text-rose-600 font-bold" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                <User size={20} className="mb-0.5 shrink-0" />
                <span className="text-[10px] leading-tight truncate">Log in</span>
              </button>
            )}
          </div>
          <MobileLoginSheet isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </nav>
      </div>
    </>
  );
}
