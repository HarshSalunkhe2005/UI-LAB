import type { ComponentType } from 'react'
import Tokens from './patterns/foundations/Tokens'
import Buttons from './patterns/components/Buttons'
import ScrollReveal from './patterns/motion/ScrollReveal'
import ViewTransitionGrid from './patterns/motion/ViewTransitionGrid'
import CountUp from './patterns/motion/CountUp'

export const CATEGORIES = [
  'Foundations',
  'Components',
  'Motion',
  'Layouts',
  'Data viz',
  'Recipes',
] as const

export type Category = (typeof CATEGORIES)[number]

export type Pattern = {
  slug: string
  title: string
  category: Category
  summary: string
  /** When to reach for this. Every entry needs at least one. */
  when: string[]
  /** Source file under src/patterns, shown in the code panel. */
  file: string
  source?: { label: string; url: string }
  Component: ComponentType
}

export const PATTERNS: Pattern[] = [
  {
    slug: 'tokens',
    title: 'Design tokens',
    category: 'Foundations',
    summary: 'Color, type, spacing, radius, elevation and motion tokens. Light/dark aware, no flash.',
    when: [
      'Starting any new project: copy src/tokens/tokens.css first',
      'Plain HTML projects too; the file has no framework dependency',
    ],
    file: 'foundations/Tokens.tsx',
    Component: Tokens,
  },
  {
    slug: 'buttons',
    title: 'Buttons',
    category: 'Components',
    summary: 'Primary / secondary / ghost / danger, three sizes, loading state and a tactile press.',
    when: ['Any clickable action', 'Swap --accent to rebrand without touching the component'],
    file: 'components/Buttons.tsx',
    Component: Buttons,
  },
  {
    slug: 'scroll-reveal',
    title: 'Scroll reveal (CSS only)',
    category: 'Motion',
    summary: 'Elements fade and rise as they enter the viewport using animation-timeline: view(). Zero JS.',
    when: [
      'Landing pages and long-form sections',
      'Prefer this over IntersectionObserver when you only need enter animations',
    ],
    file: 'motion/ScrollReveal.tsx',
    source: {
      label: 'MDN: scroll-driven animations',
      url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations',
    },
    Component: ScrollReveal,
  },
  {
    slug: 'view-transition-grid',
    title: 'Shared-element view transition',
    category: 'Motion',
    summary: 'A card morphs into its detail view with the View Transitions API. Falls back to an instant swap.',
    when: ['Grid → detail navigation', 'Gallery / product / project pages (MemoryShards-style)'],
    file: 'motion/ViewTransitionGrid.tsx',
    source: {
      label: 'MDN: View Transition API',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API',
    },
    Component: ViewTransitionGrid,
  },
  {
    slug: 'count-up',
    title: 'Count-up stats',
    category: 'Motion',
    summary: 'Numbers animate from 0 when scrolled into view, with tabular figures so width stays stable.',
    when: ['Stat tiles on landing pages and dashboards'],
    file: 'motion/CountUp.tsx',
    source: { label: 'For fancier digit rolls: number-flow', url: 'https://github.com/barvian/number-flow' },
    Component: CountUp,
  },
]
