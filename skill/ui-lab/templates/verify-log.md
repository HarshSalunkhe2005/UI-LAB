# Verification log (design/verify.md)

**Method:** (browser tool / headless screenshot / static audit only)   **Widths rendered:** (1440, 375, others)
**Round 1 date/time:**   **Round 2 (confirming):**

## Evidence (paste real output; an empty field means that step was skipped)

- **Static audit** (`node scripts/audit-ui.mjs <project-dir>`): paste the summary line (for example "0 critical, 2 warning, 1 suggestion") and list every critical and warning with what you did about it:
- **375 px measurement** (the measurements block from `templates/viewport-probe.html`, or the same numbers measured another way): paste the block. It must show horizontal overflow, the elements under 44 px in width or height, and the h1 count:
- **Slices viewed** (how many screen-sized slices at 375 and how many at 1440 you opened and looked at, out of the total), with **one line per slice**: what is in it, and any defect you can see (text overlapping a highlight or badge, a label or number cut off, content covered, an empty half, crowding):
- **First screen at 1440x900 and 375x812:** headline and primary action both visible without scrolling? Headline line count at 1440:

## Checklist

| # | Check | Result (PASS / FAIL / NOT CHECKED) | Evidence and fix (a measured number, not "looks fine") |
|---|---|---|---|
| 1 | Console: zero errors at fresh load | | |
| 2 | No horizontal scroll at 375 | | |
| 3 | Interactive elements at least 44x44 px at 375, width and height | | |
| 4 | Exactly one h1 per page (extra views use h2); landmarks; alt text; form labels | | |
| 5 | Visible focus everywhere; no keyboard trap | | |
| 6 | Reduced motion handled; nothing loops for decoration | | |
| 7 | Contrast: text pairs at 4.5:1 (large 3:1) | | |
| 8 | No collisions or clipping (stamps, sticky header, tables at 375, text under art) | | |
| 9 | Every control does something | | |
| 10 | Every slice viewed: hierarchy, rhythm, one place of visual weight | | |
| 11 | First screen: headline and primary action visible at both sizes; headline at most 4 lines at 1440 | | |
| 12 | Balance and rendering: no half-empty bands, no covered content, code blocks render as one block, tables keep their key columns at 375 | | |

**Found in round 1 and fixed:**
**Left as known defects (and why):**
**Could not check:**
