# Accessibility: the short version that actually gets applied

Accessible design is not a separate phase. It is a handful of habits that, applied while building, cost almost nothing and
are expensive to retrofit. This page is the checklist UI Lab itself is audited against (axe-core run over every pattern page,
plus keyboard and reduced-motion checks).

## The ten habits

1. **Use the real element.** A `<button>` for actions, `<a href>` for navigation, `<label for>` for fields, `<table>` with `<th scope>` for data. Native elements bring keyboard, focus and screen-reader behaviour for free. A `div` with `role="button"` needs all of it rebuilt by hand.
2. **Everything reachable by keyboard.** Tab through the page. Every control must be reachable, in a sensible order, with a **visible** focus style (never `outline: none` without a replacement).
3. **Contrast.** Body text 4.5:1 against its background; large text and UI borders 3:1. Check on the real colours, including text on images and on hover states.
4. **Touch targets 44px.** Small icons get padding, not just size.
5. **Do not rely on colour alone.** Up/down, error/ok and selected states also use a sign, an icon, a word or a shape.
6. **Respect reduced motion.** Under `prefers-reduced-motion: reduce`, remove travelling motion and parallax; keep state changes instant. Never put essential content only inside an animation.
7. **Name everything.** Icon-only buttons need `aria-label`. Landmarks (`nav`, `main`) get labels when there is more than one of a kind.
8. **Headings in order.** One `h1`, then `h2`, `h3` without skipping levels. Headings describe the structure; do not choose them for their size.
9. **Say what changed.** Dynamic updates (form errors, "3 results", a toast) go in an `aria-live` region, or move focus to the new content.
10. **Zoom and reflow.** The page works at 200% zoom and at 375px wide with no horizontal scrolling.

## For motion-heavy pages

- The content should be readable with the animation switched off, in the DOM, in order.
- Scroll-jacking (taking over the wheel) must leave keyboard, touch and scrollbar scrolling intact.
- Autoplaying sound is never acceptable; start audio only on a user gesture, at a low level.
- Flashing: nothing flashes more than three times a second.

## Testing in five minutes

1. Put the mouse away and tab through the whole page.
2. Turn on reduced motion in the operating system and reload.
3. Zoom to 200%, then resize to 375px.
4. Run axe-core (the browser extension, or `axe.run()` in the console) and fix everything marked serious or critical.
5. Turn on a screen reader (VoiceOver, NVDA) and listen to the first screen and one form.

## Where this shows up in UI Lab

- Every pattern has an **Accessibility** note saying how it handles keyboard, screen readers and reduced motion.
- The home page has a skip link, labelled landmarks, a search field with a visible label for assistive tech, and a plain-language explanation of each category.
- `playbook/verify.md` lists the bugs we have already hit and fixed.
