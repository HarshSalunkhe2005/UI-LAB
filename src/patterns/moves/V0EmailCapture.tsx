import { useState } from 'react'

/*
 * Vibe-coded move (Waitlist and Newsletter templates, v0): design every state of an email form, not just the
 * happy path. Idle, invalid (shown after the field is left, not while typing), submitting, success and
 * server error each have their own copy and look. Errors are tied to the input with aria-describedby and
 * announced politely; the button is disabled only while submitting. Type "fail@x.com" to see the error state.
 */

type S = 'idle' | 'submitting' | 'success' | 'error'
const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function V0EmailCapture() {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [state, setState] = useState<S>('idle')
  const invalid = touched && !valid(email)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!valid(email)) return
    setState('submitting')
    window.setTimeout(() => setState(email.startsWith('fail@') ? 'error' : 'success'), 900)
  }

  if (state === 'success')
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border bg-surface p-8 text-center" role="status">
        <svg viewBox="0 0 24 24" width="40" height="40" className="mx-auto text-success" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" style={{ strokeDasharray: 24, strokeDashoffset: 0, animation: 'v0ec-draw 500ms ease-out' }} />
        </svg>
        <style>{`@keyframes v0ec-draw { from { stroke-dashoffset: 24; } } @media (prefers-reduced-motion: reduce) { path { animation: none !important; } }`}</style>
        <h3 className="mt-3 text-lg font-semibold">You are on the list</h3>
        <p className="mt-1 text-sm text-fg-muted">We will write to {email} when your spot opens.</p>
        <button onClick={() => { setState('idle'); setEmail(''); setTouched(false) }} className="mt-4 min-h-11 text-sm text-accent hover:underline">Add another</button>
      </div>
    )

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-md space-y-3 rounded-xl border border-border bg-surface p-6">
      <label htmlFor="v0ec-email" className="block text-sm font-medium">Join the waitlist</label>
      <div className="flex gap-2">
        <input
          id="v0ec-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
          onBlur={() => setTouched(true)}
          aria-invalid={invalid}
          aria-describedby="v0ec-msg"
          placeholder="you@company.com"
          className={`min-h-11 min-w-0 flex-1 rounded-md border bg-bg px-3 text-sm outline-none focus:border-accent ${invalid ? 'border-danger' : 'border-border'}`}
        />
        <button disabled={state === 'submitting'} className="min-h-11 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg disabled:opacity-60">
          {state === 'submitting' ? 'Joining…' : 'Join'}
        </button>
      </div>
      <p id="v0ec-msg" role={invalid || state === 'error' ? 'alert' : undefined} className={`min-h-5 text-sm ${invalid || state === 'error' ? 'text-danger' : 'text-fg-muted'}`}>
        {invalid ? 'Enter a valid email address, like name@company.com.' : state === 'error' ? 'We could not add you just now. Try again in a moment.' : 'One email when it opens. No spam.'}
      </p>
    </form>
  )
}
