# UI Lab skill

A gated design procedure for coding agents. It makes an agent write a brief, pick between candidate directions drawn from different design-world families, render and check the result at two widths, and compare its choices against known AI-default patterns, before it calls the work done.

## Modes

- **Build:** a new page, screen or component.
- **Redesign:** an existing UI, preserve-first (change the skin, not the wiring).
- **Critique:** a scored audit of any UI with concrete fixes.

## Install

Claude Code: unzip so that the folder `ui-lab/` (containing `SKILL.md`) sits inside `~/.claude/skills/`:

    ~/.claude/skills/ui-lab/SKILL.md

On Windows the folder is `%USERPROFILE%\.claude\skills\`. Other agents that read a `SKILL.md` skills folder work the same way: place the `ui-lab/` folder where that agent looks for skills.

## What is inside

| Path | Purpose |
|---|---|
| `SKILL.md` | The workflow. Loaded first; names the other files to read and when. |
| `references/` | 24 design worlds in 6 families with exact token blocks, a 40-entry anti-slop catalogue, dense-UI guidance, 15 font pairings, colour, motion and accessibility rules, the verify loop and a bug catalogue. {{pro}}Also a technique index distilled from 68 site teardowns, site-type skeletons and a glossary.{{/pro}} |
| `patterns/` | Canonical HTML, CSS and vanilla JavaScript patterns (heroes, dense-UI parts, navigation, sections, commerce, forms and states, motion, docs), each with when-to-use and accessibility notes, plus an index. |
| `templates/` | Fill-in formats for the brief, house-style check and direction card, verification log, critique report and handoff. |
| `scripts/` | Zero-dependency helpers run locally: a static UI audit and a contrast checker. They read only the folder you point them at and use no network. | {{pro-line}}
| `examples/` | Worked examples. | {{pro-line}}

## Requirements

None. Nothing is installed and nothing is fetched at runtime. The skill never asks the agent to read files outside the project or visit a website.
