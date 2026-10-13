import { useState } from 'react'

/*
 * Signature move (Resend): the code and the thing it makes, one tap apart. A segmented control swaps a code
 * window for the rendered result with a short cross-fade and a lift, so the product's promise ("this is what
 * you write, this is what they get") is felt, not explained. Tab semantics with arrow keys.
 */

const CODE = `import { Resend } from 'resend'

const resend = new Resend(process.env.KEY)

await resend.emails.send({
  from: 'Acme <hi@acme.dev>',
  to: ['you@example.com'],
  subject: 'Welcome aboard',
  html: '<strong>It works.</strong>',
})`

export default function CodeToPreview() {
  const [view, setView] = useState<'code' | 'preview'>('code')
  const tabs = ['code', 'preview'] as const
  return (
    <div className="mx-auto max-w-xl">
      <div role="tablist" aria-label="View" className="mb-3 inline-flex rounded-full border border-border p-1">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={view === t}
            tabIndex={view === t ? 0 : -1}
            onClick={() => setView(t)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault()
                setView(t === 'code' ? 'preview' : 'code')
              }
            }}
            className={`min-h-9 rounded-full px-4 text-sm capitalize transition-colors ${view === t ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="relative h-72 overflow-hidden rounded-xl border border-border bg-surface">
        <pre
          aria-hidden={view !== 'code'}
          className="absolute inset-0 overflow-auto p-5 font-mono text-[13px] leading-6 transition-all duration-500 motion-reduce:transition-none"
          style={{ opacity: view === 'code' ? 1 : 0, transform: view === 'code' ? 'none' : 'translateY(-12px) scale(0.98)', pointerEvents: view === 'code' ? 'auto' : 'none' }}
        >
          <code>{CODE}</code>
        </pre>
        <div
          aria-hidden={view !== 'preview'}
          className="absolute inset-0 grid place-items-center p-6 transition-all duration-500 motion-reduce:transition-none"
          style={{ opacity: view === 'preview' ? 1 : 0, transform: view === 'preview' ? 'none' : 'translateY(12px) scale(0.98)', pointerEvents: view === 'preview' ? 'auto' : 'none' }}
        >
          <div className="w-full max-w-xs rounded-lg bg-white p-5 text-left text-neutral-900 shadow-xl">
            <p className="text-xs text-neutral-500">From: Acme &lt;hi@acme.dev&gt;</p>
            <p className="mt-1 text-sm font-medium">Welcome aboard</p>
            <hr className="my-3 border-neutral-200" />
            <p className="text-sm"><strong>It works.</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
