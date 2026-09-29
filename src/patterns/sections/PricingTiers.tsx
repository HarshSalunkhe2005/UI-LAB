import { useState } from 'react'

/*
 * Three-tier pricing band: monthly/yearly switch (a real radiogroup),
 * a highlighted middle plan, ticked feature lists and a ghost wordmark
 * behind the grid. Prices animate width-stably with tabular figures.
 */

const PLANS = [
  { name: 'Starter', m: 0, y: 0, blurb: 'For side projects', features: ['1 project', 'Community support', 'Core patterns'] },
  { name: 'Pro', m: 19, y: 15, blurb: 'For working builders', features: ['Unlimited projects', 'All patterns + shaders', 'Priority support', 'Figma files'], featured: true },
  { name: 'Team', m: 49, y: 39, blurb: 'For studios', features: ['Everything in Pro', '10 seats', 'Private registry', 'Custom tokens'] },
]

export default function PricingTiers() {
  const [yearly, setYearly] = useState(true)
  return (
    <section className="relative overflow-hidden rounded-2xl bg-bg px-4 py-14 sm:px-8" aria-labelledby="pricing-h">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-2 text-center font-display text-[18vw] leading-none italic opacity-[0.05] sm:text-[9rem]">
        Pricing
      </span>
      <div className="relative text-center">
        <h2 id="pricing-h" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple, <span className="font-display font-normal italic text-accent">honest</span> pricing
        </h2>
        <div role="radiogroup" aria-label="Billing period" className="mx-auto mt-6 inline-flex rounded-full border border-border p-1 text-sm">
          {[['Monthly', false], ['Yearly −20%', true]].map(([label, val]) => (
            <button
              key={String(label)}
              role="radio"
              aria-checked={yearly === val}
              onClick={() => setYearly(val as boolean)}
              className={`rounded-full px-4 py-1.5 transition-colors ${yearly === val ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.name}
            className={`flex flex-col rounded-2xl border p-6 backdrop-blur ${
              p.featured ? 'border-accent/60 bg-accent-soft/60 shadow-lg md:-translate-y-2' : 'border-border bg-surface/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{p.name}</h3>
              {p.featured && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-fg">Popular</span>}
            </div>
            <p className="mt-1 text-sm text-fg-muted">{p.blurb}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tabular-nums">${yearly ? p.y : p.m}</span>
              <span className="text-sm text-fg-muted">/mo</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent" aria-hidden>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`mt-8 rounded-full py-2.5 text-sm font-medium ${p.featured ? 'bg-fg text-bg' : 'border border-border hover:bg-surface-2'}`}>
              Choose {p.name}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
