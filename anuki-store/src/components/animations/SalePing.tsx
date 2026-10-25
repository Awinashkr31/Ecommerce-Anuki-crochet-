"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import { SALE_PINGS_ENABLED, areAnimationsEnabled } from "@/lib/animationConfig";

interface SaleRecord {
  id: string;
  firstName: string;
  city: string;
  productName: string;
  productImage?: string | null;
  timeAgo: string;
}

export default function SalePing() {
  const pathname = usePathname();
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [current, setCurrent] = useState<SaleRecord | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Excluded routes: /cart, /checkout, /blog*
  const isExcludedRoute =
    !pathname ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/blog");

  useEffect(() => {
    // Hard guard: MUST be enabled via config AND not an excluded route
    if (!SALE_PINGS_ENABLED || isExcludedRoute || dismissed) {
      return;
    }

    if (!areAnimationsEnabled()) return;

    // Fetch strictly real orders from DB
    fetch("/api/recent-sales")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SaleRecord[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSales(data);
        }
      })
      .catch(() => setSales([]));
  }, [isExcludedRoute, dismissed]);

  useEffect(() => {
    if (!SALE_PINGS_ENABLED || sales.length === 0 || dismissed) return;

    let index = 0;
    const showNext = () => {
      setCurrent(sales[index % sales.length]);
      setVisible(true);

      // Hide after 5 seconds
      timerRef.current = setTimeout(() => {
        setVisible(false);
        index++;
        // Schedule next after 14 seconds
        timerRef.current = setTimeout(showNext, 14000);
      }, 5000);
    };

    // Initial appearance after 6 seconds
    const initialTimer = setTimeout(showNext, 6000);

    return () => {
      clearTimeout(initialTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sales, dismissed]);

  // If config flag is OFF or route excluded or no data, render NOTHING
  if (!SALE_PINGS_ENABLED || isExcludedRoute || dismissed || !current) {
    return null;
  }

  return (
    <aside
      aria-label="Recent purchase alert"
      className={`fixed bottom-20 left-4 z-40 max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-rose-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Product image or fallback icon */}
        <div className="w-12 h-12 rounded-xl bg-rose-50 overflow-hidden relative shrink-0 border border-rose-100 flex items-center justify-center">
          {current.productImage ? (
            <Image
              src={current.productImage}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <ShoppingBag size={20} className="text-rose-700" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-semibold text-neutral-900 leading-tight truncate">
            {current.firstName} in {current.city}
          </p>
          <p className="text-[11px] text-neutral-500 truncate mt-0.5">
            Purchased {current.productName}
          </p>
          <p className="text-[10px] text-rose-700 font-medium mt-0.5">
            {current.timeAgo} · Verified Buyer
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setVisible(false);
            setDismissed(true);
          }}
          className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full transition-colors self-start"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
