---
description: Add a pattern to the library
argument-hint: <what it is>
---
Add a pattern: $ARGUMENTS

One self-contained file in `src/patterns/<folder>/<Name>.tsx` with a default-exported demo. Entry in the right meta file (`meta.ts`, `meta-moves.ts` or `meta-niche.ts`): slug, title, category, summary, when[], file, tags[], a11y, deps. Keyboard and reduced motion handled. Animate transform, opacity or clip-path, not layout. Then `npx tsc --noEmit` and `npm run build`. Do not copy code or text from other libraries.
