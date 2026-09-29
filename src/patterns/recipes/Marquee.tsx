import type { ReactNode } from 'react'

/*
 * Infinite marquee. Content is rendered twice and the track slides by
 * exactly -50%, so the loop is seamless at any width. mask-image fades
 * the edges; hover pauses.
 */
export function Marquee({ children, speed = 30, reverse = false }: { children: ReactNode; speed?: number; reverse?: boolean }) {
  return (
    <div className="marquee group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <style>{`
        @keyframes marquee { to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee var(--speed) linear infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
      `}</style>
      <div
        className="marquee-track flex w-max"
        style={{ ['--speed' as string]: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={copy === 1 || undefined}>
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}

const STACK = ['React', 'Tailwind', 'GSAP', 'Motion', 'Vite', 'shadcn/ui', 'Radix', 'Three.js', 'Figma', 'Spline']

export default function MarqueeDemo() {
  return (
    <div className="space-y-6">
      <Marquee>
        {STACK.map((s) => (
          <span key={s} className="font-display text-4xl whitespace-nowrap italic">
            {s}
          </span>
        ))}
      </Marquee>
      <Marquee reverse speed={40}>
        {STACK.map((s) => (
          <span key={s} className="rounded-full border border-border px-4 py-1.5 font-mono text-xs whitespace-nowrap text-fg-muted">
            {s}
          </span>
        ))}
      </Marquee>
    </div>
  )
}
