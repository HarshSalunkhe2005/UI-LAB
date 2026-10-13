# Inspiration: how to take it without copying it

Good designers don't "have taste" in the abstract. They look at a lot of real work, name *why* it works, and recombine.
This is that process, written so an agent can run it.

## Where to look

Start with the curated list: [`/resources.md`](../resources.md) (galleries, award-level studios, Codrops demo repos, libraries).
Pick by the brief's **mode**, not by what is fashionable:

- Persuade / product: Awwwards, Godly, Lapa, Land-book, brand microsites for physical products (drinks, shoes, audio, cars).
- Operate / app: Linear, Vercel, Stripe, Raycast, Mercury, Arc. Study density, states and empty screens.
- Read: Stripe docs, Tailwind docs, Are.na, long-form editorial (The Pudding, NYT interactive).
- Experience: Active Theory, Locomotive, Resn, Bruno Simon-style portfolios, Codrops tutorials.

Search with the **content**, not "cool website": "beverage product scroll 3D", "architecture studio portfolio", "fintech dashboard dark".

## The teardown (one per reference, 10 minutes)

Open it in the browser and do all of these, in this order:

1. **First viewport, no scroll.** What is the largest thing? What is the second? What is the one verb the page wants?
2. **Scroll slowly through the whole page.** Note every moment where something *changes*: what triggers it, how long it lasts, what it replaces.
3. **Identify the signature moment.** One sentence. If you can't, it has none (not a good reference).
4. **Find the stack.** Run `node tools/site-stack.mjs <url>` (detects GSAP, ScrollTrigger, Lenis, three.js, Framer Motion, Locomotive,
   Rive, Lottie, Spline, WebGL canvas). In DevTools: Network (is the hero a video, a GLB, an image sequence?), Elements
   (is the sticky section `position: sticky` or a pin spacer?), Performance (is it scroll-linked or time-based?).
5. **Type and colour.** Read computed font families and sizes of the display and body. Sample 4-5 colours and decide the *role* of each.
6. **Pacing.** Time the entrances. Is easing exponential-out? Are durations ~0.6-1.2 s? Is there a stagger? Is there *stillness* between moments?
7. **What it does not do.** Often the lesson. (No nav clutter, no cards, no stock photos.)

Write the result as five lines:

```
Reference: <url>
Idea:      one sentence
Technique: stack + how the signature moment is built
Palette/Type: roles and faces
Take / Leave: what I will adapt, what I will not
```

## Synthesis (this is the creative step)

Do not average the references. **Cross them:**

- *Structure from one* (e.g. pinned scroll stages), *palette logic from another* (one flat colour per variant),
  *type attitude from a third* (condensed display in huge scale behind the object).
- Ask: what does the brief have that none of the references have? Make **that** the centre.
- Apply the **tension test**: name one deliberate unexpected pairing. If there is none, the result will be forgettable.
- Apply the **swap test**: replace the brand name with a competitor's. If nothing needs to change, the design is generic. Redo it.

## What is allowed and what is not

Allowed: re-implementing a *technique* (pinned scroll, magnetic cursor, text mask reveals, palette tween) in your own code, with your own
content, assets, layout and palette.

Not allowed: copying source, copy text, brand assets, images, 3D models without a licence, or reproducing a site's distinctive layout 1:1.
Teardowns in `RESOURCES.md` describe techniques only. Licences for models: prefer CC0 (Quaternius, Khronos samples, Poly Pizza).

## Using UI Lab as the parts bin

After the direction card exists, look things up instead of improvising:

1. `GET /patterns.json`, filter by `category` and `tags` that match the moment you need (`scroll`, `3d`, `text`, `cursor`, `shader`, `marquee`...).
2. `GET /docs/<slug>.md`: metadata, "when to use", accessibility notes and the full source.
3. Adapt to the world's tokens. Keep the pattern's `prefers-reduced-motion` handling.
4. Whole-site starting points are the **Sites** category (`site-solar`, `site-mare`, `site-lattice`, `site-hotmess`, `site-abyss`); `/docs/site-<name>.md` has every file.

## Building your own taste log

When you finish a project, add what you learned to this playbook (a new world, a bug in the catalogue, a technique
in a recipe). The library only gets better if each project leaves it a little smarter than it found it.

## Teardown field notes (from the fifty-site study, 2026-10-14)

Things that cost time and how to avoid them:

- **Measure, don't squint.** A 30-line probe run in the page (computed `font-family` and size of the visible text, the most common background colours, counts of `canvas`, `video`, `position: sticky`, `backdrop-filter`, `mask-image`, `clip-path`, `mix-blend-mode`, running `animation-name`) gave better facts in seconds than screenshots did. Keep the probe; paste it into each page.
- **The stack scan can lie.** `tools/site-stack.mjs` matches words, so a site that merely contains the string "rapier" or "barba" gets flagged. Treat its output as a lead and confirm in DevTools (for Lenis: look for the `lenis` class on `<html>`).
- **Canvas-only and WebGL2-only sites hide from the DOM.** Bruno Simon and Resn have almost no DOM text at load; Igloo shows its own "WebGL2 is not supported" notice in the built-in browser pane. Record those as *partial* instead of guessing what the scene looks like.
- **Heavy WebGL pages time out screenshots in a software-rendered pane.** Use the computed-style probe instead, and take a screenshot only for light pages.
- **Bot walls.** Some sites (Locomotive, Aesop) answer with a Cloudflare security check. Do not try to bypass it; swap in another reference and note why.
- **Template galleries show their popularity.** v0's template pages list two counts per template; sorting by them gives an objective "most used" list for vibe-coded UIs. Previews often need a sign-in, so describe from the listing and mark it *listing*.
- **Don't let the tool think for you.** The most useful lines were the plain ones: "one font size on the whole site" (Are.na, Emil Kowalski), "720px headings" (Rauno), "the hero is the class list" (Tailwind).
