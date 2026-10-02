# Recipe: scroll-driven 3D product site

The architecture behind the `site-solar` pattern (a spinning soda can that changes label, colour and copy as you scroll).
Reuse it for any "object + stages" page. Full working code: `src/patterns/sites/solar/` (or `/docs/site-solar.md`).

## The idea in one paragraph

A fixed, transparent WebGL canvas sits above a coloured background layer and below the page text. The page is ordinary
HTML sections. **One GSAP timeline, scrubbed by the whole page's scroll, writes into a plain mutable object** (`rig`:
position, scale, rotation, flavor index). The R3F `useFrame` loop reads that object and damps toward it. CSS variables on `<html>`
carry the palette; one `data-flavor` attribute drives all text swaps in CSS. React never re-renders while scrolling.

```
scroll ──▶ GSAP timeline (1 time unit = 1 px) ──▶ rig {x,y,s,rx,ry,rz,flavor} ──▶ useFrame (damp) ──▶ mesh
                         └──▶ --bg / --fg on <html> ──▶ background layer + text colour
rig.flavor ──▶ ticker callback ──▶ <html data-flavor="n"> ──▶ CSS swaps giant word, copy, dots
```

## Files (in `src/patterns/sites/solar/`)

| File | Job |
|---|---|
| `src/rig.ts` | The mutable state objects (`rig`, `intro`, `pointer`). No React. |
| `src/flavors.ts` | Content + palette per stage. The only file you edit to rebrand. |
| `src/label.ts` | Paints a texture to a `<canvas>` (sunburst, waves, brand, citrus), returns a `CanvasTexture`. |
| `src/Scene.tsx` | R3F canvas, procedural can (cylinder + lathe caps + pull tab), env lighting, sparkles, frame loop. |
| `src/App.tsx` | Lenis + master timeline + reveal/count-up triggers + page markup. |
| `src/styles.css` | Layout, giant words, sticky stage, data-attribute swaps, marquee, responsive, reduced motion. |

## Steps to adapt

1. **Content:** edit `flavors.ts` (stage names, copy, `bg`, `fg`, label colours). Rename the brand in `label.ts` and `App.tsx`.
2. **Object:** replace the can in `Scene.tsx` with a `useGLTF` model (keep the group + `rig` mapping), or keep it procedural.
   If you load a GLB: `useGLTF.preload`, wrap in `<Suspense>`, call `onReady` after first render so the loader clears.
3. **Stages:** the pinned `.flavors` section is `height: (N+2) * 100svh`; inside is a `position: sticky; height: 100svh` stage.
   The tween over it has duration `section.offsetHeight - innerHeight`. Stage `i` starts at `seg * i` where `seg = duration / N`.
4. **Choreography:** each section gets its own `tl.to(rig, {...}, startPx)`. Express X in *fractions of half the viewport width*
   (so it works at any width); scale in units relative to `min(viewport.height/5, viewport.width/2.3)`.
5. **Responsive:** below aspect 0.9 the can centres (`x = 0`) and the layout stacks; text sits bottom. Test at 375px.

## Rules that make it feel premium

- The object is the only thing allowed to be 3D-fancy. Text is flat, huge and confident.
- Background word sits *behind* the canvas at ~16% opacity; foreground copy sits *above* it. That layering is most of the look.
- Colour changes happen over ~24% of a stage and are centred on the stage boundary. Label swaps at the same moment.
- Idle life: tiny sine bob, pointer tilt (damped), a few sparkles. Never more.
- Intro plays only after the first frame renders (loader clears on `onReady`), so the entrance is seen, not missed.
- Environment lighting uses `<Lightformer>`s inside `<Environment>` (no network HDR): big top softbox, two side strips, rim ring, low fill.
  Metal reads as metal because of those strips. Don't remove them.

## Performance

- `React.lazy(() => import('./Scene'))` keeps three.js out of the first bundle (~1 MB). Show a splash until `onReady`.
- `dpr={[1, 2]}`, `powerPreference: 'high-performance'`, one physical material, 96-128 radial segments is plenty.
- Only one tweened CSS variable pair on `<html>`; if style recalc gets heavy, move the colour to a single fixed background element.
- Honour `prefers-reduced-motion`: no Lenis, no sparkles, zero-duration intro. Scroll-linked movement is user-driven and may stay.

## Gotchas (see also verify.md)

`immediateRender: false` on the timeline; pad the timeline to the scroll length; use bounding rects not `offsetTop`; `floor` not `round`
for stage index; don't render the mesh until textures exist; guard `useFrame` against null refs; `await document.fonts.load()`
before painting canvas text; `new Lenis({ anchors: true })` so nav links work.
