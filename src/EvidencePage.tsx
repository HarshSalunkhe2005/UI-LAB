import { EVIDENCE, EVIDENCE_SUMMARY, type EvidencePair, type Verdict } from './evidence'

/* Blind eval pairs, side by side: plain Sonnet and Sonnet with the UI Lab skill, same brief, one row per brief. Data in evidence.ts. */

const VERDICT: Record<Verdict, { label: string; mark: string; cls: string }> = {
  win: { label: 'Skill wins', mark: '✓', cls: 'border-accent text-accent' },
  tie: { label: 'Tie', mark: '=', cls: 'border-border text-fg' },
  loss: { label: 'Plain page wins', mark: '✗', cls: 'border-fg text-fg' },
}

function Shot({ slug, kind, brief }: { slug: string; kind: 'baseline' | 'skill'; brief: string }) {
  const name = kind === 'baseline' ? 'Plain Sonnet' : 'With the UI Lab skill'
  return (
    <figure className="min-w-0">
      <figcaption className="mb-2 font-mono text-xs tracking-wider text-fg-muted uppercase">{name}</figcaption>
      <img
        src={`/evidence/${slug}-${kind}.jpg`}
        width={900}
        height={562}
        loading="lazy"
        alt={`${name}: first screen at 1440 pixels wide for the brief "${brief}"`}
        className="block h-auto w-full rounded-lg border border-border"
      />
    </figure>
  )
}

function Row({ p }: { p: EvidencePair }) {
  const v = VERDICT[p.verdict]
  return (
    <li className="space-y-3 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{p.brief}</h2>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs ${v.cls}`}>
          <span aria-hidden>{v.mark}</span>
          {v.label}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Shot slug={p.slug} kind="baseline" brief={p.brief} />
        <Shot slug={p.slug} kind="skill" brief={p.brief} />
      </div>
      <p className="max-w-3xl text-fg-muted">
        {p.why} <span className="font-mono text-xs">({p.note})</span>
      </p>
    </li>
  )
}

export default function EvidencePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-3xl space-y-4">
        <p className="font-mono text-xs tracking-wider text-accent uppercase">Evidence</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Plain agent, or with the skill? <span className="font-display font-normal text-accent italic">Judge for yourself.</span>
        </h1>
        <p className="text-lg text-fg-muted">
          The same brief given to the same model twice: once plain, once with the UI Lab skill installed. Two reviewers, one Opus and one Sonnet, saw only
          screenshots and did not know which was which. A pair counts as a skill win only when both pick the skill.
        </p>
        <p className="rounded-lg border border-border bg-surface/50 p-4 text-fg" role="note">
          <strong>{EVIDENCE_SUMMARY}</strong> Across eight briefs the skill won 6, tied 2 and lost none; the two ties were the SaaS landing page and the mobile
          screen, and across six runs each the SaaS page never won and the app screen won once.
        </p>
      </header>
      <ul className="space-y-10">
        {EVIDENCE.map((p) => (
          <Row key={p.slug} p={p} />
        ))}
      </ul>
      <p className="mt-12 max-w-3xl text-sm text-fg-muted">
        Each picture is the first screen at 1440 px from one run; the full pages, both widths and the judges' own words are in{' '}
        <a href="https://github.com/HarshSalunkhe2005/UI-LAB/tree/main/evals/results" className="text-accent underline underline-offset-2">evals/results</a>. One run per
        pair is a small sample, and most votes were close.
      </p>
    </div>
  )
}
