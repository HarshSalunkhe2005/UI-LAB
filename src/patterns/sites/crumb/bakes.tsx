import type { ReactElement } from 'react'

/* Hand-drawn bakes as SVG: simple shapes with a wobble, so they read as drawn rather than rendered. */

export type Bake = { id: string; name: string; price: number; note: string; ready: number; out: number; draw: () => ReactElement }

const ink = '#3a2a20'
const wob = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const BAKES: Bake[] = [
  {
    id: 'sour', name: 'Sourdough loaf', price: 4.8, note: 'Long-fermented, crisp crust, open crumb.', ready: 7, out: 13,
    draw: () => (
      <svg viewBox="0 0 160 110" role="img" aria-label="Drawing of a round sourdough loaf with slashes">
        <path d="M18 70 C14 34 54 14 82 14 C116 14 148 34 142 70 C140 90 118 98 80 98 C44 98 20 90 18 70 Z" fill="#d9a066" stroke={ink} strokeWidth="3" {...wob} />
        <path d="M52 40 C60 52 64 58 66 70 M80 34 C88 48 92 58 92 72 M108 40 C112 52 114 60 112 70" fill="none" stroke="#f3dcb8" strokeWidth="5" {...wob} />
        <path d="M30 80 C60 92 108 92 132 80" fill="none" stroke={ink} strokeWidth="2" opacity="0.4" {...wob} />
      </svg>
    ),
  },
  {
    id: 'cardamom', name: 'Cardamom bun', price: 3.2, note: 'Twisted, sugared, a little too good.', ready: 7, out: 11,
    draw: () => (
      <svg viewBox="0 0 160 110" role="img" aria-label="Drawing of a twisted cardamom bun">
        <path d="M80 12 C118 12 140 36 136 62 C132 88 106 100 80 100 C54 100 28 88 24 62 C20 36 42 12 80 12 Z" fill="#cf8a4f" stroke={ink} strokeWidth="3" {...wob} />
        <path d="M80 28 C104 28 118 44 112 60 C106 76 82 74 76 62 C70 50 86 46 92 56" fill="none" stroke="#f3dcb8" strokeWidth="6" {...wob} />
        {[[50, 40], [114, 36], [124, 72], [44, 76], [82, 90]].map(([x, y]) => <circle key={x + y} cx={x} cy={y} r="2.6" fill="#fff6e6" />)}
      </svg>
    ),
  },
  {
    id: 'rye', name: 'Seeded rye', price: 5.2, note: 'Dense, sweet, full of seeds.', ready: 8, out: 14,
    draw: () => (
      <svg viewBox="0 0 160 110" role="img" aria-label="Drawing of a rectangular seeded rye loaf">
        <path d="M22 44 C22 24 44 18 80 18 C116 18 138 24 138 44 L136 84 C136 94 118 98 80 98 C42 98 24 94 24 84 Z" fill="#a8704a" stroke={ink} strokeWidth="3" {...wob} />
        {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={36 + (i % 8) * 12.5} cy={36 + Math.floor(i / 8) * 22 + (i % 3) * 3} rx="2.6" ry="1.6" fill="#f3dcb8" transform={`rotate(${i * 23} ${36 + (i % 8) * 12.5} ${36 + Math.floor(i / 8) * 22})`} />)}
      </svg>
    ),
  },
  {
    id: 'focaccia', name: 'Rosemary focaccia', price: 4.4, note: 'Olive oil, sea salt, dimples you can feel.', ready: 9, out: 15,
    draw: () => (
      <svg viewBox="0 0 160 110" role="img" aria-label="Drawing of a flat focaccia with dimples and rosemary">
        <rect x="14" y="22" width="132" height="70" rx="14" fill="#e3b872" stroke={ink} strokeWidth="3" {...wob} />
        {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={32 + (i % 6) * 19} cy={40 + Math.floor(i / 6) * 20} rx="5" ry="3.4" fill="#c8924a" opacity="0.8" />)}
        <path d="M40 34 l14 -8 M98 70 l16 -6 M60 76 l10 -10" stroke="#4d6b3a" strokeWidth="3" {...wob} />
      </svg>
    ),
  },
]
