/*
 * The router: what to build from, given what the brief smells like.
 * Rendered into /for-claude.md at build time. Every slug is validated against meta.ts (ai-index.ts throws on a typo),
 * so this file cannot silently rot when a pattern is renamed.
 */

export type Route = {
  /** How the brief reads, in the words a client or user would actually use. */
  brief: string
  mode: 'Persuade' | 'Operate' | 'Read' | 'Experience'
  /** Name of the direction (worlds.md or niche-worlds.md). */
  world: string
  /** Which playbook file holds the card. */
  card: 'worlds.md' | 'niche-worlds.md'
  /** Whole sites or patterns that prove it. Open these first. */
  proof: string[]
  /** One sentence: the move that makes it work. */
  move: string
}

export const ROUTES: Route[] = [
  { brief: 'a physical product, "the object is the star"', mode: 'Persuade', world: '1 Product Hero Scroll', card: 'worlds.md', proof: ['site-solar', 'move-frame-scrub'], move: 'The object rotates through stages while label, colour and copy change on state boundaries.' },
  { brief: 'premium, timeless, boutique, hospitality, fashion', mode: 'Persuade', world: '2 Editorial Quiet Luxury', card: 'worlds.md', proof: ['site-mare'], move: 'One oversized photograph cropped with intent; a caption set like a museum label.' },
  { brief: 'developers, API, agents, infra', mode: 'Persuade', world: '3 Technical Dark', card: 'worlds.md', proof: ['site-lattice', 'move-command-demo', 'move-code-to-preview'], move: 'A live product component as the hero, not a screenshot. One accent, used sparingly.' },
  { brief: 'indie, bold, "does not look corporate"', mode: 'Persuade', world: '4 Neo-Brutalist Print', card: 'worlds.md', proof: ['site-hotmess'], move: 'Hard shadows, flat colour and oversized type, applied with discipline.' },
  { brief: 'portfolio, studio, "wow", immersive', mode: 'Experience', world: '5 Cinematic Immersive', card: 'worlds.md', proof: ['site-abyss', 'move-scroll-tunnel', 'move-drive-world'], move: 'The scroll is a camera. One world, one continuous move.' },
  { brief: 'timetable, schedule, live status, rail, airline', mode: 'Persuade', world: '9 Departures Board', card: 'niche-worlds.md', proof: ['site-departures', 'niche-split-flap'], move: 'A board whose cells cycle forward to a target; a real table sits behind it.' },
  { brief: 'archive, specimens, field guide, craft, slow commerce', mode: 'Persuade', world: '10 Botanical Plate', card: 'niche-worlds.md', proof: ['site-herbarium', 'niche-plate-callouts'], move: 'An illustration driven by one number; handwriting only for annotation.' },
  { brief: 'audio, instruments, hardware, "how it sounds"', mode: 'Persuade', world: '11 Hi-Fi Deck', card: 'niche-worlds.md', proof: ['site-tape', 'niche-vu-deck'], move: 'The product is the page: a working control you can hear or see change.' },
  { brief: 'newsletter, journal, essay, finance, long-form', mode: 'Read', world: '12 Broadsheet', card: 'niche-worlds.md', proof: ['site-ledger', 'niche-broadsheet'], move: 'Reading is the interface: columns, sidenotes, size control, a table that does not rely on colour.' },
  { brief: 'retro, hacker, terminal, fiction', mode: 'Experience', world: '13 CRT Terminal / 16 Terminal BBS', card: 'niche-worlds.md', proof: ['niche-crt', 'niche-terminal-bbs'], move: 'Cosmetic effect, but the content stays readable and keyboard-operable.' },
  { brief: 'exhibition, collection, heritage, gallery', mode: 'Experience', world: '14 Museum Placard', card: 'niche-worlds.md', proof: ['niche-museum-placard'], move: 'The caption hierarchy, set exactly as a curator would, with a large-print option.' },
  { brief: 'seasonal, grow, cook, calendar of when', mode: 'Persuade', world: '15 Seed Packet', card: 'niche-worlds.md', proof: ['niche-seed-packet'], move: 'The packet opens to a planting-calendar table with real headers.' },
  { brief: 'divination, outcomes, game of chance, storytelling', mode: 'Experience', world: '17 Tarot', card: 'niche-worlds.md', proof: ['niche-tarot'], move: 'A small deck with meaning on every card; a flip reachable by keyboard.' },
  { brief: 'medicine, dose, safety, compliance', mode: 'Operate', world: '18 Clinical Label', card: 'niche-worlds.md', proof: ['niche-clinical-label'], move: 'Strict hierarchy; warnings carry an icon and a word, never colour alone.' },
  { brief: 'typeface, foundry, design system', mode: 'Persuade', world: '19 Type Specimen', card: 'niche-worlds.md', proof: ['niche-specimen'], move: 'Drag the axes and watch the real letterforms change.' },
  { brief: 'maps, depth, terrain, travel, science', mode: 'Experience', world: '20 Nautical Chart', card: 'niche-worlds.md', proof: ['niche-nautical-chart'], move: 'A generated contour field that responds to a control.' },
]

/** Techniques you are likely to want regardless of world. Each slug rebuilds a studied site. */
export const TOOLBOX: { want: string; slug: string }[] = [
  { want: 'cursor that carries the brand', slug: 'move-label-cursor' },
  { want: 'hover that feels liquid', slug: 'move-liquid-hover' },
  { want: 'text that draws or follows the cursor', slug: 'move-glyph-trail' },
  { want: 'a hero with depth and motion', slug: 'move-mesh-gradient' },
  { want: 'sticky chapters that tell a story', slug: 'move-scrollytelling' },
  { want: 'a number that counts', slug: 'move-odometer' },
  { want: 'a tab pill that slides', slug: 'move-morph-tabs' },
  { want: 'a live command palette demo', slug: 'move-command-demo' },
  { want: 'a toast stack', slug: 'move-toast-stack' },
  { want: 'an image-sequence scrub', slug: 'move-frame-scrub' },
]

/** Briefs worth refusing or sending back for one sharp question. */
export const REFUSE_UNTIL_CLEAR = [
  'No real content. A site with lorem ipsum cannot be designed, only decorated. Ask for the actual words, numbers and images.',
  'A world that is not earned by the content. A departures board for a bakery fails the swap test; use a general world.',
  'Two worlds at once. Cross techniques, keep one identity.',
  'A hero that needs an asset nobody has (a model, a photoshoot). Say so, propose the cheapest honest substitute, and ask.',
]
