/** Plain-language explanation of each category, shown on the home page and used by the filter. */
export const CATEGORY_INFO: Record<string, { plain: string; for: string }> = {
  Foundations: { plain: 'The base layer: colours, type sizes, spacing and the rules the rest is built on.', for: 'Start a new project with a consistent look.' },
  Components: { plain: 'Everyday interface parts: buttons, menus, dialogs, tabs, forms.', for: 'Drop a well-behaved part into an app.' },
  Text: { plain: 'Headlines and text effects: reveals, scrambles, counters, kinetic type.', for: 'Make a heading feel alive without hurting readability.' },
  Motion: { plain: 'Movement that explains something: scroll effects, transitions, springs, cursors.', for: 'Add motion that has a reason.' },
  Backgrounds: { plain: 'Full-area backdrops: gradients, grids, noise, aurora, particles.', for: 'Give a page depth behind the content.' },
  '3D': { plain: 'Three-dimensional scenes in the browser, with and without WebGL.', for: 'Show a product or a world in 3D.' },
  '3D Motion': { plain: '3D scenes driven by scrolling.', for: 'Tell a story as the visitor scrolls.' },
  Layouts: { plain: 'Page structures: grids, sidebars, bento boxes, split screens.', for: 'Arrange content so it reads well.' },
  Sections: { plain: 'Ready-made page sections: hero, pricing, testimonials, FAQ, footer.', for: 'Assemble a landing page quickly.' },
  Screens: { plain: 'Whole app screens: dashboards, inboxes, settings, checkout.', for: 'Start from a complete screen, not a blank one.' },
  Sites: { plain: 'Complete websites, each in its own design style. Open one full screen and scroll it like a visitor.', for: 'See what a committed design looks like, and borrow its structure.' },
  'Signature moves': { plain: 'One striking technique each, rebuilt from award-winning and popular sites we studied.', for: 'Add a memorable moment to your own page.' },
  'Niche worlds': { plain: 'Designs for specific kinds of subject: timetables, plants, audio gear, newspapers, medicine labels.', for: 'Match the look to what you are selling or saying.' },
  'Modern CSS': { plain: 'Browser features that replace JavaScript: scroll-driven animation, popovers, anchor positioning.', for: 'Ship less code, with a safe fallback.' },
  'Data viz': { plain: 'Charts and data displays built to be read at a glance.', for: 'Show numbers without a charting library.' },
  Recipes: { plain: 'Small techniques you combine: gradients, masks, glass, shadows.', for: 'Learn a trick and reuse it.' },
}

export const START_PATHS = [
  {
    title: 'I want to see finished websites',
    body: 'Seventeen complete sites, each in a different design style. Open one full screen and scroll it.',
    kind: 'sites',
    href: '',
    cta: 'Browse the sites',
  },
  {
    title: 'I need a part to copy',
    body: 'Buttons, sections, effects and screens. Every one runs live, shows its code, and lists how it handles keyboards and reduced motion.',
    kind: 'search',
    href: '',
    cta: 'Search the collection',
  },
  {
    title: 'I am working with an AI assistant',
    body: 'Copy-paste prompts that get a better result, and a guide that maps what you are building to the right style, written for Claude and other agents.',
    kind: 'link',
    href: '#/playbook/prompts',
    cta: 'See the prompts',
  },
] as const

export const HOW_IT_WORKS = [
  { n: 1, t: 'Open one', d: 'Every card runs live. Move, click and press keys to try it.' },
  { n: 2, t: 'Read when to use it', d: 'Each page says what it is for, and how it behaves for people using a keyboard or a screen reader.' },
  { n: 3, t: 'Copy the code', d: 'Switch to the Code tab, copy it, and keep the accessibility handling when you adapt it.' },
] as const
