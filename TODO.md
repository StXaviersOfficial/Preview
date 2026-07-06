# TODO — St. Xavier's School Website Overhaul

> Generated from a full audit of the codebase. Items are grouped by category.
> Each item is individually checkable. Mark with `[x]` when verified done.

## A. Correctness Bugs — Translation System (HIGHEST PRIORITY) — DONE PASS 1

- [x] **A1.** Rewrite `hindi-overlay.tsx` DOM translation to store originals in `data-en-original` attribute on parent elements.
- [x] **A2.** Remove the `restoredSet` WeakSet.
- [x] **A3.** Make `restoreAll()` idempotent.
- [x] **A4.** Handle mixed-content elements with WeakMap fallback.
- [x] **A5.** Add `characterData: true` to MutationObserver.
- [x] **A6.** Throttle MutationObserver callback to 250ms.
- [x] **A7.** `data-no-translate` opt-out verified.
- [x] **A8.** Verified: 4 consecutive EN→HI→EN cycles, 0 Hindi sections remaining.

## B. Performance — Code-Splitting & Lazy Loading — DONE PASS 1 (revised PASS 2)

- [x] **B1.** All 17 sections use `next/dynamic` imports with `ssr: true`.
- [x] **B2.** ~~LazyChunk wrapper~~ — Replaced with `Suspense` + `ErrorBoundary` for SSR + code-splitting (LazyChunk broke SSR for SEO; see pass 2 summary).
- [x] **B3.** 3D showcase chunk deferred via `ssr: false` client wrapper.
- [x] **B4.** Heavy animation helpers are in chunks that use them (code-split via dynamic imports).
- [x] **B5.** CustomCursor and ScrollProgressRing remain in layout (needed for all pages).
- [x] **B6.** Framer-motion tree-shaking verified — v12.42.2 with named imports; `motion/react` path not available in this version but tree-shaking works with named imports + code-splitting.

## C. Performance — Animation Loop Pausing — DONE PASS 1 + PASS 2

- [x] **C1.** CustomCursor rAF pauses on `visibilitychange`.
- [x] **C2.** ScrollProgressRing pauses (hides + freezes) on `visibilitychange` — DONE PASS 2.
- [x] **C3.** Reveal uses IntersectionObserver (one per element — acceptable; shared observer is premature optimization).
- [x] **C4.** `prefers-reduced-motion` respected by Reveal (verified in code).
- [x] **C5.** NoticeTicker interval pauses on `visibilitychange`.
- [x] **C6.** Marquee CSS animation pauses via `animation-play-state` when offscreen (IntersectionObserver) — DONE PASS 2.

## D. Performance — Images — DONE PASS 1 + PASS 2

- [x] **D1.** Images audited; 15 converted to WebP (4 kept as JPEG where WebP was larger).
- [x] **D2.** Width/height added via `next/image` (SmartImage upgraded to use next/image).
- [x] **D3.** `loading="lazy"` on non-priority images (next/image handles automatically).
- [x] **D4.** Hero migrated to `next/image` via SmartImage with `fill` + `priority` + AVIF/WebP format negotiation — DONE PASS 2.
- [x] **D5.** `decoding="async"` (next/image handles automatically).

## E. Performance — MutationObserver / Translation Cost — DONE PASS 1

- [x] **E1.** MutationObserver scoped to childList + characterData.
- [x] **E2.** Debounce increased to 250ms.
- [x] **E3.** Observer pauses when document hidden.

## F. New 3D Showcase Section — DONE PASS 1

- [x] **F1.** three, @react-three/fiber, @react-three/drei installed.
- [x] **F2.** Scroll-driven 3D scene (graduation cap + book + diploma scroll).
- [x] **F3.** Interactive (OrbitControls, drag to rotate, auto-rotate when idle).
- [x] **F4.** Lazy-loaded via `ssr: false` client wrapper.
- [x] **F5.** `prefers-reduced-motion` fallback (static scene).
- [x] **F6.** Suspense fallback (loading spinner).
- [x] **F7.** Placed between Admissions and Fees.
- [x] **F8.** Tripo3D licensing caveat documented (see pass 2 summary — attempted, login wall, evidence captured).

## G. Accessibility — DONE PASS 2

- [x] **G1.** Verified focus indicators: global `:focus-visible` with 2px solid gold outline. Tested via keyboard Tab + computed style check — all interactive elements show `outline: 2px solid` in gold/xavier color.
- [x] **G2.** Color contrast checked with actual computed values:
  - Light theme `text-muted-foreground` on `bg-card`: **5.84:1** (AA pass)
  - Dark theme `text-muted-foreground` on `bg-card`: **7.91:1** (AAA pass)
  - `text-cream-fg/60` on `bg-xavier-dark` light: **8.81:1** (AAA pass)
  - `text-cream-fg/60` on `bg-xavier-dark` dark: was **1.28:1 (FAIL)** → FIXED by introducing `--cream-fg` variable that stays light in dark theme. Now passes.
  - Body text `text-foreground` on `bg-background`: **19.66:1** (AAA pass)
- [x] **G3.** Icon-only buttons audited: 13 buttons, 24 links — ALL have aria-labels. Zero missing.
- [x] **G4.** Keyboard navigation verified:
  - FAQ accordion: Tab moves between questions, Enter toggles. Added `aria-expanded` and `aria-controls` (was missing — FIXED).
  - Gallery lightbox: Enter opens, Escape closes, ArrowRight/ArrowLeft navigate. Verified via direct event dispatch.
  - Fees filter: Tab moves between filters, Enter applies (16 rows → 1 row for Laboratory filter).
- [x] **G5.** `prefers-reduced-motion` respected by Reveal, CustomCursor, PageCurtain, 3D scene.
- [x] **G6.** Skip-to-content link verified (focuses on #home).
- [x] **G7.** 3D scene has `.sr-only` text alternative, `aria-labelledby` pointing to heading.

## H. SEO — DONE PASS 2

- [x] **H1.** Metadata complete: title (default + template), description, keywords, authors, openGraph (title, description, siteName, type, url, locale, images), twitter (card, title, description, images), robots, alternates (canonical), category. JSON-LD School schema with address, geo, affiliation, sameAs, areaServed, gradeRange.
- [x] **H2.** Sitemap includes all 7 static pages (/, /achievements, /faculty, /notices, /alumni, /privacy, /terms, /admin).
- [x] **H3.** robots.txt disallows /admin and /api/ — verified via curl.
- [x] **H4.** Canonical URLs added to all 6 subpages (achievements, faculty, notices, alumni, privacy, terms). Home page already had canonical in pass 1.

## I. Mobile Responsiveness (Galaxy A34 5G — 360×780 CSS px) — DONE PASS 2

- [x] **I1.** Touch targets fixed: Dismiss notice (20→44px), Theme toggle (36→44px), Language toggle (32→44px), Hamburger (added `shrink-0` to prevent flex-shrink, now 44×44), Academics tabs (16→42px via `py-3`), Filter buttons (24→36px via `py-2.5 sm:py-1.5`). Remaining under-44 targets are text links (logo 36px, phone links 38px) which are acceptable per WCAG AA.
- [x] **I2.** No horizontal overflow at 360px viewport — verified via `scrollWidth <= innerWidth`.
- [x] **I3.** Sticky Apply bar: added `pb-16 sm:pb-0` to page wrapper so content isn't hidden behind the 61px sticky bar on mobile.
- [x] **I4.** Mobile nav drawer: opens (10 links + admin login + Apply CTA), closes via X button — smooth, no jank.

## J. Code Quality — DONE PASS 2

- [x] **J1.** ErrorBoundary around 3D chunk and all sections.
- [x] **J2.** ErrorBoundary around each section (Suspense + ErrorBoundary).
- [x] **J3.** Dead code: `PageCurtain` was unused → MOUNTED in layout.tsx (with `prefers-reduced-motion` check added). `CursorTrail` and `ParticleField` kept as available utilities (exported, tree-shaken if not imported — no runtime cost). Other animation exports (VelocityMarquee, DrawPath, etc.) are general-purpose utilities, kept for future use.
- [x] **J4.** All `console.error` calls are informative and prefixed with context tags: `[Firestore]`, `[Fees]`, `[Timetable]`, `[SECURITY]`, `[email]`, `[API]`, `[ErrorBoundary]`. `console.log` in analytics.ts is dev-mode only (gated by `NODE_ENV`). No debug noise.

## K. Security — DONE PASS 1 (verified, no changes needed)

- [x] **K1.** Admin code read from env var, dev fallback with warning.
- [x] **K2.** ADMIN_SESSION_SECRET fails closed in production.
- [x] **K3.** Contact form server-side validation (zod-style regex, length limits).
- [x] **K4.** Rate limiting on contact (5/hour) and admin login (5/15min).
- [x] **K5.** No exposed API keys in client code (NEXT_PUBLIC_GA_ID is intentionally public).

## L. Verification & Testing — DONE PASS 2

- [x] **L1.** `npm run build` succeeds with zero TypeScript errors.
- [x] **L2.** Hindi toggle verified: 4 consecutive EN→HI→EN cycles, all sections revert.
- [x] **L3.** Fees (16 rows), FAQs (12 questions), Timetable (6 day-cards) all load.
- [x] **L4.** 3D section loads with canvas, scroll-interactive, no console errors.
- [x] **L5.** No console errors on page load.
- [x] **L6.** Real before/after performance profiling (see SUMMARY.md appendix):
  - BEFORE: DOM ready 2577ms, 19 JS files, 1004KB JS
  - AFTER: DOM ready 492ms (5.2x faster), 58 JS files, 98KB initial JS (10.2x smaller)
- [x] **L7.** SUMMARY.md exists (ticked).

---

**All 50+ items complete.** Pass 2 closed the remaining 20 items with real browser-automation verification.

## Pass 3 — Reveal Fix + 3D Name + Polish — DONE

- [x] **P3.1.** Reveal: tuned rootMargin from 100px to 150px (fire earlier).
- [x] **P3.2.** Reveal: tuned threshold from 0 to 0.05 (fire when 5% visible).
- [x] **P3.3.** Reveal: increased duration from 600ms to 800ms (clearly perceptible).
- [x] **P3.4.** Reveal: reduced initial offsets (80px→40px, 60px→30px, etc.) for smoother feel.
- [x] **P3.5.** Reveal: added willChange cleanup + data-reveal="done" after animation completes.
- [x] **P3.6.** ChunkSkeleton: replaced tiny spinner with content-aware placeholder (minHeight per section).
- [x] **P3.7.** ChunkSkeleton: added shimmer sweep animation for premium loading feel.
- [x] **P3.8.** Added 3D name animation (name-3d.tsx) using drei Text3D with gold metallic material.
- [x] **P3.9.** 3D name: intro scale-up animation with ease-out-back.
- [x] **P3.10.** 3D name: CSS fallback (gold glow text) for immediate render while font loads.
- [x] **P3.11.** 3D name: integrated into hero, replaced old static gradient headline.
- [x] **P3.12.** Copy audit: no typos, no inconsistent capitalization, no double spaces.
- [x] **P3.13.** Visual consistency: text-cream-fg used correctly, color palette consistent.
- [x] **P3.14.** Verified: 0 console errors, 2 canvases rendering, 57 reveal animations completed.
- [x] **P3.15.** Created /proof folder with before/after screenshots + NOTES.md.
- [x] **P3.16.** Created SUMMARY-PASS3.md.

## Pass 4 — Remove Code-Splitting + Fix 3D Name — DONE

- [x] **P4.1.** Replaced all 15 dynamic() imports with plain static imports in page.tsx.
- [x] **P4.2.** Removed all Suspense + ChunkSkeleton wrappers from page.tsx.
- [x] **P4.3.** Deleted ChunkSkeleton function from page.tsx.
- [x] **P4.4.** Deleted src/components/site/lazy-chunk.tsx (confirmed no imports).
- [x] **P4.5.** Removed shimmer-sweep keyframe from globals.css (confirmed unused).
- [x] **P4.6.** Left Reveal scroll-animation system completely untouched.
- [x] **P4.7.** Fixed ghost text: removed CSS fallback from Name3D (no double text possible).
- [x] **P4.8.** Self-hosted helvetiker_bold.typeface.json in public/fonts/ (was CDN).
- [x] **P4.9.** Fixed h1 sizing: changed to h2 with text-xl/sm:text-3xl/lg:text-4xl for "Jr./Sr. School".
- [x] **P4.10.** Made Name3D container height responsive (80px mobile, 130px desktop).
- [x] **P4.11.** Made camera Z position responsive (4.0 mobile, 5.0 desktop).
- [x] **P4.12.** Upgraded 3D material to meshPhysicalMaterial with clearcoat + reflectivity.
- [x] **P4.13.** Added gold Sparkles particles around 3D text.
- [x] **P4.14.** Added orbiting gold point light for dynamic highlights.
- [x] **P4.15.** Verified: 0 ghost text, 0 console errors, 0 skeleton spinners, all sections present.
- [x] **P4.16.** Created /proof folder with screenshots + NOTES.md.
- [x] **P4.17.** Created SUMMARY-PASS4.md.
- [x] **P4.18.** Created BACKUP.zip (pre-pass-4 state) for rollback.

## Pass 5 — Hero Video + 3D Name + Polish — DONE

- [x] **P5.1.** Downloaded video from MediaFire via browser automation (112.54 MB, valid MP4).
- [x] **P5.2.** Compressed video to 410 KB (H.264, 720p, CRF 32, no audio, faststart).
- [x] **P5.3.** Extracted poster frame (88 KB JPEG).
- [x] **P5.4.** Added background video to hero (muted, loop, playsInline, autoPlay, preload="metadata").
- [x] **P5.5.** Layered: video → dark overlay (45/65/85%) → 3D canvas → content.
- [x] **P5.6.** Added prefers-reduced-motion handling (video shows poster only).
- [x] **P5.7.** Verified 3D name still renders (0 ghost text, 2 canvases).
- [x] **P5.8.** Verified all sections present (0 spinners, 9/9 section IDs).
- [x] **P5.9.** Verified 0 console errors.
- [x] **P5.10.** Measured performance: DOM-ready 679ms, JS 547KB (regression from Three.js in main bundle).
- [x] **P5.11.** Copy audit: 0 typos, 0 inconsistencies.
- [x] **P5.12.** Visual consistency: overlay opacity tuned.
- [x] **P5.13.** Created /proof folder with screenshots + NOTES.md.
- [x] **P5.14.** Created SUMMARY-PASS5.md.
- [x] **P5.15.** Reviewed Fable 5 system prompt (applied principles, did not adopt as OS).
