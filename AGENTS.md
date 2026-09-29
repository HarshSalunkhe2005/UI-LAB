# AGENTS.md

Guide for AI coding agents using or extending UI Lab.

## Using it as a reference (from another project)

1. Read the index: https://ui-lab-gzfw.onrender.com/llms.txt (or `/patterns.json` for structured data, `/llms-full.txt` for everything in one file).
2. Pick patterns by `tags`, `category` and `when`. Fetch `/docs/<slug>.md` for metadata + full source, or `/raw/<file>` for the bare file.
3. Copy `src/tokens/tokens.css` into the target project first. Patterns use its CSS variables; Tailwind utilities (`bg-surface`, `text-fg-muted`, `border-border`, `text-accent`, …) map to them via the `@theme` block in `src/index.css`.
4. Keep each pattern's `prefers-reduced-motion` handling and a11y notes when adapting.

## Adding a pattern (in this repo)

1. Create `src/patterns/<folder>/<Name>.tsx` with a **default-exported demo**. Export the reusable piece as a named export.
2. Add an entry to `ALL` in `src/meta.ts`: slug, title, category, summary, when[], file, tags[], a11y, optional source/deps.
3. That's it: sidebar, home grid (live thumbnail), Ctrl+K search, `/llms.txt`, `/patterns.json`, `/docs/<slug>.md` and `/raw/…` all generate from `meta.ts`.

## Rules

- One self-contained file per pattern. No new runtime dependencies without listing them in `deps`.
- Style with tokens, never hard-coded theme colours (demo content may use its own colours).
- Every motion pattern handles `prefers-reduced-motion`. Every interactive one works by keyboard.
- Build our own implementations. Do not copy code, prompts or copy text from paid libraries.
- Commit messages: plain, no AI attribution.

## Commands

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # typecheck + static build (includes AI files)
```
