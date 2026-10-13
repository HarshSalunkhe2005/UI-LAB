# Reference sites: what fifty good (and popular) UIs have in common

Fifty teardowns live at [`/references.md`](../references.md) (also `/references.json` and the **References** page of the app):
30 world-class websites and 20 vibe-coded UIs, each with its signature moment, how it is built, what we measured, what we take and what we leave.
Every technique we took is rebuilt in our own code as a pattern in the **Signature moves** category (39 of them), so you can open the
teardown, then the working demo, then the source.

This page is the synthesis: what the fifty teach, and how to use them without copying.
Measured 2026-10-14 at 1440x900 with computed styles and the library scan in `tools/site-stack.mjs`. Where we could not see
a site properly (WebGL2-only, canvas-only, bot-challenged) the entry says so.

## Part 1: the thirty

### Craft is not stack
Technique count tells you almost nothing. Emil Kowalski's site has zero animations and a 2,480px page; Linear ships zero canvases and zero videos;
Igloo and Bruno Simon are a single WebGL canvas each; Immersive Garden runs twelve canvases. All are "premium". What they share is one decision
carried through everything, not a heavier toolchain. Pick the cheapest technique that delivers the moment.

### Type is the loudest decision
Measured display sizes: 16px (Emil, one size only), 19.2px (Are.na, one size only), 48px at weight 300 (Stripe), 54-64px at weights 400-600
(Framer, Vercel, Raycast, Apple, Superhuman), 80-96px (Cuberto, Tailwind, Resend), **720px** (Rauno). Two extremes work: monumental, or one calm size.
The muddy middle (three similar sizes, four weights) is what "mid" looks like.

- At least 14 of the 30 set their headline in a custom or licensed family (Stripe sohne, Superhuman Super Sans, Mercury arcadia, Nothing Ndot, teenage engineering te-20, PostHog RoundHog, Arc Marlin Soft, Resend domaine, Pudding Atlas + Gooper, Rive Orbitron). We cannot ship those; the lesson is that *the family carries the brand*. Choose one distinctive open face (see `worlds.md`) and commit to it.
- Light and medium weights dominate large type: 300 at Stripe, 480 at Mercury, 540 at Superhuman, 500 at Cuberto and Framer. Heavy weights are rare at display size (Orbitron 900 at Rive is the sci-fi exception).

### One accent, used once
Measured accents: Stripe violet `rgb(83,58,253)`, basement orange `rgb(255,77,0)`, Mercury periwinkle `rgb(82,102,235)`, Arc blue `rgb(49,57,251)`, Lusion blue `rgb(0,22,236)`.
Grounds are either near-black (Linear `8,9,10`, Vercel `10,10,10`, Raycast `7,8,10`, Resend black) or a *warm* neutral (Arc cream, PostHog green-cream, Emil paper `253,253,252`, Rauno grey). Stripe is the exception with a white ground, and it spends its one accent and its gradient carefully.

### The page proves the product by being it
- Raycast types a query into a launcher and answers to the arrow keys. (`move-command-demo`)
- Superhuman is built around keystrokes. (`move-shortcut-inbox`)
- Resend's code turns into the email it sends. (`move-code-to-preview`)
- Rive shows interaction as states. (`move-state-button`)
- Tailwind's hero is the class list that styles it.

If your product is an interface, the hero should be a live piece of it, not a screenshot.

### Commit to one metaphor
PostHog is a desktop (`move-desktop-home`). Stripe Press is a stack of books (`move-book-stack`). Bruno Simon is a drivable world (`move-drive-world`).
Nothing is dot-matrix (`move-dot-matrix`). teenage engineering is a spec sheet (`move-rotary-knob`). The metaphor decides layout, type, motion and copy at once, which is why these sites feel finished.

### Scroll is used for exactly one thing
- Apple pins scenes and scrubs media (measured: 11 sticky regions, 6 scroll-snap points, 16 videos; `move-frame-scrub`).
- Igloo makes scroll the camera (`move-scroll-tunnel`).
- The Pudding makes scroll advance a story under a sticky chart (`move-scrollytelling`).
- Lenis, Cuberto and Immersive Garden use eased scrolling (Lenis confirmed on all three; `move-scroll-rail`).

Nobody does all four on one page.

### What breaks (observed, so avoid)
- **WebGL2 as a hard requirement.** Igloo shows an apology in a browser without it. Canvas-only sites (Bruno Simon, Resn) have no DOM text at load, so crawlers and screen readers get nothing. Offer a fallback or keep real text in the DOM.
- **A blank first frame.** Linear's hero text arrived several seconds after load in our browser. Entrances should start from visible content.
- **Bot walls.** Locomotive and Aesop sit behind a Cloudflare challenge; we do not bypass those, so they are not in the thirty.

## Part 2: the twenty vibe-coded

**How they were chosen.** There is no neutral ranking of "best vibe-coded sites". We took v0's own featured templates and ranked them by the larger of the two counts each card shows (most likely forks; likes second). That gives certain provenance (all made in v0) and an honest popularity signal, not a design award. For other galleries, browse Lovable Launched, madewithlovable.com and vibecodingshowcase.com.

**What the popularity shows.** The most-forked are the safe defaults: Pointer AI landing page (20.7K), Brillance SaaS landing page (14.7K), Marketing Website (11.2K), Dashboard M.O.N.K.Y (11.1K). Of the twenty, twelve are SaaS, marketing, portfolio, waitlist or storefront templates in the same section order (hero, features, pricing, testimonials, call to action, footer). People fork the thing they already expect.

**The look it converges on** (measured on the Pointer template): the system sans stack (`ui-sans-serif`) at 60px/600, a rounded hero panel filled with a pale mint gradient, floating pixel squares, a code-editor mock below, and **23 backdrop-filters** on one page. That is "decorative glass", one of the refusals in `00-start-here.md`. It is a competent default, and exactly what the swap test catches.

**Where vibe coding is genuinely strong** (the entries worth studying):
- Complete states for small interactive things: the Waitlist and Newsletter forms (`move-v0-email-capture`), the Image Generation Playground's history and shortcuts.
- App shells with clear structure: the M.O.N.K.Y dashboard (`move-v0-dashboard-shell`).
- Self-contained visual toys with a definite algorithm: isometric room with pathfinding (`move-v0-isometric-room`), globe-to-map projection blend (`move-v0-globe-to-map`), particle logo (`move-v0-particle-logo`), SVG-mask hero (`move-v0-mask-hero`).
- Clean seams to services: BaseHub as a CMS, Upstash Redis for signups, AI Gateway for generation.

**The caution.** Speed hides risk. Wikipedia's "Vibe coding" article reports that 170 of 1,645 Lovable-created web applications had a flaw that let anyone read personal information. When a generated app stores user data, review auth and row-level access before shipping, however good the UI looks.

## How to use this when building

1. Pick references by the brief's **mode** (Persuade, Operate, Read, Experience), then open 2-3 teardowns whose *signature moment* matches your content, not your industry.
2. Open the matching **Signature move** pattern. Read its source; keep its reduced-motion and keyboard handling.
3. **Cross, don't copy:** structure from one, type attitude from another, a metaphor from a third. Run the swap test.
4. Prefer the cheapest technique that delivers the moment (CSS or SVG before canvas, canvas before WebGL).
5. If you are tempted by the vibe-coded default, treat it as the baseline to beat. Replace the type, the order of sections and one thing the template never does.

## What we deliberately did not do

- Copy code, text, brand assets or distinctive layouts. Each move re-implements a *technique* with our own content.
- Claim more than we saw. Entries marked *partial* or *listing* say how little we could verify.
- Rank sites. The fifty are a study set, not a leaderboard.
