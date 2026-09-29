import { img } from '../three-d/_shared'

/*
 * Split hero: headline, sub, dual CTA, avatar social proof and a pill
 * announcement on the left; a stacked, slightly rotated image collage on
 * the right. Collapses to one column. The h1 is the only heading level 1.
 */

export default function SplitHero() {
  return (
    <section className="grid items-center gap-10 rounded-2xl bg-bg p-6 sm:p-10 md:grid-cols-2">
      <div>
        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-fg-muted hover:text-fg">
          <span className="rounded-full bg-accent px-1.5 text-[10px] font-medium text-accent-fg">New</span> Shader backgrounds are here →
        </a>
        <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          Websites that feel <span className="font-display font-normal text-accent italic">alive</span>.
        </h1>
        <p className="mt-5 max-w-md text-fg-muted">Motion-first patterns, tokens and full screens. Copy a file, ship a page that doesn't look generated.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg">Start building</button>
          <button className="rounded-full border border-border px-6 py-3 text-sm font-medium">Watch demo ▸</button>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <img key={i} src={img(i + 900, 64, 64)} alt="" className="h-8 w-8 rounded-full border-2 border-bg object-cover" />
            ))}
          </div>
          <p className="text-sm text-fg-muted"><b className="text-fg">6,100+</b> builders shipping faster</p>
        </div>
      </div>
      <div className="relative h-80 sm:h-96" aria-hidden>
        <img src={img(910, 400, 500)} alt="" className="absolute top-0 right-6 h-64 w-48 rotate-6 rounded-2xl object-cover shadow-lg" />
        <img src={img(911, 400, 500)} alt="" className="absolute top-16 left-4 h-64 w-48 -rotate-6 rounded-2xl object-cover shadow-lg" />
        <img src={img(912, 400, 400)} alt="" className="absolute right-20 bottom-0 h-40 w-40 rounded-2xl border-4 border-bg object-cover shadow-lg" />
      </div>
    </section>
  )
}
