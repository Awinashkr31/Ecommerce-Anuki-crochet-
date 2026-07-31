"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileLoginSheet } from "./MobileLoginSheet";
import { Home, Search, LayoutGrid, User, Shield } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

export function BottomNav() {
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { items } = useCartStore();
  const { profile } = useAuthStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isLoggedIn = !!profile;
  const isAdmin = isLoggedIn && ADMIN_ROLES.includes(profile.role);

  // Don't show bottom nav in admin area, product detail page, cart, or checkout
  // (Product detail, cart, and checkout have their own sticky buy bars on mobile)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout") || pathname === "/cart" || pathname?.match(/^\/products\/[^/]+$/)) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-4">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${pathname === "/" ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
        >
          <Home size={24} className="mb-1" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link 
          href="/products" 
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${pathname?.startsWith("/products") ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
        >
          <Search size={24} className="mb-1" />
          <span className="text-[10px] font-bold">Shop</span>
        </Link>
        <Link 
          href="/categories"
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${pathname === "/categories" ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
        >
          <LayoutGrid size={24} className="mb-1" />
          <span className="text-[10px] font-bold">Category</span>
        </Link>

        {/* Show Admin link for staff, Account link for others */}
        {isAdmin ? (
          <Link 
            href="/admin" 
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${pathname?.startsWith("/admin") ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <Shield size={24} className="mb-1" />
            <span className="text-[10px] font-bold">Admin</span>
          </Link>
        ) : isLoggedIn ? (
          <Link 
            href="/account"
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${pathname?.startsWith("/account") ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className={`w-6 h-6 rounded-full object-cover mb-1 border ${pathname?.startsWith("/account") ? "border-rose-600" : "border-neutral-200"}`} />
            ) : (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 border ${pathname?.startsWith("/account") ? "border-rose-600 bg-rose-100 text-rose-700" : "border-neutral-200 bg-neutral-100 text-neutral-700"}`}>
                {profile?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-[10px] font-bold">Account</span>
          </Link>
        ) : (
          <button 
            onClick={() => setIsLoginOpen(true)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isLoginOpen ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <User size={24} className="mb-1" />
            <span className="text-[10px] font-bold">Log in</span>
          </button>
        )}
      </div>

      <MobileLoginSheet isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
}
