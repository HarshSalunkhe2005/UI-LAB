# UI Lab

A live, runnable reference library of UI patterns to pull from when starting any new frontend.
Every entry is a working demo with a "when to use" note and its source, viewable in the gallery.

```bash
npm install
npm run dev      # http://localhost:5180
```

## Layout

```
src/
  tokens/tokens.css      # framework-agnostic design tokens; copy into any project
  index.css              # Tailwind v4 + tokens exposed as utilities (bg-surface, text-fg-muted…)
  registry.ts            # the index of every pattern (title, category, when-to-use, source)
  patterns/
    foundations/         # tokens, type, color
    components/          # buttons, inputs, modals…
    motion/              # scroll, view transitions, micro-interactions
    layouts/             # page templates
    dataviz/             # charts, stat tiles, timelines
    recipes/             # small copy-paste CSS tricks
RESOURCES.md             # external libraries, tools and inspiration
```

## Adding a pattern

1. Create `src/patterns/<category>/<Name>.tsx` with a default-exported demo component.
2. Add an entry to `PATTERNS` in `src/registry.ts`, including at least one `when` line.
3. It appears in the sidebar automatically, with its source viewable on the page.

## Rules

- Live demo or it doesn't go in. Links alone belong in `RESOURCES.md`.
- Only patterns that have actually been used or fully built.
- Generic, no project-specific branding. Style everything through tokens.
- Respect `prefers-reduced-motion` in every motion pattern.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4
