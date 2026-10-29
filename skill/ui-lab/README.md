# UI Lab skill

A gated design procedure for coding agents. It makes an agent write a brief and a direction card before it writes UI, render and check the result at two widths, and compare its choices against known AI-default patterns.

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
| `references/` | The anti-slop list with alternatives per axis, dense-UI guidance, worked design directions, the verify loop and bug catalogue, accessibility rules. |
| `templates/` | Fill-in formats for the brief, house-style check and direction card, verification log, critique report and handoff. |
| `scripts/` | Zero-dependency helpers run locally: a static UI audit and a contrast checker. They read only the folder you point them at and use no network. | {{pro-line}}
| `examples/` | Worked examples. | {{pro-line}}

## Requirements

None. Nothing is installed and nothing is fetched at runtime. The skill never asks the agent to read files outside the project or visit a website.
