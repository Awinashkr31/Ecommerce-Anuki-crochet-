"use client";

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Mock analytics tracker
    // In production, this is where you'd trigger posthog.capture('$pageview') or GA gtag()
    console.log(`[Analytics] PageView: ${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
