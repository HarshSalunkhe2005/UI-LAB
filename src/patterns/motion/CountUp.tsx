import { useEffect, useRef, useState } from 'react'

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLElement | null>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          setValue(target * easeOutExpo(t))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, duration])

  return [ref, value] as const
}

function Stat({ label, target, format }: { label: string; target: number; format: (n: number) => string }) {
  const [ref, value] = useCountUp(target)
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="rounded-lg border border-border bg-surface p-5">
      <div className="text-3xl font-semibold tabular-nums">{format(value)}</div>
      <div className="mt-1 text-sm text-fg-muted">{label}</div>
    </div>
  )
}

const int = (n: number) => Math.round(n).toLocaleString('en-IN')

export default function CountUp() {
  const [key, setKey] = useState(0)
  return (
    <div>
      <div key={key} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Fragments ingested" target={128540} format={int} />
        <Stat label="Timelines rebuilt" target={3412} format={int} />
        <Stat label="Accuracy" target={97.4} format={(n) => `${n.toFixed(1)}%`} />
        <Stat label="Median latency" target={180} format={(n) => `${Math.round(n)}ms`} />
      </div>
      <button className="mt-4 text-sm text-fg-muted hover:text-fg" onClick={() => setKey((k) => k + 1)}>
        ↻ Replay
      </button>
    </div>
  )
}
