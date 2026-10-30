# Accessibility: habits that cost nothing when applied while building

Accessibility is not a separate phase. These habits are cheap during the build and expensive to retrofit. Target WCAG 2.2 level AA.

## The ten habits

1. **Use the real element.** `<button>` for actions, `<a href>` for navigation, `<label for>` for fields, `<table>` with `<th scope>` for data, `<details>` for disclosure. Native elements bring keyboard, focus and screen-reader behaviour for free.
2. **Everything reachable by keyboard**, in a sensible order, with a visible focus style. Never `outline: none` without a replacement; prefer `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }`.
3. **Contrast.** Body text 4.5:1; large text and meaningful UI borders and icons 3:1. Check text on images, hover, disabled and state colours.
4. **Touch targets at least 44 by 44 px** with space between neighbours (WCAG 2.5.8 sets 24 px as the floor; 44 is the comfortable target). Small icons get padding, not just size. Inline links in a sentence are exempt.
5. **Do not rely on colour alone.** Up and down, error and ok, selected: add a sign, icon, word or shape.
6. **Respect reduced motion.** See `motion.md`. Nothing essential only inside an animation.
7. **Name everything.** Icon-only buttons need an accessible name (`aria-label` or visually hidden text). Landmarks get labels when there is more than one of a kind. Images carry meaningful `alt`, or `alt=""` when decorative.
8. **Headings in order.** One `h1`; `h2`, `h3` without skipping. Headings describe structure; choose them for meaning, not size.
9. **Say what changed.** Dynamic updates (form errors, "3 results", a toast) go in an `aria-live` region, or move focus to the new content.
10. **Zoom and reflow.** Works at 200% zoom and at 375 px with no horizontal scrolling and no clipped content.

## Page structure

- A skip link as the first focusable element on content-heavy pages.
- Landmarks: `header`, `nav`, `main` (one), `footer`; `aside` and `section` only with an accessible name.
- `<html lang="...">` set. A viewport meta tag that does not block zoom.
- Page `<title>` that says where you are.

## Forms

- A visible `<label>` per control; placeholders are not labels.
- Required and format hints in text, before the field.
- Errors: next to the field, in words, tied with `aria-describedby`; a summary at the top that receives focus after a failed submit.
- Do not clear a form on error. Group related controls in `<fieldset>` with `<legend>`.
- Use the right `type` and `autocomplete` values.

## Tables, charts and data

- Real tables for tabular data, `<caption>` for the title, `scope` on headers, `aria-sort` on the sorted header.
- Every chart has a text alternative or a data table behind a toggle; series are separated by label or pattern, not hue alone.
- Status chips carry text. Large result lists announce counts when filters change ("Showing 12 of 56").

## Components

- **Tabs:** `role="tablist"`, arrow keys move, Tab enters the panel.
- **Menus and popovers:** Escape closes and returns focus; focus stays inside modal dialogs; use the native `<dialog>` where possible.
- **Toasts:** `role="status"` (polite) for confirmations, `role="alert"` only for errors that need interrupting; leave them on screen long enough to read, with a way to dismiss.
- **Carousels and tickers:** pause control; do not auto-advance by default.
- **Custom controls** (sliders, comboboxes): follow the ARIA Authoring Practices pattern, including arrow keys and Home and End.

## Motion-heavy and scroll pages

- The content is readable in the DOM, in order, with animation off.
- Scroll-jacking must leave keyboard, touch and scrollbar scrolling intact.
- Autoplaying sound is never acceptable; start audio on a user gesture, at a low level.
- Nothing flashes more than three times a second; anything moving longer than five seconds can be paused.

## Five-minute test

1. Put the mouse away; Tab through the whole page.
2. Turn on reduced motion and reload.
3. Zoom to 200%, then resize to 375 px.
4. Run an automated checker (an axe-core integration, or the browser's built-in audit) and fix serious and critical issues.
5. If you can, listen to the first screen and one form with a screen reader.
6. Greyscale test: does the page still communicate?

Automated tools find roughly a third of problems. The keyboard pass and the render pass find most of the rest. When something fails, see `bugs.md`.
