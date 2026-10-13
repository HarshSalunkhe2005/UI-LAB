import { useEffect, useState } from 'react'

/*
 * Signature move (Mercury): numbers that roll. Each digit is a vertical strip of 0-9 that slides to the right
 * digit with a transform, so only the digits that change move (like a mechanical odometer). Tabular figures
 * keep widths stable; the whole value is also exposed as plain text for assistive tech. Reduced motion: digits
 * switch instantly.
 */

function Digit({ d }: { d: number }) {
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden align-bottom" aria-hidden>
      <span
        className="absolute inset-x-0 top-0 flex flex-col motion-reduce:transition-none"
        style={{ transform: `translateY(${-d * 1.1}em)`, transition: 'transform 900ms var(--ease-out-expo)' }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="h-[1.1em] text-center leading-[1.1]">{i}</span>
        ))}
      </span>
    </span>
  )
}

export function Odometer({ value, prefix = '$' }: { value: number; prefix?: string }) {
  const digits = String(Math.max(0, Math.floor(value))).padStart(7, '0')
  const chars = digits.split('')
  return (
    <span className="inline-flex items-baseline font-display text-6xl tabular-nums" role="text" aria-label={`${prefix}${value.toLocaleString('en-US')}`}>
      <span aria-hidden>{prefix}</span>
      {chars.map((c, i) => {
        const fromRight = chars.length - 1 - i
        const comma = fromRight > 0 && fromRight % 3 === 0
        const leadingZero = chars.slice(0, i + 1).every((x) => x === '0') && fromRight > 0
        return (
          <span key={i} className={`inline-flex ${leadingZero ? 'opacity-0' : ''}`} aria-hidden>
            <Digit d={Number(c)} />
            {comma && <span>,</span>}
          </span>
        )
      })}
    </span>
  )
}

export default function OdometerDemo() {
  const [v, setV] = useState(1284930)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setV((x) => x + Math.floor(Math.random() * 90000) + 10000), 2600)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface py-12">
      <p className="text-sm text-fg-muted">Balance across accounts</p>
      <Odometer value={v} />
      <button onClick={() => setV((x) => x + 25000)} className="min-h-11 rounded-md border border-border px-4 text-sm text-fg-muted hover:text-fg">
        Deposit $25,000
      </button>
    </div>
  )
}
