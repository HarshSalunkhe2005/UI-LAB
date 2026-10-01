import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

/*
 * Cursor comet: a glowing head follows the cursor with a springy lag and
 * leaves a fading ribbon of light (drei <Trail>, a mesh-line that remembers
 * recent positions). Three satellite sparks orbit the head with their own
 * trails, so fast movements draw braided light-painting strokes.
 */

function Head() {
  const { camera, pointer, raycaster } = useThree()
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const vel = useMemo(() => new THREE.Vector3(), [])
  const head = useRef<THREE.Mesh>(null!)
  const sparks = useRef<(THREE.Mesh | null)[]>([])
  useFrame((s, dt) => {
    raycaster.setFromCamera(pointer, camera)
    raycaster.ray.intersectPlane(plane, target)
    const p = head.current.position
    vel.add(target.clone().sub(p).multiplyScalar(dt * 30)).multiplyScalar(0.82)
    p.addScaledVector(vel, dt)
    const t = s.clock.elapsedTime
    sparks.current.forEach((m, i) => {
      if (!m) return
      const a = t * (3 + i) + (i * Math.PI * 2) / 3
      m.position.set(p.x + Math.cos(a) * 0.35, p.y + Math.sin(a) * 0.35, Math.sin(a * 0.5) * 0.2)
    })
  })
  const colors = ['#f472b6', '#22d3ee', '#facc15']
  return (
    <>
      <Trail width={1.6} length={7} color="#a5b4fc" attenuation={(w) => w * w}>
        <mesh ref={head}>
          <sphereGeometry args={[0.1, 24, 24]} />
          <meshBasicMaterial color="#e0e7ff" toneMapped={false} />
        </mesh>
      </Trail>
      {colors.map((c, i) => (
        <Trail key={c} width={0.5} length={5} color={c} attenuation={(w) => w}>
          <mesh ref={(el) => { sparks.current[i] = el }}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color={c} toneMapped={false} />
          </mesh>
        </Trail>
      ))}
    </>
  )
}

export default function CometTrail() {
  return (
    <div className="h-96 cursor-none overflow-hidden rounded-xl bg-[#03030a]" role="img" aria-label="Glowing comet with light trails following the cursor">
      <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <Head />
      </Canvas>
    </div>
  )
}
