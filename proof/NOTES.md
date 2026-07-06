# Proof Folder — Pass 5 Notes

> **Read this once, then delete the entire `/proof` folder before deploying.**

## What's in this folder

| File | What it shows |
|------|---------------|
| `mediafire-page.png` | MediaFire download page — browser automation navigated here to get the real video URL |
| `after-hero-video-3d.png` | Hero with background video (bokeh particles visible) + 3D gold "St. Xavier's" + subtitle |
| `after-mobile-hero-video.png` | Mobile (375px) — 3D name + video background working |

## What was done in Pass 5

### Task 1 — Hero centerpiece: 3D name + background video

**1a. 3D animated school name** (already from pass 4, verified still working):
- Extruded gold text using `@react-three/drei` `<Text3D>` with `meshPhysicalMaterial` (clearcoat, reflectivity)
- 60 gold sparkle particles + orbiting point light
- Intro scale-up animation (1.5s, strong ease-out-back)
- Font self-hosted (`public/fonts/helvetiker_bold.typeface.json`, 61KB)

**1b. Background video** (NEW):
- Downloaded from MediaFire via browser automation (navigated to share page, clicked download button, got real file URL)
- Verified valid MP4: 112.54 MB original, compressed to 410 KB (H.264, 720p, CRF 32, no audio, faststart)
- Poster frame extracted: 88 KB JPEG (first frame — dark background with warm bokeh particles)
- Saved to `public/video/stxaviersbg.mp4` + `public/video/stxaviersbg-poster.jpg`

**1c. Layering**:
- z-0: `<video>` (muted, loop, playsInline, autoPlay, preload="metadata", poster)
- z-0 (on top of video): semi-transparent dark gradient overlays (45%/65%/85% opacity)
- z-10: decorative glows, grain, corner frames
- z-20: 3D canvas + all hero content (badge, subtitle, CTAs, pills)

**1d. Performance**:
- Video: preload="metadata" (does NOT eagerly buffer), 410 KB total
- Poster: 88 KB, loads instantly (what counts toward LCP)
- 3D canvas: does not block hero text/CTAs (renders independently)
- prefers-reduced-motion: video shows poster only (no autoplay), 3D intro still plays

**Performance measurements** (Navigation Timing API):
| Metric | Pass 2 baseline | Pass 5 | Change |
|--------|----------------|--------|--------|
| DOM Content Loaded | 492ms | 679ms | +187ms |
| Load Event | — | 860ms | — |
| Initial JS payload | 98KB | 547KB | +449KB |

**Note on JS regression**: The 547KB JS payload is due to Three.js + React Three Fiber + Drei being bundled into the main chunk. Pass 4 removed code-splitting (dynamic imports), which moved Three.js from a lazy-loaded chunk to the main bundle. The video itself (410KB, preload="metadata") does NOT contribute to JS payload or DOM-ready time. If JS size is a concern, re-introducing `next/dynamic` with `ssr: true` for the 3D components would move ~256KB back to a lazy chunk.

### Task 2 — Reveal/chunk-loading (already fixed in pass 4)
- Pass 4 already removed all `dynamic()` imports + `<Suspense>` + `ChunkSkeleton`
- Reveal component was tuned in pass 3 (rootMargin 150px, threshold 0.05, duration 800ms)
- Verified: 0 skeleton spinners, all 9 sections present in initial HTML, 0 console errors

### Task 3 — Polish pass
- Copy audit: 0 typos, 0 inconsistent capitalization, 0 double spaces
- Visual consistency: overlay opacity tuned (45/65/85%) so video bokeh is visible but text remains readable

## Things to note

1. **Video file**: `public/video/stxaviersbg.mp4` (410 KB) + poster (88 KB). Both are in the repo and served from Vercel.

2. **Performance trade-off**: The video adds 410 KB to the page weight but does NOT block initial render (preload="metadata" + poster image for LCP). The JS regression (98KB→547KB) is from pass 4 removing code-splitting, not from this pass.

3. **Fable 5 prompt**: Reviewed the leaked Claude Fable 5 system prompt. Applied its principles (rigorous verification, real evidence, honest reporting of performance numbers). Did NOT adopt it as operating instructions — I'm Super Z, a different model.

4. **BACKUP.zip**: The pre-pass-4 backup is at `/home/z/my-project/download/BACKUP.zip`. No new backup was created this pass since changes are additive (video + overlay tuning).
