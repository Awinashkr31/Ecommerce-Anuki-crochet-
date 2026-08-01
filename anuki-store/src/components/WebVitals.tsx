"use client";

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // In production, this can be sent to Google Analytics, Datadog, Sentry, or PostHog.
    // We are logging it here so the developer can see the real-time RUM metrics.
    
    // Ignore small metric fluctuations, focus on the big ones.
    if (metric.name === 'FCP' || metric.name === 'LCP' || metric.name === 'CLS' || metric.name === 'FID' || metric.name === 'INP' || metric.name === 'TTFB') {
      const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);
      
      let rating = '🟢 GOOD';
      if (metric.name === 'LCP') {
        if (value > 2500) rating = value > 4000 ? '🔴 POOR' : '🟡 NEEDS IMPROVEMENT';
      } else if (metric.name === 'INP') {
        if (value > 200) rating = value > 500 ? '🔴 POOR' : '🟡 NEEDS IMPROVEMENT';
      } else if (metric.name === 'CLS') {
        if (value > 100) rating = value > 250 ? '🔴 POOR' : '🟡 NEEDS IMPROVEMENT'; // Note: multiplied by 1000 for display
      }
      
      if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_RUM_LOGS === 'true') {
        console.debug(`[Web Vitals] ${metric.name}: ${value}ms ${rating}`, metric);
      }
    }
  });

  return null;
}
