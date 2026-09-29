import { useEffect, useRef, useState } from 'react'

/*
 * Text that decodes into place: each character cycles through random glyphs
 * and locks in left to right. Screen readers get the final text via
 * aria-label; the animating glyphs are aria-hidden. Reduced motion shows the
 * final text immediately.
 */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/\\|'

export function ScrambleText({
  text,
  duration = 1200,
  delay = 0,
  play = true,
  className = '',
}: {
  text: string
  duration?: number
  delay?: number
  /** Change this (e.g. a counter) to replay. */
  play?: boolean | number
  className?: string
}) {
  const [out, setOut] = useState(text)
  const raf = useRef(0)

  useEffect(() => {
    if (!play || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text)
      return
    }
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now + delay
      const p = Math.max(0, (now - start) / duration)
      const locked = Math.floor(p * text.length)
      setOut(
        [...text]
          .map((ch, i) => (i < locked || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      )
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else setOut(text)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [text, duration, delay, play])

  return (
    <span className={className} aria-label={text} role="text">
      <span aria-hidden>{out}</span>
    </span>
  )
}

export default function ScrambleTextDemo() {
  const [run, setRun] = useState(1)
  return (
    <div className="space-y-6">
      <p className="font-mono text-2xl sm:text-3xl">
        <ScrambleText text="Architect worlds that move." play={run} />
      </p>
      <p className="font-mono text-sm text-fg-muted">
        <ScrambleText text="NEWS / WORKS / ABOUT / CONTACT" play={run} delay={300} duration={900} />
      </p>
      <button onClick={() => setRun((r) => r + 1)} className="text-sm text-fg-muted hover:text-fg">
        ↻ Replay
      </button>
    </div>
  )
}
