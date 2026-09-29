import { useId, useState } from 'react'

/*
 * Form control set: text input with hint + error, switch, checkbox, radio
 * cards, select and range slider. Everything is a native element restyled,
 * so keyboard, autofill and form submission work unchanged. Errors are
 * linked with aria-describedby and aria-invalid.
 */

export function Field({ label, hint, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={hint || error ? `${id}-d` : undefined}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm transition-colors outline-none placeholder:text-fg-muted focus:border-accent focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15"
        {...rest}
      />
      {(hint || error) && <p id={`${id}-d`} className={`mt-1.5 text-xs ${error ? 'text-danger' : 'text-fg-muted'}`}>{error ?? hint}</p>}
    </div>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
      {label}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-surface-2 ring-1 ring-border'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-out-expo ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </label>
  )
}

export default function FormControls() {
  const [on, setOn] = useState(true)
  const [plan, setPlan] = useState('pro')
  const [vol, setVol] = useState(60)
  return (
    <form className="grid gap-6 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <Field label="Work email" type="email" placeholder="you@company.com" hint="We'll never share it." />
        <Field label="Username" defaultValue="h@rsh" error="Only letters, numbers and dashes." />
        <div>
          <label htmlFor="fc-role" className="mb-1.5 block text-sm font-medium">Role</label>
          <select id="fc-role" className="w-full appearance-none rounded-lg border border-border bg-surface bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 stroke=%22gray%22 fill=%22none%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 py-2 text-sm outline-none focus:border-accent">
            <option>Designer</option>
            <option>Engineer</option>
            <option>Founder</option>
          </select>
        </div>
        <div>
          <label htmlFor="fc-vol" className="mb-1.5 flex justify-between text-sm font-medium">Volume <span className="font-mono text-fg-muted">{vol}</span></label>
          <input id="fc-vol" type="range" min={0} max={100} value={vol} onChange={(e) => setVol(+e.target.value)} className="w-full accent-[var(--accent)]" />
        </div>
      </div>
      <div className="space-y-4">
        <Switch label="Email notifications" checked={on} onChange={setOn} />
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[var(--accent)]" />
          I agree to the terms
        </label>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Plan</legend>
          <div className="grid grid-cols-2 gap-2">
            {[['free', 'Free', '$0'], ['pro', 'Pro', '$15/mo']].map(([v, l, p]) => (
              <label key={v} className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${plan === v ? 'border-accent bg-accent-soft' : 'border-border'}`}>
                <input type="radio" name="plan" value={v} checked={plan === v} onChange={() => setPlan(v)} className="sr-only" />
                <span className="block font-medium">{l}</span>
                <span className="text-fg-muted">{p}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="w-full rounded-lg bg-fg py-2.5 text-sm font-medium text-bg">Save</button>
      </div>
    </form>
  )
}
