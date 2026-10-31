# Accessibility appendix: the habits a script cannot see

{{pro}}The verify script already measures touch targets, the h1 and main landmark, focus and reduced-motion rules, overflow at 375 and text collisions, and the audit catches missing alt text, unlabelled controls and declared contrast failures. {{/pro}}Aim for WCAG 2.2 AA. Do these while building.

1. **Use the real element.** `button` for actions, `a href` for navigation, `label for` for fields, `table` with `th scope` for data, `details` for disclosure, `dialog` for modals.
2. **Do not rely on colour alone.** Up and down, error and ok, selected: add a sign, icon, word or shape. Status chips carry text.
3. **Contrast of every state.** Body text 4.5:1, large text and UI borders 3:1, including hover, disabled and text on images.{{pro}} Check pairs with `scripts/contrast.mjs`.{{/pro}}
4. **Name everything.** Icon-only buttons get an accessible name; a landmark that appears twice gets a label; images carry meaningful `alt`, or `alt=""` when decorative.
5. **Say what changed.** Form errors, "3 results" and toasts go in an `aria-live` region (`role="status"` for confirmations, `role="alert"` only for errors), or move focus to the new content.
6. **Forms.** A visible label per control (a placeholder is not a label); hints before the field; errors beside the field in words, tied with `aria-describedby`; never clear the form on error; the right `type` and `autocomplete`.
7. **Tables and charts.** `caption`, `scope` on headers, `aria-sort` on the sorted column; a chart has a text alternative or a data table behind a toggle.
8. **Keyboard.** Tab through the whole page by hand: order makes sense, Escape closes popovers and returns focus, modals trap focus, custom widgets follow the ARIA Authoring Practices keys, nothing is only reachable by hover.
9. **Motion and scroll pages.** The content is readable in the DOM with animation off; scroll-jacking leaves keyboard, touch and scrollbar scrolling intact; no autoplaying sound; carousels and tickers can be paused.
10. **Zoom.** At 200% zoom and at 375 px nothing is clipped and nothing scrolls sideways.

Automated checks find roughly a third of problems. The keyboard pass and looking at every slice find most of the rest. When a gate fails, see `fixes.md`.
