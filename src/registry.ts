import type { ComponentType } from 'react'
import Tokens from './patterns/foundations/Tokens'
import Buttons from './patterns/components/Buttons'
import ScrollReveal from './patterns/motion/ScrollReveal'
import ViewTransitionGrid from './patterns/motion/ViewTransitionGrid'
import CountUp from './patterns/motion/CountUp'
import CommandPalette from './patterns/components/CommandPalette'
import MeshGradient from './patterns/recipes/MeshGradient'
import Toast from './patterns/components/Toast'
import Drawer from './patterns/components/Drawer'
import BentoGrid from './patterns/layouts/BentoGrid'
import Timeline from './patterns/dataviz/Timeline'
import Marquee from './patterns/recipes/Marquee'
import SpotlightCard from './patterns/motion/SpotlightCard'

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

const ALL: Pattern[] = [
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
  {
    slug: 'command-palette',
    title: 'Command palette',
    category: 'Components',
    summary: 'Ctrl/⌘K launcher on the native <dialog>: focus trap, Esc and backdrop for free, arrow-key navigation.',
    when: ['Any app with more than a handful of pages or actions', 'Power-user shortcut on top of normal nav, never instead of it'],
    file: 'components/CommandPalette.tsx',
    source: { label: 'Heavier alternative: cmdk', url: 'https://github.com/pacocoursey/cmdk' },
    Component: CommandPalette,
  },
  {
    slug: 'mesh-gradient',
    title: 'Animated mesh gradient',
    category: 'Recipes',
    summary: 'Three blurred blobs drifting on offset loops, plus SVG grain. Pure CSS hero background.',
    when: ['Hero and section backgrounds', 'Set --mesh-a/b/c to rebrand; pair with big display type'],
    file: 'recipes/MeshGradient.tsx',
    source: { label: 'Generator alternative: Mesh Gradient', url: 'https://www.meshgradient.com/' },
    Component: MeshGradient,
  },
  {
    slug: 'toast',
    title: 'Toasts',
    category: 'Components',
    summary: 'Provider + useToast() hook. Stacks up to four, auto-dismisses, springs in, announced via aria-live.',
    when: ['Confirming a background action (saved, sent, copied)', 'Never for errors the user must act on; use inline errors'],
    file: 'components/Toast.tsx',
    source: { label: 'Fuller alternative: Sonner', url: 'https://sonner.emilkowal.ski/' },
    Component: Toast,
  },
  {
    slug: 'drawer',
    title: 'Drawer',
    category: 'Components',
    summary: 'Left or right sheet on the native <dialog>, with animated exit and backdrop fade.',
    when: ['Filters, settings, detail panes that keep list context', 'Mobile navigation'],
    file: 'components/Drawer.tsx',
    Component: Drawer,
  },
  {
    slug: 'spotlight-card',
    title: 'Spotlight card',
    category: 'Motion',
    summary: 'Cursor-following glow and slight 3D tilt, driven by CSS variables so React never re-renders.',
    when: ['Feature grids and pricing cards on landing pages', 'Sparingly: one group per page'],
    file: 'motion/SpotlightCard.tsx',
    Component: SpotlightCard,
  },
  {
    slug: 'bento-grid',
    title: 'Bento grid',
    category: 'Layouts',
    summary: 'Six-column grid with mixed tile spans and dense packing. Collapses to one column on phones.',
    when: ['Feature overviews and dashboard summaries', 'Landing sections that need hierarchy without a long list'],
    file: 'layouts/BentoGrid.tsx',
    Component: BentoGrid,
  },
  {
    slug: 'timeline',
    title: 'Event timeline',
    category: 'Data viz',
    summary: 'Vertical rail with aligned mono timestamps and confidence-coloured dots. Rows reveal on scroll.',
    when: ['Activity feeds, audit logs, reconstructed days (MemoryShards)', 'Order and delivery tracking'],
    file: 'dataviz/Timeline.tsx',
    Component: Timeline,
  },
  {
    slug: 'marquee',
    title: 'Infinite marquee',
    category: 'Recipes',
    summary: 'Seamless looping strip with faded edges, pause on hover, any speed and direction.',
    when: ['Logo walls, tech stacks, testimonials', 'Keep it decorative; nothing essential should scroll away'],
    file: 'recipes/Marquee.tsx',
    Component: Marquee,
  },
]

/** Sorted by category so the grid and prev/next follow the sidebar order. */
export const PATTERNS: Pattern[] = ALL.map((p, i) => ({ p, i }))
  .sort((a, b) => CATEGORIES.indexOf(a.p.category) - CATEGORIES.indexOf(b.p.category) || a.i - b.i)
  .map(({ p }) => p)
