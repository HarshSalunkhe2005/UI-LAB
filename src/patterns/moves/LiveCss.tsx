import { useState } from 'react'

/*
 * Signature move (Josh W. Comeau): explain by letting people break it. Sliders change a live element and the
 * CSS that produces it, side by side, so the rule and its effect are one gesture apart. Each control is a real
 * range input with a visible label and value; the preview and the code are the same state, so they cannot
 * disagree. No libraries.
 */

export default function LiveCss() {
  const [radius, setRadius] = useState(16)
  const [blur, setBlur] = useState(24)
  const [rotate, setRotate] = useState(-6)
  const [hue, setHue] = useState(24)

  const css = `.card {
  border-radius: ${radius}px;
  box-shadow: 0 ${Math.round(blur / 2)}px ${blur}px hsl(${hue} 80% 40% / 0.45);
  transform: rotate(${rotate}deg);
  background: hsl(${hue} 85% 60%);
}`

  const controls: [string, number, (n: number) => void, number, number][] = [
    ['border-radius', radius, setRadius, 0, 64],
    ['blur', blur, setBlur, 0, 60],
    ['rotate', rotate, setRotate, -30, 30],
    ['hue', hue, setHue, 0, 360],
  ]

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-surface p-5 md:grid-cols-2">
      <div className="grid min-h-56 place-items-center rounded-lg bg-bg">
        <div
          className="grid size-28 place-items-center text-sm font-semibold text-black/80 transition-[border-radius,box-shadow,transform] duration-150 motion-reduce:transition-none"
          style={{ borderRadius: radius, boxShadow: `0 ${Math.round(blur / 2)}px ${blur}px hsl(${hue} 80% 40% / 0.45)`, transform: `rotate(${rotate}deg)`, background: `hsl(${hue} 85% 60%)` }}
        >
          .card
        </div>
      </div>
      <div className="space-y-4">
        {controls.map(([name, val, set, min, max]) => (
          <label key={name} className="block">
            <span className="flex justify-between font-mono text-xs text-fg-muted">
              <span>{name}</span>
              <span className="tabular-nums">{val}</span>
            </span>
            <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} className="mt-1 h-8 w-full accent-[var(--accent)]" />
          </label>
        ))}
        <pre tabIndex={0} role="region" aria-label="Generated CSS" className="overflow-auto rounded-lg bg-bg p-3 font-mono text-[12px] leading-5"><code>{css}</code></pre>
      </div>
    </div>
  )
}
