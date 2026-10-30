# World 9. Departures Board

**Family:** Machine and Signal. **Metaphor:** a station hall at dusk; the board is the voice of the building.
**Use when:** rail, ferry, airline, event schedules; anything with times, places and states.
**Never when:** there is no real timetable data, or the board would only be decoration.
**Fonts:** Barlow Condensed (headings) + IBM Plex Mono (board and numbers). Google Fonts.

```css
:root {
  --surface:#080b14; --surface-raised:#16130e; --ink:#f1e8c9; --ink-muted:#b5ab8c; --accent:#ffd23f; --accent-ink:#1a1400; --border:#2c2619;
  --font-display:'Barlow Condensed','Arial Narrow',sans-serif; --font-text:'IBM Plex Mono',ui-monospace,monospace; --font-mono:'IBM Plex Mono',ui-monospace,monospace;
  --step--1:.75rem; --step-0:.9375rem; --step-1:1.125rem; --step-2:1.75rem; --step-3:3rem; --step-4:clamp(3rem,8vw,6rem);
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:20px; --space-5:40px; --space-6:80px;
  --radius:2px; --dur-fast:60ms; --dur:300ms; --ease:steps(4,end);
}
```
**Signature:** a board whose rows change status while you watch (cells cycle through the alphabet to a target, 60 ms a step), with a real table behind it for assistive tech.
**Refuse:** 1. fake urgency colours. 2. flap animation under reduced motion. 3. a board used as decoration.
**First screen:** a dark hall; a board of six real rows (time, place, status) fills the width; the page title is small above it; one yellow action.
