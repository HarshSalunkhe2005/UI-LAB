/*
 * Reading progress bar + section indicator driven by a CSS scroll timeline
 * (animation-timeline: scroll()), no JS. The bar scales on X from 0 to 1
 * with the nearest scroller. Falls back to hidden where unsupported.
 */

const CSS = `
.progress-bar { transform-origin: left; transform: scaleX(0); }
@supports (animation-timeline: scroll()) {
  .progress-bar { animation: grow linear both; animation-timeline: scroll(nearest block); }
}
@keyframes grow { to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) { .progress-bar { animation-duration: 1ms; } }
`

export default function ScrollProgress() {
  return (
    <div className="h-80 overflow-y-auto rounded-xl border border-border" tabIndex={0} aria-label="Article with reading progress, scroll inside">
      <style>{CSS}</style>
      <div className="sticky top-0 z-10 h-1 bg-surface-2">
        <div className="progress-bar h-full bg-accent" aria-hidden />
      </div>
      <article className="prose-sm max-w-none space-y-4 p-6 text-fg-muted">
        <h4 className="text-xl font-semibold text-fg">Reading progress</h4>
        {Array.from({ length: 8 }, (_, i) => (
          <p key={i}>
            Paragraph {i + 1}. The bar above tracks how far through this box you have scrolled, using a scroll timeline so
            the browser drives it on the compositor. Swap the scroller for the document and it becomes a page-level
            reading indicator.
          </p>
        ))}
      </article>
    </div>
  )
}
