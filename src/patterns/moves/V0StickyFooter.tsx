/*
 * Vibe-coded move (Simple Parallax Sticky Footer Landing, v0): the page lifts like a curtain to reveal the
 * footer. The content sits above the footer (higher z-index, with a bottom margin equal to the footer's
 * height), and the footer is position: sticky; bottom: 0, so it stays put underneath while the content
 * scrolls away. Pure CSS, no scroll handlers. Scroll the box to see it. Works with real page scroll the same way.
 */

export default function V0StickyFooter() {
  return (
    <div className="h-96 overflow-y-auto rounded-xl border border-border" tabIndex={0} aria-label="Scroll to reveal the footer">
      <div className="relative z-10 mb-56 bg-bg">
        {['Ship faster', 'Sleep better', 'Charge more'].map((t, i) => (
          <section key={t} className="grid h-60 place-items-center border-b border-border" style={{ background: i % 2 ? 'var(--surface)' : 'var(--bg)' }}>
            <h3 className="font-display text-5xl italic">{t}</h3>
          </section>
        ))}
      </div>
      <footer className="sticky bottom-0 z-0 grid h-56 place-items-center bg-accent text-accent-fg">
        <p className="font-display text-6xl italic">Let’s talk.</p>
      </footer>
    </div>
  )
}
