"use client";

import CountUp from "./CountUp";
import { Sparkles, HeartHandshake, Layers } from "lucide-react";

export default function StatsStrip() {
  return (
    <section className="px-3 sm:px-4 py-1.5 sm:py-4 max-w-4xl mx-auto w-full">
      <div className="bg-gradient-to-r from-[#fff7f8] via-[#fff0f2] to-[#fff7f8] rounded-xl sm:rounded-2xl border border-rose-100/80 p-2 sm:p-5 shadow-xs grid grid-cols-3 divide-x divide-rose-100">
        
        {/* Stat 1: 22+ Handmade Designs */}
        <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-100/70 text-rose-700 flex items-center justify-center mb-0.5 sm:mb-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="text-base sm:text-2xl md:text-3xl font-black text-rose-900 tracking-tight leading-tight py-0.5">
            <CountUp end={22} suffix="+" />
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-600 font-medium mt-0.5 sm:mt-1 leading-tight">
            Handmade Designs
          </p>
        </div>

        {/* Stat 2: 100% Handmade */}
        <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-100/70 text-rose-700 flex items-center justify-center mb-0.5 sm:mb-1.5 shrink-0">
            <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="text-base sm:text-2xl md:text-3xl font-black text-rose-900 tracking-tight leading-tight py-0.5">
            <CountUp end={100} suffix="%" />
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-600 font-medium mt-0.5 sm:mt-1 leading-tight">
            100% Handmade
          </p>
        </div>

        {/* Stat 3: 5 Gift Categories */}
        <div className="flex flex-col items-center justify-center text-center px-1 sm:px-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-100/70 text-rose-700 flex items-center justify-center mb-0.5 sm:mb-1.5 shrink-0">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="text-base sm:text-2xl md:text-3xl font-black text-rose-900 tracking-tight leading-tight py-0.5">
            <CountUp end={5} />
          </div>
          <p className="text-[10px] sm:text-xs text-neutral-600 font-medium mt-0.5 sm:mt-1 leading-tight">
            Gift Categories
          </p>
        </div>

      </div>
    </section>
  );
}
