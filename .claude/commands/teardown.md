---
description: Take a reference site apart and add it to references.ts
argument-hint: <url>
---
Teardown target: $ARGUMENTS

Method in `playbook/inspiration.md`. Open it in a browser at 1440x900, scroll it slowly, run `node tools/site-stack.mjs $ARGUMENTS`, and read computed styles (fonts, sizes, colours, canvas/video/sticky counts). Do not bypass a bot wall.
Write the entry in `src/references.ts`: idea, technique, look, take, leave, evidence (`inspected`, `partial` or `listing`, honestly), tags, and `moves` linking to a pattern that rebuilds the technique. If no pattern exists and the technique is worth keeping, build it as `move-*` in `src/patterns/moves/` with its entry in `src/meta-moves.ts`. Never copy code, text or assets.
