/*
 * Scroll-driven typography, three modes in one demo, all CSS view
 * timelines (no JS):
 *  - blur-in: each word starts blurred and transparent, sharpens as it enters
 *  - highlight: a marker sweeps behind key phrases as they cross the viewport
 *  - fill: words go from muted to full colour one by one while reading
 * Everything is readable without support; animations off for reduced motion.
 */

const CSS = `
@supports (animation-timeline: view()) {
  .sb-word { animation: sb-blur linear both; animation-timeline: view(); animation-range: entry 10% cover 35%; }
  .sb-mark { background: linear-gradient(color-mix(in oklab, var(--accent) 40%, transparent), color-mix(in oklab, var(--accent) 40%, transparent)) no-repeat 0 85% / 0% 40%;
             animation: sb-mark linear both; animation-timeline: view(); animation-range: cover 25% cover 50%; }
  .sb-fill { animation: sb-fill linear both; animation-timeline: view(); animation-range: cover 20% cover 45%; }
}
@keyframes sb-blur { from { filter: blur(10px); opacity: 0; transform: translateY(.3em); } }
@keyframes sb-mark { to { background-size: 100% 40%; } }
@keyframes sb-fill { from { color: color-mix(in oklab, var(--fg) 20%, transparent); } }
@media (prefers-reduced-motion: reduce) { .sb-word, .sb-mark, .sb-fill { animation: none; } }
`

const Words = ({ text, cls }: { text: string; cls: string }) => (
  <>
    {text.split(' ').map((w, i) => (
      <span key={i} className={`${cls} inline-block`}>{w}&nbsp;</span>
    ))}
  </>
)

export default function ScrollBlurText() {
  return (
    <div className="h-96 overflow-y-auto rounded-xl border border-border px-6" tabIndex={0} aria-label="Scroll typography demo, scroll inside">
      <style>{CSS}</style>
      <div className="space-y-[40vh] py-[30vh] text-3xl leading-snug font-semibold tracking-tight sm:text-4xl">
        <p><Words text="Words come into focus as you read them, one after another." cls="sb-word" /></p>
        <p>
          Great interfaces feel <span className="sb-mark">inevitable</span>, like nothing else <span className="sb-mark">could have been there</span>.
        </p>
        <p><Words text="Every word lights up in turn, pulling the eye through the sentence." cls="sb-fill" /></p>
      </div>
    </div>
  )
}
