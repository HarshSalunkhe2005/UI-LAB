import { useState } from 'react'

/*
 * Status messages that say what happened in words and a shape, so colour is only reinforcement. Error and warning use
 * role=alert (announced at once); success and info use role=status (announced politely). Each can be dismissed with a
 * labelled button, and dismissal never removes information the user still needs: errors name what to do next.
 */

type Kind = 'error' | 'warning' | 'success' | 'info'
const META: Record<Kind, { icon: string; label: string; cls: string; role: 'alert' | 'status' }> = {
  error: { icon: '✕', label: 'Error', cls: 'border-danger/60 bg-danger/10', role: 'alert' },
  warning: { icon: '!', label: 'Warning', cls: 'border-warning/60 bg-warning/10', role: 'alert' },
  success: { icon: '✓', label: 'Success', cls: 'border-success/60 bg-success/10', role: 'status' },
  info: { icon: 'i', label: 'Note', cls: 'border-border bg-surface', role: 'status' },
}
const MESSAGES: { kind: Kind; title: string; body: string }[] = [
  { kind: 'error', title: 'Payment was not taken', body: 'Your card was declined. Check the number and expiry, or try another card.' },
  { kind: 'warning', title: 'Your session ends in 2 minutes', body: 'Save your work. Press Stay signed in to keep going.' },
  { kind: 'success', title: 'Changes saved', body: 'Your profile has been updated.' },
  { kind: 'info', title: 'Scheduled maintenance', body: 'The site will be read-only on Sunday between 02:00 and 03:00.' },
]

export default function AlertBanners() {
  const [gone, setGone] = useState<string[]>([])
  const shown = MESSAGES.filter((m) => !gone.includes(m.title))
  return (
    <div className="mx-auto max-w-xl space-y-3">
      {shown.map((m) => {
        const k = META[m.kind]
        return (
          <div key={m.title} role={k.role} className={`flex items-start gap-3 rounded-lg border p-4 ${k.cls}`}>
            <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-bold">{k.icon}</span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold"><span className="sr-only">{k.label}: </span>{m.title}</p>
              <p className="mt-0.5 text-fg-muted">{m.body}</p>
            </div>
            <button onClick={() => setGone([...gone, m.title])} aria-label={`Dismiss: ${m.title}`} className="grid size-11 shrink-0 place-items-center rounded-md hover:bg-surface-2">×</button>
          </div>
        )
      })}
      {shown.length === 0 && (
        <p className="text-sm text-fg-muted">
          All dismissed. <button onClick={() => setGone([])} className="font-medium text-accent underline underline-offset-2">Bring them back</button>
        </p>
      )}
    </div>
  )
}
