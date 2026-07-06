# St. Xavier's Jr./Sr. School Website — Pass 5 Summary

This pass added the hero centerpiece (3D name + background video) and completed the premium polish pass.

---

## Task 1 — Hero Centerpiece: 3D Name + Background Video

### 1a. 3D Animated School Name
Carried over from pass 4 (verified still working):
- Extruded gold text via `@react-three/drei` `<Text3D>` with `meshPhysicalMaterial` (clearcoat 0.5, reflectivity 0.8)
- 60 gold `<Sparkles>` particles floating around the text
- Orbiting gold point light for dynamic highlights
- Intro scale-up animation (1.5s, strong ease-out-back with c1=2.5)
- Font self-hosted at `public/fonts/helvetiker_bold.typeface.json` (61KB)
- Responsive container height (80px mobile, 130px desktop)
- VLM confirmed: "3D gold text" with "raised, dimensional quality"

### 1b. Background Video
**Download process** (browser automation):
1. Navigated to `https://www.mediafire.com/file/etzc17dkzn0boqb/stxaviersbg.mp4/file`
2. Screenshot of MediaFire page saved to `proof/mediafire-page.png`
3. Found download button, clicked it, Playwright captured the download
4. Real file URL: `https://download1475.mediafire.com/...`
5. Downloaded: 118,002,619 bytes (112.54 MB), valid MP4 signature confirmed

**Compression** (ffmpeg):
- Original: 112.54 MB
- Compressed: 410 KB (H.264, 720p, 24fps, CRF 32, no audio, `+faststart`)
- Compression ratio: 99.6% reduction
- Poster frame extracted: 88 KB JPEG

**Implementation**:
- `<video autoPlay muted loop playsInline preload="metadata" poster="/video/stxaviersbg-poster.jpg">`
- `preload="metadata"` — browser does NOT eagerly buffer the whole file
- Poster provides instant first paint (LCP element)
- `muted` + `playsInline` — required for iOS autoplay
- `prefers-reduced-motion`: `autoPlay={!reducedMotion}` — video shows poster only

### 1c. Layering
```
z-0:  <video> (background, ambient motion)
z-0:  dark gradient overlays (45%/65%/85% opacity — video stays ambient)
z-10: decorative glows, grain texture, corner frames
z-20: 3D <Canvas> + all hero content (badge, subtitle, CTAs, pills)
```
VLM confirmed: "rich, deep red background with subtle, soft bokeh/particle effects" — video reads as ambient background, not competing focal point.

### 1d. Performance Measurements (Navigation Timing API)

| Metric | Pass 2 Baseline | Pass 5 | Delta |
|--------|----------------|--------|-------|
| DOM Content Loaded | 492ms | 679ms | +187ms |
| DOM Interactive | — | 666ms | — |
| Load Event | — | 860ms | — |
| Initial JS payload | 98KB | 547KB | +449KB |
| HTML transfer size | — | 29KB | — |

**Analysis**:
- The +187ms DOM-ready regression is primarily from Three.js being in the main JS bundle (pass 4 removed code-splitting). The largest chunk is 256KB — likely Three.js + R3F + Drei.
- The video (410KB, `preload="metadata"`) does NOT contribute to JS payload or DOM-ready time. The poster (88KB) loads as an image, not blocking.
- If the JS size is a concern, re-introducing `next/dynamic` with `ssr: true` specifically for the 3D components (not all sections) would move ~256KB to a lazy chunk without reintroducing the chunk-loading lag that pass 4 fixed.

---

## Task 2 — Reveal/Chunk-Loading (Already Fixed in Pass 4)

Pass 4 already:
- Removed all 15 `dynamic()` imports → plain static imports
- Removed all `<Suspense>` + `ChunkSkeleton` wrappers
- Deleted `lazy-chunk.tsx` and `shimmer-sweep` keyframe
- Tuned Reveal: rootMargin 150px, threshold 0.05, duration 800ms, reduced initial offsets

**Verified this pass**: 0 skeleton spinners, all 9 section IDs present in initial HTML, 0 console errors.

---

## Task 3 — Premium Polish Pass

### Copy/wording audit
- Searched all source files for: `recieve`, `seperate`, `occured`, `untill`, `begining`, `teh`, `adn` — **0 found**
- School name capitalization: **all consistent** (`St. Xavier's`)
- Double spaces in JSX text: **0 found**

### Visual consistency
- Tuned hero overlay opacity from 65/80/100% → 45/65/85% so video bokeh particles are visible while text remains readable
- All other sections unchanged (consistent spacing, alignment, color usage verified)

---

## Files Changed This Pass

| File | Change |
|------|--------|
| `src/components/site/hero.tsx` | Replaced static background image with `<video>` + poster; added `prefers-reduced-motion` handling; tuned overlay opacity |
| `public/video/stxaviersbg.mp4` | **NEW** — compressed background video (410 KB) |
| `public/video/stxaviersbg-poster.jpg` | **NEW** — poster frame (88 KB) |

## Files NOT Changed (per constraints)
- Hindi toggle logic — untouched
- SSR architecture — untouched (pass 4's static imports remain)
- Peer-dependency fix — untouched
- Accessibility/mobile fixes — untouched
- Reveal scroll-animation system — untouched

## Build Status
- TypeScript: 0 errors
- Build: 27 pages generated
- Console errors: 0
- Video: playing (verified currentTime > 0, paused = false)
- 3D name: rendering (2 canvases, 0 ghost text)
- All sections: present in initial HTML
