# UI Lab

A library of working website designs and building blocks, with a written guide to choosing between them. Every entry runs live, shows its code, and says how it behaves for people who use a keyboard or a screen reader.

**Live:** https://ui-lab-weld.vercel.app

## Who it is for

- **Designers and developers** who want a site that looks authored, not generic, and want to see real examples before they build.
- **People who use an AI assistant** (Claude and others) to build sites, and want better results than "make it premium". The library includes copy-paste prompts and a guide the assistant can read itself.
- **Anyone learning** what good web design and accessibility look like in practice.

## Three ways to start

1. **See finished websites.** Eighteen complete sites, each in a different design style, open full screen: a night-train departures board, a botanical field notebook, a working tape deck, a broadsheet newsletter, a tide planner, a museum exhibition, a terminal portfolio, a plain-text forecast, and ten more, including a bakery, an app landing page, a data report and an engineering blueprint and a receipt-style shop.
2. **Find a part to copy.** Over 210 patterns (buttons, sections, scroll effects, charts, screens). Search by what you need, or filter by category. Each page has the live demo, the code, "when to use it" and an accessibility note.
3. **Use it with an AI assistant.** Give your assistant [`/for-claude.md`](https://ui-lab-weld.vercel.app/for-claude.md). It maps what you are building to the right design style, a proof site to study, and the techniques to take. See [`playbook/prompts.md`](playbook/prompts.md) for prompts to copy.

## What is inside

| Part | What it is |
|---|---|
| **Patterns** (`src/patterns/`) | One self-contained, copyable file each, grouped by category. The index is [`src/meta.ts`](src/meta.ts) plus `meta-moves.ts`, `meta-niche.ts`, `meta-css.ts` and `meta-sites.ts`. |
| **Sites** (`src/patterns/sites/`) | Whole websites, one design world each. Open any pattern page and press *Launch full screen*. |
| **Signature moves** | One striking technique each, rebuilt in our own code from award-winning and popular sites we studied. |
| **Niche worlds** | Designs for specific subjects: timetables, plants, audio gear, newspapers, medicine labels, museums. |
| **Modern CSS** | Browser features that replace JavaScript, each with a safe fallback. |
| **References** (`src/references.ts`) | 67 teardowns: 30 world-class sites, 20 vibe-coded UIs, the latest Awwwards winners and a few community picks. Page `#/references`, also `/references.md` and `/references.json`. |
| **Playbook** (`playbook/`) | The written judgement: how to brief, choose a design world (21 of them), study a reference, build, check accessibility and verify. [Start here](playbook/00-start-here.md). |

## For AI assistants

- [`src/router.ts`](src/router.ts): brief to design world to proof to technique. Published as `/for-claude.md` and validated at build time (a wrong pattern name fails the build).
- [`CLAUDE.md`](CLAUDE.md) and [`AGENTS.md`](AGENTS.md): the rules and conventions for working in this repo.
- Project slash commands in [`.claude/commands/`](.claude/commands): `/brief`, `/build-site`, `/teardown`, `/verify`, `/add-pattern`, `/add-world`.
- Machine-readable: `/llms.txt`, `/llms-full.txt`, `/patterns.json`, `/references.json`, `/docs/<slug>.md`.
- A Claude skill packaging the procedure: [`skills/ui-lab`](skills/ui-lab/SKILL.md).

## Run it

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # typecheck, static build and the AI files; fails on broken metadata
```

## Adding to it

1. **A pattern:** create `src/patterns/<category>/<Name>.tsx` with a default-exported demo, then add an entry to the right meta file (`when`, `tags`, `a11y`). The sidebar, home grid, search and all AI files update by themselves.
2. **A whole site:** see "Adding a whole site" in [`AGENTS.md`](AGENTS.md). It needs scoped CSS, a registered entry and a thumbnail (the build checks).
3. **A reference:** use the `/teardown` command, or read [`playbook/inspiration.md`](playbook/inspiration.md).

## Layout

```
src/
  tokens/tokens.css      # framework-agnostic design tokens; copy into any project
  index.css              # Tailwind v4 + tokens exposed as utilities (bg-surface, text-fg-muted…)
  meta*.ts               # the index of every pattern: plain data, read by the app AND the build
  router.ts              # brief -> world -> proof -> technique (published as /for-claude.md)
  references.ts          # teardowns of studied sites
  patterns/              # foundations, components, motion, text, backgrounds, 3D, sites, moves, niche, css, …
playbook/                # the written guidance (also served at /playbook/*.md)
tools/                   # site-stack detector, CSS scoping tool for whole sites
skills/ui-lab/SKILL.md   # the playbook packaged as a Claude skill
ai-index.ts              # Vite plugin: llms.txt, patterns.json, docs/*.md, raw/*, for-claude.md, and metadata validation
```

## Rules

- A live demo, or it does not go in. Links alone belong in `RESOURCES.md`.
- Style through tokens, never hard-coded theme colours (demo content may use its own palette).
- Every motion pattern respects `prefers-reduced-motion`; every interactive one works with a keyboard.
- Techniques are re-implemented in our own code. Nothing is copied from the sites we study.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4
