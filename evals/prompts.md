# Eval arm prompts (as run in Phase 2)

Both arms: Sonnet subagent, same environment and hooks as the Phase 0 baseline, one agent per brief, static HTML/CSS/JS in one file.

## Baseline arm ("baseline-free", output evals/runs/baseline-free/<brief>/index.html)

Preamble: plain front-end developer; do not read or search anything under the UI-Lab repo except writing the output (and, for brief 08, reading the fixture); do not use any skill named ui-lab; do not fetch the live UI Lab sites. Then the brief verbatim, then constraints (single file, fonts from a font service or system, images as inline SVG/CSS, must work at 1440 and 375). "Build it the way you normally would, and check it however you normally would. Reply with one line: done + file path."

(Phase 0 baselines for 01 and 02 additionally said "Do not run anything else", so they could not render. The free arm removes that restriction.)

## Skill arm ("skill-r1", output evals/runs/skill-r1/<brief>/index.html)

Preamble: the ui-lab skill is installed and applies to this task; its folder is release/stage/pro/ui-lab (unpacked from release/ui-lab.zip); read SKILL.md first and follow it, loading its references only when its read-this-when table says; its design/ artifacts go in design/ next to the output; do not read other repo folders (src, playbook, evals except the brief fixture). Then the same brief and constraints as the baseline, without the "build it the way you normally would" line.

## Phase 2 round 2

Brief 01 only, skill arm re-run after the SKILL.md iteration, output evals/runs/skill-r2/01-saas-landing. Same prompt as round 1, new output path. Judge prompts: brief text, then screenshot paths for A and B, then "decide which one a senior design reviewer would choose to ship", weighing audience fit, hierarchy, craft, distinctiveness, mobile, defects, with a fixed reply format (winner, reasoning, biggest flaw of each, which is more like a typical AI-generated page). A and B were assigned by a random draw per pair.
