import { useId, useMemo, useState } from 'react'

/*
 * A password field that helps without nagging. A real label, a show/hide button that names its state (aria-pressed), a
 * rule list that ticks off live in words ("Met" or "Not yet", never colour alone), and a strength line that is written
 * out. The strength is an estimate from length and variety, labelled as such; it does not replace a server check.
 * Paste is allowed (password managers need it) and autocomplete is set to new-password.
 */

const RULES: [string, (p: string) => boolean][] = [
  ['At least 12 characters', (p) => p.length >= 12],
  ['A mix of upper and lower case', (p) => /[a-z]/.test(p) && /[A-Z]/.test(p)],
  ['A number', (p) => /\d/.test(p)],
  ['A symbol or a space', (p) => /[^A-Za-z0-9]/.test(p)],
]

export default function PasswordField() {
  const id = useId()
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const met = useMemo(() => RULES.map(([, f]) => f(pw)), [pw])
  const score = pw.length === 0 ? 0 : Math.min(4, met.filter(Boolean).length + (pw.length >= 16 ? 1 : 0)) - (pw.length < 8 ? 1 : 0)
  const label = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'][Math.max(0, Math.min(4, score))]

  return (
    <div className="mx-auto max-w-sm">
      <label htmlFor={id} className="text-sm font-medium">Create a password</label>
      <div className="relative mt-1">
        <input id={id} type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" aria-describedby={`${id}-rules ${id}-str`} className="min-h-12 w-full rounded-md border border-border bg-surface px-3 pr-20 font-mono" />
        <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show} className="absolute top-1 right-1 min-h-10 rounded px-3 text-sm font-medium text-accent hover:bg-surface-2">
          {show ? 'Hide' : 'Show'}<span className="sr-only"> password</span>
        </button>
      </div>
      <p id={`${id}-str`} className="mt-2 text-sm" role="status">
        Strength (estimate): <b>{label}</b>
      </p>
      <div className="mt-1 flex gap-1" aria-hidden>
        {[1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded ${score >= n ? 'bg-fg' : 'bg-border'}`} />)}
      </div>
      <ul id={`${id}-rules`} className="mt-3 space-y-1 text-sm">
        {RULES.map(([t], i) => (
          <li key={t} className="flex items-center gap-2">
            <span aria-hidden className={`grid size-5 place-items-center rounded-full border text-[11px] ${met[i] ? 'border-success text-success' : 'border-border text-fg-muted'}`}>{met[i] ? '✓' : ''}</span>
            <span className={met[i] ? '' : 'text-fg-muted'}>{t}<span className="sr-only">: {met[i] ? 'Met' : 'Not yet'}</span></span>
          </li>
        ))}
      </ul>
    </div>
  )
}
