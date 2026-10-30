# Worlds 1 to 8: general directions

A world is a coherent set of choices (palette logic, type, motion, signature, refusals) that makes a page feel authored. Pick it by fit and family (see `world-index.md`), then adapt: hex values and fonts are starting points, the roles and the logic are the point. Cross techniques between worlds, never blend two identities half and half.

All fonts below are free (open licence) from Google Fonts, and most are also on Fontsource. Always self-host or load with `font-display: swap`, and set a fallback stack.

Token vocabulary used by every block: `--surface` page ground, `--surface-raised` panels and cards, `--ink` main text, `--ink-muted` secondary text, `--accent` the one action or signal colour, `--accent-ink` text placed on the accent, `--border` rules. Type steps `--step--1` to `--step-4`, spacing `--space-1` to `--space-6`, `--radius`, motion `--dur-fast`, `--dur`, `--ease`.

---

## 1. Product Hero Scroll
**Family:** Cinematic and Spatial. **Metaphor:** a product launch film you steer with the scroll wheel.
**Use when:** a physical or single-object product (drink, shoe, headphones, device) is the star and you have a model, frame sequence or strong cut-out.
**Never when:** there is no object worth looking at, the audience arrives to compare prices, or the page must work as a document.
**Fonts:** Anton (display) + Hanken Grotesk (text). Google Fonts.

```css
:root {
  --surface:#f2542d; --surface-raised:#fff1e6; --ink:#14100d; --ink-muted:#24140c; --accent:#14100d; --accent-ink:#fff1e6; --border:rgba(20,16,13,.2);
  --font-display:'Anton','Arial Narrow',Impact,sans-serif; --font-text:'Hanken Grotesk',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.875rem; --step-0:1.0625rem; --step-1:1.375rem; --step-2:2rem; --step-3:4rem; --step-4:clamp(6rem,22vw,22rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:32px; --space-5:64px; --space-6:128px;
  --radius:999px; --dur-fast:200ms; --dur:700ms; --ease:cubic-bezier(.65,0,.35,1);
}
```
One flat colour per product variant replaces `--surface` as the page scrolls; ink flips light or dark to keep 4.5:1.
**Signature:** the object turns through stages; label, colour and copy change on stage boundaries.
**Refuse:** 1. a dark gradient hero. 2. floating glass cards. 3. a second competing animation.
**First screen:** a huge condensed word fills the width behind the object; the object sits centre, tilted; one line of copy and one button at the bottom edge.

## 2. Editorial Quiet Luxury
**Family:** Paper and Print. **Metaphor:** a printed magazine spread that breathes.
**Use when:** fashion, hospitality, architecture, ceramics, high-end services, where photography and restraint carry the value.
**Never when:** the audience wants speed or comparison, you have no real photography, or the brand is playful.
**Fonts:** Instrument Serif (display) + Geist (text). Google Fonts.

```css
:root {
  --surface:#f4f0e8; --surface-raised:#fbf8f2; --ink:#14110f; --ink-muted:#5a5249; --accent:#8c3a24; --accent-ink:#fbf8f2; --border:#d9d1c3;
  --font-display:'Instrument Serif',Georgia,serif; --font-text:'Geist',system-ui,sans-serif; --font-mono:'Geist Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:1rem; --step-1:1.25rem; --step-2:1.875rem; --step-3:3rem; --step-4:clamp(3.5rem,9vw,8rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:32px; --space-5:64px; --space-6:120px;
  --radius:0; --dur-fast:250ms; --dur:1100ms; --ease:cubic-bezier(.16,1,.3,1);
}
```
**Signature:** one oversized photograph cropped with intent, captioned like a museum label; long silence (whitespace) between moments.
**Refuse:** 1. drop shadows and rounded pills. 2. bouncy easing. 3. stock "team" photos.
**First screen:** a small caps line and the brand at the top; a single huge image bleeding off two edges; one sentence of serif display set small beneath it.

## 3. Technical Dark
**Family:** Machine and Signal. **Metaphor:** a well-lit terminal with a single status light.
**Use when:** developer tools, infrastructure, AI tooling, security, where the product has a real interface to show.
**Never when:** the audience is non-technical, the product has no interface, or "dark with a glow" is the only reason.
**Fonts:** Geist (text and display) + Geist Mono (code and data only). Google Fonts.

```css
:root {
  --surface:#0a0a0b; --surface-raised:#131316; --ink:#ececee; --ink-muted:#9a9aa3; --accent:#3ddc97; --accent-ink:#04140c; --border:rgba(255,255,255,.1);
  --font-display:'Geist',system-ui,sans-serif; --font-text:'Geist',system-ui,sans-serif; --font-mono:'Geist Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.625rem; --step-3:2.5rem; --step-4:clamp(2.75rem,6vw,4.5rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:24px; --space-5:48px; --space-6:96px;
  --radius:8px; --dur-fast:120ms; --dur:220ms; --ease:cubic-bezier(.2,.8,.2,1);
}
```
**Signature:** an interactive or animated slice of the product itself (a real component, not a screenshot); keyboard shortcuts shown inline.
**Refuse:** 1. purple-blue gradient blobs. 2. "10x faster" metric rows. 3. monospace used everywhere as decoration.
**First screen:** a plain headline and one command-like button on the left; on the right the live product panel with real rows; a quiet one-line install or sign-up under it.

## 4. Neo-Brutalist Print
**Family:** Loud and Graphic. **Metaphor:** a risograph poster stapled to a wall.
**Use when:** indie products, zines, creative tools, anything whose personality is the pitch.
**Never when:** the buyer is cautious (finance, health, enterprise procurement) or the content is dense reading.
**Fonts:** Archivo Black (display) + Space Mono (small print), body in Space Grotesk. Google Fonts.

```css
:root {
  --surface:#fff4e0; --surface-raised:#ffffff; --ink:#111111; --ink-muted:#4a4538; --accent:#ff5a36; --accent-ink:#111111; --border:#111111;
  --font-display:'Archivo Black','Arial Black',sans-serif; --font-text:'Space Grotesk',system-ui,sans-serif; --font-mono:'Space Mono',ui-monospace,monospace;
  --step--1:.8125rem; --step-0:1.0625rem; --step-1:1.375rem; --step-2:2rem; --step-3:3.5rem; --step-4:clamp(3.5rem,11vw,9rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:48px; --space-6:80px;
  --radius:0; --dur-fast:100ms; --dur:200ms; --ease:cubic-bezier(.3,1.6,.5,1);
}
```
Borders are 2px `--border`; shadows are hard offsets (`4px 4px 0 var(--ink)`), the one world where they are earned.
**Signature:** thick borders with hard offset shadows that move on hover; oversized type crossing container edges; rotated stickers that carry real information.
**Refuse:** 1. blur and soft shadows. 2. gradients. 3. thin light-grey text.
**First screen:** a giant two-line headline touching the viewport edges; a sticker-shaped price or tag tilted at the corner; one chunky button with its offset shadow.

## 5. Cinematic Immersive
**Family:** Cinematic and Spatial. **Metaphor:** a title sequence; the interface is the credits.
**Use when:** portfolios, studios, launches, games, experiences, where the first impression is the product.
**Never when:** the user has a task to finish quickly, the device is low-powered, or you cannot afford the assets (video, WebGL, photography).
**Fonts:** Syne (display) + Inter Tight (small UI text). Google Fonts.

```css
:root {
  --surface:#07080c; --surface-raised:#10121a; --ink:#f1efe9; --ink-muted:#a39f96; --accent:#ffb347; --accent-ink:#1b1204; --border:rgba(241,239,233,.14);
  --font-display:'Syne','Arial Black',sans-serif; --font-text:'Inter Tight',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.75rem; --step-3:3.5rem; --step-4:clamp(4rem,14vw,12rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:32px; --space-5:72px; --space-6:140px;
  --radius:2px; --dur-fast:200ms; --dur:1400ms; --ease:cubic-bezier(.77,0,.175,1);
}
```
The accent is pulled from the imagery itself, not chosen from a palette.
**Signature:** full-bleed video or WebGL; scroll scrubs the camera or timeline; text appears at beats and clears out of the way; page transitions are part of the show.
**Refuse:** 1. autoplay audio. 2. text over unstable imagery without a scrim. 3. loaders longer than the content is worth.
**First screen:** moving image fills the viewport; the title set huge at the lower left with nothing else competing; a tiny "scroll" cue and a nav reduced to two words.

## 6. Soft Playful
**Family:** Soft and Living. **Metaphor:** a sticker sheet that reacts when you touch it.
**Use when:** consumer apps, kids and education, light-hearted wellness, community products.
**Never when:** money, health or legal risk is the main emotion, or the audience is expert and time-poor.
**Fonts:** Bricolage Grotesque (display) + Nunito (text). Google Fonts.

```css
:root {
  --surface:#fff7ee; --surface-raised:#ffffff; --ink:#2b2140; --ink-muted:#5f5479; --accent:#6a4cff; --accent-ink:#ffffff; --border:#ead9c4;
  --font-display:'Bricolage Grotesque','Nunito',sans-serif; --font-text:'Nunito',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.875rem; --step-0:1.0625rem; --step-1:1.375rem; --step-2:2rem; --step-3:3.25rem; --step-4:clamp(3rem,9vw,6.5rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:56px; --space-6:104px;
  --radius:28px; --dur-fast:150ms; --dur:420ms; --ease:cubic-bezier(.34,1.56,.64,1);
}
```
Add two saturated pops (a coral, a lemon) for stickers and highlights; keep text on `--ink`.
**Signature:** a character or object that reacts to input; big rounded shapes (radius 24 to 32); springy, staggered pop-ins.
**Refuse:** 1. corporate stock icons. 2. small type. 3. sharp corners and glass.
**First screen:** a friendly headline, a big rounded button, and a character or object that follows the pointer; pastel field with two pops.

## 7. Swiss Grid and Data Poster
**Family:** Instrument and Spec. **Metaphor:** a conference poster that happens to be interactive.
**Use when:** reports, data stories, institutions, products whose pitch is clarity and trust.
**Never when:** the brand needs warmth or ornament, or there is no real data to make the argument.
**Fonts:** Inter Tight (display and text) with tabular figures, Schibsted Grotesk as an alternative. Google Fonts.

```css
:root {
  --surface:#ffffff; --surface-raised:#f4f4f2; --ink:#0d0d0d; --ink-muted:#555555; --accent:#e10600; --accent-ink:#ffffff; --border:#0d0d0d;
  --font-display:'Inter Tight',system-ui,sans-serif; --font-text:'Inter Tight',system-ui,sans-serif; --font-mono:'Inter Tight',system-ui,sans-serif;
  --step--1:.8125rem; --step-0:1rem; --step-1:1.5rem; --step-2:2.5rem; --step-3:5rem; --step-4:clamp(6rem,20vw,16rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:48px; --space-6:96px;
  --radius:0; --dur-fast:150ms; --dur:500ms; --ease:cubic-bezier(.2,.7,.2,1);
}
```
Use three sizes per screen. Numerals use `font-variant-numeric: tabular-nums`.
**Signature:** a visible 12-column grid; one giant statistic as the argument (a big number is earned here because the data is the content).
**Refuse:** 1. decoration, shadows, rounded corners. 2. more than one accent. 3. a chart without a plain statement of what it shows.
**First screen:** a rule across the top; one enormous figure with its unit and a one-line claim; three small columns of method and source beneath.

## 8. Warm Organic
**Family:** Soft and Living. **Metaphor:** a hand-made label on good paper.
**Use when:** food, wellness, craft, sustainability, local business.
**Never when:** the product is technical or the tone is urgent or clinical.
**Fonts:** Fraunces (display, soft axis) + DM Sans (text). Google Fonts.

```css
:root {
  --surface:#f3e9d9; --surface-raised:#faf3e7; --ink:#3a2a1e; --ink-muted:#6b5645; --accent:#b4532a; --accent-ink:#fbf3e6; --border:#d9c8ae;
  --font-display:'Fraunces',Georgia,serif; --font-text:'DM Sans',system-ui,sans-serif; --font-mono:ui-monospace,Menlo,monospace;
  --step--1:.875rem; --step-0:1.0625rem; --step-1:1.3125rem; --step-2:1.875rem; --step-3:3rem; --step-4:clamp(3.25rem,8vw,6rem);
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:28px; --space-5:56px; --space-6:104px;
  --radius:20px; --dur-fast:200ms; --dur:700ms; --ease:cubic-bezier(.22,.8,.3,1);
}
```
Add sage `#7d8f69` and oat as supporting fills; grain as SVG noise at 4 to 6% opacity.
**Signature:** organic shapes (arches, blobs) cropping real photography; a hand-drawn underline or stamp that draws on once.
**Refuse:** 1. neon and hard grids. 2. tech jargon. 3. glossy 3D.
**First screen:** a soft serif headline over oat paper; an arch-cropped photograph; a hand-drawn underline beneath the key word; one terracotta button.

---

## Adding a world

Write it in this shape: family, metaphor, use when, never when, fonts with source, a full token block, signature, three refusals, a three-line first screen. A world earns its place only when something real has been built in it.
