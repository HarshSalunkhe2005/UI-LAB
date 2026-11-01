# Example: restaurant site (Salt and Ember)

Real output of a Build run. The audit report is the real script output, including the warning that was left.

## Brief

The site for Salt and Ember, a 28-seat wood-fire restaurant in a coastal town. It needs a hero, the story, a menu (starters, mains, desserts, drinks with prices), opening hours, location, a reservation form and a private-dining note. It should make you hungry and feel like one specific place.

## Gate 2 table

| Axis | Default | Candidates | Chosen |
|---|---|---|---|
| ground | charcoal and warm cream | 8 Warm Organic (Soft and Living) or 20 Nautical Chart (Instrument and Spec) | night-sea navy, chart paper, sea-blue menu, an ember band |
| type | display serif with an italic accent word | | Crimson Pro roman with Public Sans, no italic accent word |
| layout | centred hero and three cards | | chart sheet: hero art with a control, tide-table hours, harbour chart |
| accent | orange glow | | ember is for fire and the booking action only |
| motion | fade-up everywhere | | flame flicker, and contours that redraw when the heat control moves |

Chosen: world 20 Nautical Chart, adapted so ember replaces the hazard magenta. Boldest element: heat contours around the hearth. Swap test: the contours, the tide table and the harbour chart belong to this place and no other. Rhythm: night, paper, sea, night, ember, night.

## Direction card (design/direction.md)

```css
:root{
  --night:#0f1c27; --night-2:#16293a; --paper:#efe9d6; --paper-2:#f7f2e2;
  --ink:#1d2b3a; --ink-muted:#44546a; --sea-3:#8fb2c2; --sea-4:#5f90a6;
  --ember:#e2552b; --ember-deep:#b8391a; --coal:#ffb27a;
  --on-night:#efe9d6; --on-night-muted:#a9b9c6; --rule:#7d93a8;
  --font-display:'Crimson Pro',Georgia,'Times New Roman',serif;
}
```

## Code excerpt: opening hours as a tide table

```html
<table class="tides" id="tides">
  <caption>Weekly service, Porth Ennis time</caption>
  <tbody>
    <tr data-d="1" class="closed"><th scope="row">Monday</th><td>Closed</td><td class="r">Wood-splitting day</td></tr>
    <tr data-d="3"><th scope="row">Wednesday</th><td>5:30 pm to 10:00 pm</td><td class="r">Dinner</td></tr>
  </tbody>
</table>
```

Hours are a real table with row headers, styled like a tide table, and today's row is picked out by script from the data attribute.

## Audit report

```
WARNING (1)
  [small-target] nav a.btn-nav: about 22px tall from padding (estimate)  (heuristic)
SUGGESTION (2)
  [vh-100] .hero: uses 100vh
  [repeated-reveal] the same reveal animation is applied to 8 elements  (heuristic)
0 critical, 1 warning, 2 suggestion.
```

Left as known: the nav link estimate is a heuristic (the rendered check passed at 375). The 100vh hero and the repeated reveal are suggestions the builder chose not to act on.

## Screenshot reference (described, no image in the package)

First screen at 1440 by 900: a night-navy ground covered in orange and slate contour lines that radiate from a small flame at centre right, with elevation numbers in italic and a compass mark top right. "Salt and Ember" is set very large in cream roman at the lower left (the ampersand is ember), with a two-line description and two buttons. A bordered hearth panel reads "480 C" with a heat slider.

## Why it works as an example

A restaurant brief usually produces warm cream and a serif italic. Here the place is a coast, so the system came from charts, and the colour that means fire appears only on fire and on the booking action.
