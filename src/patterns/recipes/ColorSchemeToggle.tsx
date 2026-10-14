import { useEffect, useState } from 'react'

/*
 * A colour-scheme switch done properly: three choices (System, Light, Dark) rather than a single flip, the choice stored
 * in a data attribute on the element you theme, and "System" following the operating setting live via the
 * prefers-color-scheme media query. This demo themes only its own box, so it will not change the page around it. In a
 * real site set the attribute on <html> and store the choice in localStorage inside try/catch.
 */

type Mode = 'system' | 'light' | 'dark'

export default function ColorSchemeToggle() {
  const [mode, setMode] = useState<Mode>('system')
  const [sysDark, setSysDark] = useState(typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = () => setSysDark(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const dark = mode === 'dark' || (mode === 'system' && sysDark)
  return (
    <div className="rounded-xl border border-border p-5 transition-colors motion-reduce:transition-none" style={{ background: dark ? '#14141a' : '#fbfaf6', color: dark ? '#ececf1' : '#1b1b20' }}>
      <div role="radiogroup" aria-label="Colour scheme" className="inline-flex rounded-lg border p-1" style={{ borderColor: dark ? '#3a3a46' : '#d4d2c8' }}>
        {(['system', 'light', 'dark'] as const).map((m) => (
          <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className="min-h-11 rounded-md px-4 text-sm font-medium capitalize" style={mode === m ? { background: dark ? '#ececf1' : '#1b1b20', color: dark ? '#14141a' : '#fbfaf6' } : undefined}>
            {m}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm" role="status">Showing the {dark ? 'dark' : 'light'} scheme{mode === 'system' ? ` because your system prefers ${sysDark ? 'dark' : 'light'}` : ''}.</p>
    </div>
  )
}
