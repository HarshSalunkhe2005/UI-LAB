# Dense UI: dashboards, admin tools, editors

For screens a person works in rather than reads. The measure of success is how fast the right decision is made, not how much fits.

## 1. Start from the decision

Write the three questions the user arrives with and the one action each leads to. The first viewport answers them in that order. Example for an operations dashboard: "Are we on time?" then "Where is it going wrong?" then "Which sailing do I phone about?" The last one is the action list and belongs high, not below the fold.

- Put "needs attention" above or beside summaries, not under them.
- A summary number needs a comparison (target, yesterday, last week) or it is decoration.
- Remove any figure no decision depends on.

## 2. Layout

- Use a grid of 8 to 12 columns with a 16 or 24 px gutter and a fixed page padding. Panels align to it. Unequal panel heights are fine; unaligned edges are not.
- Density levels: summary row (large figures), analysis (charts, 200 to 280 px tall), working area (table or list). Give each a distinct visual weight.
- One lead figure larger than the rest. Others at one or two smaller sizes. Not five identical tiles.
- Page background, panel and raised surface differ by tone, not by shadow stacks. One border colour.
- Keep a persistent frame (title, date range, filters) that does not scroll away on long pages.

## 3. Type for numbers

- Use a face with tabular figures (`font-variant-numeric: tabular-nums`) for every column of numbers, and right-align them.
- Scale: 12 (meta), 13 or 14 (table body), 16 (panel titles), 24 to 32 (lead figures), 40 plus only for one hero figure. Do not use below 12 px.
- Labels are small caps or small regular in a muted ink; values are heavier. Units next to values, smaller and muted.
- Pick a text face deliberately. A system stack is acceptable only if the choice is stated; it is not a design.

## 4. Tables

- Row height 32 to 40 px (48 for touch). One height throughout.
- Header row sticky, with the sort control visible; the sorted column and direction are shown (use `aria-sort`).
- Align by data type: text left, numbers right, status and icons centred or left with a fixed width.
- Rules between rows, or gentle zebra, not both. No cell borders in dense tables.
- Status as a chip with text (Delayed, Cancelled) plus colour; never colour alone.
- Row actions on hover and focus, but also reachable by keyboard.
- Long tables: virtualise or paginate; show counts ("56 of 56").
- **At 375 px:** a clipped table is a defect. Choose one:
  - Stacked rows: each row becomes a small block with the key field as the title and the rest as label/value pairs.
  - Column priority: keep two or three columns, collapse the rest into an expandable row.
  - Horizontal scroll only when the first column stays frozen and there is a visible edge fade or hint.

## 5. Charts

- One question per chart, stated in its title as a finding or a label ("Delays by cause, minutes").
- Direct labels on bars, lines and slices instead of legends where possible.
- One accent colour for the series that matters; the rest in neutral tones. Keep the same colour for the same category across the page.
- Prefer sorted horizontal bars over donuts and pies; a donut only for two or three parts of a whole.
- Axes: start bars at zero, thin gridlines, few ticks, units on the axis.
- Mark target lines and the current point. Annotate the one anomaly.
- Give each chart a text alternative or a data table behind a toggle. Do not rely on colour to separate series; add shape, label or pattern.
- Drawn with inline SVG or canvas: set `viewBox` so they scale, and check them at 375.

## 6. Status and colour

- Reserve one signal colour for "act now" and use it nowhere else.
- Semantic set: success, warning, danger, info, neutral. Test each on its background at 4.5:1 for text.
- Add an icon or word to every coloured state.

## 7. Controls

- Filters, date ranges and sort state are always visible and show their current value. A reset is one click.
- Segmented controls for 2 to 5 mutually exclusive choices; select for more.
- Selecting a filter updates all dependent panels together and says so ("Showing 3 routes").
- Controls are at least 44 px high on touch widths even if 32 px on desktop.
- Keyboard: every control reachable, visible focus, Escape closes popovers, arrow keys in segmented controls and menus.

## 8. States people forget

- Loading (skeleton at the final size, not a spinner on a blank), empty ("No sailings match; clear filters"), error (what failed, what to do), stale data (timestamp of last update), partial data.
- Real-looking data: a plausible distribution, a few outliers, at least one bad value. If the data is invented, be consistent: totals equal the sum of the parts, percentages match counts.

## 9. Mobile (375)

- Single column. Lead figure first, then the action list, then charts, then the full table.
- KPIs in a 2-up grid; the lead figure full width.
- Charts keep their labels; reduce to the top few series if needed.
- The filter bar collapses into one control that opens a sheet, with the active filters summarised beside it.
- Tap targets 44 px, spacing between them at least 8 px.

## 10. Quick self-check

- Can a first-time user say what the top problem is in three seconds?
- Is there any panel you could delete without anyone noticing?
- Is every colour carrying meaning?
- Does the table survive 375 px?
- Would the screen still read in greyscale?
