# Verify: the loop that stops "mid and buggy"

Code that was never rendered is a guess. Motion, scroll and WebGL code is wrong in ways only a browser reveals.
The loop is **bounded**: it is not an invitation to polish forever.

## The loop

1. **Build fully** (vertical slice first, then the rest). Typecheck and build must pass.
2. **Start the dev server** and open it in a real browser (Claude: the Browser pane, `preview_start` with a URL).
3. **One batched inspection round.** In a single pass, do all of:
   - Load fresh. Wait for the splash/loader to clear. Console: zero errors, read warnings.
   - Scroll to *every section* by position (`window.scrollTo`) and screenshot each. Include both ends of every pinned/scrubbed zone.
   - Desktop (1440x900) **and** phone (375x812, `resize_window` mobile preset; reload after switching).
   - `prefers-reduced-motion` on: page still readable and operable.
   - Keyboard: Tab through; focus ring visible everywhere; nothing trapped.
   - Resize narrow/wide once; look for overflow and overlap.
4. **Fix everything it showed in one batch.** Don't fix-and-reshoot one thing at a time.
5. **One confirming round.** Then stop.
6. **Report honestly**: what you rendered, at what sizes, what you could not test (real GPU, Safari, touch hardware).

## Environment caveats

- The built-in browser pane renders WebGL in software. First load of a 3D scene can take 10+ seconds and frame rate is low.
  Smoothed values (damping, scrub) will look mid-transition in a screenshot taken too soon. Wait, then screenshot.
  Don't "fix" slowness that is the test environment; do keep first-paint cheap (code-split three.js, show a loader).
- A jump-scroll (`scrollTo`) is not the same as a wheel scroll with smooth-scroll libraries. Both should land correctly.

## Bug catalogue (all found and fixed while building the `site-*` patterns)

Check for these first; they cost hours when found late.

| Symptom | Cause | Fix |
|---|---|---|
| Page loads already showing the *last* section's colours/state | `gsap.fromTo` in a timeline renders its start values immediately, in creation order, so the last tween wins | `timeline({ defaults: { immediateRender: false } })` and make defaults match the hero state |
| Palette/state drifts out of sync with the scroll position | Timeline total length is shorter than the scrollable distance, so progress is scaled | Pad the timeline to exactly the scroll length (`tl.set({}, {}, scrollHeight - innerHeight)`) and use 1 time-unit = 1 px of scroll |
| Animation fires at the wrong scroll offset for nested elements | `offsetTop` is relative to the nearest *positioned* ancestor | Use `getBoundingClientRect().top + scrollY` |
| Label/text swaps at a different moment than the colour change | `Math.round(progress)` vs `Math.floor` boundaries | Pick one rule; make colour tween centre on the same boundary |
| Plain untextured model flashes before the real texture | Material compiled without a map, map assigned later, recompile stalls | Don't render the object until its textures exist; create material with the map from the start; swap maps (same shader define) afterwards |
| `Cannot read properties of null (reading 'position')` in `useFrame` | Frame loop runs before the conditionally-rendered mesh mounts | `if (!ref.current) return` at the top of `useFrame` |
| Text drawn into a canvas texture uses the fallback font | Fonts not loaded when the canvas was painted | `await document.fonts.load('100px "Face"')` before drawing |
| Canvas text mirrored/offset on a cylinder | Cylinder UV seam is at the front by default | `texture.wrapS = RepeatWrapping; texture.offset.x = 0.5` |
| Scroll feels floaty, anchors jump | Smooth-scroll lib not wired to GSAP's ticker; anchor links bypass it | `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`, `new Lenis({ anchors: true })` |
| Everything repaints on every scroll frame | A CSS variable on `<html>` is tweened and read by the whole tree | Acceptable on desktop; for heavy pages tween a single background layer's colour instead |
| Mobile: layout jumps when the URL bar hides | `100vh` | `100svh` |
| Pinned section is too short/long | Track height in `vh` doesn't match tween distance | Track = (stages x N vh); tween duration = track height minus one viewport |
| `React.StrictMode` double-mount breaks WebGL | Calling `WEBGL_lose_context` in cleanup | Don't; let R3F dispose |
| A full-page demo embedded in a host SPA leaks styles or breaks routing | Global selectors (`html`, `body`, `*`, `:root`), shared class names, `href="#id"` anchors in a hash-routed host | Scope CSS under a wrapper class (`tools/scope-css.py`), rename colliding classes, handle anchor clicks in JS, put variables and classes on the wrapper, not `<html>` |
| A heavy route (WebGL) shows a tiny or black snapshot after navigating | The host's View Transition morph hangs while the first render blocks the main thread | Skip the transition for routes into and out of full-screen demos |
| `Invalid hook call` / two Reacts after adding deps in dev | Vite's pre-bundled dependency cache is stale | Stop the dev server, delete `node_modules/.vite`, restart |
| Sticky or pinned sections stop working inside the wrapper | `overflow-x: hidden` on an ancestor makes it a scroll container | Use `overflow-x: clip` |
| `scrollIntoView` as effect body returns a Promise | Newer Chromium | Wrap in braces so the effect returns nothing |

## Smoke checklist (copy into the final report)

```
[ ] build + typecheck pass
[ ] console clean on fresh load
[ ] every section screenshotted at 1440 and 375
[ ] no horizontal scroll at 375
[ ] reduced-motion usable
[ ] keyboard: focus visible, reachable
[ ] first paint fast; heavy chunks code-split; loader shown
[ ] untested: ______ (be specific)
```
