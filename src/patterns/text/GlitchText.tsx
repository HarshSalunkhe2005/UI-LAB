/*
 * CSS glitch: two pseudo-element copies of the text (via data-text), each
 * clipped to random horizontal bands with clip-path and offset in opposite
 * directions with RGB-split colours. Keyframes jump between band sets.
 * Runs on hover by default (always-on flicker is hard on some users);
 * disabled under reduced motion.
 */

const CSS = `
.glitch { position: relative; display: inline-block; }
.glitch::before, .glitch::after { content: attr(data-text); position: absolute; inset: 0; opacity: 0; }
.glitch::before { color: #22d3ee; transform: translate(-2px, 0); }
.glitch::after  { color: #f43f5e; transform: translate(2px, 0); }
.glitch:hover::before, .glitch.on::before { opacity: .9; animation: g1 .9s steps(1) infinite; }
.glitch:hover::after,  .glitch.on::after  { opacity: .9; animation: g2 .75s steps(1) infinite; }
@keyframes g1 {
  0% { clip-path: inset(10% 0 70% 0); transform: translate(-3px, 1px); }
  20% { clip-path: inset(60% 0 10% 0); transform: translate(3px, -1px); }
  40% { clip-path: inset(30% 0 45% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, 0); }
  80% { clip-path: inset(0 0 85% 0); transform: translate(-4px, -1px); }
}
@keyframes g2 {
  0% { clip-path: inset(75% 0 5% 0); transform: translate(3px, 0); }
  25% { clip-path: inset(5% 0 80% 0); transform: translate(-3px, 1px); }
  50% { clip-path: inset(45% 0 35% 0); transform: translate(2px, -2px); }
  75% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 1px); }
}
@media (prefers-reduced-motion: reduce) { .glitch::before, .glitch::after { animation: none !important; opacity: 0 !important; } }
`

export function GlitchText({ text, always = false, className = '' }: { text: string; always?: boolean; className?: string }) {
  return (
    <span className={`glitch ${always ? 'on' : ''} ${className}`} data-text={text}>
      <style>{CSS}</style>
      {text}
    </span>
  )
}

export default function GlitchTextDemo() {
  return (
    <div className="grid h-56 place-items-center rounded-xl bg-black text-white">
      <div className="text-center">
        <p className="font-mono text-6xl font-bold tracking-tight sm:text-7xl"><GlitchText text="SIGNAL" /></p>
        <p className="mt-3 font-mono text-xs text-neutral-500">hover the word</p>
      </div>
    </div>
  )
}
