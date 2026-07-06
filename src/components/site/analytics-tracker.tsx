'use client';

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/site/analytics";

/**
 * AnalyticsTrackerInner — tracks page views on route changes.
 *
 * Uses useSearchParams which requires a Suspense boundary in Next.js 16
 * during static generation (especially for the not-found page).
 */
function AnalyticsTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * AnalyticsTracker — wrapped in Suspense for static page compatibility.
 */
export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  );
}
