import { useRef, type ReactNode } from 'react'

/*
 * Magnetic button: within its hover area the button leans toward the
 * pointer (and its label leans a bit more, for depth), then springs back on
 * leave. Transforms are written straight to style; no React state.
 */

export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const inner = useRef<HTMLSpanElement>(null)
  return (
    <span
      className="inline-block p-6 motion-reduce:pointer-events-none"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * strength
        const y = (e.clientY - r.top - r.height / 2) * strength
        const btn = e.currentTarget.firstElementChild as HTMLElement
        btn.style.transform = `translate(${x}px, ${y}px)`
        if (inner.current) inner.current.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`
      }}
      onPointerLeave={(e) => {
        ;(e.currentTarget.firstElementChild as HTMLElement).style.transform = ''
        if (inner.current) inner.current.style.transform = ''
      }}
    >
      <span className="inline-block transition-transform duration-300 ease-out-expo">
        {typeof children === 'string' ? <span ref={inner} className="inline-block transition-transform duration-300 ease-out-expo">{children}</span> : children}
      </span>
    </span>
  )
}

export default function MagneticButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      <Magnetic>
        <button className="rounded-full bg-fg px-8 py-4 font-medium text-bg">Let's talk →</button>
      </Magnetic>
      <Magnetic strength={0.5}>
        <button className="grid h-24 w-24 place-items-center rounded-full border border-border text-sm">Menu</button>
      </Magnetic>
    </div>
  )
}
