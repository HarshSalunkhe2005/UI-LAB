import { useId, useState } from 'react'

/*
 * A sign-up form that handles the unhappy paths. A visible label (not a placeholder), a type that brings up the right
 * keyboard, validation on submit with the message tied to the field (aria-describedby, aria-invalid) and announced
 * (role=alert), a busy state that prevents double sending, and a success message that replaces the form's promise.
 * The "send" is a timer here; connect it to your own endpoint.
 */

type State = 'idle' | 'invalid' | 'sending' | 'done'

export default function NewsletterForm() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const bad = state === 'invalid'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setState('invalid')
    setState('sending')
    setTimeout(() => setState('done'), 900)
  }

  if (state === 'done')
    return (
      <div className="rounded-xl border border-border bg-surface p-6" role="status">
        <p className="text-lg font-semibold">You are on the list.</p>
        <p className="mt-1 text-sm text-fg-muted">We sent a confirmation to {email}. Click the link in it and you are done. No other emails until then.</p>
        <button onClick={() => { setEmail(''); setState('idle') }} className="mt-4 min-h-11 rounded-md border border-border px-3 text-sm hover:bg-surface-2">Add another address</button>
      </div>
    )

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border border-border bg-surface p-6">
      <h3 className="text-xl font-semibold tracking-tight">One email a month</h3>
      <p className="mt-1 text-sm text-fg-muted">What we shipped and what we learned. Unsubscribe in one click.</p>
      <label htmlFor={id} className="mt-5 block text-sm font-medium">Email address</label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (bad) setState('idle') }}
          aria-invalid={bad}
          aria-describedby={`${id}-msg`}
          disabled={state === 'sending'}
          className={`min-h-12 flex-1 rounded-md border bg-bg px-3 ${bad ? 'border-danger' : 'border-border'}`}
        />
        <button disabled={state === 'sending'} aria-busy={state === 'sending'} className="min-h-12 rounded-md bg-accent px-6 text-sm font-medium text-accent-fg disabled:opacity-60">
          {state === 'sending' ? 'Sending…' : 'Subscribe'}
        </button>
      </div>
      <p id={`${id}-msg`} role={bad ? 'alert' : undefined} className={`mt-2 min-h-5 text-sm ${bad ? 'text-danger' : 'text-fg-muted'}`}>
        {bad ? 'That does not look like an email address. Check for an @ and a domain, like name@example.com.' : 'We never share your address.'}
      </p>
    </form>
  )
}
