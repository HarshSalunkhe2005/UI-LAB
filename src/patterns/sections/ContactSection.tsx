import { useState } from 'react'

/*
 * Enquiry section: promise list + contact rows on the left, a glass message
 * panel on the right, a ghost wordmark and a corner glow behind. The form
 * has real labels, native validation, an inline error summary announced via
 * aria-live, and a success state that replaces the form.
 */

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'error' | 'sent'>('idle')
  return (
    <section className="relative overflow-hidden rounded-2xl bg-bg p-6 sm:p-10" aria-labelledby="contact-h">
      <div aria-hidden className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-emerald-500/30 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -top-4 left-4 font-display text-[7rem] leading-none italic opacity-[0.05]">
        Get in touch
      </span>
      <div className="relative grid gap-10 md:grid-cols-2">
        <div>
          <h2 id="contact-h" className="text-3xl font-semibold tracking-tight">
            Let's build <span className="font-display font-normal italic">something</span>.
          </h2>
          <ul className="mt-6 space-y-2 text-sm text-fg-muted">
            {['Reply within one working day', 'Fixed quotes, no hourly surprises', 'NDA on request'].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-success" aria-hidden>●</span>
                {t}
              </li>
            ))}
          </ul>
          <dl className="mt-8 divide-y divide-border rounded-xl border border-border text-sm">
            {[['Email', 'hello@studio.dev'], ['Phone', '+91 98 7654 3210'], ['Studio', 'Pune, India']].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3">
                <dt className="text-fg-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-surface/70 p-6 shadow-lg backdrop-blur">
          {status === 'sent' ? (
            <div role="status" className="grid h-full place-items-center py-10 text-center">
              <div>
                <p className="text-2xl">✓</p>
                <p className="mt-2 font-medium">Message sent</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-fg-muted hover:text-fg">
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <form
              noValidate
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setStatus(e.currentTarget.checkValidity() ? 'sent' : 'error')
              }}
            >
              <p aria-live="assertive" className="text-sm text-danger">
                {status === 'error' && 'Please fill in your name, a valid email and a message.'}
              </p>
              {[
                ['name', 'Name', 'text'],
                ['email', 'Email', 'email'],
              ].map(([id, label, type]) => (
                <div key={id}>
                  <label htmlFor={`c-${id}`} className="mb-1.5 block text-sm">
                    {label}
                  </label>
                  <input
                    id={`c-${id}`}
                    type={type}
                    required
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 outline-none focus:border-accent aria-[invalid=true]:border-danger"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="c-msg" className="mb-1.5 block text-sm">
                  Message
                </label>
                <textarea id="c-msg" required rows={4} className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 outline-none focus:border-accent" />
              </div>
              <button className="w-full rounded-full bg-fg py-2.5 text-sm font-medium text-bg">Send message</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
