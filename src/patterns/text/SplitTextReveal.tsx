import { useEffect, useRef, useState } from 'react'

/*
 * Headline split into words (or letters), each masked by an overflow-hidden
 * wrapper and sliding up into view with a stagger when the block enters the
 * viewport. The sentence stays intact for screen readers (aria-label), the
 * split spans are aria-hidden. Reduced motion: shown immediately.
 */

export function SplitTextReveal({ text, by = 'word', stagger = 60, className = '' }: { text: string; by?: 'word' | 'char'; stagger?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setOn(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.4 })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])
  const parts = by === 'word' ? text.split(' ') : [...text]
  return (
    <span ref={ref} aria-label={text} role="text" className={className}>
      {parts.map((p, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span
            className="inline-block transition-transform duration-[900ms] ease-out-expo"
            style={{ transform: on ? 'none' : 'translateY(110%)', transitionDelay: `${i * stagger}ms` }}
          >
            {p === ' ' ? ' ' : p}
          </span>
          {by === 'word' && i < parts.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

export default function SplitTextRevealDemo() {
  const [k, setK] = useState(0)
  return (
    <div key={k} className="space-y-6">
      <h3 className="text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
        <SplitTextReveal text="Design that moves people." />
      </h3>
      <p className="font-display text-3xl italic">
        <SplitTextReveal text="letter by letter" by="char" stagger={30} />
      </p>
      <button onClick={() => setK((x) => x + 1)} className="text-sm text-fg-muted hover:text-fg">↻ Replay</button>
    </div>
  )
}
