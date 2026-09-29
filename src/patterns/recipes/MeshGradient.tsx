/*
 * Animated mesh gradient, CSS only. Three heavily blurred blobs drift on
 * long, offset loops; a grain overlay stops the blur from looking plastic.
 * Put it behind a hero with `absolute inset-0 -z-10`.
 */
const CSS = `
.mesh { position: absolute; inset: 0; overflow: hidden; isolation: isolate; }
.mesh-blob {
  position: absolute; width: 55%; aspect-ratio: 1; border-radius: 50%;
  filter: blur(80px); opacity: 0.55; mix-blend-mode: screen;
  animation: mesh-drift 18s var(--ease-in-out) infinite alternate;
}
.mesh-blob:nth-child(1) { background: var(--mesh-a, #6366f1); top: -20%; left: -10%; }
.mesh-blob:nth-child(2) { background: var(--mesh-b, #ec4899); top: 10%; right: -15%; animation-duration: 22s; animation-delay: -6s; }
.mesh-blob:nth-child(3) { background: var(--mesh-c, #06b6d4); bottom: -30%; left: 25%; animation-duration: 26s; animation-delay: -12s; }
.mesh-grain {
  position: absolute; inset: 0; opacity: 0.12; mix-blend-mode: overlay; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
@keyframes mesh-drift {
  0%   { transform: translate(0, 0) scale(1); }
  50%  { transform: translate(12%, 8%) scale(1.15); }
  100% { transform: translate(-8%, 14%) scale(0.95); }
}
@media (prefers-reduced-motion: reduce) { .mesh-blob { animation: none; } }
:root[data-theme='light'] .mesh-blob { mix-blend-mode: multiply; opacity: 0.5; }
@media (prefers-color-scheme: light) { :root:not([data-theme='dark']) .mesh-blob { mix-blend-mode: multiply; opacity: 0.5; } }
`

export function MeshGradient({ className = '' }: { className?: string }) {
  return (
    <div className={`mesh ${className}`} aria-hidden>
      <style>{CSS}</style>
      <div className="mesh-blob" />
      <div className="mesh-blob" />
      <div className="mesh-blob" />
      <div className="mesh-grain" />
    </div>
  )
}

export default function MeshGradientDemo() {
  return (
    <div className="relative grid h-80 place-items-center overflow-hidden rounded-lg border border-border bg-bg">
      <MeshGradient />
      <h3 className="relative font-display text-5xl italic">Soft motion</h3>
    </div>
  )
}
