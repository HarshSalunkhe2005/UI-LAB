import { useEffect, useState } from 'react'

/*
 * Ask before playing sound. A non-blocking bar on first visit with two
 * equal choices; the answer is remembered and a small toggle stays in the
 * corner afterwards. Audio never autoplays without a click, which is also
 * what browsers require anyway.
 */

const KEY = 'sound-pref'

export function useSoundPref() {
  const [pref, setPref] = useState<'on' | 'off' | null>(() => {
    try {
      return (localStorage.getItem(KEY) as 'on' | 'off' | null) ?? null
    } catch {
      return null
    }
  })
  useEffect(() => {
    try {
      if (pref) localStorage.setItem(KEY, pref)
      else localStorage.removeItem(KEY)
    } catch {}
  }, [pref])
  return [pref, setPref] as const
}

export function SoundOptIn({ pref, onChange }: { pref: 'on' | 'off' | null; onChange: (p: 'on' | 'off' | null) => void }) {
  if (pref === null) {
    return (
      <div
        role="region"
        aria-label="Sound preference"
        className="flex flex-wrap items-center gap-3 rounded-full border border-border bg-surface/90 px-4 py-2 text-sm shadow-lg backdrop-blur"
      >
        <span className="flex-1">This site has sound. Turn it on?</span>
        <button onClick={() => onChange('on')} className="rounded-full bg-fg px-3 py-1 text-xs font-medium text-bg">
          Sound on
        </button>
        <button onClick={() => onChange('off')} className="rounded-full border border-border px-3 py-1 text-xs">
          Continue without
        </button>
      </div>
    )
  }
  return (
    <button
      onClick={() => onChange(pref === 'on' ? 'off' : 'on')}
      aria-pressed={pref === 'on'}
      className="flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-fg-muted hover:text-fg"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[2px] bg-current"
            style={{
              height: pref === 'on' ? undefined : '3px',
              animation: pref === 'on' ? `eq .9s ${i * 0.15}s ease-in-out infinite alternate` : 'none',
            }}
          />
        ))}
      </span>
      sound {pref}
      <style>{`@keyframes eq { from { height: 3px } to { height: 12px } } @media (prefers-reduced-motion: reduce) { [aria-pressed] span span { animation: none !important; height: 8px !important; } }`}</style>
    </button>
  )
}

export default function SoundOptInDemo() {
  const [pref, setPref] = useState<'on' | 'off' | null>(null)
  return (
    <div className="space-y-4">
      <SoundOptIn pref={pref} onChange={setPref} />
      <button onClick={() => setPref(null)} className="text-sm text-fg-muted hover:text-fg">
        ↻ Reset (first visit)
      </button>
    </div>
  )
}
