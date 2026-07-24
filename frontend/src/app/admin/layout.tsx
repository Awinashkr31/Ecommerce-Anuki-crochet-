"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from './Sidebar';
import { Menu, X, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "CATALOG_MANAGER",
  "ORDER_FULFILLMENT",
  "CUSTOMER_SUPPORT",
  "MARKETING",
  "FINANCE",
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, isLoading } = useAuthStore();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  const isAuthorized = profile && ADMIN_ROLES.includes(profile.role);

  useEffect(() => {
    // Only redirect after auth has fully resolved (not loading)
    if (isLoading) return;
    
    setHasChecked(true);

    if (!profile) {
      router.replace("/auth");
      return;
    }

    if (!ADMIN_ROLES.includes(profile.role)) {
      toast.error("Access denied. You don't have admin permissions.");
      router.replace("/");
      return;
    }
  }, [profile, isLoading, router]);

  // If we have a cached profile and it's authorized, render immediately
  // Don't wait for isLoading to finish
  if (isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50 text-neutral-900">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-neutral-900 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-40">
          <h1 className="font-bold text-rose-500">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -mr-2">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 w-full md:w-auto">
          {children}
        </main>
      </div>
    );
  }

  // Show minimal loading (only when there's no cached profile yet)
  if (!hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-300" />
      </div>
    );
  }

  // Redirecting...
  return null;
}
