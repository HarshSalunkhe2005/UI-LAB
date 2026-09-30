import { useRef, type ButtonHTMLAttributes } from 'react'

/*
 * Particle burst on click: spawns N small dots at the click point that fly
 * out on random angles with the Web Animations API and remove themselves.
 * No state, no library. Skipped under reduced motion (the click still works).
 */

export function burst(host: HTMLElement, x: number, y: number, colors = ['#818cf8', '#f472b6', '#fbbf24', '#34d399'], count = 18) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span')
    const size = 4 + Math.random() * 6
    Object.assign(p.style, {
      position: 'absolute', left: `${x}px`, top: `${y}px`, width: `${size}px`, height: `${size}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px', background: colors[i % colors.length], pointerEvents: 'none',
    })
    host.appendChild(p)
    const a = Math.random() * Math.PI * 2
    const d = 40 + Math.random() * 70
    p.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 },
      ],
      { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(.16,1,.3,1)' },
    ).onfinish = () => p.remove()
  }
}

export function ParticleButton({ children, className = '', onClick, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const wrap = useRef<HTMLSpanElement>(null)
  return (
    <span ref={wrap} className="relative inline-block">
      <button
        {...rest}
        onClick={(e) => {
          const r = wrap.current!.getBoundingClientRect()
          const x = e.clientX ? e.clientX - r.left : r.width / 2
          const y = e.clientY ? e.clientY - r.top : r.height / 2
          burst(wrap.current!, x, y)
          onClick?.(e)
        }}
        className={`rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform active:scale-95 ${className}`}
      >
        {children}
      </button>
    </span>
  )
}

export default function ParticleButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-10">
      <ParticleButton>Celebrate 🎉</ParticleButton>
      <ParticleButton className="!bg-pink-500 !text-white">♥ Like</ParticleButton>
    </div>
  )
}
