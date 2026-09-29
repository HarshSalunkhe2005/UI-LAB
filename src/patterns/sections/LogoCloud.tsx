/*
 * Logo cloud + stats band. Wordmark "logos" are text here (swap for SVGs
 * with alt text). Logos sit greyscale and light up on hover; the stats row
 * uses a <dl> so each number is paired with its label for screen readers.
 */

const LOGOS = ['Northwind', 'Acme', 'Globex', 'Umbrella', 'Initech', 'Hooli', 'Vandelay', 'Stark']
const STATS = [['99.99%', 'uptime'], ['4.2M', 'requests / day'], ['180ms', 'median latency'], ['140+', 'countries']]

export default function LogoCloud() {
  return (
    <section className="space-y-10 rounded-2xl bg-bg p-6 sm:p-10" aria-labelledby="lc-h">
      <p id="lc-h" className="text-center font-mono text-xs tracking-wider text-fg-muted uppercase">Trusted by teams at</p>
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {LOGOS.map((l, i) => (
          <li key={l} className="text-center text-xl font-semibold tracking-tight text-fg-muted/60 transition-colors hover:text-fg" style={{ fontStyle: i % 3 === 0 ? 'italic' : undefined, fontFamily: i % 2 ? 'var(--font-display)' : undefined }}>
            {l}
          </li>
        ))}
      </ul>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {STATS.map(([n, l]) => (
          <div key={l} className="bg-surface p-5">
            <dt className="order-2 text-sm text-fg-muted">{l}</dt>
            <dd className="text-3xl font-semibold tabular-nums">{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
