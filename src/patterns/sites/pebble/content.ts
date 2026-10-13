/* The content of the portfolio, written once. The terminal and the plain page both read from it. */

export const PERSON = {
  name: 'Mira Okafor',
  role: 'Systems engineer',
  place: 'Leeds, UK',
  email: 'mira@pebble.example',
}

export type Project = { id: string; name: string; year: string; line: string; detail: string }

export const PROJECTS: Project[] = [
  {
    id: 'tidewatch',
    name: 'tidewatch',
    year: '2025',
    line: 'A small daemon that turns harbour sensor noise into a tide you can trust.',
    detail: 'Reads six sensors, rejects outliers with a rolling median, and publishes one number a minute. Runs on a Raspberry Pi in a bait shed and has missed two readings in a year.',
  },
  {
    id: 'ledgerd',
    name: 'ledgerd',
    year: '2024',
    line: 'An append-only journal with checksums, for people who lose power a lot.',
    detail: 'Every record carries a checksum of the record before it. After a crash the tail is verified and trimmed, never guessed. About 900 lines of Rust and a long README on why.',
  },
  {
    id: 'plainlog',
    name: 'plainlog',
    year: '2023',
    line: 'Structured logs you can read without a tool.',
    detail: 'A logging format that is both valid JSON lines and a legible sentence. Adopted by two teams who were tired of piping everything through a viewer.',
  },
]

export const ABOUT =
  'I build small, dull, reliable systems: things that run for years without being looked at. I like boring technology and loud documentation. Before this I wrote firmware for marine instruments.'

export const USES = ['Rust and a little Go', 'SQLite, always', 'A plain text editor', 'systemd, grudgingly']

export const FILES: Record<string, string> = {
  'about.txt': ABOUT,
  'uses.txt': USES.map((u) => `- ${u}`).join('\n'),
  'contact.txt': `Email: ${PERSON.email}\nBased in ${PERSON.place}. Replies within two working days.`,
}
