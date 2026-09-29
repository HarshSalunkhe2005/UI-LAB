/*
 * Extruded 3D text with pure CSS: a stack of text-shadows, each 1px further
 * along the extrusion direction and slightly darker, then a soft cast
 * shadow. The shadow list is generated, so depth and colour are props.
 * The whole block tilts toward the pointer.
 */

export function extrude(depth = 14, color = '60 50% 40%') {
  const [h, s, l] = color.split(' ')
  const layers = Array.from({ length: depth }, (_, i) => `${i + 1}px ${i + 1}px 0 hsl(${h} ${s} calc(${l} - ${i * 1.5}%))`)
  return [...layers, `${depth + 6}px ${depth + 10}px 18px rgb(0 0 0 / .35)`].join(', ')
}

export default function ExtrudedText() {
  return (
    <div
      className="grid h-64 place-items-center [perspective:800px]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -20}deg`)
        e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 20}deg`)
      }}
    >
      <h3
        className="text-7xl font-black tracking-tight text-amber-300 transition-transform duration-200 select-none motion-reduce:!transform-none sm:text-8xl"
        style={{ textShadow: extrude(16, '30 90% 45%'), transform: 'rotateX(var(--rx, 8deg)) rotateY(var(--ry, -12deg))' }}
      >
        BOLD
      </h3>
    </div>
  )
}
