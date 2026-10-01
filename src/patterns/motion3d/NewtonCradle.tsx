import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Newton's cradle. Five chrome balls on V-strings. The physics is faked
 * the way the real thing behaves: only the outer balls ever swing, as a
 * damped pendulum, and energy hands over through the stationary middle
 * balls each time an end ball hits. Click a ball (or press the button) to
 * pull an end ball back and release it; strings are redrawn every frame.
 */

const N = 5
const L = 2
const R = 0.25

function Cradle({ kick }: { kick: React.MutableRefObject<number> }) {
  const balls = useRef<(THREE.Group | null)[]>([])
  const s = useRef({ left: 0, right: 0, vl: 0, vr: 0, active: 'left' as 'left' | 'right' })
  const strings = useMemo(() => Array.from({ length: N }, () => new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#a1a1aa' }))), [])
  useFrame((_, dt) => {
    const st = s.current
    if (kick.current) {
      st.left = -0.9
      st.vl = 0
      st.right = 0
      st.vr = 0
      st.active = 'left'
      kick.current = 0
    }
    const g = 9.8 / L
    const h = Math.min(dt, 1 / 30)
    if (st.active === 'left') {
      st.vl += -g * Math.sin(st.left) * h
      st.left += st.vl * h
      if (st.left > 0 && st.vl > 0) {
        st.vr = st.vl * 0.985
        st.vl = 0
        st.left = 0
        st.active = 'right'
      }
    } else {
      st.vr += -g * Math.sin(st.right) * h
      st.right += st.vr * h
      if (st.right < 0 && st.vr < 0) {
        st.vl = st.vr * 0.985
        st.vr = 0
        st.right = 0
        st.active = 'left'
      }
    }
    for (let i = 0; i < N; i++) {
      const ang = i === 0 ? st.left : i === N - 1 ? st.right : 0
      const px = (i - (N - 1) / 2) * R * 2
      const bx = px + Math.sin(ang) * L
      const by = 1.6 - Math.cos(ang) * L
      balls.current[i]?.position.set(bx, by, 0)
      strings[i].geometry.setFromPoints([new THREE.Vector3(px, 1.6, -0.5), new THREE.Vector3(bx, by, 0), new THREE.Vector3(px, 1.6, 0.5)])
    }
  })
  return (
    <group position={[0, 0.3, 0]}>
      {strings.map((l, i) => <primitive key={i} object={l} />)}
      {Array.from({ length: N }, (_, i) => (
        <group key={i} ref={(el) => { balls.current[i] = el }} onClick={() => (kick.current = 1)}>
          <mesh>
            <sphereGeometry args={[R * 0.98, 48, 48]} />
            <meshStandardMaterial color="#e4e4e7" metalness={1} roughness={0.08} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 3.2]} />
        <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Studio() {
  // A tiny gradient "environment" so chrome has something to reflect, no HDR download.
  const env = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 128
    const g = c.getContext('2d')!
    const grd = g.createLinearGradient(0, 0, 0, 128)
    grd.addColorStop(0, '#ffffff')
    grd.addColorStop(0.5, '#6366f1')
    grd.addColorStop(1, '#0a0a0a')
    g.fillStyle = grd
    g.fillRect(0, 0, 256, 128)
    const t = new THREE.CanvasTexture(c)
    t.mapping = THREE.EquirectangularReflectionMapping
    return t
  }, [])
  return <primitive object={env} attach="environment" />
}

export default function NewtonCradle() {
  const kick = useRef(1)
  return (
    <div>
      <div className="h-80 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900 to-black" role="img" aria-label="Newton's cradle with chrome balls swinging">
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0.5, 5], fov: 40 }}>
          <Studio />
          <ambientLight intensity={0.3} />
          <directionalLight position={[2, 4, 3]} intensity={1.5} />
          <Cradle kick={kick} />
        </Canvas>
      </div>
      <button onClick={() => (kick.current = 1)} className="mx-auto mt-3 block rounded-full border border-border px-4 py-1.5 text-sm">Release a ball</button>
    </div>
  )
}
