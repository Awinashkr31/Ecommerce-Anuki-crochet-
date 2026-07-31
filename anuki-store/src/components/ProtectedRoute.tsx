"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { profile, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && mounted) {
      if (!profile) {
        router.push(`/auth?redirect=${encodeURIComponent(pathname || "/")}`);
      } else if (adminOnly && profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN") {
        router.push("/");
      }
    }
  }, [profile, isLoading, mounted, router, pathname, adminOnly]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!profile || (adminOnly && profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN")) {
    return null;
  }

  return <>{children}</>;
}
