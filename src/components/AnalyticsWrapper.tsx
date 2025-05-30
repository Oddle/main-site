// components/AnalyticsWrapper.tsx
'use client';

import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function AnalyticsWrapper() {
  useEffect(() => {
    // Load after component mounts and page is interactive
    const timer = setTimeout(() => {
      // Analytics components are already loaded here
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}