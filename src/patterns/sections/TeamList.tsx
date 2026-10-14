/*
 * A team section as a list, not a wall of identical cards. Each person is a row: name, role and one real sentence about
 * what they do, with initials in a plain disc standing in for a photograph (use real photos with real alt text, or none).
 * The list is a description list so the relationship between a name and its description is machine-readable, and the
 * layout is a single readable column that works at any width.
 */

const TEAM = [
  ['Amara Osei', 'Design lead', 'Draws the first sketch and decides when it is finished.'],
  ['Ben Hollis', 'Engineering', 'Builds the parts you never see, and keeps them boring on purpose.'],
  ['Chioma Eze', 'Research', 'Talks to your customers so that nobody has to guess.'],
  ['Dev Patel', 'Production', 'Makes sure what we promised on Monday is what ships on Friday.'],
] as const

export default function TeamList() {
  return (
    <section aria-labelledby="team-h" className="mx-auto max-w-2xl">
      <h3 id="team-h" className="text-2xl font-semibold tracking-tight">Who you will work with</h3>
      <dl className="mt-4 divide-y divide-border border-y border-border">
        {TEAM.map(([n, r, d]) => (
          <div key={n} className="relative py-4 pl-16">
            <span aria-hidden className="absolute top-4 left-0 grid size-12 place-items-center rounded-full bg-accent-soft font-mono text-sm font-semibold text-accent">{n.split(' ').map((w) => w[0]).join('')}</span>
            <dt className="font-semibold">{n} <span className="font-normal text-fg-muted">· {r}</span></dt>
            <dd className="mt-0.5 text-fg-muted">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
