import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Scroll-driven camera flight along a 3D spline. A closed CatmullRom curve
 * winds through space; image cards hang along it. Scroll progress (0..1)
 * maps to a point on the curve; the camera eases to that point and looks a
 * little further ahead along the curve, so it banks through the turns.
 * The path itself is drawn as a thin glowing tube.
 */

const CARDS = 10

function Flight({ progress }: { progress: React.MutableRefObject<number> }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([[0, 0, 0], [4, 1, -6], [0, 3, -12], [-5, 1, -16], [-3, -2, -24], [3, 0, -30], [6, 3, -36], [0, 2, -42]].map(([x, y, z]) => new THREE.Vector3(x, y, z))),
    [],
  )
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 300, 0.02, 6, false), [curve])
  const texs = useMemo(() => {
    const l = new THREE.TextureLoader()
    return Array.from({ length: CARDS }, (_, i) => {
      const t = l.load(`/img/${(i * 5 + 3) % 48}.webp`)
      t.colorSpace = THREE.SRGBColorSpace
      return t
    })
  }, [])
  const cards = useMemo(
    () =>
      Array.from({ length: CARDS }, (_, i) => {
        const u = (i + 0.6) / (CARDS + 0.5)
        const p = curve.getPointAt(u)
        const side = i % 2 ? 1 : -1
        const tan = curve.getTangentAt(u)
        const offset = new THREE.Vector3().crossVectors(tan, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(1.3 * side)
        return { pos: p.add(offset).add(new THREE.Vector3(0, 0.3, 0)), look: curve.getPointAt(Math.max(0, u - 0.03)) }
      }),
    [curve],
  )
  const cur = useRef(0)
  useFrame((s, dt) => {
    cur.current = THREE.MathUtils.damp(cur.current, progress.current, 3, dt)
    const u = Math.min(0.96, cur.current * 0.96)
    s.camera.position.copy(curve.getPointAt(u)).add(new THREE.Vector3(0, 0.7, 0))
    s.camera.lookAt(curve.getPointAt(Math.min(1, u + 0.035)).add(new THREE.Vector3(0, 0.45, 0)))
  })
  return (
    <>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#818cf8" />
      </mesh>
      {cards.map((c, i) => (
        <mesh key={i} position={c.pos} onUpdate={(m) => m.lookAt(c.look)}>
          <planeGeometry args={[1.4, 1.8]} />
          <meshBasicMaterial map={texs[i]} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  )
}

export default function SplineFlythrough() {
  const box = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  useEffect(() => {
    const el = box.current!
    const on = () => (progress.current = el.scrollTop / (el.scrollHeight - el.clientHeight || 1))
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])
  return (
    <div ref={box} className="relative h-96 overflow-y-auto rounded-xl bg-[#05040f]" tabIndex={0} aria-label="Camera flies along a 3D path past image cards as you scroll inside">
      <div className="h-[600%]">
        <div className="sticky top-0 h-96">
          <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ fov: 60, position: [0, 0.25, 0] }}>
            <fog attach="fog" args={['#05040f', 4, 18]} />
            <Flight progress={progress} />
          </Canvas>
          <p className="pointer-events-none absolute bottom-3 w-full text-center font-mono text-xs text-white/60">scroll ↓ to fly</p>
        </div>
      </div>
    </div>
  )
}
