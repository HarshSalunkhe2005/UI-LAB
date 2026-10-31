# Verification log (written by scripts/verify.mjs)

**Page:** index.html   **Run:** 2026-10-31T13:52:29.623Z
**Method:** headless local browser, exact 375 px frame and 1440 px frame

## Result

**PASS**

- Static audit: 0 critical, 0 warning, 2 suggestion

## Gates (measured)

| # | Gate | Result | Detail |
|---|---|---|---|
| 1 | console clean (both widths) | PASS |  |
| 2 | no horizontal overflow at 375 | PASS |  |
| 3 | targets >= 44px at 375 | PASS |  |
| 4 | one h1 and a main landmark | PASS | 1 h1, main present |
| 5 | reduced-motion rule present | PASS |  |
| 6 | focus style present | PASS |  |
| 7 | no text collisions (1440 and 375) | PASS |  |

## 375 px measurement

```
page height 812px, document width 375px, horizontal overflow: no
interactive elements: 9; under 44px: 0
h1 count: 1; images without alt: 0; inputs without a label: 0
headline lines at 1440: 1; at 375: 1
```

## Slices to look at (open every one; this is the part the script cannot judge)

- 1440 slice 1 of 1: `verify/slice-1440-01.png`   what is in it / any defect:
- 375 slice 1 of 1: `verify/slice-375-01.png`   what is in it / any defect:

## Manual checks (fill these in; the script cannot do them)

| Check | Result | Evidence |
|---|---|---|
| Contrast of every text pair (scripts/contrast.mjs) | | |
| Visible focus and no keyboard trap (tab through) | | |
| Every control does something | | |
| One place of visual weight per slice; no half-empty band; headline and primary action on the first screen | | |
| Code blocks render as one block; tables keep their key columns at 375 | | |

**Found and fixed:**
**Left as known defects (and why):**
**Could not check:**
