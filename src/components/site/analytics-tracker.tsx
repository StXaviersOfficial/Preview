'use client';

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/site/analytics";

/**
 * AnalyticsTracker — tracks page views on route changes.
 *
 * Mount this once in the root layout. It listens for pathname/searchParams
 * changes and fires a GA4/Plausible pageview event.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}
