"use client";

import { useEffect, useState } from "react";
import { useAnimationState } from "@/hooks/useAnimationState";

const WORDS = [
  "Bouquets",
  "Plushies",
  "Keychains",
  "Hair Clips",
  "Flower Pots",
];

export default function WordRotator() {
  const canAnimate = useAnimationState();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!canAnimate) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [canAnimate]);

  return (
    <span
      className="inline-block relative h-[1.35em] overflow-hidden align-middle text-rose-300 font-serif"
      style={{ minWidth: "6ch" }}
      aria-live="polite"
      aria-label={WORDS[index]}
    >
      <span
        className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `translateY(-${index * 20}%)`,
          willChange: "transform",
        }}
      >
        {WORDS.map((word) => (
          <span
            key={word}
            className="flex items-center leading-none select-none"
            style={{ height: "1.35em" }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}
