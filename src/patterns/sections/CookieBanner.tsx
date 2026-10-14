import { useState } from 'react'

/*
 * A consent banner that is fair: "Reject non-essential" and "Accept all" are the same size and weight, nothing is
 * pre-ticked, choices are grouped and explained, and the page stays usable behind it. It is a non-modal region, not
 * a trap: focus is not stolen, Esc is not required, and the choice can be reopened from the footer link.
 */

type Choice = { analytics: boolean; marketing: boolean }

export default function CookieBanner() {
  const [saved, setSaved] = useState<Choice | null>(null)
  const [more, setMore] = useState(false)
  const [draft, setDraft] = useState<Choice>({ analytics: false, marketing: false })

  if (saved)
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm">
        <p role="status">
          Saved: analytics {saved.analytics ? 'on' : 'off'}, marketing {saved.marketing ? 'on' : 'off'}.{' '}
          <button onClick={() => setSaved(null)} className="font-medium text-accent underline underline-offset-2">Change cookie choices</button>
        </p>
      </div>
    )

  return (
    <section aria-labelledby="ck-h" className="rounded-xl border border-border bg-surface p-5 shadow-lg">
      <h3 id="ck-h" className="text-base font-semibold">Cookies on this site</h3>
      <p className="mt-1 max-w-prose text-sm text-fg-muted">
        We use essential cookies to make the site work. With your permission we would also like to measure how it is used and show relevant offers. You can say no and still use everything.
      </p>
      {more && (
        <fieldset className="mt-4 grid gap-3 text-sm">
          <legend className="sr-only">Optional cookies</legend>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })} className="mt-1 size-5" />
            <span><b className="font-medium">Analytics.</b> Counts visits so we can see which pages help. No names, no cross-site tracking.</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={draft.marketing} onChange={(e) => setDraft({ ...draft, marketing: e.target.checked })} className="mt-1 size-5" />
            <span><b className="font-medium">Marketing.</b> Lets partners show you our offers elsewhere.</span>
          </label>
        </fieldset>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setSaved({ analytics: false, marketing: false })} className="min-h-11 rounded-md border border-fg px-4 text-sm font-medium hover:bg-surface-2">Reject non-essential</button>
        <button onClick={() => setSaved({ analytics: true, marketing: true })} className="min-h-11 rounded-md border border-fg px-4 text-sm font-medium hover:bg-surface-2">Accept all</button>
        {more ? (
          <button onClick={() => setSaved(draft)} className="min-h-11 rounded-md bg-fg px-4 text-sm font-medium text-bg">Save my choices</button>
        ) : (
          <button onClick={() => setMore(true)} className="min-h-11 rounded-md px-3 text-sm text-fg-muted underline underline-offset-2 hover:text-fg">Choose</button>
        )}
      </div>
    </section>
  )
}
