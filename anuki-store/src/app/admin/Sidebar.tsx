"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { apiPost, apiGet } from "../../lib/api";
import { preload } from "swr";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, RotateCcw, Ticket,
  FileText, BarChart3, Warehouse, ScrollText, Settings, Truck, Star, Palette, LogOut, Search
} from "lucide-react";

const fetcher = (url: string) => apiGet<any>(url);

const routeToApiMap: Record<string, string> = {
  "/admin": "/analytics",
  "/admin/products": "/products",
  "/admin/categories": "/categories",
  "/admin/orders": "/orders?page=1&limit=20",
  "/admin/inventory": "/inventory",
  "/admin/coupons": "/coupons",
  "/admin/returns": "/returns",
  "/admin/settings": "/settings",
  "/admin/audit-logs": "/audit-logs",
  "/admin/blog": "/posts",
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: "all" },
  { href: "/admin/products", label: "Products", icon: Package, roles: ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "OPERATIONS"] },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, roles: ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"] },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, roles: ["SUPER_ADMIN", "ADMIN", "OPERATIONS", "ORDER_FULFILLMENT", "CUSTOMER_SUPPORT", "FINANCE"] },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse, roles: ["SUPER_ADMIN", "ADMIN", "OPERATIONS", "CATALOG_MANAGER"] },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket, roles: ["SUPER_ADMIN", "ADMIN", "MARKETING"] },
  { href: "/admin/returns", label: "Returns", icon: RotateCcw, roles: ["SUPER_ADMIN", "ADMIN", "CUSTOMER_SUPPORT", "OPERATIONS"] },
  { href: "/admin/shipping", label: "Shipping", icon: Truck, roles: ["SUPER_ADMIN", "ADMIN", "OPERATIONS", "ORDER_FULFILLMENT"] },
  { href: "/admin/reviews", label: "Reviews", icon: Star, roles: ["SUPER_ADMIN", "ADMIN", "MARKETING"] },
  { href: "/admin/blog", label: "Blog", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "MARKETING"] },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN", "FINANCE"] },
  { href: "/admin/seo", label: "SEO Health", icon: Search, roles: ["SUPER_ADMIN", "ADMIN", "MARKETING"] },
  { href: "/admin/cms", label: "CMS", icon: Palette, roles: ["SUPER_ADMIN", "ADMIN", "MARKETING"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN"] },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText, roles: ["SUPER_ADMIN"] },
];

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout: clearAuthStore } = useAuthStore();

  const activeRole = profile?.role || "CUSTOMER";

  // Wake up serverless backend to avoid cold starts when navigating
  useEffect(() => {
    apiGet('/health').catch(() => {});
  }, []);

  const handleLogout = () => {
    // Fire and forget
    apiPost("/auth/logout", {}).catch(() => {});
    signOut(auth).catch(() => {});
    
    // Instant UI update
    clearAuthStore();
    router.push("/auth");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href) || false;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Header */}
        <div className="p-6 pb-2">
          <h2 className="text-xl font-bold text-rose-500 hidden md:block">Admin Panel</h2>
          <div className="mt-4 mb-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Logged in as: <span className="text-emerald-400">{activeRole}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {navItems
            .filter(item => item.roles === "all" || (item.roles as string[]).includes(activeRole))
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => {
                    if (routeToApiMap[item.href]) {
                      preload(routeToApiMap[item.href], fetcher);
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-white/10 text-white font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} className={active ? "text-rose-400" : ""} />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-rose-400 hover:bg-white/5 transition-all w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
