# Start here: how to design a frontend that doesn't look generic

This is the operating procedure for any agent (or human) building a website or UI with UI Lab.
The patterns in this library are the *parts*. This document is the *judgement* that decides which parts, why, and how to
know the result is good. Follow it in order. Do not open an editor before step 3.

## Why output usually comes out "mid"

Four causes, in order of impact:

1. **No target.** "Make it premium" has no content. The model falls back to the average of everything it has seen:
   dark gradient, glass cards, Inter, fade-in-up on every section.
2. **No signature moment.** Premium sites are built around one idea (a product that spins, a number that counts the
   page's argument, a cursor that carries the brand). Everything else supports it. Without one, you get a pile of sections.
3. **No assets.** The impressive sites run on a model, a frame sequence, a video, real photography, an illustration
   system. Gradient blobs are what you get instead.
4. **No verification.** Scroll, 3D and motion code breaks in ways reading it never reveals. If the result was never
   rendered, scrolled and screenshotted, it is probably broken.

The procedure below attacks each of these.

## The procedure

### 1. Brief (5 lines, written down)

Write these before anything else. If you can't, ask the user one sharp question; do not guess a whole site.

- **Who** visits, **where** (laptop at a desk, phone on a train), **in what mood**.
- **Mode** (what success looks like for the visitor):
  - *Persuade*: they decide and act (landing, product, campaign). Design is the product.
  - *Operate*: they finish a task (app, dashboard, admin). Scannability and consistency beat expression.
  - *Read*: they understand something (docs, article). Structure for comprehension first.
  - *Experience*: they are inside the work (portfolio, showcase). The artifact leads, the UI recedes.
- **The one memorable moment** (Persuade/Experience). One sentence. "The can spins while features change colour."
- **Real content.** Actual copy, numbers, names. Invent plausible ones if missing and flag them as placeholders.
- **Constraints**: stack, deadline, devices, brand assets, things the user already said they hate.

### 2. Inspiration (real, not remembered)

Start with UI Lab's own five finished sites (category **Sites**: `site-solar`, `site-mare`, `site-lattice`, `site-hotmess`, `site-abyss`; open each full screen from its pattern page): each is a different world with a different signature moment, so you can see what "committed" looks like before studying outside references.

Never design from memory of what "good" looks like. Go look. See [inspiration.md](inspiration.md) for the method.
Minimum: three references, one teardown each. Output is a short note per reference:

- the single idea that makes it work
- what is technically happening (run `tools/site-stack.mjs <url>`; open DevTools; scroll it slowly)
- type, palette logic, motion pacing
- what you will take, and what you will deliberately not

Then **synthesize**: the move from A, the palette logic from B, the type attitude from C, all rebuilt around *this*
product's content. Never copy code, copy text, brand assets or exact layouts. Re-implement the technique.

### 3. Commit to a world

Pick or invent a direction from [worlds.md](worlds.md) and write a **direction card** (6 lines):

```
Name:        e.g. "Solar" - saturated flat colour that changes per product
Metaphor:    what it feels like, in one image
Palette:     5 tokens max, with roles (bg, fg, accent, support, danger)
Type:        display face + body face, both self-hosted (Fontsource), never a system fallback as the voice
Motion:      one language (e.g. scrubbed, weighty, exponential ease-out) used everywhere
Signature:   the one moment, and what it needs (asset, library)
Refuse:      3 things this world must never contain
```

Rules: the brief wins over taste. When torn between "refined" and "committed", commit. One unexpected tension
(a serif in a tech product, a hard shadow in a soft world) beats five safe choices.

### 4. Assets before code

The signature moment dictates the asset. Decide *now*:

| Moment | Asset | Fallback |
|---|---|---|
| Spinning product | GLB model, or a rendered frame sequence | Build it procedurally in three.js (see `site-solar`) |
| Cinematic hero | Short looped video (< 4 MB, muted, poster frame) | Shader background from the Backgrounds category |
| Character / mascot | Rigged GLB (CC0: Quaternius, Khronos samples) | Pattern from "3D Motion" |
| Editorial feel | Real photography | Ask the user; never grey placeholder boxes in the final |
| Data story | The real numbers | Plausible, labelled as sample |

Do not ship decorative stand-ins (blurred orbs, mesh gradients) *as* the signature. Atmosphere is fine; the hero is not atmosphere.

### 5. Build a vertical slice first

Make the signature moment work end to end (asset, motion, scroll, responsive) **before** building the other sections.
If it doesn't work, the rest doesn't matter. Then build outward. Pull parts from UI Lab: search
[`/patterns.json`](../patterns.json) by `tags` and `category`, fetch `/docs/<slug>.md`, copy `tokens.css` first.

Architecture defaults:

- Vite + React + TypeScript. Tailwind only if the project already has it; plain CSS with custom properties is fine.
- Scroll-driven sites: **GSAP ScrollTrigger + Lenis**, one master timeline. See [scroll-3d-recipe.md](scroll-3d-recipe.md).
- 3D: **React Three Fiber + drei**. Mutable state object read in `useFrame`; never `setState` per scroll tick.
- Fonts: Fontsource packages, self-hosted. Preload nothing exotic. Wait for `document.fonts.load()` before drawing canvas text.

### 6. Verify (bounded, batched, honest)

See [verify.md](verify.md). In short: build once fully, then one batched inspection round (desktop + mobile, scrolled to every
section, console clean, reduced-motion on), fix everything it shows in one batch, one confirming round, stop.
Report what was and was not tested. Never say "works" for something you did not render.

### 7. Handoff

State the URL to open, what is verified, what is untested (mobile? real GPU? Safari?), what is placeholder, and the
two or three things you would do next. Short.

## The craft floor (non-negotiable mechanics)

- Contrast: body >= 4.5:1, large >= 3:1. On coloured surfaces tint secondary text from the hue, not grey.
- Type: body 65-75ch; display sizes clamp(); tight tracking only on display; balanced headings; real copy at every width.
- Spacing: tight inside groups, generous between; more above a heading than below.
- Motion: one authored moment plus consistent small ones. Exponential ease-out from a visible default. Honour `prefers-reduced-motion`.
- States: hover, focus-visible, disabled, loading, empty, error. Keyboard reaches everything.
- Touch targets >= 44px. `100svh` not `100vh`. No horizontal scroll at 375px.
- Browser surfaces are part of the design: `::selection`, scrollbar, caret, focus ring, `tabular-nums` on data.
- Copy: product's own voice. Buttons name their action. Errors name problem and fix.

## Reflexes to refuse (unless the brief earns them)

- Grids of identical icon + heading + text cards as the page structure. Nested cards, always.
- The hero-metric block (big number, small label, three of them in a row) as filler.
- Eyebrow/kicker labels above headings. Numbered sections (01/02/03) that carry no information.
- Gradient text. Glass/blur as decoration. Coloured `border-left` accents. Hard offset shadows outside a neo-brutalist world.
- Emoji or unicode glyphs as icons. Draw SVG or use one real icon set at one stroke weight.
- A system font as the display voice. `Inter` everywhere by default.
- Fade-up-on-scroll applied identically to every block.
- Light vs dark chosen by category ("tech = dark"). Choose from the use scene.

## How to think when the brief is thin

Ask, in this order, and write one line for each:

1. What is this page's *argument*? (What should the visitor believe after 20 seconds?)
2. What is the most *specific* thing about this product that no competitor could claim? Build the page around it.
3. What would this look like if it could **only** exist for this product? Delete anything that fits any product.
4. Where does the visitor's attention need to go first, second, third? Make size, contrast and motion agree with that order.
5. What is the one thing I'd be embarrassed to ship? Fix that before polishing anything else.
