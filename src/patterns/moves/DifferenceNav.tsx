/*
 * Signature move (twks, Awwwards SOTD): a header whose text is always readable because it inverts against whatever
 * scrolls under it (mix-blend-mode: difference on white text). No JavaScript, no per-section colour logic.
 * Keep the nav links as ordinary links; the blend is only paint. Caveat: on mid-greys the inverted text has low
 * contrast, so keep the content behind it either clearly light or clearly dark.
 */

const BANDS = [
  ['#f2efe8', 'Light paper'],
  ['#0f0f12', 'Near black'],
  ['#e5532d', 'Signal orange'],
  ['#fafafa', 'White'],
]

export default function DifferenceNav() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div tabIndex={0} aria-label="Scroll: the header inverts against each band" className="relative isolate overflow-y-auto" style={{ height: 340 }}>
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 text-white mix-blend-difference">
          <a href="#diff" onClick={(e) => e.preventDefault()} className="text-lg font-semibold tracking-tight">studio</a>
          <nav aria-label="Demo" className="flex gap-5 text-sm">
            {['work', 'agency', 'journal', 'contact'].map((l) => (
              <a key={l} href="#diff" onClick={(e) => e.preventDefault()} className="underline-offset-4 hover:underline">
                {l}
              </a>
            ))}
          </nav>
        </header>
        <div className="-mt-[56px]">
          {BANDS.map(([bg, name]) => (
            <section key={name} className="grid place-content-center px-6 text-center" style={{ background: bg, height: 240 }}>
              <p className="font-display text-4xl italic" style={{ color: bg === '#0f0f12' || bg === '#e5532d' ? '#fff' : '#111' }}>
                {name}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
