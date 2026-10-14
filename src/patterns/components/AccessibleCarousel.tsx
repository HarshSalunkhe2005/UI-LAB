import { useEffect, useRef, useState } from 'react'

/*
 * A carousel that does not trap anyone. It is a labelled region with slides as a list; Previous and Next are buttons;
 * the current slide is announced ("Slide 2 of 4") in a live region; auto-advance is OFF by default and, if turned on,
 * pauses on hover, on focus and always under reduced motion, with a visible Pause control. Off-screen slides are inert so
 * keyboard users do not tab into hidden content. Movement is a transform on a track.
 */

const SLIDES = [
  ['Plan', '#f2c9a1', 'Start with the person and the task.'],
  ['Draft', '#bfd8c6', 'Make the smallest version that could work.'],
  ['Test', '#c5cdea', 'Use it with a keyboard and a phone.'],
  ['Ship', '#e6c0d4', 'Release it, then keep watching.'],
] as const

export default function AccessibleCarousel() {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(false)
  const [hold, setHold] = useState(false)
  const reduced = useRef(typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (!auto || hold || reduced.current) return
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 3500)
    return () => clearInterval(t)
  }, [auto, hold])

  return (
    <section aria-roledescription="carousel" aria-label="How we work" className="mx-auto max-w-xl" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="overflow-hidden rounded-xl border border-border">
        <ul className="flex transition-transform duration-500 ease-out-expo motion-reduce:transition-none" style={{ transform: `translateX(-${i * 100}%)` }}>
          {SLIDES.map(([t, bg, d], n) => (
            <li key={t} aria-roledescription="slide" aria-label={`${n + 1} of ${SLIDES.length}`} inert={n !== i} className="grid h-52 w-full shrink-0 place-content-center px-8 text-center text-[#1d1b18]" style={{ background: bg }}>
              <p className="text-3xl font-semibold tracking-tight">{t}</p>
              <p className="mt-2 max-w-xs text-base">{d}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => setI((i - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous slide" className="grid size-11 place-items-center rounded-md border border-border hover:bg-surface">‹</button>
        <button onClick={() => setI((i + 1) % SLIDES.length)} aria-label="Next slide" className="grid size-11 place-items-center rounded-md border border-border hover:bg-surface">›</button>
        <div className="flex gap-1" role="group" aria-label="Choose a slide">
          {SLIDES.map(([t], n) => (
            <button key={t} onClick={() => setI(n)} aria-label={`Show slide ${n + 1}: ${t}`} aria-current={n === i ? 'true' : undefined} className="grid size-11 place-items-center">
              <span className={`size-2.5 rounded-full ${n === i ? 'bg-fg' : 'bg-border'}`} />
            </button>
          ))}
        </div>
        <button onClick={() => setAuto((a) => !a)} aria-pressed={auto} className="ml-auto min-h-11 rounded-md border border-border px-3 text-sm hover:bg-surface">{auto ? 'Pause' : 'Play'}</button>
      </div>
      <p className="mt-1 text-sm text-fg-muted" role="status" aria-live="polite">Slide {i + 1} of {SLIDES.length}: {SLIDES[i][0]}</p>
    </section>
  )
}
