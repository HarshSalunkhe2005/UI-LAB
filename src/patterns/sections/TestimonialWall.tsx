/*
 * Testimonial wall: CSS columns masonry of quote cards, with columns
 * scrolling in opposite directions (vertical marquee) and faded top/bottom
 * edges. Each quote is a real <figure>/<blockquote>/<figcaption>. Pauses on
 * hover; static under reduced motion.
 */

const Q = [
  ['Shipped our landing page in a day. It looks like we hired a studio.', 'Anika R.', 'Founder, Loop'],
  ['The shader backgrounds replaced a 12MB hero video.', 'Marco D.', 'Frontend lead'],
  ['Finally a library that cares about reduced motion.', 'Sam K.', 'Accessibility engineer'],
  ['Our AI agent reads llms.txt and builds on-brand every time.', 'Priya S.', 'CTO, Nova'],
  ['Copy one file, it just works. No dependency soup.', 'Leo M.', 'Indie hacker'],
  ['The dashboard screen saved us two sprints.', 'Hana T.', 'PM, Ledger'],
  ['Design tokens first was the right call.', 'Omar F.', 'Design systems'],
  ['Every demo is live, which is what sold me.', 'Zoe W.', 'Designer'],
  ['Carousels that actually work with a keyboard.', 'Ravi P.', 'Engineer'],
]

const CSS = `
.col-up { animation: col 28s linear infinite; } .col-down { animation: col 28s linear infinite reverse; }
@keyframes col { to { transform: translateY(-50%); } }
.wall:hover .col-up, .wall:hover .col-down { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .col-up, .col-down { animation: none; } }
`

function Card([q, n, r]: string[]) {
  return (
    <figure key={q + n} className="rounded-xl border border-border bg-surface p-4">
      <blockquote className="text-sm">"{q}"</blockquote>
      <figcaption className="mt-3 text-xs">
        <span className="font-medium">{n}</span> <span className="text-fg-muted">· {r}</span>
      </figcaption>
    </figure>
  )
}

export default function TestimonialWall() {
  const cols = [Q.slice(0, 3), Q.slice(3, 6), Q.slice(6, 9)]
  return (
    <section aria-label="Testimonials" className="wall relative h-96 overflow-hidden [mask-image:linear-gradient(transparent,#000_15%,#000_85%,transparent)]">
      <style>{CSS}</style>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cols.map((col, i) => (
          <div key={i} className={`space-y-3 ${i % 2 ? 'col-down' : 'col-up'} ${i > 0 ? 'hidden sm:block' : ''}`}>
            {[...col, ...col].map((q, k) => (
              <div key={k} aria-hidden={k >= col.length || undefined}>{Card(q)}</div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
