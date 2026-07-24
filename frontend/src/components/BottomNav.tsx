"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Shield } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "MARKETING", "FINANCE"];

export function BottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { profile } = useAuthStore();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isLoggedIn = !!profile;
  const isAdmin = isLoggedIn && ADMIN_ROLES.includes(profile.role);

  // Don't show bottom nav in admin area
  if (pathname?.startsWith("/admin")) {
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
          href="/checkout" 
          className={`flex flex-col items-center justify-center w-16 h-full transition-colors relative ${pathname === "/checkout" ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
        >
          <div className="relative">
            <ShoppingBag size={24} className="mb-1" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Cart</span>
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
        ) : (
          <Link 
            href={isLoggedIn ? "/account" : "/auth"} 
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${pathname?.startsWith("/account") || pathname?.startsWith("/auth") ? "text-rose-600" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            <User size={24} className="mb-1" />
            <span className="text-[10px] font-bold">{isLoggedIn ? "Account" : "Log in"}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
