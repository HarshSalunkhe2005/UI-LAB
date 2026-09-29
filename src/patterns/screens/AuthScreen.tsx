import { useState } from 'react'

/*
 * Split auth screen: brand panel with quote on one side, sign-in form on
 * the other. Social buttons, divider, email + password with show/hide,
 * remember me, and a sign-in/up toggle. Proper autocomplete tokens so
 * password managers work; errors announced via aria-live.
 */

export default function AuthScreen() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-bg md:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-700 p-8 text-white md:flex">
        <p className="font-semibold">◆ northstar</p>
        <figure>
          <blockquote className="font-display text-2xl italic">"The fastest way we've found to go from idea to something people can use."</blockquote>
          <figcaption className="mt-3 text-sm opacity-80">Lena Ortiz, Head of Product</figcaption>
        </figure>
      </div>
      <div className="p-6 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">{mode === 'in' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="mt-1 text-sm text-fg-muted">
          {mode === 'in' ? 'New here?' : 'Already have an account?'}{' '}
          <button onClick={() => setMode(mode === 'in' ? 'up' : 'in')} className="text-accent hover:underline">{mode === 'in' ? 'Sign up' : 'Sign in'}</button>
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {['Google', 'GitHub'].map((p) => (
            <button key={p} className="rounded-lg border border-border py-2 text-sm hover:bg-surface">Continue with {p}</button>
          ))}
        </div>
        <div className="my-5 flex items-center gap-3 text-xs text-fg-muted" aria-hidden>
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setErr(e.currentTarget.checkValidity() ? '' : 'Enter a valid email and a password of 8+ characters.')
          }}
        >
          <p aria-live="assertive" className="text-sm text-danger empty:hidden">{err}</p>
          {mode === 'up' && (
            <label className="block text-sm">Name<input autoComplete="name" required className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent" /></label>
          )}
          <label className="block text-sm">Email<input type="email" autoComplete="email" required className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-accent" /></label>
          <label className="block text-sm">
            <span className="flex justify-between">Password {mode === 'in' && <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-fg-muted hover:text-fg">Forgot?</a>}</span>
            <span className="relative mt-1.5 block">
              <input type={show ? 'text' : 'password'} minLength={8} required autoComplete={mode === 'in' ? 'current-password' : 'new-password'} className="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-16 outline-none focus:border-accent" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show} className="absolute top-1/2 right-2 -translate-y-1/2 rounded px-2 text-xs text-fg-muted hover:text-fg">{show ? 'Hide' : 'Show'}</button>
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-[var(--accent)]" /> Remember me</label>
          <button className="w-full rounded-lg bg-fg py-2.5 text-sm font-medium text-bg">{mode === 'in' ? 'Sign in' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
