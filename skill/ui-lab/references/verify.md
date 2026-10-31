# Verify: render it, look at it, fix it in one batch

Code that was never rendered is a guess. The loop is bounded: one batched inspection, one fix round, one confirming round, then stop.

## Rendering without a browser tool

If your tools include a browser, use it. If not, and you can run shell commands, any installed Chrome or Edge can take screenshots headlessly. Use a file URL for a static page, or the dev-server address:

- A first-screen screenshot: run the browser executable with `--headless --screenshot=<out.png> --window-size=1440,900 <url>`. Repeat with `--window-size=375,812` for mobile.
- For a long page, give a tall window (for example `1440,6000`), or scroll in the page and shoot in slices.
- Headless Chrome and Edge refuse windows narrower than about 500 px, so a screenshot "at 375" of the page itself is really wider. Use `templates/viewport-probe.html` instead (below).
- A full-page screenshot of a long page is downscaled when you open it, which hides defects. View it in screen-sized slices.

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

## The viewport probe (375 px view, every slice, measurements)

`templates/viewport-probe.html` needs no tools beyond a headless browser and does not touch the network. Copy it next to your page, set `PAGE` at the top of its script (default `index.html`), then:

1. Screenshot: run the browser with `--headless --allow-file-access-from-files --window-size=1700,1900 --screenshot=probe.png` and the probe's file URL. The image shows your page at 375 px wide as consecutive phone-screen slices (numbered 1, 2, 3, ...), side by side, with a measurements block at the top. Open it and look at every slice.
2. Numbers: run the same command with `--virtual-time-budget=6000 --dump-dom` instead of `--screenshot`; the measurements are in the `<pre id="report">` element. They list horizontal overflow, every interactive element under 44 px in width or height (inline links excepted), elements past the right edge, the `h1` count, images without alt and inputs without labels.
3. If the page is served over http, the `--allow-file-access-from-files` flag is not needed.

For the 1440 view, screenshot the page itself with a tall window (for example `--window-size=1440,6000`) and look at it in parts.

What the probe cannot do: it does not capture the console, it does not tab through the page, and it measures after load only (anything that appears on interaction needs a manual check).
