import { useEffect, useRef } from 'react'

/*
 * Signature move (Butter, Awwwards SOTD): a statement that comes into focus word by word as you scroll, while small
 * chips drift past. Each word's blur and opacity are set from one scroll-progress number; blur and opacity do not
 * trigger layout. The full sentence is in the DOM from the start, so screen readers and search read it whole.
 * Reduced motion: every word is sharp immediately.
 */

const TEXT = 'A video editor where creatives can finally work the way they think, without leaving the browser.'.split(' ')
const CHIPS = [
  ['#f26b3a', 'Cut'],
  ['#3a6bf2', 'Type'],
  ['#1f1f24', 'Mix'],
  ['#e23a6a', 'Grade'],
]

export default function FocusWords() {
  const box = useRef<HTMLDivElement>(null)
  const words = useRef<(HTMLSpanElement | null)[]>([])
  const chips = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const el = box.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const apply = () => {
      raf = 0
      const max = el.scrollHeight - el.clientHeight
      const p = reduced ? 1 : max > 0 ? Math.min(1, el.scrollTop / max) : 0
      words.current.forEach((w, i) => {
        if (!w) return
        const k = Math.min(1, Math.max(0, p * 1.25 * TEXT.length - i) / 2.5)
        w.style.filter = `blur(${(1 - k) * 9}px)`
        w.style.opacity = String(0.25 + k * 0.75)
      })
      chips.current.forEach((c, i) => {
        if (!c) return
        c.style.transform = `translate(${(i * 70 - 120) * (1 - p) + p * (i % 2 ? 50 : -50)}px, ${(i % 2 ? 1 : -1) * 36 * (1 - p)}px) rotate(${(i - 1.5) * 8 * (1 - p)}deg)`
      })
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    el.addEventListener('scroll', on, { passive: true })
    apply()
    return () => {
      el.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div ref={box} tabIndex={0} aria-label="Scroll to bring the sentence into focus" className="overflow-y-auto" style={{ height: 340 }}>
        <div style={{ height: 900 }}>
          <div className="sticky top-0 grid place-items-center overflow-hidden bg-[#f6f6f4] px-8 text-[#15151a]" style={{ height: 340 }}>
            <p className="relative max-w-xl text-center text-2xl leading-snug font-medium sm:text-3xl">
              {TEXT.map((w, i) => (
                <span key={i}>
                  <span ref={(n) => { words.current[i] = n }} className="inline-block will-change-[filter]">{w}</span>{' '}
                </span>
              ))}
            </p>
            <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-3" aria-hidden>
              {CHIPS.map(([bg, t], i) => (
                <span
                  key={t}
                  ref={(n) => { chips.current[i] = n }}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
                  style={{ background: bg }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
