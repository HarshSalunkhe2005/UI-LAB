import { useState } from 'react'

/*
 * Niche world: Pharmacy / Clinical Label. When the content can hurt someone if misread, design is clarity under
 * rules: one typeface, a strict hierarchy (what, how much, when, warnings), large tabular numerals for doses,
 * boxed warnings with a redundant icon and the word "Warning" (never colour alone), and a daily schedule you can
 * tick. State is saved in the page only; this is a demo, not medical advice. Reduced motion is irrelevant (no motion).
 */

const DOSES = ['Morning', 'Midday', 'Evening', 'Bedtime']

export default function ClinicalLabel() {
  const [taken, setTaken] = useState<boolean[]>([true, false, false, false])
  const next = DOSES.find((_, i) => !taken[i])

  return (
    <div className="mx-auto max-w-xl rounded-md border-2 border-black bg-white p-5 text-black" style={{ fontFamily: 'var(--font-sans)' }}>
      <header className="flex items-start justify-between gap-4 border-b-4 border-black pb-3">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase">Patient: A. Mehta · Rx 0048213</p>
          <h3 className="mt-1 text-2xl font-bold">Amoxicillin 500 mg</h3>
          <p className="text-sm">Capsule · Antibiotic</p>
        </div>
        <div className="text-right" aria-label="Quantity: 21 capsules">
          <p className="text-4xl font-bold tabular-nums">21</p>
          <p className="text-xs uppercase">capsules</p>
        </div>
      </header>
      <section className="mt-4" aria-labelledby="cl-how">
        <h4 id="cl-how" className="text-xs font-semibold tracking-wider uppercase">How to take</h4>
        <p className="mt-1 text-xl font-semibold">Take <span className="tabular-nums">1</span> capsule <span className="tabular-nums">3</span> times a day, with food.</p>
        <p className="text-sm">Finish all 21 capsules, even if you feel better.</p>
      </section>
      <section className="mt-4 border-2 border-black p-3" aria-labelledby="cl-warn">
        <h4 id="cl-warn" className="flex items-center gap-2 text-sm font-bold uppercase"><span aria-hidden className="grid size-6 place-items-center bg-black text-white">!</span> Warning</h4>
        <ul className="mt-1 list-disc pl-5 text-sm">
          <li>Do not take if you are allergic to penicillin.</li>
          <li>Stop and call your doctor if you get a rash or trouble breathing.</li>
        </ul>
      </section>
      <section className="mt-4" aria-labelledby="cl-today">
        <h4 id="cl-today" className="text-xs font-semibold tracking-wider uppercase">Today</h4>
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DOSES.map((d, i) => (
            <li key={d}>
              <button
                role="checkbox"
                aria-checked={taken[i]}
                onClick={() => setTaken((t) => t.map((v, j) => (j === i ? !v : v)))}
                className={`min-h-14 w-full border-2 border-black px-2 text-left text-sm font-semibold ${taken[i] ? 'bg-black text-white' : 'bg-white'}`}
              >
                <span aria-hidden>{taken[i] ? '✔ ' : '☐ '}</span>{d}
                <span className="block text-xs font-normal">{taken[i] ? 'Taken' : 'Due'}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm" aria-live="polite">{next ? `Next dose: ${next}.` : 'All doses taken for today.'}</p>
      </section>
      <p className="mt-4 border-t border-black pt-2 text-[11px]">Demo label. Not medical advice.</p>
    </div>
  )
}
