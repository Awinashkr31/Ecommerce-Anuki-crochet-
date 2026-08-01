"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from './Sidebar';
import { Menu, X, Loader2 } from "lucide-react";
import { SWRConfig } from "swr";
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
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -mr-2">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Top Bar */}
          <div className="hidden md:flex h-16 border-b border-neutral-200 bg-white items-center justify-end px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-bold">{profile.fullName}</p>
                  <p className="text-xs text-neutral-500 capitalize">{profile.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <main className="flex-1 p-4 md:p-8">
            <SWRConfig value={{ keepPreviousData: true, dedupingInterval: 10000 }}>
              {children}
            </SWRConfig>
          </main>
        </div>
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
