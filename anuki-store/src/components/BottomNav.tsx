"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MobileLoginSheet } from "./MobileLoginSheet";
import { Home, Search, LayoutGrid, User, Shield, Wand2, ShoppingBag, X, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

const HOME_ROTATING_MESSAGES = ["Help?", "Order on WhatsApp", "Track Order"];

const WHATSAPP_POPUP_OPTIONS = [
  {
    icon: "💬",
    badge: "Quick Help",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200/80",
    iconBg: "bg-rose-50 text-rose-600 border border-rose-200/60",
    title: "Help & Custom Queries",
    subtitle: "Colors, custom sizes & design support",
    text: "Hi Anuki Crochet! I need some help with your handcrafted items.",
    isPopular: false,
  },
  {
    icon: "🛍️",
    badge: "Direct Order",
    badgeClass: "bg-[#25D366] text-white font-bold shadow-2xs",
    iconBg: "bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-xs",
    title: "Order on WhatsApp",
    subtitle: "Share reference photo to place direct order",
    text: "Hi Anuki Crochet! I would like to place an order on WhatsApp.",
    isPopular: true,
  },
  {
    icon: "📦",
    badge: "Live Status",
    badgeClass: "bg-amber-50 text-amber-800 border border-amber-200/80",
    iconBg: "bg-amber-50 text-amber-600 border border-amber-200/60",
    title: "Track My Order",
    subtitle: "Check dispatch updates & courier AWB",
    text: "Hi Anuki Crochet! I would like to track my order status.",
    isPopular: false,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { items } = useCartStore();
  const { profile } = useAuthStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === "/";
  const [homeMsgIndex, setHomeMsgIndex] = useState(0);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;
    const interval = setInterval(() => {
      setHomeMsgIndex((prev) => (prev + 1) % HOME_ROTATING_MESSAGES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [isHomePage]);

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
  const defaultWhatsappUrl = isCustomPage
    ? `https://wa.me/918434897767?text=${encodeURIComponent("Hi! I would like to request a custom crochet design.")}`
    : `https://wa.me/918434897767?text=${encodeURIComponent("Hi! I would like to order on WhatsApp.")}`;
  const whatsappTooltip = isHomePage
    ? HOME_ROTATING_MESSAGES[homeMsgIndex]
    : (isCustomPage ? "Chat on WhatsApp" : "Order on WhatsApp");

  return (
    <>
      {/* WhatsApp Options Popup (Specifically for Homepage) */}
      {isHomePage && isWhatsappModalOpen && (
        <>
          {/* Backdrop with soft blur to close when tapping outside */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200" 
            onClick={() => setIsWhatsappModalOpen(false)}
            aria-hidden="true"
          />

          <div 
            role="dialog"
            aria-label="WhatsApp quick contact options"
            style={{ top: "auto", bottom: "calc(4.75rem + 3.25rem + env(safe-area-inset-bottom, 0px))" }}
            className="fixed z-50 right-3 sm:right-4 w-[calc(100vw-1.5rem)] sm:w-[350px] max-w-[360px] bg-white rounded-[24px] shadow-2xl shadow-neutral-900/25 border border-emerald-100/80 overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header: WhatsApp gradient & Live Online Indicator */}
            <div 
              style={{ background: "linear-gradient(135deg, #075E54 0%, #128C7E 100%)" }}
              className="text-white p-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    {/* Live Online Dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366] border-2 border-[#075E54]"></span>
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white leading-tight truncate">Anuki Crochet</h4>
                      <span className="text-[10px] bg-white/20 text-emerald-100 font-bold px-1.5 py-0.5 rounded-full">Official</span>
                    </div>
                    <p className="text-[11px] text-emerald-100/90 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                      Typically replies in &lt; 1 hour
                    </p>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setIsWhatsappModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="p-3 sm:p-3.5 flex flex-col gap-2 bg-[#f9faf9]">
              {WHATSAPP_POPUP_OPTIONS.map((opt, i) => (
                <a
                  key={i}
                  href={`https://wa.me/918434897767?text=${encodeURIComponent(opt.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsWhatsappModalOpen(false)}
                  style={opt.isPopular ? { background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #ecfdf5 100%)" } : undefined}
                  className={`p-3 rounded-2xl transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.98] ${
                    opt.isPopular
                      ? "border-2 border-emerald-400/90 shadow-xs hover:border-emerald-500 hover:shadow-md"
                      : "bg-white border border-neutral-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      style={opt.isPopular ? { background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" } : undefined}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform ${opt.iconBg}`}
                    >
                      <span>{opt.icon}</span>
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors leading-tight">
                          {opt.title}
                        </p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${opt.badgeClass}`}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-medium leading-tight line-clamp-1">
                        {opt.subtitle}
                      </p>
                    </div>
                  </div>

                  <div 
                    style={opt.isPopular ? { backgroundColor: "#25D366" } : undefined}
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      opt.isPopular
                        ? "text-white group-hover:scale-110 shadow-2xs"
                        : "bg-neutral-100 text-neutral-400 group-hover:bg-[#25D366] group-hover:text-white"
                    }`}
                  >
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>

            {/* Bottom Reassurance Footer */}
            <div className="px-3.5 py-2.5 bg-white border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <span>💬</span> WhatsApp Verified Support
              </span>
              <span className="text-neutral-400 font-medium">
                Pan-India Delivery 🇮🇳
              </span>
            </div>
          </div>
        </>
      )}

      {/* Floating WhatsApp FAB - Positioned comfortably above the bottom navigation bar */}
      <div className="fixed z-40 right-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-8 md:right-8 pointer-events-auto transition-transform duration-300 hover:scale-105">
        <a 
          href={isHomePage ? "#" : defaultWhatsappUrl} 
          target={isHomePage ? undefined : "_blank"} 
          rel={isHomePage ? undefined : "noopener noreferrer"}
          aria-label={whatsappTooltip}
          onClick={(e) => {
            if (isHomePage) {
              e.preventDefault();
              setIsWhatsappModalOpen((prev) => !prev);
            }
          }}
          className="relative group flex items-center justify-center cursor-pointer"
        >
          {/* Floating Tooltip above the button (changes between 3 messages on Homepage) */}
          {!isWhatsappModalOpen && (
            <div className="absolute -top-10 right-0 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-[#25D366]/20 pointer-events-none whitespace-nowrap transition-all duration-300">
              <span className="text-[10px] font-bold text-[#128C7E]">{whatsappTooltip}</span>
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white border-b border-r border-[#25D366]/20 transform rotate-45"></div>
            </div>
          )}
          
          <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all relative border-2 border-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
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
