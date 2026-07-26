"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, User, LogOut, Shield, ChevronDown, ShoppingCart, Menu, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { apiGet, apiPost } from "../lib/api";
import useSWR from 'swr';

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* Mobile Back Button or Logo */}
        <div className="flex items-center gap-3 relative z-10">
          {pathname !== "/" && (
            <button 
              onClick={() => router.back()}
              className="p-2 md:hidden -ml-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.png" alt="Anuki Logo" className="h-10 md:h-16 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Nav with Mega-menu style triggers */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-neutral-600">
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

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors hidden md:block">
            <Search size={20} className="text-neutral-700" />
          </button>

          {isLoggedIn ? (
            /* Logged-in user dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 hover:bg-neutral-100 rounded-full transition-colors"
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
                <ChevronDown size={14} className={`text-neutral-500 transition-transform hidden md:block ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="font-bold text-sm text-neutral-900 truncate">{profile.fullName}</p>
                    <p className="text-xs text-neutral-500 truncate">{profile.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        <Shield size={10} />
                        {profile.role.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <User size={16} className="text-neutral-400" />
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Shield size={16} className="text-neutral-400" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-neutral-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in — show login link */
            <Link href="/auth" className="flex items-center gap-2 px-3 md:px-4 py-2 bg-neutral-900 text-white rounded-full text-xs md:text-sm font-bold hover:bg-neutral-800 transition-colors">
              <User size={16} className="hidden md:block" />
              Log in
            </Link>
          )}
          <Link 
            href="/cart"
            className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ShoppingCart size={24} />
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
