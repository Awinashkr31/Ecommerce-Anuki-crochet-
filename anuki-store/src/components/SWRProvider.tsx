"use client";

import { SWRConfig } from 'swr';
import React from 'react';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{ 
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
