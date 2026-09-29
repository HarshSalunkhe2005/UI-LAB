# UI-Lab — Resource Index

Seed research for the lab. Everything here is a pointer; patterns we actually adopt get rebuilt as live demos in the lab itself.

Star counts are from the GitHub API on 2026-09-29.

---

## 1. Agent design skills / AI-UI guardrails

Tools that make coding agents produce non-generic frontends. Highest leverage for how we build.

| Resource | Stars | What it is |
|---|---|---|
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 91k | "Anti-slop" frontend framework/skill for AI agents |
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) · [getdesign.md](https://getdesign.md/) | 118k | `DESIGN.md` files reverse-engineered from popular brand design systems; drop one into a project so the agent matches it |
| [VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) | 3.9k | 68 design-system inspirations in `DESIGN.md` format |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) → `web-design-guidelines` | — | Vercel's web interface guidelines packaged as an agent skill |
| [wilwaldon/Claude-Code-Frontend-Design-Toolkit](https://github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit) | 1.2k | Curated list of skills/plugins for better-looking agent output |
| [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | 614 | Design skill for coding agents |
| [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) | 13.5k | Lets the agent open, screenshot and interact with the UI it built (visual self-check loop) |
| Image-to-code (e.g. [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code)) | — | Screenshot/Pinterest ref → code |

**Workflow idea (from reel 2):** reference image (Pinterest/Godly) → image-to-code → `DESIGN.md` for tokens → taste/guidelines skill for polish → Playwright to verify.

## 2. Design-system extraction

| Resource | Stars | What it is |
|---|---|---|
| [Manavarya09/design-extract](https://github.com/Manavarya09/design-extract) | 4.1k | Extract any site's design system → DTCG tokens |
| [dembrandt/dembrandt](https://github.com/dembrandt/dembrandt) | 3.6k | Site → tokens (logo, colors, type, borders…) |
| [alexpate/awesome-design-systems](https://github.com/alexpate/awesome-design-systems) | 26k | Curated list of public design systems |

## 3. Component libraries (copy-paste)

| Resource | Notes |
|---|---|
| [shadcn/ui](https://ui.shadcn.com/) | Base layer; most libs below are shadcn-compatible |
| [React Bits](https://reactbits.dev/) · [repo](https://github.com/DavidHDev/react-bits) (48k) | Animated/interactive components |
| [Magic UI](https://magicui.design/) · [repo](https://github.com/magicuidesign/magicui) (22k) | Animated effects for landing pages |
| [Aceternity UI](https://ui.aceternity.com/) | Flashy hero/landing effects |
| [Motion Primitives](https://motion-primitives.com/) | Motion-first copy-paste components (reel 1) |
| [Watermelon UI](https://ui.watermelon.sh/) | 600+ open-source components (reel 1) |
| [Cult UI](https://www.cult-ui.com/) · [Skiper UI](https://skiper-ui.com/) · [Componentry](https://componentry.dev/) | shadcn-ecosystem extras |
| [21st.dev](https://21st.dev/) | Community component registry |
| [HeroUI](https://heroui.com/) · [HyperUI](https://hyperui.dev/) | Full kit / plain Tailwind blocks |
| [Uiverse](https://uiverse.io/) | Single elements (buttons, loaders, toggles) in plain CSS |
| [number-flow](https://github.com/barvian/number-flow) (7.7k) | Animated number transitions |
| [aniftyco/awesome-tailwindcss](https://github.com/aniftyco/awesome-tailwindcss) (15k) | Tailwind ecosystem list |

## 4. Motion & scroll

| Resource | Notes |
|---|---|
| [GSAP](https://gsap.com/) (28.7k) | ScrollTrigger, timelines; our default for scroll-driven stuff |
| [Motion](https://motion.dev/) | React/JS animation (ex-Framer Motion) |
| [Anime.js](https://animejs.com/) · [React Spring](https://www.react-spring.dev/) · [Theatre.js](https://www.theatrejs.com/) | Alternatives / spring physics / timeline editor |
| [Animista](https://animista.net/) | CSS keyframe generator |
| [Jitter](https://jitter.video/) | Motion design tool for prototyping |
| [fliptheweb/motion-ui-design](https://github.com/fliptheweb/motion-ui-design) | Motion UI inspiration list |
| [tsParticles](https://github.com/tsparticles/tsparticles) | Particles/confetti |

## 5. Color, gradients, backgrounds

[Realtime Colors](https://www.realtimecolors.com/) · [CSS Gradient](https://cssgradient.io/) · [Mesh Gradient](https://www.meshgradient.com/) · [Shader Gradient](https://www.shadergradient.co/) · [Haikei](https://haikei.app/) (SVG blobs/waves, reel 1) · [Shape Divider](https://www.shapedivider.app/) · [Pattern Monster](https://pattern.monster/) · [fffuel](https://www.fffuel.co/)

## 6. Type & icons

Fonts: [Fontshare](https://www.fontshare.com/) · [Fontsource](https://fontsource.org/) · [Bunny Fonts](https://fonts.bunny.net/) · [Fontjoy](https://fontjoy.com/) (pairing)
Icons: [Iconify](https://icon-sets.iconify.design/) · [Phosphor](https://phosphoricons.com/) · [Heroicons](https://heroicons.com/) · [Tabler](https://tabler.io/icons)

## 7. Inspiration

[Godly](https://godly.website/) · [Refero Styles](https://styles.refero.design/) · [Mobbin](https://mobbin.com/) · Pinterest (reel 2) · [Spline](https://spline.design/) (3D)

## 8. Site teardowns

**Scrolltide** (scrolltide.co), studied 2026-09-30. A paid library of AI-prompt templates.
- Stack: Next.js; Bricolage Grotesque + Inter + Space Mono; WebGL hero; ~99 looping preview videos.
- Catalog: 97 cinematic templates, 26 components (3D carousels, liquid glass, text effects), 55 shaders (about 7 families × palettes, dithered), 18 sections, 14 dashboard screens.
- What makes it look good: huge heavy display type with one gradient word, warm-to-cool dark glows + grain, mono micro-labels, video previews for every item.
- Accessibility: good (single h1, sane heading order, alt on all images, named controls, some reduced-motion rules). Missing: skip link, focus-visible styles, labels on videos.
- Rebuilt here in our own code: shader backgrounds (all families), liquid glass button, focus reveal, ring carousel, coverflow, expanding cards, morph pill card, fan deck, dot grid warp, particle globe, pricing / footer / contact sections, analytics dashboard.

**Alche** (alche.studio), studied 2026-09-30. A Japanese immersive/metaverse studio.
- Stack: Astro + Lenis smooth scroll, 3 WebGL canvases, Adobe Fonts (JP + Latin mix).
- Signature moves: blueprint line-draw logo intro, text scramble, asks before sound, intro shrinking into a framed window on scroll.
- Accessibility: asks before audio (good), lang="ja"; no reduced-motion handling, one image missing alt.
- Rebuilt here: blueprint intro, scramble text, sound opt-in.

---

## Sources

- Reel 1 (buildwaleesh): Watermelon UI, Motion Primitives, Manus (sponsored, not included), Haikei
- Reel 2 (Imagine Tech): taste-skill, Vercel web-design-guidelines, awesome-design-md, image-to-code, playwright-cli
- "Vibe Coder's Toolkit" artifact: 41 tools across 9 categories (sections 3–7)
- GitHub search, 2026-09-29
