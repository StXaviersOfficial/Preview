# St. Xavier's Jr./Sr. School Website — Pass 4 Summary

This pass fixed two regressions introduced in pass 3: the code-splitting lag and the broken 3D hero name.

---

## Fix 1 — Remove Code-Splitting Entirely

### Problem
Pass 3 wrapped every section in `dynamic(() => import(...), { ssr: true })` + `<Suspense fallback={<ChunkSkeleton />}>`. While this code-split the JS, it caused visible lag as each section's chunk hydrated on scroll — users saw skeleton spinners flash before content appeared.

### Root Cause
The `Suspense` boundary + `next/dynamic` with `ssr: true` means the HTML is server-rendered, but the client-side JS for each section loads as a separate chunk. When the chunk arrives, React hydrates it, causing a brief flash where the skeleton is replaced by the actual content. On slower connections, this is very noticeable.

### Fix Applied
- Replaced all 15 `dynamic()` calls with plain `import { X } from "@/components/site/X"` at the top of `page.tsx`
- Removed all `<Suspense fallback={<ChunkSkeleton />}>` wrappers — sections render directly
- Deleted the `ChunkSkeleton` function entirely
- Deleted `src/components/site/lazy-chunk.tsx` (unused dead code from pass 1, confirmed no imports)
- Removed `shimmer-sweep` keyframe from `globals.css` (only used by ChunkSkeleton)
- Kept `ErrorBoundary` only around the 3D showcase (the one component that can legitimately crash on unsupported browsers)
- Left the `Reveal` scroll-animation system completely untouched

### Verification
- All 9 section IDs (`about`, `academics`, `admissions`, `fees`, `faq`, `campus`, `gallery`, `timetable`, `contact`) present in initial HTML
- 0 skeleton spinners on the page
- 0 console errors

---

## Fix 2 — Fix Broken 3D Hero Name

### Bug A — Ghost/Double Text

**Problem**: The CSS fallback (`Name3DFallback`) was rendered in an `absolute inset-0` div and was NEVER hidden once the WebGL canvas/font finished loading. The flat CSS text stayed visible behind/overlapping the 3D text permanently.

**Root Cause**: The `Name3D` component rendered both the CSS fallback and the 3D `<Canvas>` simultaneously. The fallback was always visible (`opacity: 1`), and nothing tracked whether the 3D text had actually rendered to hide it.

**Fix**: Removed the CSS text fallback entirely. The font is now self-hosted (`public/fonts/helvetiker_bold.typeface.json`, 61KB, loads in <100ms), so there's no need for a text fallback. The 3D text appears with its intro scale-up animation — no ghost text is possible.

**Verification**: DOM check confirms 0 flat "St. Xavier's" text elements on the page. The only "St. Xavier's" visible is the 3D rendered text in the canvas.

### Bug B — "Jr./Sr. School" Misalignment

**Problem**: The `<h1>` that used to contain both "St. Xavier's" and "Jr./Sr. School" was still sized at `text-[clamp(2.75rem,11vw,8rem)]` with `leading-[0.92]`. Since "St. Xavier's" moved into `<Name3D />` above it, the `<h1>` now only contained the small nested span — but the huge font size and line height remained, creating a massive invisible gap that pushed "Jr./Sr. School" far below the 3D name.

**Fix**: Changed the `<h1>` to an `<h2>` with proper sizing:
- `text-xl sm:text-3xl lg:text-4xl` (was `text-[clamp(2.75rem,11vw,8rem)]`)
- `leading-tight` (was `leading-[0.92]`)
- `-mt-1 sm:-mt-2` (slight negative margin to sit closer to the 3D name)

**Verification**: VLM confirmed "Jr./Sr. School" sits "directly below the 3D name, with clean spacing."

### Bug C — Mobile Clipping

**Problem**: The `Name3D` component had a fixed `140px` container height and camera settings that could clip the 3D text on narrow mobile screens.

**Fix**: Made the container height responsive (80px on mobile, 130px on desktop) and adjusted the camera Z position (4.0 on mobile, 5.0 on desktop) so the text is larger relative to the viewport on small screens.

**Verification**: VLM confirmed on mobile (375px): "The 3D gold text 'St. Xavier's' is visible, not clipped, and fits within the screen width."

---

## 3D Premium Upgrades

While fixing the bugs, the 3D name was upgraded to be genuinely premium:

| Feature | Pass 3 | Pass 4 |
|---------|--------|--------|
| Material | `meshStandardMaterial` | `meshPhysicalMaterial` with clearcoat + reflectivity |
| Font source | threejs.org CDN | Self-hosted (`public/fonts/`) |
| Particles | None | 60 gold `<Sparkles>` floating around text |
| Dynamic light | Static | Gold point light orbits the text |
| Intro animation | 1.2s, mild ease-out-back | 1.5s, strong ease-out-back (c1=2.5) |
| CSS fallback | Flat text (caused ghost) | None (font loads in <100ms) |
| Mobile | Fixed 140px height | Responsive 80px/130px + camera adjust |

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/page.tsx` | Replaced all dynamic imports with static imports; removed Suspense + ChunkSkeleton |
| `src/components/site/name-3d.tsx` | Removed CSS fallback; upgraded material to meshPhysicalMaterial; added particles + orbiting light; responsive sizing |
| `src/components/site/hero.tsx` | Changed h1 to h2 with proper sizing for "Jr./Sr. School" subtitle |
| `src/app/globals.css` | Removed `shimmer-sweep` keyframe |
| `src/components/site/lazy-chunk.tsx` | **DELETED** (unused dead code) |
| `public/fonts/helvetiker_bold.typeface.json` | **NEW** — self-hosted font for 3D text |

## Files NOT Changed (per constraints)
- `src/components/site/reveal.tsx` — scroll animation system untouched
- `src/components/site/hindi-overlay.tsx` — Hindi toggle logic untouched
- `src/components/site/error-boundary.tsx` — kept (still used for 3D showcase)
- All accessibility/mobile fixes from pass 2 — untouched
- Peer-dependency fix — untouched

## Build Status
- TypeScript: 0 errors
- Build: 27 pages generated successfully
- Console errors: 0
- Ghost text: 0 flat "St. Xavier's" elements
- Skeleton spinners: 0
- All 9 section IDs present in initial HTML
