# UI Lab

A design skill for coding agents, and the library behind it.

**The skill** makes an AI coding agent follow a short, gated procedure before it writes UI: write the brief, name the house style it would fall into by default and leave it, pick a direction from design worlds that differ, build, then render the page at 1440 px and a true 375 px and fix what the checks find before calling it done. It works in Claude Code and any agent that reads a `SKILL.md` skills folder.

**The library** is 263 working patterns (22 of them whole sites), each with a live demo, its code, when to use it and an accessibility note. Everything in it runs live, shows its code, and says how it behaves for people who use a keyboard or a screen reader.

**Live site:** https://ui-lab-weld.vercel.app

## Install the skill

With the Claude Code plugin marketplace:

```
/plugin marketplace add HarshSalunkhe2005/UI-LAB
/plugin install ui-lab@ui-lab
```

Or by hand: copy the folder [`skills/ui-lab`](skills/ui-lab) into `~/.claude/skills/` (on Windows `%USERPROFILE%\.claude\skills\`), so that `~/.claude/skills/ui-lab/SKILL.md` exists. This is the free **Lite** build. Nothing else is installed, and nothing is fetched at run time.

**Pro** is a paid build on Agensi. It adds the one-command verification (`scripts/verify.mjs`, which runs your own local Chrome or Edge on your own page), the 36-rule static audit, worked examples, brief and site-type references and two more patterns. The Lite skill is complete on its own: same procedure, same 24 worlds.

## The three modes

| Mode | Use it for | What you get |
|---|---|---|
| **Build** | A new page, screen or component | A brief, a house-style check, a direction card with real tokens, a first slice built end to end, then a verified page and a handoff |
| **Redesign** | An existing UI | Preserve-first: the content, order and wiring stay, the skin changes; before and after are compared at both widths |
| **Critique** | Any UI, yours or someone else's | A scored report with concrete fixes, seeded by a static audit of the source |

The skill's source is in [`skill/ui-lab`](skill/ui-lab); `npm run skill` builds the Lite package into `skills/ui-lab` (what the plugin installs) and writes both zips to `release/`. Lite has the procedure, 24 design worlds in 6 families, a catalogue of the defaults to avoid, 10 patterns for the situations agents rebuild badly, and the fixes catalogue. Pro adds a 36-rule static audit, 2 more patterns, and `scripts/verify.mjs`: one command that renders at 1440 and a true 375, measures ten mechanical gates, saves contact sheets of every screen of the page and writes the verification log.

## What the evidence says

Tested blind: plain Sonnet against Sonnet with the skill on the same briefs, judged by one Opus and one Sonnet reviewer who only see screenshots. A pair counts as a skill win only if both prefer it.

- **Across eight briefs the skill won 6, tied 2 and lost 0.** It wins on specific, dense or structured work: an analytics dashboard, a restaurant site, a developer portfolio, a docs page, a product page and a redesign of a generic landing page.
- **It is not better than plain Sonnet on generic marketing landing pages or mobile app screens.** In the latest re-run (three builds of each, after adding the one-command verification), the SaaS landing page got 0 wins, 1 tie and 2 losses, and so did the app screen. The reviewers preferred the plainer, more finished page. On those briefs the skill's pages were more distinctive but less polished.
- **Variance is high.** The same prompt gives a win, a tie and a loss in different runs, and most votes are close.
- **Three pages from one brief still look alike.** Reviewers rate three runs of the same landing page brief as one direction in three costumes, mostly because the brief itself suggests the layout.

The full results, with the judges' own words, are in [`evals/results/`](evals/results).

## Using the library with an AI assistant

- Give your assistant [`/for-claude.md`](https://ui-lab-weld.vercel.app/for-claude.md). It maps what you are building to a design world, a proof site to study and the techniques to take. [`src/router.ts`](src/router.ts) is its source, validated at build time.
- [`playbook/prompts.md`](playbook/prompts.md) has prompts to copy; [`playbook/00-start-here.md`](playbook/00-start-here.md) is the written procedure.
- Machine-readable: `/llms.txt`, `/llms-full.txt`, `/patterns.json`, `/references.json`, `/docs/<slug>.md`.
- Slash commands for working in this repo are in [`.claude/commands/`](.claude/commands): `/brief`, `/build-site`, `/teardown`, `/verify`, `/add-pattern`, `/add-world`.

## What is in the repo

| Part | What it is |
|---|---|
| **Patterns** (`src/patterns/`) | One self-contained, copyable file each, grouped by category. The index is [`src/meta.ts`](src/meta.ts) plus `meta-moves.ts`, `meta-niche.ts`, `meta-css.ts` and `meta-sites.ts`. |
| **Sites** (`src/patterns/sites/`) | 22 whole websites, one design world each, from a night-train departures board and a botanical field notebook to a tide planner, a museum exhibition, a playable CRT arcade and a kitchen recipe page. Open any pattern page and press *Launch full screen*. |
| **References** (`src/references.ts`) | 68 teardowns of studied sites. Page `#/references`, also `/references.md` and `/references.json`. |
| **Styles** (page `#/styles`) | Every design world on one page, filterable by what the visitor is doing. |
| **Evidence** (page `#/evidence`) | Eight briefs, plain Sonnet next to Sonnet with the skill, with the blind verdict and the judges' reasoning on each row, losses included. Data in `src/evidence.ts`, pictures in `public/evidence/`. |
| **Playbook** (`playbook/`) | The written judgement: how to brief, choose a design world, study a reference, build, check accessibility and verify. |
| **Skill** (`skill/ui-lab`, `skills/ui-lab`, `tools/build-skill.mjs`) | The agent skill: hand-written source, the Lite copy the plugin ships, and the build and validation tools. |
| **Evals** (`evals/`) | The blind-judging harness, the runs and the results above. |

## Run it

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # typecheck, static build and the AI files; fails on broken metadata
npm test           # tests for the pure logic and the pattern counts
npm run skill      # build and validate the skill package (release/ui-lab-lite.zip, release/ui-lab-pro.zip and the Lite plugin copy)
npm run skill:test # clean-install test plus tests for the skill, its scripts and its worlds
```

## Adding to it

1. **A pattern:** create `src/patterns/<category>/<Name>.tsx` with a default-exported demo, then add an entry to the right meta file (`when`, `tags`, `a11y`). The sidebar, home grid, search and all AI files update by themselves.
2. **A whole site:** see "Adding a whole site" in [`AGENTS.md`](AGENTS.md). It needs scoped CSS, a registered entry and a thumbnail (the build checks).
3. **A reference:** use the `/teardown` command, or read [`playbook/inspiration.md`](playbook/inspiration.md).

## Rules

- A live demo, or it does not go in. Links alone belong in `RESOURCES.md`.
- Style through tokens, never hard-coded theme colours (demo content may use its own palette).
- Every motion pattern respects `prefers-reduced-motion`; every interactive one works with a keyboard.
- Techniques are re-implemented in our own code. Nothing is copied from the sites we study.

## License

MIT, see [`LICENSE`](LICENSE), for everything in this repository, including the Lite skill. The paid Pro build on Agensi is a separate package under its own single-user licence; it is not part of this repository.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4
