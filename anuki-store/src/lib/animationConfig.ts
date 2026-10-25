/**
 * Animation System Configuration
 * Global kill switch and configuration flags for anukicrochet.in
 */

// GLOBAL KILL SWITCH: Set to false to disable all animations site-wide
export const ANIMATIONS_ENABLED = true;

// SALE PINGS KILL SWITCH: Defaulted to false.
// May only be switched on when real paid orders exist in the database.
// Never fabricate customer names, cities, or times.
export const SALE_PINGS_ENABLED = false;

/**
 * Checks if animations should run based on:
 * 1. Global ANIMATIONS_ENABLED flag
 * 2. User's OS-level prefers-reduced-motion setting
 */
export function areAnimationsEnabled(): boolean {
  if (!ANIMATIONS_ENABLED) return false;
  if (typeof window === 'undefined') return false;
  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return !mediaQuery.matches;
  } catch {
    return true;
  }
}
