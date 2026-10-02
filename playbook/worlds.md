# Worlds: design directions to start from

A *world* is a coherent set of choices (palette logic, type, motion, signature moves, refusals) that makes a site feel
authored. Pick one that fits the brief, or invent a new one and add it here. Don't blend two worlds half and half; cross
*techniques*, keep one world's identity.

Fonts below are Fontsource packages (`npm i @fontsource/<name>` or `@fontsource-variable/<name>`).
Hex values are starting points; shift them to the brand, keep the **roles**.

---

## 1. Product Hero Scroll
**Proof:** pattern `site-solar`.
**Use for:** a physical product (drink, shoe, headphones, car) where the object is the star.
**Metaphor:** a product launch film you control with the scroll wheel.
**Palette:** one **flat saturated colour per variant**, tweened as the visitor scrolls; ink that flips light/dark per variant. Support: cream, near-black.
**Type:** condensed display at enormous scale *behind* the object (Anton, Bebas Neue, Oswald), grotesk body (Bricolage Grotesque, Hanken Grotesk).
**Motion:** scrubbed, weighty, linear where the object spins, `power2.inOut` for position moves; text swaps by state attribute, not per-frame.
**Signature:** the object rotates through stages; label, colour and copy change on stage boundaries.
**Needs:** a model or frame sequence. See `site-solar`.
**Refuse:** dark-gradient hero, floating glass cards, lifestyle stock photos, a second competing animation.

## 2. Editorial Quiet Luxury
**Proof:** pattern `site-mare`.
**Use for:** fashion, hospitality, architecture, ceramics, high-end services.
**Metaphor:** a printed magazine spread that breathes.
**Palette:** warm off-white `#f4f0e8`, ink `#14110f`, **one** muted accent (clay, oxblood, moss). No gradients.
**Type:** high-contrast serif display (Instrument Serif, Cormorant, Fraunces) with a precise sans (Geist, Hanken Grotesk). Generous leading, hairline rules.
**Motion:** slow (0.9-1.4 s), exponential ease-out, image mask reveals, gentle parallax <= 8%. Silence between moments.
**Signature:** one oversized photograph cropped with intent, a caption set like a museum label.
**Needs:** real photography.
**Refuse:** drop shadows, rounded pills, emoji, bouncy easing, stock "team" photos.

## 3. Technical Dark / Dev Tool
**Proof:** pattern `site-lattice`.
**Use for:** developer products, infra, AI tooling, security.
**Metaphor:** a well-lit terminal with a single status light.
**Palette:** near-black `#0a0a0b`, surfaces `#111113`/`#17171a`, 1px borders `rgba(255,255,255,.08)`, **one** accent used sparingly (signal green, electric blue, amber).
**Type:** Geist or Inter Tight for UI, **Geist Mono / JetBrains Mono for real code and data only**.
**Motion:** short (0.15-0.3 s), tight easing, subtle glow/gradient border on hover, live product UI as the hero (an actual component, not a screenshot).
**Signature:** an interactive or animated slice of the product itself; command palette; keyboard shortcuts shown.
**Refuse:** purple-blue gradient blobs, "10x faster" metric rows, monospace everywhere as decoration.

## 4. Neo-Brutalist Print
**Proof:** pattern `site-hotmess`.
**Use for:** indie products, zines, creative tools, anything with attitude.
**Metaphor:** a risograph poster stapled to a wall.
**Palette:** cream `#fff4e0`, black, 2-3 acid colours (tomato, lemon, mint, cobalt). Flat only.
**Type:** heavy grotesk or slab (Archivo Black, Space Grotesk, Bowlby One) + a mono for small print (Space Mono).
**Motion:** snappy, slight overshoot allowed, marquees, rotated stickers, hover that moves the offset shadow.
**Signature:** thick 2px borders with **hard offset shadows** (this is the one world where they are earned), oversized type crossing boundaries.
**Refuse:** blur, soft shadows, gradients, thin light-grey text.

## 5. Cinematic Immersive
**Proof:** pattern `site-abyss`.
**Use for:** portfolios, studios, launches, games, experiences.
**Metaphor:** a title sequence; the interface is the credits.
**Palette:** deep neutral or colour-graded dark, one luminous accent from the imagery itself.
**Type:** a confident display (Syne, Unbounded, Fraunces, Inter Tight at huge scale) with tiny, quiet UI text.
**Motion:** full-bleed WebGL/video, scroll scrubs the camera or timeline, text appears at beats and gets out of the way. Page transitions are part of the show.
**Signature:** a camera path, shader transition or physical simulation that responds to the pointer.
**Needs:** strong assets and a perf budget (code-split three.js, loader, lower DPR on weak GPUs).
**Refuse:** nav bars with 7 links, long paragraphs over moving imagery, effects that don't serve the story.

## 6. Soft Playful
**Use for:** consumer apps, kids/education, wellness with humour, community products.
**Metaphor:** a sticker sheet that reacts when you touch it.
**Palette:** pastel field + 2 saturated pops; generous white space; friendly dark ink (not pure black).
**Type:** rounded or quirky sans (Bricolage Grotesque, Fredoka, Nunito) with one characterful display accent.
**Motion:** springy (stiffness ~200, damping ~18), squash/stretch on press, staggered pop-ins, cursor-reactive mascots.
**Signature:** a character or object that reacts to input; big rounded shapes (radius 24-32).
**Refuse:** corporate stock icons, tiny type, sharp corners, glass.

## 7. Swiss Grid / Data Poster
**Use for:** reports, data stories, institutions, products whose pitch is clarity.
**Metaphor:** a conference poster that happens to be interactive.
**Palette:** white or paper, black, **one** hard accent (signal red or international blue).
**Type:** neo-grotesk (Inter Tight, Hanken Grotesk, Schibsted Grotesk) in 3 sizes only; huge numerals; tabular figures.
**Motion:** minimal. Number counters, line draw on charts, section rules that extend on enter.
**Signature:** a strict 12-column grid made visible; one giant statistic as the page's argument (here a big number *is* earned, because the data is the content).
**Refuse:** decoration, shadows, rounded corners, more than one accent.

## 8. Warm Organic
**Use for:** food, wellness, craft, sustainability, local business.
**Metaphor:** a hand-made label on good paper.
**Palette:** earth tones (terracotta, sage, oat, deep brown), subtle grain (SVG noise, 4-6% opacity).
**Type:** soft serif display (Fraunces with soft/wonk axes, Young Serif) + humanist sans.
**Motion:** gentle float, slow parallax, arch/blob masks on imagery, hand-drawn SVG line animation.
**Signature:** organic shapes cropping real photography; a hand-drawn underline/stamp that draws on.
**Refuse:** neon, hard grids, tech jargon, glossy 3D.

---

## Adding a world

Copy the shape above (Use for / Metaphor / Palette / Type / Motion / Signature / Needs / Refuse). A world is only
real if you've shipped something in it. Link the project or pattern that proves it (worlds 6 to 8 are still unproven: build one before trusting the card).

## Choosing quickly

| Brief smells like... | Start with |
|---|---|
| "a product with a hero object" | 1 Product Hero Scroll |
| "premium", "timeless", "boutique" | 2 Editorial Quiet Luxury |
| "developers", "API", "agents" | 3 Technical Dark |
| "indie", "bold", "doesn't look corporate" | 4 Neo-Brutalist Print |
| "wow", "portfolio", "studio" | 5 Cinematic Immersive |
| "friendly", "for everyone", "app" | 6 Soft Playful |
| "report", "numbers", "trust" | 7 Swiss Grid |
| "natural", "handmade", "local" | 8 Warm Organic |
