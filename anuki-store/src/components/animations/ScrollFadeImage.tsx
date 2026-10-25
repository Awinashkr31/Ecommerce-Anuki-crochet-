"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationState } from "@/hooks/useAnimationState";

interface ScrollFadeImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ScrollFadeImage({
  src,
  alt,
  className = "",
  priority = false,
}: ScrollFadeImageProps) {
  const canAnimate = useAnimationState();
  const [isVisible, setIsVisible] = useState(priority || !canAnimate);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (priority || !canAnimate) {
      setIsVisible(true);
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
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, canAnimate]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      style={
        canAnimate && !priority
          ? {
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "none" : "translateY(12px)",
              willChange: "transform, opacity",
            }
          : undefined
      }
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
