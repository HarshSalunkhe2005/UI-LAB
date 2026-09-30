import { img } from '../three-d/_shared'

/*
 * Six image-card hover treatments in CSS: slide-up caption, zoom + dim,
 * split reveal (two halves part), corner frame draw, clip-path circle
 * reveal, and colour-from-greyscale. Each card is a link, and focus-visible
 * triggers the same state as hover so keyboard users see it too.
 */

const CSS = `
.cap { position: relative; overflow: hidden; border-radius: 14px; display: block; aspect-ratio: 4/5; color: white; }
.cap img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s var(--ease-out-expo), filter .5s; }
.cap .t { position: absolute; left: 0; right: 0; bottom: 0; padding: 1rem; }
.c-slide .t { background: linear-gradient(transparent, rgb(0 0 0 / .75)); transform: translateY(100%); transition: transform .5s var(--ease-out-expo); }
.c-slide:is(:hover,:focus-visible) .t { transform: none; }
.c-zoom::after { content: ''; position: absolute; inset: 0; background: rgb(0 0 0 / .45); opacity: 0; transition: opacity .4s; }
.c-zoom .t { z-index: 1; opacity: 0; transform: translateY(10px); transition: all .4s var(--ease-out-expo); }
.c-zoom:is(:hover,:focus-visible) img { transform: scale(1.12); }
.c-zoom:is(:hover,:focus-visible)::after, .c-zoom:is(:hover,:focus-visible) .t { opacity: 1; transform: none; }
.c-split .h { position: absolute; left: 0; right: 0; height: 50%; background: var(--fg); z-index: 1; transition: transform .6s var(--ease-out-expo); }
.c-split .h1 { top: 0; } .c-split .h2 { bottom: 0; }
.c-split .t { top: 50%; bottom: auto; transform: translateY(-50%); text-align: center; z-index: 2; color: var(--bg); transition: opacity .3s; }
.c-split:is(:hover,:focus-visible) .h1 { transform: translateY(-100%); } .c-split:is(:hover,:focus-visible) .h2 { transform: translateY(100%); }
.c-split:is(:hover,:focus-visible) .t { opacity: 0; }
.c-frame::before { content: ''; position: absolute; inset: 14px; border: 1px solid white; z-index: 1; transform: scale(1.15); opacity: 0; transition: all .5s var(--ease-out-expo); }
.c-frame:is(:hover,:focus-visible)::before { transform: none; opacity: 1; }
.c-frame .t { z-index: 1; text-align: center; top: 50%; bottom: auto; transform: translateY(-50%); opacity: 0; transition: opacity .4s .1s; }
.c-frame:is(:hover,:focus-visible) .t { opacity: 1; } .c-frame:is(:hover,:focus-visible) img { filter: brightness(.55); }
.c-circle .t { inset: 0; display: grid; place-items: center; background: var(--accent); clip-path: circle(0% at 50% 50%); transition: clip-path .6s var(--ease-out-expo); }
.c-circle:is(:hover,:focus-visible) .t { clip-path: circle(75% at 50% 50%); }
.c-gray img { filter: grayscale(1) contrast(1.1); } .c-gray:is(:hover,:focus-visible) img { filter: none; transform: scale(1.04); }
.c-gray .t { background: linear-gradient(transparent, rgb(0 0 0 / .6)); }
@media (prefers-reduced-motion: reduce) { .cap *, .cap::before, .cap::after { transition: none !important; } }
`

const CARDS = ['c-slide', 'c-zoom', 'c-split', 'c-frame', 'c-circle', 'c-gray']

export default function CaptionHover() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <style>{CSS}</style>
      {CARDS.map((c, i) => (
        <a key={c} href="#" onClick={(e) => e.preventDefault()} className={`cap ${c}`}>
          <img src={img(i + 1000, 400, 500)} alt="" />
          {c === 'c-split' && (
            <>
              <span className="h h1" aria-hidden />
              <span className="h h2" aria-hidden />
            </>
          )}
          <span className="t">
            <span className="block font-display text-2xl italic">Project {i + 1}</span>
            <span className="font-mono text-[11px] opacity-80">.{c}</span>
          </span>
        </a>
      ))}
    </div>
  )
}
