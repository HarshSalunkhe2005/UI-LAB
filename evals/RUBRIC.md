# Design rubric (eval scoring)

Ten criteria, each scored **0, 1 or 2**. Total /20. Score from the screenshots (1440 and 375) plus the page's own source and the mechanical checks in the shot report. Score blind where possible: the grader sees the output, not which agent made it.

Anchor words: **0** = fails / generic default; **1** = competent but unremarkable or with visible flaws; **2** = deliberate, specific, would survive a design review.

| # | Criterion | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | **Distinctiveness** | Interchangeable with any AI-generated page for this category: 2023 slop (purple/blue gradient, centred hero, three icon cards) **or the current convergent house style** (see below) with nothing in the brief to earn it | One or two deliberate choices, rest default; or a convergent default that the brief only partly earns | A clear point of view that the brief, audience or product chose; you could not swap the content for another brand's without it feeling wrong; no convergent default present unless earned |
| 2 | **Hierarchy** | Everything similar weight; eye has no path | Main heading and CTA clear, secondary levels muddy | One obvious entry point, clear second and third levels, grouping by proximity and contrast, not just boxes |
| 3 | **Typography** | System/default fonts everywhere, or no real scale | Sensible pairing or scale but generic (Inter everywhere), line length/leading off in places | Chosen pair with distinct roles, a real scale, good measure (45-80ch) and leading, numerals/caps handled |
| 4 | **Colour** | Default framework palette or gradient wash; low contrast in places | Coherent palette but not tied to the brand/subject, or accent overused | Restrained, role-based palette (surface, ink, accent, state) that fits the subject; contrast passes |
| 5 | **Spacing & rhythm** | Cramped or uniformly padded; no scale | Mostly consistent, some sections feel off | Visible spacing scale, intentional density change between sections, alignment on a grid |
| 6 | **Motion restraint** | Gratuitous (everything fades/bounces) or none where a state change needs it | Some purposeful transitions, some noise | Motion explains state or guides attention only; respects reduced-motion; nothing loops for decoration |
| 7 | **Accessibility** | Missing landmarks/labels, low contrast, no focus styles, div-buttons | Basics present, gaps in focus/labels/targets | Semantic landmarks, visible focus, labelled controls, contrast met, 44px targets, reduced-motion handled |
| 8 | **Responsiveness** | Breaks (overflow, overlap, unreadable) at 375 | Works at 375 but is a squashed desktop | Designed at both: layout changes meaning at 375 (reordered, simplified), no horizontal scroll |
| 9 | **Content realism** | Lorem ipsum, "Feature One", vague superlatives, fake round numbers everywhere | Plausible copy, generic voice | Specific, in-voice copy and data a real client could ship; numbers that hang together |
| 10 | **Bug-free** | Console errors, broken layout, dead controls, overflow | One or two small defects (a dead link, a clipped label) | Console clean, every control works, no clipping/overlap at either width |

## Convergent defaults (penalised under criterion 1 unless the brief earns them)

These are what a modern agent produces when it avoids the 2023 slop. Treat them as defaults, not as taste.

- **Editorial house style:** cream or off-white ground, a heavy display serif with one italic accent word in a warm colour, a mono eyebrow label, a rotated "sample" stamp or badge, hard offset shadows, a marquee ticker.
- **Default dashboard:** dark navy/slate ground, blue plus amber accents, a donut chart, KPI tiles in a row.
- **Bento grid** of unequal rounded tiles as the feature section.
- **Numbered section labels** ("01 / How it works") that carry no meaning.
- **Display serif plus warm orange on charcoal** for any food or hospitality brief.

"Earned" means the brief, the audience or the product points to it (a print magazine might earn the editorial style; a hospitality brief with a wood-fire kitchen might earn a warm dark palette). A match that the scorer cannot justify from the brief is scored as 0 or 1 on criterion 1, whatever its polish. Record which defaults were present in the run notes.

## Mechanical checks (recorded per run, feed criteria 3, 7, 8, 10)

From the JSON that `evals/shoot.mjs` writes next to the screenshots:
- `consoleErrors` (count) → criterion 10
- `hOverflow375` (document wider than the viewport at 375) → criteria 8, 10
- `smallTargets` (interactive elements under 44px tall at 375) → criterion 7
- `imgsMissingAlt`, `inputsUnlabelled`, `landmarks` → criterion 7
- `fonts` (computed font families on headings and body) → criterion 3

## Procedure

1. Open both screenshots in full. Do not read the source first.
2. Write one line per criterion: the score and the evidence you saw.
3. Then read the source and the JSON; adjust criteria 3, 7, 10 only if the evidence is mechanical.
4. List the top 3 defects, ordered by how much they would cost in a design review.

## Win condition (for later phases)

A skill run beats its baseline on a brief when its total is higher by at least 3 points and criterion 1 (distinctiveness) is not lower. The skill must win at least 7 of 8 briefs. A negative prompt passes when no UI Lab skill content is loaded or reflected in the answer.
