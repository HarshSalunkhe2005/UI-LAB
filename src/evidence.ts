/* Blind eval pairs shown on the Evidence page: plain Sonnet next to Sonnet with the UI Lab skill, same brief.
 * Screenshots are the first screen at 1440 px, taken from the eval runs (evals/runs). Verdicts and the judges' reasons come from
 * evals/results (phase5.md, phase5b.md, phase5c.md). A pair is a "win" only when both blind judges (one Opus, one Sonnet) pick the skill. */

export type Verdict = 'win' | 'tie' | 'loss'

export interface EvidencePair {
  slug: string
  brief: string
  verdict: Verdict
  /** the run the screenshot shows, and how that brief did across all its runs */
  note: string
  /** one line paraphrasing why the judges chose as they did */
  why: string
}

export const EVIDENCE: EvidencePair[] = [
  {
    slug: '02-analytics-dashboard',
    brief: 'Analytics dashboard for a ferry operator',
    verdict: 'win',
    note: 'Phase 5 run',
    why: 'One dark lead panel answers the 7am question at a glance, and each chart labels its own story.',
  },
  {
    slug: '03-developer-portfolio',
    brief: 'Portfolio for a front-end engineer',
    verdict: 'win',
    note: 'Phase 5 run',
    why: 'A contour-depth hero with a tide slider shows data-viz and accessibility thinking instead of stating it.',
  },
  {
    slug: '04-restaurant-site',
    brief: 'Site for a 28-seat wood-fire restaurant',
    verdict: 'win',
    note: 'Phase 5 run',
    why: 'The coastal-town idea runs through the whole page, from a contour-line hearth to a chart-style map.',
  },
  {
    slug: '05-docs-page',
    brief: 'Documentation page for a date library',
    verdict: 'win',
    note: 'Latest run; it tied the first time',
    why: 'Numbered sections and a filterable token table that keeps its columns at 375 px; the plain page read as a default docs template.',
  },
  {
    slug: '06-ecommerce-product-page',
    brief: 'Product page for a carry-on backpack',
    verdict: 'win',
    note: 'Phase 5 run; the re-run also won',
    why: 'A clear buy box, an order receipt and a proportional litre bar make it feel specific to the product and trustworthy.',
  },
  {
    slug: '08-redesign-generic-page',
    brief: 'Redesign of a generic analytics landing page',
    verdict: 'win',
    note: 'Phase 5 run',
    why: 'It commits to a brand: a saturated yellow hero with "moved." reversed out, and a scannable features table.',
  },
  {
    slug: '01-saas-landing',
    brief: 'Landing page for a support-ticket digest tool',
    verdict: 'loss',
    note: 'Latest run. Over six runs: 0 wins, 2 ties, 4 losses',
    why: 'Both judges chose the plain page: the skill hero was more distinctive, but its highlight bar clips the headline and the footer links wrap.',
  },
  {
    slug: '07-mobile-app-screen',
    brief: 'Habit-tracker app screen',
    verdict: 'loss',
    note: 'Latest run. Over six runs: 1 win, 2 ties, 3 losses',
    why: 'Judges preferred the familiar, polished streak card; the skill\'s heavy outlines and tight spacing felt cramped at 375 px.',
  },
]

export const EVIDENCE_SUMMARY =
  'Wins on specific, dense or structured briefs. No better than plain Sonnet on generic SaaS landing pages or mobile app screens.'
