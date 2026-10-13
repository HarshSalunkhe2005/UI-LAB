import { useEffect, useRef, useState } from 'react'

/*
 * Signature move (The Pudding): the chart is the article. Text steps scroll past a sticky graphic; the step
 * nearest the middle of the viewport sets the graphic's state, and the graphic animates between states.
 * Steps are found with one IntersectionObserver (no scroll handler). The chart is SVG with a text summary
 * per step, so the story reads without it. Reduced motion: the chart changes without easing.
 */

const STEPS = [
  { text: 'In 2000, most people watched on a TV. Streaming was a rounding error.', bars: [88, 8, 4] },
  { text: 'By 2010, broadband changed the habit. Downloads and DVDs started to shrink.', bars: [62, 22, 16] },
  { text: 'In 2020, streaming overtook everything else in a single pandemic year.', bars: [30, 20, 50] },
  { text: 'Today, three out of four evenings begin with a thumbnail, not a schedule.', bars: [14, 10, 76] },
]
const LABELS = ['Broadcast', 'Disc', 'Streaming']

export default function Scrollytelling() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const steps = root.current!.querySelectorAll<HTMLElement>('[data-step]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
      },
      { root: root.current, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    steps.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const bars = STEPS[active].bars
  return (
    <div ref={root} className="relative h-96 overflow-y-auto rounded-xl border border-border bg-surface" tabIndex={0} aria-label="Scroll the story">
      <div className="sticky top-0 z-10 h-44 border-b border-border bg-surface/95 px-6 pt-4">
        <svg viewBox="0 0 300 120" className="h-full w-full" role="img" aria-label={`Share of viewing: ${LABELS.map((l, i) => `${l} ${bars[i]} percent`).join(', ')}`}>
          {bars.map((b, i) => (
            <g key={i}>
              <rect
                x={20 + i * 95}
                y="0"
                width="70"
                height="100"
                rx="4"
                fill={i === 2 ? 'var(--accent)' : 'var(--border)'}
                style={{ transformBox: 'fill-box', transformOrigin: 'bottom', transform: `scaleY(${b / 100})`, transition: 'transform 700ms var(--ease-out-expo)' }}
              />
              <text x={55 + i * 95} y="114" textAnchor="middle" fontSize="9" fill="var(--fg-muted)">{LABELS[i]}</text>
              <text x={55 + i * 95} y="94" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)" style={{ transform: `translateY(${-b}px)`, transition: 'transform 700ms var(--ease-out-expo)' }}>
                {b}%
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="px-8">
        {STEPS.map((s, i) => (
          <p key={i} data-step={i} className={`flex min-h-64 items-center text-xl leading-snug transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-35'}`}>
            {s.text}
          </p>
        ))}
      </div>
    </div>
  )
}
