/**
 * Lightweight analytics — works with GA4 or Plausible.
 * Reads GA_MEASUREMENT_ID from env var.
 * If not set, events are logged to console only (no-op for production).
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page view (called on route change)
export function trackPageView(url: string) {
  if (typeof window === "undefined") return;

  // GA4
  if (GA_ID && (window as any).gtag) {
    (window as any).gtag("config", GA_ID, { page_path: url });
  }

  // Plausible
  if ((window as any).plausible) {
    (window as any).plausible("pageview", { u: url });
  }
}

// Track custom event
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  // GA4
  if (GA_ID && (window as any).gtag) {
    (window as any).gtag("event", name, props);
  }

  // Plausible
  if ((window as any).plausible) {
    (window as any).plausible(name, { props });
  }

  // Console log in dev
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", name, props);
  }
}

// Convenience: track outbound clicks (WhatsApp, phone, email)
export function trackOutbound(target: string, label: string) {
  trackEvent("outbound_click", { target, label });
}

// Convenience: track enquiry form submission
export function trackEnquiry() {
  trackEvent("enquiry_submit", { source: "contact_form" });
}

// Convenience: track Apply Now clicks
export function trackApplyNow(source: "nav" | "hero" | "sticky" | "footer" | "admissions") {
  trackEvent("apply_now_click", { source });
}

// GA4 script tag (inject in layout)
export const analyticsScript = GA_ID
  ? `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  : null;

export const gaId = GA_ID;
