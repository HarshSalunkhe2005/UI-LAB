# Patterns

12 canonical patterns: self-contained HTML, CSS and a little vanilla JavaScript. Pick by "use when", open the file, take the structure and the accessibility behaviour, then replace the tokens (the `:root` block at the top) with your direction's tokens. Each file starts with a header comment with accessibility notes and how to adapt it. They use neutral system fonts and a plain palette on purpose: they are starting points, not finished design.

## Docs

- `patterns/code-block-copy.html`: Documentation. A readable code sample with one copy button, a language label, horizontal scroll that does not break the page, and…

## Dense UI

- `patterns/data-table-sortable.html`: Any list of records with several columns that users scan, sort and act on. Never ship a table that clips or blind-scrolls on a ph…
- `patterns/kpi-lead-figure.html`: A dashboard summary. One number carries the answer to the user's first question, set against its target; the rest are smaller and…

## Forms and states

- `patterns/empty-state.html`: Lists, search results and filtered tables that can return nothing. Say what is empty and why, then give the single next action.
- `patterns/form-field-errors.html`: Any form that can fail validation. Errors appear next to the field in words, are tied to the input, and an error summary receives…
- `patterns/toast-live.html`: Short confirmations after an action ("Saved", "Copied") and errors that do not block. Not for anything the user must act on: use…

## Sections

- `patterns/faq-details.html`: Questions people ask before buying or connecting. Native details gives keyboard support, correct semantics and no JavaScript.
- `patterns/pricing-plain.html`: Any pricing section. Each plan states who it is for in the buyer's terms and what changes between plans, with no scaled middle ti…

## Hero

- `patterns/hero-evidence.html`: The product turns an input into an output (tickets into a digest, logs into alerts). Show the transformation on the first screen…

## Navigation

- `patterns/nav-responsive.html`: Marketing and content sites with 4 to 7 links and one action. Inline links at desktop width, a disclosure menu at 375.
- `patterns/toc-scrollspy.html`: Documentation, long articles, product pages with several sections. A right-hand outline shows where you are and jumps to sections.

## Commerce

- `patterns/product-gallery.html`: A product detail page with several images or views. One large view, a row of thumbnails, no carousel library.

