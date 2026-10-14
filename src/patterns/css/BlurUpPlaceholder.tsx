import { useState } from 'react'

/*
 * A tiny blurred placeholder made in CSS from just six colours (three by two cells, eighteen bytes of hex). The cells are
 * scaled up and blurred so they read as a soft impression of the picture while the real image loads, then the image fades
 * in over it. It is the idea behind blurhash and LQIP, with no decoder and no canvas. Trade-off: six colours cannot show
 * detail, so use it for photographs, not diagrams. Always keep the image's alt text; the placeholder is decorative.
 */

const CELLS = ['#c9d6e8', '#e9cfa6', '#9bb7d4', '#5f7c96', '#8aa58a', '#c98b5f']
// A tiny scene drawn as an SVG data URI: stands in for a photograph so the demo needs no network.
const SCENE = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'><defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#bcd3ea'/><stop offset='1' stop-color='#f1dcb6'/></linearGradient></defs><rect width='300' height='200' fill='url(#s)'/><circle cx='220' cy='60' r='26' fill='#fff2c4'/><path d='M0 140 L70 90 L130 130 L190 80 L300 150 V200 H0Z' fill='#5f7c96'/><path d='M0 170 Q80 130 160 165 T300 160 V200 H0Z' fill='#8aa58a'/></svg>`)}`

export default function BlurUpPlaceholder() {
  const [loaded, setLoaded] = useState(false)
  const [key, setKey] = useState(0)
  return (
    <div className="mx-auto max-w-sm">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-border bg-surface-2">
        <div aria-hidden className="absolute inset-0 grid scale-125 grid-cols-3 grid-rows-2 blur-2xl">
          {CELLS.map((c) => <span key={c} style={{ background: c }} />)}
        </div>
        {loaded && <img key={key} src={SCENE} alt="A pale mountain range at dusk with a small sun" className="absolute inset-0 h-full w-full animate-[fadein_.6s_ease_both] object-cover motion-reduce:animate-none" />}
        <style>{'@keyframes fadein { from { opacity: 0 } to { opacity: 1 } }'}</style>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <p className="text-fg-muted">{loaded ? 'Loaded. The placeholder sits behind it.' : 'Six colours, blurred. Press load.'}</p>
        <button onClick={() => { setLoaded((l) => !l); setKey((k) => k + 1) }} className="min-h-11 shrink-0 rounded-md border border-border px-4 font-medium hover:bg-surface">{loaded ? 'Reset' : 'Load image'}</button>
      </div>
      <pre tabIndex={0} aria-label="The six colours" className="mt-3 overflow-x-auto rounded-lg bg-surface-2 p-3 font-mono text-xs">{CELLS.join(' ')}</pre>
    </div>
  )
}
