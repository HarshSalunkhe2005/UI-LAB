# UI Lab

**Live:** https://ui-lab-gzfw.onrender.com · **For AI agents:** [`/llms.txt`](https://ui-lab-gzfw.onrender.com/llms.txt) · [`/patterns.json`](https://ui-lab-gzfw.onrender.com/patterns.json) · [AGENTS.md](AGENTS.md)

A reference library of UI patterns, built mainly for AI coding agents (and humans) to pull from when building frontends.
Every entry is a working demo with tags, "when to use" notes, accessibility notes and copyable source.

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
    layouts/ sections/   # grids and full landing-page bands
    screens/             # complete app screens (dashboards)
    dataviz/             # charts, timelines
    recipes/             # small copy-paste CSS tricks
ai-index.ts              # Vite plugin: generates llms.txt, patterns.json, docs/*.md, raw/*
RESOURCES.md             # external libraries, tools, inspiration and site teardowns
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
