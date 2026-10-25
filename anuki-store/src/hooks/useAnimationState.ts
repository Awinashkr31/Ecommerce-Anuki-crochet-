"use client";

import { useState, useEffect } from "react";
import { ANIMATIONS_ENABLED } from "@/lib/animationConfig";

/**
 * Hook to reactively check whether animations should run.
 * Returns true only if ANIMATIONS_ENABLED is true AND user has NOT requested reduced motion.
 */
export function useAnimationState(): boolean {
  const [canAnimate, setCanAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (!ANIMATIONS_ENABLED) {
      setCanAnimate(false);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setCanAnimate(!mediaQuery.matches);

    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);
    return () => mediaQuery.removeEventListener("change", updateMotion);
  }, []);

  return canAnimate;
}
