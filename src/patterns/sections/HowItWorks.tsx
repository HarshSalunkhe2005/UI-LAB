/*
 * How it works: an ordered list of steps with a connecting line. It is a real <ol>, so assistive technology announces
 * "list, 3 items" and "1 of 3". The number is part of the list, not a separate decoration, and the line is drawn with a
 * border so it needs no image. On narrow screens the steps stack and the line runs down the side.
 */

const STEPS = [
  ['Tell us what you need', 'A short form, five minutes. We read every answer.'],
  ['We send a plan', 'A fixed price, a start date and a named person who is responsible.'],
  ['You approve, we build', 'Check in at the end of each week. Stop at any time and keep the work.'],
] as const

export default function HowItWorks() {
  return (
    <section aria-labelledby="hiw-h" className="mx-auto max-w-3xl">
      <h3 id="hiw-h" className="text-2xl font-semibold tracking-tight">How it works</h3>
      <ol className="mt-6 space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0">
        {STEPS.map(([t, b], i) => (
          <li key={t} className="relative flex gap-4 pb-8 sm:block sm:pb-0">
            <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 border-fg bg-bg font-mono text-sm font-semibold" aria-hidden>{i + 1}</span>
            {i < STEPS.length - 1 && <span aria-hidden className="absolute top-10 bottom-0 left-5 w-px bg-border sm:top-5 sm:right-[-1.5rem] sm:bottom-auto sm:left-10 sm:h-px sm:w-auto" />}
            <div className="sm:mt-4">
              <h4 className="font-semibold"><span className="sr-only">Step {i + 1}: </span>{t}</h4>
              <p className="mt-1 text-sm text-fg-muted">{b}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
