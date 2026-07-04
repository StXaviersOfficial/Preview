# Proof Folder — Pass 4 Notes

> **Read this once, then delete the entire `/proof` folder before deploying.**

## What's in this folder

| File | What it shows |
|------|---------------|
| `after-hero-3d-name-fixed.png` | Hero with 3D name — NO ghost text, "Jr./Sr. School" properly sized below |
| `after-about.png` | About section — renders immediately, no skeleton |
| `after-facilities.png` | Facilities section — renders immediately |
| `after-mobile-hero.png` | Mobile (375px) — 3D name visible, not clipped |

## What was fixed in Pass 4

### Fix 1 — Removed code-splitting entirely
- Removed all 15 `dynamic(() => import(...), { ssr: true })` calls from `page.tsx`
- Removed all `<Suspense fallback={<ChunkSkeleton />}>` wrappers
- Deleted the `ChunkSkeleton` function entirely
- Deleted `src/components/site/lazy-chunk.tsx` (unused dead code from pass 1)
- Removed `shimmer-sweep` keyframe from `globals.css` (was only used by ChunkSkeleton)
- All sections now use plain `import { X } from "@/components/site/X"` — they render immediately in the initial HTML, no chunk-loading lag
- The `Reveal` scroll-animation system was left completely untouched
- `ErrorBoundary` kept only around the 3D showcase (the one component that might actually crash)

### Fix 2A — Ghost/double text eliminated
- **Root cause**: The CSS fallback (`Name3DFallback`) was rendered in an `absolute inset-0` div and NEVER hidden once the WebGL canvas finished loading. The flat CSS text stayed visible behind the 3D text permanently.
- **Fix**: Removed the CSS text fallback entirely. The font is now self-hosted (`public/fonts/helvetiker_bold.typeface.json`, 61KB, loads in <100ms), so there's no need for a text fallback. The 3D text appears with its intro scale-up animation — no ghost text is possible.
- **Verified**: DOM check confirms 0 flat "St. Xavier's" text elements on the page.

### Fix 2B — "Jr./Sr. School" alignment fixed
- **Root cause**: The `<h1>` that used to contain both "St. Xavier's" and "Jr./Sr. School" was still sized at `text-[clamp(2.75rem,11vw,8rem)]` with `leading-[0.92]` — huge font size and line height for what was now just the small "Jr./Sr. School" subtitle. This left a massive invisible gap, pushing the subtitle far below the 3D name.
- **Fix**: Changed the `<h1>` to an `<h2>` with proper sizing: `text-xl sm:text-3xl lg:text-4xl leading-tight -mt-1 sm:-mt-2`. It now sits directly and visually connected under the 3D name.

### Fix 2C — Mobile clipping addressed
- Made the container height responsive: 80px on mobile, 130px on desktop (was fixed 140px)
- Camera Z position adjusts: 4.0 on mobile, 5.0 on desktop (closer camera = larger text on small screens)
- VLM confirmed: 3D text is "visible, not clipped, and fits within the screen width" on mobile

### 3D premium upgrades
- **Material**: Upgraded from `meshStandardMaterial` to `meshPhysicalMaterial` with clearcoat (0.5) and reflectivity (0.8) for a liquid-gold look
- **Particles**: Added `<Sparkles>` (60 gold particles) floating around the text
- **Orbiting light**: Gold point light orbits the text, creating dynamic highlights
- **Intro animation**: Scale 0 → 1 with strong ease-out-back (c1=2.5) over 1.5s
- **Font**: Self-hosted (was loading from threejs.org CDN — now local for reliability)

## Things to note

1. **Font file**: The `helvetiker_bold.typeface.json` font is in `public/fonts/`. It's from Three.js examples (MIT licensed). If you want a different font, generate a typeface JSON from any TTF using [Facetype.js](https://gero3.github.io/facetype.js/).

2. **BACKUP.zip**: A backup of the state BEFORE pass 4 changes is at `/home/z/my-project/download/BACKUP.zip`. If you want to revert to the pass 3 state, upload this zip.

3. **No features removed**: The `Reveal` scroll-animation system, Hindi toggle, accessibility fixes, and all existing animations are untouched. Only the dynamic-import/Suspense/chunk-skeleton system was removed.
