# Verification log (written by scripts/verify.mjs)

**Page:** index.html   **Run:** 2026-10-31T13:55:51.561Z
**Method:** headless local browser, exact 375 px frame and 1440 px frame

## Result

**PASS**

- Static audit: 0 critical, 0 warning, 0 suggestion

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
page height 8196px, document width 360px, horizontal overflow: no
interactive elements: 20; under 44px: 0
h1 count: 1; images without alt: 0; inputs without a label: 0
headline lines at 1440: 1; at 375: 1
```

## Slices to look at (open every one; this is the part the script cannot judge)

- 1440 slice 1 of 6: `verify/slice-1440-01.png`   what is in it / any defect:
- 1440 slice 2 of 6: `verify/slice-1440-02.png`   what is in it / any defect:
- 1440 slice 3 of 6: `verify/slice-1440-03.png`   what is in it / any defect:
- 1440 slice 4 of 6: `verify/slice-1440-04.png`   what is in it / any defect:
- 1440 slice 5 of 6: `verify/slice-1440-05.png`   what is in it / any defect:
- 1440 slice 6 of 6: `verify/slice-1440-06.png`   what is in it / any defect:
- 375 slice 1 of 11: `verify/slice-375-01.png`   what is in it / any defect:
- 375 slice 2 of 11: `verify/slice-375-02.png`   what is in it / any defect:
- 375 slice 3 of 11: `verify/slice-375-03.png`   what is in it / any defect:
- 375 slice 4 of 11: `verify/slice-375-04.png`   what is in it / any defect:
- 375 slice 5 of 11: `verify/slice-375-05.png`   what is in it / any defect:
- 375 slice 6 of 11: `verify/slice-375-06.png`   what is in it / any defect:
- 375 slice 7 of 11: `verify/slice-375-07.png`   what is in it / any defect:
- 375 slice 8 of 11: `verify/slice-375-08.png`   what is in it / any defect:
- 375 slice 9 of 11: `verify/slice-375-09.png`   what is in it / any defect:
- 375 slice 10 of 11: `verify/slice-375-10.png`   what is in it / any defect:
- 375 slice 11 of 11: `verify/slice-375-11.png`   what is in it / any defect:

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
