import { useEffect, useRef, useState } from 'react'

/*
 * Signature move (Pensatori Irrazionali, Awwwards SOTD): a studio page set like system documentation. Numbered
 * modules in monospace on the left, a column of status lines on the right, and a turning globe in the middle. As you
 * scroll, the module in the middle of the box becomes the active one, the others dim, and the status lights come on in
 * order. State is the active index only; the dimming is opacity. Reduced motion: the globe stops turning.
 */

const MODULES = [
  ['IDENTITY', 'STUDIO-ID-A01', 'A container for intention. Form emerges before explanation.'],
  ['SYSTEMS', 'SYS-CORE-B07', 'Systems are not designed. They are discovered through constraints.'],
  ['INTERFACE', 'UI-THRESHOLD-C22', 'An interface is a negotiation between machine logic and human instinct.'],
  ['NARRATIVE', 'NAR-SEQ-D09', 'Narrative is not linear. It folds, repeats and leaks across media.'],
  ['FORM', 'FORM-FIELD-E03', 'Form is a consequence, not a decision. Shape follows pressure.'],
] as const

export default function StatusModules() {
  const box = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = box.current!
    const on = () => {
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? el.scrollTop / max : 0
      setActive(Math.min(MODULES.length - 1, Math.round(p * (MODULES.length - 1))))
    }
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0d0d0f] text-[#e8e8e8]">
      <div ref={box} tabIndex={0} role="region" aria-label="Scroll through the modules" className="overflow-y-auto" style={{ height: 340 }}>
        <div style={{ height: 760 }}>
          <div className="sticky top-0 grid grid-cols-[1fr_auto_1fr] items-center gap-4 overflow-hidden px-5 font-mono text-[11px] leading-5" style={{ height: 340 }}>
            <ol className="space-y-3">
              {MODULES.map(([name, id, text], i) => (
                <li key={name} className="transition-opacity duration-300 motion-reduce:transition-none" style={{ opacity: i === active ? 1 : 0.62 }} aria-current={i === active ? 'true' : undefined}>
                  <p>
                    {name} / MODULE {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="text-[#9a9aa3]">ID: {id}</p>
                  {i === active && <p className="mt-1 max-w-[22ch] text-[#e8e8e8]">{text}</p>}
                </li>
              ))}
            </ol>
            <div aria-hidden className="relative grid size-28 place-items-center">
              <div className="absolute inset-0 rounded-full border border-[#555] motion-safe:animate-[spin_24s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
              <div className="absolute inset-3 rounded-full border border-[#888]" />
              <div className="size-14 rounded-full bg-gradient-to-br from-white to-[#777]" />
            </div>
            <ul className="space-y-1 text-right">
              {Array.from({ length: 7 }, (_, i) => (
                <li key={i} className="flex items-center justify-end gap-2" style={{ opacity: i <= active + 1 ? 1 : 0.35 }}>
                  0{i + 1} STATUS / {i <= active + 1 ? 'ACTIVE' : 'IDLE'}
                  <span className="size-2 rounded-full" style={{ background: i <= active + 1 ? '#4ade80' : '#555' }} aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
