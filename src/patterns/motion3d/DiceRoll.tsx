import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { reducedMotion } from './_pointer'

/*
 * Two dice you can roll. Each roll picks the result first, then animates a
 * throw: an arc with bounces (decaying |sin|), wild spin that slerps into
 * the exact quaternion that shows the chosen face up. Faces are canvas
 * textures with pips. The total is announced for screen readers.
 */

const FACE_UP: Record<number, THREE.Euler> = {
  1: new THREE.Euler(0, 0, Math.PI / 2), 6: new THREE.Euler(0, 0, -Math.PI / 2),
  2: new THREE.Euler(0, 0, 0), 5: new THREE.Euler(Math.PI, 0, 0),
  3: new THREE.Euler(-Math.PI / 2, 0, 0), 4: new THREE.Euler(Math.PI / 2, 0, 0),
}
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
}

function faceTex(n: number) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = '#fafaf9'
  g.fillRect(0, 0, 128, 128)
  g.fillStyle = n === 1 ? '#dc2626' : '#18181b'
  for (const [x, y] of PIPS[n]) {
    g.beginPath()
    g.arc(64 + x * 32, 64 + y * 32, 12, 0, Math.PI * 2)
    g.fill()
  }
  return new THREE.CanvasTexture(c)
}
// BoxGeometry material order: +x, -x, +y, -y, +z, -z
const ORDER = [1, 6, 2, 5, 3, 4]

function Die({ value, roll, x }: { value: number; roll: number; x: number }) {
  const ref = useRef<THREE.Group>(null!)
  const mats = useMemo(() => ORDER.map((n) => new THREE.MeshStandardMaterial({ map: faceTex(n), roughness: 0.4 })), [])
  const start = useRef(-10)
  const spin = useMemo(() => new THREE.Vector3(), [])
  const last = useRef(roll)
  const target = useMemo(() => new THREE.Quaternion(), [])
  useFrame((s) => {
    if (last.current !== roll) {
      last.current = roll
      start.current = s.clock.elapsedTime
      spin.set(Math.random() * 20 + 10, Math.random() * 20 + 10, Math.random() * 20)
      target.setFromEuler(FACE_UP[value]).premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2))
    }
    const t = reducedMotion() ? 1 : Math.min(1, (s.clock.elapsedTime - start.current) / 1.4)
    const e = 1 - Math.pow(1 - t, 3)
    ref.current.position.set(x + (1 - e) * -2.5, Math.abs(Math.sin(t * Math.PI * 3)) * (1 - t) * 1.6, (1 - e) * 1.5)
    const wild = new THREE.Quaternion().setFromEuler(new THREE.Euler(spin.x * (1 - e), spin.y * (1 - e), spin.z * (1 - e)))
    ref.current.quaternion.copy(wild).slerp(target, e)
  })
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        {mats.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)}
      </mesh>
    </group>
  )
}

export default function DiceRoll() {
  const [vals, setVals] = useState([4, 2])
  const [roll, setRoll] = useState(0)
  const doRoll = () => {
    setVals([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)])
    setRoll((r) => r + 1)
  }
  return (
    <div className="relative">
      <div className="h-80 overflow-hidden rounded-xl bg-[#14532d]" role="img" aria-label={`Two dice showing ${vals[0]} and ${vals[1]}`}>
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 4.5, 4.5], fov: 40 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)} shadows>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 6, 3]} intensity={2} castShadow />
          <Die value={vals[0]} roll={roll} x={-0.8} />
          <Die value={vals[1]} roll={roll} x={0.8} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#166534" roughness={1} />
          </mesh>
        </Canvas>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button onClick={doRoll} className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-bg">🎲 Roll</button>
        <span aria-live="polite" className="font-mono text-sm">{roll ? `Total: ${vals[0] + vals[1]}` : 'Roll the dice'}</span>
      </div>
    </div>
  )
}
