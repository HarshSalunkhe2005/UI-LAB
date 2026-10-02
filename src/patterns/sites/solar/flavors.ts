export type Flavor = {
  name: string
  tag: string
  blurb: string
  bg: string
  fg: string
  can: string
  accent: string
  ink: string
}

export const FLAVORS: Flavor[] = [
  {
    name: 'Blood Orange',
    tag: 'Nº 01 — Bright',
    blurb: 'Sicilian blood orange, a squeeze of yuzu peel, and bubbles that hit like a sunrise.',
    bg: '#ff5a1f',
    fg: '#1b0802',
    can: '#ff6a2b',
    accent: '#ffd23f',
    ink: '#1b0802',
  },
  {
    name: 'Lime Volt',
    tag: 'Nº 02 — Electric',
    blurb: 'Persian lime and green mandarin. Sharp, cold, and loud enough to wake a Monday.',
    bg: '#c6f432',
    fg: '#0e1a00',
    can: '#1d6b3a',
    accent: '#d8ff4f',
    ink: '#f2ffd0',
  },
  {
    name: 'Midnight Berry',
    tag: 'Nº 03 — Deep',
    blurb: 'Blackcurrant, blueberry and a thread of vanilla. The one you save for after dark.',
    bg: '#5b2bff',
    fg: '#ffffff',
    can: '#2a1070',
    accent: '#ff7ad9',
    ink: '#ffffff',
  },
]

export const STORY_BG = '#fff1dc'
export const STORY_FG = '#1b0802'
export const CTA_BG = '#0f0805'
export const CTA_FG = '#fff1dc'
