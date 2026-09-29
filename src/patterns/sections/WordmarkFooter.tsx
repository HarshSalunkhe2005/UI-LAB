/*
 * Studio footer: newsletter panel, link columns, and an enormous wordmark
 * bleeding off the bottom edge. The wordmark is sized in container query
 * units (cqw) so it always spans the footer's width, and is aria-hidden
 * because the brand name already appears as text.
 */

const COLS = {
  Product: ['Patterns', 'Shaders', 'Sections', 'Changelog'],
  Studio: ['About', 'Work', 'Careers', 'Press'],
  Social: ['X / Twitter', 'GitHub', 'Dribbble', 'YouTube'],
}

export default function WordmarkFooter({ brand = 'tidewave' }: { brand?: string }) {
  return (
    <footer className="relative overflow-hidden rounded-2xl bg-neutral-950 text-neutral-200 [container-type:inline-size]">
      <div className="grid gap-10 p-6 sm:p-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <form className="max-w-xs space-y-3" onSubmit={(e) => e.preventDefault()}>
          <p className="text-lg font-medium text-white">Letters from the studio</p>
          <p className="text-sm text-neutral-400">One email a month. New work, no noise.</p>
          <div className="flex rounded-full border border-white/15 p-1 focus-within:border-white/40">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input id="footer-email" type="email" required placeholder="you@studio.com" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-neutral-500" />
            <button className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black">Join</button>
          </div>
        </form>
        {Object.entries(COLS).map(([h, links]) => (
          <nav key={h} aria-label={h}>
            <p className="mb-3 font-mono text-[11px] tracking-wider text-neutral-500 uppercase">{h}</p>
            <ul className="space-y-2 text-sm">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="flex justify-between px-6 font-mono text-[11px] text-neutral-500 sm:px-10">
        <span>© 2026 {brand}</span>
        <span>Made with care</span>
      </div>
      <p aria-hidden className="-mb-[4cqw] text-center leading-[0.8] font-semibold tracking-tighter text-lime-300 select-none" style={{ fontSize: '22cqw' }}>
        {brand}
      </p>
    </footer>
  )
}
