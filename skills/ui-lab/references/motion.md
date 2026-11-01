# Motion

Motion should explain a change, direct attention, or give weight to an object. If it does none of those, remove it. Decide the motion language per direction (durations, easing, what moves and why) and write it into the direction file.

## What motion is for

| Job | Example | Typical duration |
|---|---|---|
| Confirm an input | Button press, toggle, checkbox | 80 to 150 ms |
| Show a state change | Panel opens, filter applies, row expands, value updates | 150 to 300 ms |
| Orient | Page or view transition, item moving to a new place | 250 to 450 ms |
| Explain a process | A bar growing to a value, a line drawing, tickets becoming counts | 400 to 900 ms, once |
| Create atmosphere | Hero choreography, scroll storytelling | 700 to 1400 ms; only where the world calls for it |

Durations above 1 second need a reason. Nothing should make the user wait for it.

## Easing

- **Entering or growing:** ease-out, `cubic-bezier(.16, 1, .3, 1)` (soft landing) or `cubic-bezier(.2, .8, .2, 1)`.
- **Leaving:** ease-in, shorter than the entrance.
- **Moving between places:** ease-in-out, `cubic-bezier(.65, 0, .35, 1)`.
- **Playful:** a slight overshoot, `cubic-bezier(.34, 1.56, .64, 1)`, on small elements only.
- **Mechanical worlds (boards, receipts, terminals):** `steps(n)` easing makes the motion feel like the machine.
- **Linear** only for continuous loops that carry meaning (a progress or time readout) and for scrubbed scroll.

## Patterns

1. **Press and hover:** change one property (background or transform), 100 to 150 ms. No glow.
2. **Disclosure (accordion, drawer, popover):** animate height or transform with opacity, 200 to 300 ms; the control shows its state. Use `<details>` or the `hidden` attribute so closed content leaves the tab order.
3. **Value changes:** bars and lines move to their new value (200 to 400 ms); numbers update in place with tabular figures; the changed value may briefly highlight (1 to 2 s fade).
4. **Entrance on first view:** one choreographed sequence per page at most; stagger 40 to 80 ms; once only. Do not fade up every block.
5. **Scroll-linked:** use it when the scroll position is the content (a process, a product turning). Keep scroll native; drive visuals from progress. Tie one master timeline to scroll distance rather than many independent triggers.
6. **Page and view transitions:** the View Transitions API gives cross-fades and shared-element moves with little code. Skip them for heavy full-screen routes.
7. **Loading:** skeletons at the final size; progress that shows real progress; no spinner on a blank page for under a second.

## Performance

- Animate `transform` and `opacity`; avoid animating `width`, `height`, `top`, `left` or box-shadow on large areas.
- Use `will-change` sparingly and remove it after the animation.
- One scroll listener per page, passive, and requestAnimationFrame for work; prefer CSS scroll-driven animations or IntersectionObserver where they fit.
- Do not tween a CSS variable on the root if the whole tree reads it; tween one layer.
- Test on a throttled CPU; cap particle and shader counts for mobile.

## Reduced motion

Honour `prefers-reduced-motion: reduce` everywhere:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

That blanket rule is a floor. Better: wrap decorative travelling motion in `@media (prefers-reduced-motion: no-preference)` so it never exists, and keep meaningful feedback (a progress bar, a focus ring) at low amplitude. In script, check `matchMedia('(prefers-reduced-motion: reduce)')` and replace motion with an instant change. Nothing essential may live only inside an animation; autoplaying video and marquees need a pause control.

## Safety

- Nothing flashes more than three times a second.
- Anything that moves on its own for more than five seconds can be paused.
- Parallax and large translations are optional under reduced motion.
- No autoplay audio.

## Review checklist

- Can you say in one sentence what each animation explains?
- Does anything loop? If so, why, and does it stop under reduced motion?
- Does every transition finish in under a second (atmosphere excepted)?
- Does the page read correctly with all motion off?
