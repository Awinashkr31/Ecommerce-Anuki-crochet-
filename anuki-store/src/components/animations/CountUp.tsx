"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationState } from "@/hooks/useAnimationState";

interface CountUpProps {
  end: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  end,
  durationMs = 1200,
  prefix = "",
  suffix = "",
  className = "",
}: CountUpProps) {
  const canAnimate = useAnimationState();
  const [count, setCount] = useState<number>(canAnimate ? 0 : end);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!canAnimate) {
      setCount(end);
      return;
    }

    if (hasAnimatedRef.current) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease-out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(easedProgress * end);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [canAnimate, end, durationMs]);

  return (
    <span ref={elementRef} className={`tabular-nums font-bold ${className}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
