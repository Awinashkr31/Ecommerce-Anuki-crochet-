"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SWRConfig } from 'swr';
import React from 'react';

export function SWRProvider({ children, fallback = {} }: { children: React.ReactNode, fallback?: Record<string, any> }) {
  return (
    <SWRConfig 
      value={{ 
        fallback,
        revalidateOnFocus: false,
        revalidateIfStale: false, // Prevents automatic revalidation just because a component remounts
        revalidateOnReconnect: true, // It's still good to reconnect
        dedupingInterval: 120000, // 2 minutes - heavily reduces duplicate requests
        errorRetryCount: 2 // Reduce aggressive retrying
      }}
    >
      {children}
    </SWRConfig>
  );
}
