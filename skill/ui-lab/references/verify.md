# Verify: render it, look at it, fix it in one batch

Code that was never rendered is a guess. The loop is bounded: one batched inspection, one fix round, one confirming round, then stop.

## Rendering without a browser tool

If your tools include a browser, use it. If not, and you can run shell commands, any installed Chrome or Edge can take screenshots headlessly. Use a file URL for a static page, or the dev-server address:

- A first-screen screenshot: run the browser executable with `--headless --screenshot=<out.png> --window-size=1440,900 <url>`. Repeat with `--window-size=375,812` for mobile.
- For a long page, give a tall window (for example `1440,6000`), or scroll in the page and shoot in slices.
- Some headless builds refuse windows narrower than about 500 px. If the 375 screenshot comes back wider or cropped, measure instead: load the page in a 375 px wide iframe inside a test page, or read `document.documentElement.scrollWidth` at that width, and say which method you used.
- Always open the PNG and look at it. A screenshot you did not look at is not a check.

If you can run neither, {{pro}}use `scripts/audit-ui.mjs` and {{/pro}}write NOT RENDERED in the handoff, with the list of checks you could not do.

## The loop

1. Build fully. Typecheck and build must pass.
2. **One batched inspection round**, all of:
   - Fresh load. Wait for loaders to clear. Console: zero errors; read warnings.
   - Every section at 1440 and at 375. Include both ends of any pinned or scrubbed zone.
   - Reduced motion on: the page is readable and operable, nothing loops.
   - Keyboard: Tab through; focus ring visible everywhere; nothing trapped.
   - Resize once between widths; look for overflow and overlap.
   - Contrast of every text pair, including hover and disabled states.
3. Fix everything it showed in one batch. Do not fix and re-shoot one thing at a time.
4. One confirming round. Then stop.
5. Report honestly: what you rendered, at what sizes, what you could not test (real devices, other browsers, screen readers).

## Mechanical checklist

Record each as PASS, FAIL or NOT CHECKED in `design/verify.md` (template: `templates/verify-log.md`).

1. Console: zero errors on fresh load.
2. No horizontal scroll at 375: `document.documentElement.scrollWidth <= innerWidth`.
3. Interactive elements at least 44 by 44 px at 375 (inline text links in a sentence are exempt).
4. One `h1`; `header`, `nav`, `main`, `footer` present where the page has those parts; every `img` has `alt`; every form control has a label.
5. Visible focus on every control; no keyboard trap.
6. `prefers-reduced-motion: reduce` handled; nothing loops for decoration.
7. Text contrast 4.5:1 (large text 3:1).
8. No collisions or clipping: stamps over text, sticky headers over headings, labels cut off, tables cut off at 375, text under illustrations.
9. Every control does something: no dead buttons or anchors, form states for empty, error and success where relevant.
10. The first screen's hierarchy is clear in three seconds, and the page changes rhythm down its length.

## Environment caveats

- Software-rendered WebGL is slow. Wait before judging a 3D screenshot; smoothed or scrubbed values look mid-transition if shot too soon. Do not "fix" slowness that is the test environment; do keep first paint cheap.
- A jump-scroll is not a wheel scroll with a smooth-scroll library. Check both when a library is involved.
- A hidden or throttled browser tab stalls transitions and animation frames; finish animations before screenshots.

## Smoke checklist for the handoff

```
[ ] build and typecheck pass
[ ] console clean on fresh load
[ ] every section screenshotted at 1440 and 375
[ ] no horizontal scroll at 375
[ ] reduced motion usable
[ ] keyboard: focus visible, reachable
[ ] first paint fast; heavy parts code-split; loader shown
[ ] not tested: ______ (be specific)
```

When something renders wrong, check `bugs.md` first.
