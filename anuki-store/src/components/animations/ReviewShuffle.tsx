"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { useAnimationState } from "@/hooks/useAnimationState";

const REVIEWS = [
  {
    name: "Priya Sharma",
    init: "P",
    text: "The custom bouquet I ordered for my mom's 50th birthday arrived in perfect packaging. She literally teared up seeing the forever crochet sunflowers! 🌻",
  },
  {
    name: "Ananya",
    init: "A",
    text: "The amigurumi toy I ordered was incredibly detailed. You can see the love put into it!",
  },
  {
    name: "Rohan M.",
    init: "R",
    text: "Ordered a sunflower pot for my desk. Craftsmanship is flawless and delivery was right on time. Brings so much joy to my workspace.",
  },
  {
    name: "Sneha K.",
    init: "S",
    text: "I gifted a crochet rose bouquet to my wife for our anniversary. She absolutely loved it! Better than real flowers since these last forever.",
  },
];

export default function ReviewShuffle() {
  const canAnimate = useAnimationState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!canAnimate || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [canAnimate, isPaused]);

  return (
    <section className="py-10 bg-[#fdfaf9] border-y border-[#f0e8e6]">
      <div className="px-4 mb-6 flex justify-between items-end max-w-4xl mx-auto">
        <div>
          <h2 className="text-[10px] font-bold tracking-widest text-rose-800 uppercase mb-1.5">
            Real Reviews
          </h2>
          <h3 className="text-2xl font-serif font-bold text-neutral-900">
            Loved Across India
          </h3>
        </div>
        <div className="text-rose-800 font-bold text-sm flex items-center gap-1 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
          4.9/5 <span className="text-sm">⭐</span>
        </div>
      </div>

      <div
        className="max-w-2xl mx-auto px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Single Review Card with Cross-fade transition */}
        <div className="relative min-h-[220px] sm:min-h-[200px]">
          {REVIEWS.map((r, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={r.name}
                className={`w-full bg-white rounded-3xl p-6 sm:p-7 border border-[#f0e8e6] shadow-xs flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "opacity-100 transform translate-y-0 relative z-10"
                    : "opacity-0 transform translate-y-3 absolute inset-0 pointer-events-none z-0"
                }`}
                aria-hidden={!isActive}
              >
                <div>
                  <div
                    className="text-rose-500 text-sm mb-3 tracking-widest"
                    aria-label="5 out of 5 stars"
                    role="img"
                  >
                    ★★★★★
                  </div>
                  <p className="text-sm sm:text-base text-neutral-700 italic leading-relaxed mb-6 font-medium">
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>

                <div className="flex gap-3 items-center pt-4 border-t border-neutral-100">
                  <div className="w-10 h-10 bg-rose-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                    {r.init}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-neutral-900 mb-0.5">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 flex items-center gap-1 font-medium">
                      <Check size={12} className="text-green-500" /> Verified Buyer, India
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
