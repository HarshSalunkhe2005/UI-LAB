import { useRef, useState } from 'react'

/*
 * One-time-code input: six boxes that behave like one field. Typing
 * advances, Backspace goes back, arrows move, and pasting a full code fills
 * every box. autocomplete="one-time-code" lets phones autofill from SMS.
 * Each box is labelled "Digit n of 6" inside a labelled group.
 */

export default function OtpInput({ length = 6, onComplete }: { length?: number; onComplete?: (code: string) => void }) {
  const [vals, setVals] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const [done, setDone] = useState('')

  const set = (next: string[]) => {
    setVals(next)
    const code = next.join('')
    if (code.length === length) {
      setDone(code)
      onComplete?.(code)
    } else setDone('')
  }

  return (
    <div className="space-y-3">
      <div role="group" aria-label="Verification code" className="flex gap-2">
        {vals.map((v, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            value={v}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            aria-label={`Digit ${i + 1} of ${length}`}
            onChange={(e) => {
              const d = e.target.value.replace(/\D/g, '').slice(-1)
              const next = [...vals]
              next[i] = d
              set(next)
              if (d && i < length - 1) refs.current[i + 1]?.focus()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1]?.focus()
              if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
              if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
            }}
            onPaste={(e) => {
              const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
              if (!digits) return
              e.preventDefault()
              const next = Array(length).fill('').map((_, k) => digits[k] ?? '')
              set(next)
              refs.current[Math.min(digits.length, length - 1)]?.focus()
            }}
            onFocus={(e) => e.target.select()}
            className="h-14 w-11 rounded-lg border border-border bg-surface text-center font-mono text-xl outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        ))}
      </div>
      <p aria-live="polite" className="h-5 text-sm text-success">{done && `Code ${done} entered ✓`}</p>
    </div>
  )
}
