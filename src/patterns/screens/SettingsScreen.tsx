import { useId, useState } from 'react'

/*
 * A settings screen with honest state: real switches (role=switch, aria-checked) with a visible on/off word, grouped
 * in fieldsets, an unsaved-changes bar that appears only when something differs, Save and Discard buttons, and a
 * status message after saving. Danger actions are separate, named and need a confirmation step.
 */

type S = { emails: boolean; digest: boolean; sound: boolean; theme: 'system' | 'light' | 'dark'; name: string }
const START: S = { emails: true, digest: false, sound: false, theme: 'system', name: 'Alex Morgan' }

function Switch({ label, hint, on, set }: { label: string; hint: string; on: boolean; set: (v: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p id={id} className="font-medium">{label}</p>
        <p className="text-sm text-fg-muted">{hint}</p>
      </div>
      <button role="switch" aria-checked={on} aria-labelledby={id} onClick={() => set(!on)} className={`flex min-h-11 min-w-20 items-center justify-between gap-2 rounded-full border px-3 text-xs font-medium ${on ? 'border-accent bg-accent-soft text-accent' : 'border-border text-fg-muted'}`}>
        <span>{on ? 'On' : 'Off'}</span>
        <span aria-hidden className={`size-4 rounded-full ${on ? 'bg-accent' : 'bg-fg-muted'}`} />
      </button>
    </div>
  )
}

export default function SettingsScreen() {
  const [saved, setSaved] = useState<S>(START)
  const [s, setS] = useState<S>(START)
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState(false)
  const dirty = JSON.stringify(s) !== JSON.stringify(saved)
  const put = (p: Partial<S>) => { setS({ ...s, ...p }); setMsg('') }

  return (
    <div className="mx-auto max-w-xl">
      <h3 className="text-2xl font-semibold tracking-tight">Settings</h3>
      <form className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface px-4" onSubmit={(e) => { e.preventDefault(); setSaved(s); setMsg('Settings saved.') }}>
        <fieldset className="py-3">
          <legend className="sr-only">Profile</legend>
          <p aria-hidden className="text-xs font-medium tracking-wider text-fg-muted uppercase">Profile</p>
          <label className="mt-2 block text-sm font-medium" htmlFor="set-name">Display name</label>
          <input id="set-name" value={s.name} onChange={(e) => put({ name: e.target.value })} className="mt-1 min-h-11 w-full rounded-md border border-border bg-bg px-3" />
        </fieldset>
        <fieldset>
          <legend className="sr-only">Notifications</legend>
          <p aria-hidden className="pt-3 text-xs font-medium tracking-wider text-fg-muted uppercase">Notifications</p>
          <Switch label="Product emails" hint="News about features you use." on={s.emails} set={(v) => put({ emails: v })} />
          <Switch label="Weekly digest" hint="One summary on Monday morning." on={s.digest} set={(v) => put({ digest: v })} />
          <Switch label="Sounds" hint="Play a short tone for new messages." on={s.sound} set={(v) => put({ sound: v })} />
        </fieldset>
        <fieldset className="py-3">
          <legend className="sr-only">Theme</legend>
          <p aria-hidden className="text-xs font-medium tracking-wider text-fg-muted uppercase">Theme</p>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Theme">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <button type="button" key={t} role="radio" aria-checked={s.theme === t} onClick={() => put({ theme: t })} className={`min-h-11 rounded-md border px-4 text-sm capitalize ${s.theme === t ? 'border-fg bg-fg text-bg' : 'border-border'}`}>{t}</button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center gap-2 py-3">
          <button disabled={!dirty} className="min-h-11 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg disabled:opacity-40">Save changes</button>
          <button type="button" disabled={!dirty} onClick={() => { setS(saved); setMsg('') }} className="min-h-11 rounded-md border border-border px-4 text-sm disabled:opacity-40">Discard</button>
          <p className="text-sm text-fg-muted" role="status">{dirty ? 'You have unsaved changes.' : msg}</p>
        </div>
      </form>

      <section className="mt-6 rounded-xl border border-danger/50 p-4" aria-labelledby="danger-h">
        <h4 id="danger-h" className="font-semibold">Delete account</h4>
        <p className="mt-1 text-sm text-fg-muted">This removes your data and cannot be undone.</p>
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="mt-3 min-h-11 rounded-md border border-danger px-4 text-sm font-medium text-danger">Delete my account…</button>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2" role="alert">
            <p className="text-sm font-medium">Are you sure?</p>
            <button className="min-h-11 rounded-md bg-danger px-4 text-sm font-medium text-danger-fg">Yes, delete</button>
            <button onClick={() => setConfirm(false)} className="min-h-11 rounded-md border border-border px-4 text-sm">Cancel</button>
          </div>
        )}
      </section>
    </div>
  )
}
