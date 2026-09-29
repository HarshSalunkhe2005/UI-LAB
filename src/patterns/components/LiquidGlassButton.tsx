import type { ButtonHTMLAttributes } from 'react'

/*
 * Liquid glass pill. backdrop-filter blurs and saturates what is behind it;
 * layered inset shadows fake a thick bevel; a radial highlight follows the
 * pointer. Pointer position lives in registered CSS properties (@property),
 * so the highlight can transition smoothly with zero per-frame JS.
 * Needs something colourful behind it to read as glass.
 */

const CSS = `
@property --gx { syntax: '<percentage>'; inherits: false; initial-value: 50%; }
@property --gy { syntax: '<percentage>'; inherits: false; initial-value: 0%; }
.glass {
  position: relative; isolation: isolate; overflow: hidden;
  background: rgb(255 255 255 / .08);
  backdrop-filter: blur(14px) saturate(1.8) contrast(1.1);
  -webkit-backdrop-filter: blur(14px) saturate(1.8) contrast(1.1);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .45),
    inset 0 -1px 0 rgb(255 255 255 / .12),
    inset 0 0 0 1px rgb(255 255 255 / .14),
    inset 0 -10px 18px -10px rgb(255 255 255 / .25),
    0 8px 24px rgb(0 0 0 / .25);
  transition: --gx .35s var(--ease-out-expo), --gy .35s var(--ease-out-expo), transform .2s var(--ease-out-expo);
}
.glass::before {
  content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit;
  background: radial-gradient(120% 90% at var(--gx) var(--gy), rgb(255 255 255 / .38), transparent 55%);
}
.glass:hover { --gy: 30%; }
.glass:active { transform: scale(.96); }
@media (prefers-reduced-motion: reduce) { .glass { transition: none; } }
`

export function LiquidGlassButton({ className = '', children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`)
        e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`)
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.removeProperty('--gx')
        e.currentTarget.style.removeProperty('--gy')
      }}
      className={`glass rounded-full px-7 py-3 text-sm font-medium text-white ${className}`}
    >
      <style>{CSS}</style>
      {children}
    </button>
  )
}

export default function LiquidGlassDemo() {
  return (
    <div
      className="relative grid h-72 place-items-center overflow-hidden rounded-xl"
      style={{
        background:
          'radial-gradient(circle at 25% 35%, #f97316 0 18%, transparent 19%), radial-gradient(circle at 70% 60%, #8b5cf6 0 22%, transparent 23%), radial-gradient(circle at 50% 110%, #06b6d4 0 30%, transparent 31%), #0b0b10',
      }}
    >
      <div className="flex gap-4">
        <LiquidGlassButton>Get started</LiquidGlassButton>
        <LiquidGlassButton>Learn more</LiquidGlassButton>
      </div>
    </div>
  )
}
