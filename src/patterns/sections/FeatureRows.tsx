/*
 * Feature rows: instead of a grid of identical cards, each feature gets its own row, with the picture alternating sides.
 * The picture is a drawn stand-in (swap it for a screenshot of the real thing). The text order in the DOM is always
 * heading, then text, then picture, so reading and tab order do not depend on which side the picture is on.
 */

const ROWS = [
  ['Write once', 'Draft in a plain editor and the page lays itself out. Nothing to drag, nothing to align.', 'M10 60 H110 M10 40 H90 M10 20 H100'],
  ['See every change', 'Each edit is saved as a version you can compare, restore or share with a link.', 'M10 60 L40 30 L70 45 L110 10'],
  ['Hand it over', 'Send a read-only link, or invite someone to edit. You always know who changed what.', 'M20 20 H100 V60 H20 Z M20 20 L60 45 L100 20'],
] as const

export default function FeatureRows() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border">
      {ROWS.map(([title, body, path], i) => (
        <section key={title} aria-labelledby={`fr-${i}`} className={`grid items-center gap-6 py-8 sm:grid-cols-2 ${i % 2 ? 'sm:[&>figure]:order-first' : ''}`}>
          <div>
            <h3 id={`fr-${i}`} className="text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-fg-muted">{body}</p>
          </div>
          <figure className="rounded-xl border border-border bg-surface p-4" aria-hidden>
            <svg viewBox="0 0 120 70" className="w-full text-accent" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
          </figure>
        </section>
      ))}
    </div>
  )
}
