# Example: redesign of a generic landing page (Orbit Analytics)

Real output of a Redesign run (Gate R). The audit report is the real script output.

## Brief

Redesign the existing landing page for Orbit Analytics. Keep the product, the information and the section order (hero, logos, features, testimonials, pricing, CTA, footer). Change everything that makes it look generic: layout, type, colour, spacing, motion, and copy where it is vacuous.

## Gate 2 table (the before-state is the default)

| Axis | Before | Candidates | Chosen |
|---|---|---|---|
| ground | white with a lavender gradient | Swiss Grid and Data Poster (Instrument and Spec) or Neo-Brutalist Print (Loud and Graphic) | flat mustard hero, near-black testimonial band, cobalt call to action; the ground changes four times down the page |
| type | Inter | | Bricolage Grotesque display with Schibsted Grotesk text |
| layout | centred column, three identical cards | | asymmetric hero with a chart, ruled feature rows with one oversized lead row, quote-led testimonials, a bordered plan table |
| accent | purple-blue gradient | | cobalt only for the flagged data point and the call to action |
| motion | hover lift | | one orbit path that draws on load, off under reduced motion |

Chosen because "explain why the metric moved" needs an evidence-led hero, not a new skin. Boldest element: a very large headline with one inverted word.

Preserved: product, section order, prices, plan contents, names and roles. Changed: copy where vacuous, and all visuals. Refusals: no gradients, no emoji icons, no equal card grids.

## Direction card (design/direction.md)

```css
:root{
  --ink:#16140f; --ink-2:#4a4538; --paper:#f5efe0; --sun:#f2c230; --cobalt:#2236c9;
  --display:'Bricolage Grotesque','Arial Narrow',system-ui,sans-serif;
  --text:'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',sans-serif;
}
```

## Code excerpt: the hero

```html
<h1>Know why the number <em>moved.</em></h1>
<p class="lede">Orbit Analytics reads your event stream and tells your team what changed, where it started and who it touched, without a ticket to the data team.</p>
<svg class="chart" viewBox="0 0 520 440" role="img" aria-label="Chart of weekly sign-ups orbiting a baseline, with a spike in week 9 flagged and traced to a referral campaign">
```

The vacuous headline became a promise, and the hero art is data with a label, not decoration.

## Audit report

```
0 critical, 0 warning, 0 suggestion.
```

## Screenshot reference (described, no image in the package)

First screen at 1440 by 900: a flat mustard ground. "Know why the number moved." is set in three very heavy lines at the left, the last word white on a black block. On the right, concentric orbit rings with a thick spiral path, a cobalt dot labelled "Week 9: sign-ups +38%" and the note "Traced to one referral campaign". Below the fold line a cream band carries the customer names in bold type.

## Known defect

In that screenshot the annotation text sits over the orbit line, which a render check would catch (Gate 5 item 8). It is kept here as an honest example of what a verification pass should still flag.
