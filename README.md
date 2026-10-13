# UI Lab

**Live:** https://ui-lab-weld.vercel.app · **For AI agents:** [`/llms.txt`](https://ui-lab-weld.vercel.app/llms.txt) · [`/patterns.json`](https://ui-lab-weld.vercel.app/patterns.json) · [AGENTS.md](AGENTS.md)

A reference library of UI patterns, built mainly for AI coding agents (and humans) to pull from when building frontends.
Every entry is a working demo with tags, "when to use" notes, accessibility notes and copyable source.

**New: the Playbook.** Patterns are parts; [`playbook/`](playbook/00-start-here.md) is the judgement: a design procedure, 8 worlds to start from,
an inspiration/teardown method, a verification loop with a catalogue of real bugs, and a scroll-driven 3D recipe.
**Also new: fifty reference sites, taken apart.** [`src/references.ts`](src/references.ts): 30 world-class websites, 20 vibe-coded UIs and the latest Awwwards winners, each with its signature moment, how it is built, measured fonts and colours, and what to take and leave (page `#/references`, also `/references.md` and `/references.json`). The techniques are rebuilt as more than forty patterns in the **Signature moves** category ([`src/patterns/moves/`](src/patterns/moves)); the synthesis is in [`playbook/reference-sites.md`](playbook/reference-sites.md).

**Built for Claude.** [`src/router.ts`](src/router.ts) maps a brief to a world, a proof site and the techniques to take; it is published as [`/for-claude.md`](https://ui-lab-weld.vercel.app/for-claude.md) and validated at build time. Project slash commands (`/brief`, `/build-site`, `/teardown`, `/verify`, `/add-pattern`, `/add-world`) live in [`.claude/commands/`](.claude/commands), and [`playbook/briefs.md`](playbook/briefs.md) shows how to write the five-line brief.

**Niche worlds.** Twelve narrow directions (departures board, botanical plate, hi-fi deck, broadsheet, CRT, museum placard, seed packet, BBS, tarot, clinical label, type specimen, nautical chart) are written up in [`playbook/niche-worlds.md`](playbook/niche-worlds.md) and proven by the **Niche worlds** patterns plus four more whole sites.

Nine whole sites in nine design worlds, as the **Sites** category inside the library ([`src/patterns/sites/`](src/patterns/sites)): SOLAR, MARE, Lattice, HOT MESS, ABYSS, MERIDIAN (departures), Hedgerow Press (herbarium), KESTREL K-1 (tape deck), THE LEDGER (broadsheet). Open any pattern page and press *Launch full screen*. Claude skill in [`skills/ui-lab`](skills/ui-lab/SKILL.md).

```bash
npm install
npm run dev      # http://localhost:5180
```

## Layout

```
src/
  tokens/tokens.css      # framework-agnostic design tokens; copy into any project
  index.css              # Tailwind v4 + tokens exposed as utilities (bg-surface, text-fg-muted…)
  meta.ts                # the index of every pattern: plain data, read by the app AND the build
  registry.ts            # attaches each pattern's component (auto via import.meta.glob)
  patterns/
    foundations/         # tokens, type, color
    components/          # buttons, inputs, modals…
    motion/              # scroll, view transitions, micro-interactions
    text/                # text effects
    backgrounds/         # shaders, canvas and CSS backgrounds
    three-d/             # CSS 3D and canvas 3D
    motion3d/            # real 3D with three.js / React Three Fiber (code-split, lazy)
    sites/               # whole sites, one design world each (code-split; folder per site, full screen at #/live/<slug>)
    layouts/ sections/   # grids and full landing-page bands
    screens/             # complete app screens (dashboards)
    dataviz/             # charts, timelines
    recipes/             # small copy-paste CSS tricks
playbook/                # design procedure, worlds, inspiration, verification, recipes (also served at /playbook/*.md)
tools/site-stack.mjs     # detects which libraries a reference site uses
skills/ui-lab/SKILL.md   # the playbook packaged as a Claude skill
ai-index.ts              # Vite plugin: generates llms.txt, patterns.json, docs/*.md, raw/*
RESOURCES.md             # site teardowns and research notes
src/resources.ts         # curated link directory -> #/resources page + /resources.md
```

## Adding a pattern

1. Create `src/patterns/<category>/<Name>.tsx` with a default-exported demo component.
2. Add an entry to `ALL` in `src/meta.ts` (with `when`, `tags` and `a11y`).
3. Sidebar, home grid, search and all AI files update automatically.

## Rules

- Live demo or it doesn't go in. Links alone belong in `RESOURCES.md`.
- Only patterns that have actually been used or fully built.
- Generic, no project-specific branding. Style everything through tokens.
- Respect `prefers-reduced-motion` in every motion pattern.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4
