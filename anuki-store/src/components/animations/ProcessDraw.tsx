"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationState } from "@/hooks/useAnimationState";

const STEPS = [
  {
    num: "01",
    title: "Yarn",
    desc: "100% non-toxic premium yarn",
    icon: "🧶",
  },
  {
    num: "02",
    title: "Handcrafted",
    desc: "Woven loop-by-loop by artisans",
    icon: "🪡",
  },
  {
    num: "03",
    title: "Gift Box",
    desc: "Artisanal gift box & handwritten card",
    icon: "🎁",
  },
  {
    num: "04",
    title: "Pan-India",
    desc: "Safe doorstep delivery nationwide",
    icon: "🚚",
  },
];

export default function ProcessDraw() {
  const canAnimate = useAnimationState();
  const [isDrawn, setIsDrawn] = useState(!canAnimate);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!canAnimate) {
      setIsDrawn(true);
      return;
    }
    if (hasTriggeredRef.current) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setIsDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [canAnimate]);

  return (
    <section
      ref={containerRef}
      className="py-4 sm:py-8 px-2 sm:px-4 bg-white border-t border-[#f0e8e6] max-w-5xl mx-auto w-full overflow-hidden"
    >
      <div className="text-center mb-3 sm:mb-6">
        <h2 className="text-base sm:text-2xl font-serif font-bold text-neutral-900">
          How It Is Made
        </h2>
        <p className="hidden sm:block text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
          From first yarn loop to doorstep delivery, every piece is made with patience & care.
        </p>
      </div>

      <div className="relative">
        {/* Horizontal SVG Path for Connecting line */}
        <div className="block absolute top-4 sm:top-7 left-[10%] right-[10%] h-1 z-0 pointer-events-none">
          <svg className="w-full h-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 4">
            <line
              x1="0"
              y1="2"
              x2="100"
              y2="2"
              stroke="#f3d8dc"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="2"
              x2="100"
              y2="2"
              stroke="#be4b5c"
              strokeWidth="2.5"
              strokeDasharray="100"
              strokeDashoffset={isDrawn ? "0" : "100"}
              style={{
                transition: canAnimate ? "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              }}
            />
          </svg>
        </div>

        {/* 4 Steps Grid - Single Line on Mobile */}
        <div className="grid grid-cols-4 gap-1 sm:gap-4 md:gap-6 relative z-10">
          {STEPS.map((step, idx) => {
            const delay = idx * 280;
            return (
              <div
                key={step.num}
                className="flex flex-col items-center text-center px-0.5 sm:px-1"
                style={
                  canAnimate
                    ? {
                        opacity: isDrawn ? 1 : 0,
                        transform: isDrawn ? "translateY(0)" : "translateY(16px)",
                        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
                        transitionDelay: `${delay}ms`,
                        willChange: "transform, opacity",
                      }
                    : undefined
                }
              >
                {/* Step Circle */}
                <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-rose-50 border sm:border-2 border-rose-200 flex items-center justify-center text-base sm:text-2xl shadow-xs mb-1 sm:mb-2 relative group hover:scale-105 transition-transform shrink-0">
                  <span>{step.icon}</span>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-rose-800 text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {idx + 1}
                  </span>
                </div>

                <h3 className="text-xs sm:text-base font-bold font-serif text-neutral-900 leading-tight">
                  {step.title}
                </h3>
                <p className="hidden sm:block text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight sm:leading-relaxed max-w-[180px] mt-0.5">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
