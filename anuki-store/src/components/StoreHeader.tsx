"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, User, LogOut, Shield, ChevronDown, ShoppingCart, Menu, ArrowLeft, Truck, Sparkles, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { apiGet, apiPost } from "../lib/api";
import useSWR from 'swr';
import { toast } from "react-hot-toast";


const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

export function StoreHeader() {
  const { profile, logout: clearAuthStore } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const { data: categories = [] } = useSWR('/categories', (url: string) => apiGet<any[]>(url));
  const activeCategories = categories.filter((c: any) => c.isActive && !c.parentId);

  const { data: settings } = useSWR('/settings/public', (url: string) => apiGet<Record<string, string>>(url));
  const freeDeliveryThreshold = settings?.['free_delivery_threshold'] ? Number(settings['free_delivery_threshold']) : 499;

  const isLoggedIn = !!profile;
  const isAdmin = isLoggedIn && ADMIN_ROLES.includes(profile.role);
  const totalCartItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If we scroll down past 60px, hide it. If we scroll up, show it.
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    setDropdownOpen(false);
    
    // Fire and forget background tasks
    apiPost("/auth/logout", {}).catch(() => {});
    signOut(auth).catch(() => {});
    
    // Instant UI update
    clearAuthStore();
    router.push("/auth");
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      
      {/* Top Shipping Banner */}
      <div className="bg-[#781f33] text-white py-2 px-4 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest">
        <Truck size={14} className="opacity-90" />
        FREE SHIPPING ON ORDERS OVER ₹{freeDeliveryThreshold}!
        <Sparkles size={14} className="absolute right-4 text-white/30 hidden sm:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* --- MOBILE LAYOUT --- */}
        <div className="flex md:hidden items-center justify-between w-full relative">
          {/* Left: Hamburger or Back */}
          <div className="flex items-center">
            {pathname !== "/" ? (
              <button onClick={() => router.back()} className="p-2 -ml-2 text-neutral-800">
                <ArrowLeft size={24} />
              </button>
            ) : (
              <button className="p-2 -ml-2 text-neutral-800">
                <Menu size={26} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="Anuki Logo" className="h-10 w-auto object-contain" />
            </Link>
          </div>

          {/* Right: Actions (Search, Cart) */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-neutral-800">
              <Search size={22} strokeWidth={2} />
            </button>
            <Link href="/cart" className="relative p-1.5 text-neutral-800">
              <ShoppingBag size={22} strokeWidth={2} />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#781f33] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
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
              <img src="/logo.png" alt="Anuki Logo" className="h-16 w-auto object-contain" />
            </Link>
          </div>

          <nav className="flex items-center gap-8 font-bold text-sm text-neutral-600">
            <div className="group relative py-8">
              <Link href="/products" className="hover:text-rose-600 transition-colors">Shop All</Link>
            </div>
            {activeCategories.slice(0, 4).map((category: any) => (
              <div key={category.id} className="group relative py-8">
                <Link href={`/products?category=${category.slug}`} className="hover:text-rose-600 transition-colors">
                  {category.name}
                </Link>
              </div>
            ))}
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
