/*
 * Niche world: Broadsheet / The Ledger. Newspaper typography in pure CSS: a masthead with double rules, a
 * justified, hyphenated multi-column article with a drop cap and column rules, a pull quote that spans
 * columns, and a market ticker. Columns reflow with the container (column-width, not breakpoints), and the
 * text stays one continuous, selectable article. No JavaScript. Reduced motion: the ticker stops.
 */

const TICKER = ['NIFTY 24,812 ▲0.4%', 'SENSEX 81,340 ▲0.3%', 'GOLD 74,120 ▼0.1%', 'BRENT 81.4 ▲1.2%', 'USD/INR 83.6 ▼0.0%', '10Y 7.02 ▼0.02']

const BODY = [
  'The rupee has spent most of the year doing very little, which is itself the story. Traders who expected a swing in either direction found a currency that moved the way a tide does, slowly, and with a predictable return.',
  'Behind the calm sits a central bank that has been quietly buying dollars on every dip, building a cushion that few outside the market appreciate. The cost is real, and it is paid in the form of reserves that cannot be spent twice.',
  'Economists disagree about how long the arrangement can last. Some argue that a stable currency is worth almost any price; others point out that stability purchased with reserves is borrowed against the next shock.',
  'What both camps accept is that the margin for error is shrinking. A single bad quarter of exports, or one oil spike that lasts a month rather than a week, would test the cushion in ways the last two years have not.',
  'For households the lesson is more modest. A steady rupee has made imported goods predictable, and the habit of planning around it has spread. The risk is that planning becomes assumption.',
]

export default function BroadsheetColumns() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#b9ad92] bg-[#f4efe2] text-[#1a1712]" style={{ containerType: 'inline-size' }}>
      <style>{`
        @keyframes bs-tick { to { transform: translateX(-50%); } }
        .bs-tick { display: flex; width: max-content; animation: bs-tick 40s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .bs-tick { animation: none; } }
        .bs-body { column-width: 15rem; column-gap: 2rem; column-rule: 1px solid #1a1712; text-align: justify; hyphens: auto; font-size: 0.98rem; line-height: 1.6; }
        .bs-body p + p { text-indent: 1.4em; }
        .bs-body p:first-child::first-letter { float: left; font: 700 4.6em/0.8 var(--font-display, serif); padding: 0.06em 0.1em 0 0; }
      `}</style>
      <header className="px-6 pt-5 text-center">
        <p className="flex justify-between font-mono text-[11px] tracking-wider uppercase"><span>Vol. XII · No. 214</span><span>Mumbai · Tuesday</span><span>Price ₹10</span></p>
        <h2 className="mt-2 border-y-4 border-double border-[#1a1712] py-2 font-display text-5xl font-bold tracking-tight sm:text-6xl" style={{ fontFamily: 'var(--font-display, serif)' }}>The Ledger</h2>
      </header>
      <div className="mt-3 overflow-hidden border-b border-[#1a1712] bg-[#1a1712] py-1.5 text-[#f4efe2]" aria-label="Market ticker">
        <div className="bs-tick font-mono text-xs">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 gap-8 pr-8" aria-hidden={k === 1}>
              {TICKER.map((t) => <span key={t}>{t}</span>)}
            </span>
          ))}
        </div>
      </div>
      <article className="px-6 py-6">
        <h3 className="max-w-2xl font-display text-3xl leading-tight font-bold sm:text-4xl" style={{ fontFamily: 'var(--font-display, serif)' }}>A currency that refuses to move, and the price of that stillness</h3>
        <p className="mt-2 font-mono text-[11px] tracking-wider uppercase">By the Economics Desk · 6 min read</p>
        <div className="bs-body mt-4">
          {BODY.slice(0, 3).map((t) => <p key={t}>{t}</p>)}
          <blockquote className="my-3 border-y-2 border-[#1a1712] py-3 text-center font-display text-2xl leading-snug italic" style={{ columnSpan: 'all', fontFamily: 'var(--font-display, serif)' }}>
            “Stability bought with reserves is borrowed against the next shock.”
          </blockquote>
          {BODY.slice(3).map((t) => <p key={t}>{t}</p>)}
        </div>
      </article>
    </div>
  )
}
