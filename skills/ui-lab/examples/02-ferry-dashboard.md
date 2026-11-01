# Example: analytics dashboard (Harbor)

Real output of a Build run. The audit report is the real script output.

## Brief

A single-screen dashboard for Harbor, a ferry operator with 6 routes. The ops manager checks it at 7am for on-time rate, passenger load against capacity per route, delays by cause, and which sailings need attention today. It needs a date range control, a route filter, a sortable table of today's sailings and at least two charts. Dense, scannable, real-looking data.

## Gate 2 table

| Axis | Default | Candidates | Chosen |
|---|---|---|---|
| ground | dark navy and cyan | 9 Departures Board (Machine and Signal) or 20 Nautical Chart (Instrument and Spec) | 20: paper chart ground, sea-blue steps |
| type | Inter | Barlow or Plex, or Crimson italic with Public Sans | Crimson Pro italic soundings, Public Sans tabular |
| layout | four identical KPI tiles over a card grid | | one lead navy panel, charts, a working table that scrolls inside itself |
| accent | cyan and green status colours | | magenta means "act now" and nothing else |
| motion | fade-up | | none beyond 150ms state changes |

Refusals: no status colour used as decoration, no donut, no card shadows.

## Direction card (design/direction.md)

Mood: calm, exact, maritime. Memorable moment: the navy lead figure drawn over generated contour lines, set in italic serif like a chart sounding.

```css
:root{
  --surface:#efe9d6; --surface-raised:#f7f2e2; --ink:#1d2b3a; --ink-muted:#4a5a6a;
  --accent:#a3166b; --accent-ink:#fff; --border:#7d93a8; --rule:#cfc8b0;
  --sea1:#dbe6ea; --sea2:#b9d0d9; --sea3:#8fb2c2; --sea4:#5f90a6;
  --font-display:'Crimson Pro',Georgia,serif; --font-text:'Public Sans',system-ui,sans-serif;
  --dur-fast:150ms;
}
```

## Code excerpt: the table filter and its sortable table

```html
<div class="seg attn" id="attnSeg" role="group" aria-label="Sailings shown">
  <button type="button" data-a="1" aria-pressed="true" id="bAtt">Needs attention</button>
  <button type="button" data-a="0" aria-pressed="false" id="bAll">All sailings</button>
</div>
<table id="tbl">
  <caption class="sr">Today's sailings, sortable by column</caption>
```

The segmented control is two real buttons with `aria-pressed`, not styled divs, and the table has a caption for screen readers.

## Audit report

```
0 critical, 0 warning, 0 suggestion.
```

## Screenshot reference (described, no image in the package)

First screen at 1440 by 900: a thin filter bar (7, 14 or 30 days, route select, Reset) over a row of five figures. The first is a wide navy panel holding "82.1%" in large italic serif over faint contour lines, with a line saying it is 7.9 points below the 90% target. Four plain bordered figures sit beside it. Below are three charts: a line with a dashed 90 target and hollow dots where the day missed it, horizontal load bars with a magenta tick where a route passed 95%, and delay causes as bars sorted by minutes. The sailings table starts at the bottom edge with magenta marks on the rows that need a call.

## Why it works as an example

The house style was replaced (not tinted) because Gate 2 found the default, and the one saturated colour is reserved for the single thing the manager must act on.
