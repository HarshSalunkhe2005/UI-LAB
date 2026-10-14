import { useEffect, useRef } from 'react'

/*
 * Signature move (Noho, Awwwards SOTD): a statement where small picture chips sit inside the sentence, between the
 * words, at the size of a letter. Here the pictures are drawn swatches so there is no asset to ship. Each word and
 * chip rises through its own mask as you scroll, staggered by position. Transforms only. The sentence is plain text in
 * the DOM; chips are decorative. Reduced motion: everything is in place immediately.
 */

type Tok = string | { chip: string; label: string }
const TOKENS: Tok[] = [
  'Our', 'furniture', 'is', 'made', 'from', { chip: '#7aa05b', label: 'leaf' }, 'sustainable', 'ingredients', 'like', { chip: '#c9a24a', label: 'bean' }, 'castor', 'beans,',
  'old', 'carpets', { chip: '#6d597a', label: 'weave' }, 'and', 'recycled', 'fishing', { chip: '#3d5a80', label: 'net' }, 'nets.',
]

export default function InlineChips() {
  const box = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const el = box.current!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const apply = () => {
      raf = 0
      const max = el.scrollHeight - el.clientHeight
      const p = reduced ? 1 : max > 0 ? Math.min(1, el.scrollTop / max) : 0
      items.current.forEach((n, i) => {
        if (!n) return
        const k = Math.min(1, Math.max(0, p * 1.5 * TOKENS.length - i) / 3)
        n.style.transform = `translateY(${(1 - k) * 110}%)`
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
      <div ref={box} tabIndex={0} role="region" aria-label="Scroll to reveal the sentence" className="overflow-y-auto" style={{ height: 340 }}>
        <div style={{ height: 860 }}>
          <div className="sticky top-0 grid place-items-center bg-[#f1ede6] px-8 text-[#1d1b18]" style={{ height: 340 }}>
            <p className="max-w-xl text-center text-3xl leading-[1.35] font-medium tracking-tight sm:text-4xl">
              {TOKENS.map((t, i) =>
                typeof t === 'string' ? (
                  <span key={i} className="inline-block overflow-hidden align-bottom">
                    <span ref={(n) => { items.current[i] = n }} className="inline-block">{t}&nbsp;</span>
                  </span>
                ) : (
                  <span key={i} className="mx-1 inline-block h-[0.9em] w-[1.5em] overflow-hidden rounded-md align-[-0.12em]" aria-hidden>
                    <span ref={(n) => { items.current[i] = n }} className="block h-full w-full" style={{ background: `repeating-linear-gradient(45deg, ${t.chip}, ${t.chip} 5px, color-mix(in srgb, ${t.chip} 70%, #fff) 5px, color-mix(in srgb, ${t.chip} 70%, #fff) 9px)` }} />
                  </span>
                ),
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
