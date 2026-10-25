"use client";

import { useEffect, useState, useRef } from "react";
import { useAnimationState } from "@/hooks/useAnimationState";

interface TargetPoint {
  x: number;
  y: number;
  label: string;
}

export default function CursorTour() {
  const canAnimate = useAnimationState();
  const [isActive, setIsActive] = useState(false);
  const [pos, setPos] = useState<TargetPoint | null>(null);
  const [opacity, setOpacity] = useState(0);
  const tourStepRef = useRef(0);

  useEffect(() => {
    if (!canAnimate) return;
    if (typeof window === "undefined") return;

    // Desktop pointer check only
    const isDesktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktopPointer) return;

    // SessionStorage check
    const hasSeenTour = sessionStorage.getItem("anuki_custom_tour_seen");
    if (hasSeenTour) return;

    const dismissTour = () => {
      setIsActive(false);
      sessionStorage.setItem("anuki_custom_tour_seen", "true");
      cleanupEvents();
    };

    const cleanupEvents = () => {
      window.removeEventListener("pointerdown", dismissTour);
      window.removeEventListener("wheel", dismissTour);
      window.removeEventListener("keydown", dismissTour);
      window.removeEventListener("scroll", dismissTour);
    };

    // Attach dismissal listeners
    window.addEventListener("pointerdown", dismissTour, { passive: true });
    window.addEventListener("wheel", dismissTour, { passive: true });
    window.addEventListener("keydown", dismissTour, { passive: true });
    window.addEventListener("scroll", dismissTour, { passive: true });

    // Delay start slightly to let the page lay out
    const startTimer = setTimeout(() => {
      const step1 = document.getElementById("tour-product-selector");
      const step2 = document.getElementById("tour-description-field");
      const step3 = document.getElementById("tour-whatsapp-button");

      if (!step1 || !step2 || !step3) {
        cleanupEvents();
        return;
      }

      setIsActive(true);

      const getCenter = (el: HTMLElement, label: string): TargetPoint => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY,
          label,
        };
      };

      const points = [
        getCenter(step1, "1. Choose Item Type"),
        getCenter(step2, "2. Describe Your Idea"),
        getCenter(step3, "3. Connect on WhatsApp"),
      ];

      // Step 1: Fade in at target 1
      setPos(points[0]);
      setOpacity(1);

      // Step 2: Travel to target 2 after 1.4s
      const t1 = setTimeout(() => {
        setPos(points[1]);
      }, 1500);

      // Step 3: Travel to target 3 after 3.0s
      const t2 = setTimeout(() => {
        setPos(points[2]);
      }, 3100);

      // Step 4: Fade out and finish
      const t3 = setTimeout(() => {
        setOpacity(0);
        setTimeout(dismissTour, 600);
      }, 4800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }, 1200);

    return () => {
      clearTimeout(startTimer);
      cleanupEvents();
    };
  }, [canAnimate]);

  if (!isActive || !pos) return null;

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        opacity,
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      <div className="relative -top-3 -left-3 flex items-center gap-2">
        {/* Animated Custom Pointer Arrow */}
        <div className="w-7 h-7 rounded-full bg-rose-700 text-white shadow-lg flex items-center justify-center anim-pointer-pulse border border-white">
          <svg
            className="w-4 h-4 fill-current transform -rotate-45"
            viewBox="0 0 24 24"
          >
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
        </div>

        {/* Small tooltip hint */}
        <div className="bg-neutral-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap backdrop-blur-xs border border-white/20">
          {pos.label}
        </div>
      </div>
    </div>
  );
}
