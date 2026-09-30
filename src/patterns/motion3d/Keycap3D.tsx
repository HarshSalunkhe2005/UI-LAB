import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useWindowPointer } from './_pointer'

/*
 * A glossy 3D keycap that tilts toward the cursor and physically presses
 * (sinks, squashes, rim light flares) on click, Space/Enter while focused,
 * or when you type its letter anywhere. Built from RoundedBox; the legend
 * is a CanvasTexture so there are no font downloads.
 */

function legend(ch: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = '#18181b'
  g.fillRect(0, 0, 256, 256)
  g.fillStyle = '#e4e4e7'
  g.font = '600 150px system-ui, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(ch, 128, 138)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function Key({ ch, pressed }: { ch: string; pressed: boolean }) {
  const g = useRef<THREE.Group>(null!)
  const rim = useRef<THREE.PointLight>(null!)
  const pointer = useWindowPointer()
  const tex = useRef(legend(ch))
  useFrame((_, dt) => {
    const d = THREE.MathUtils.damp
    g.current.rotation.x = d(g.current.rotation.x, 0.55 - pointer.current.y * 0.35, 5, dt)
    g.current.rotation.y = d(g.current.rotation.y, pointer.current.x * 0.5, 5, dt)
    g.current.position.y = d(g.current.position.y, pressed ? -0.18 : 0, pressed ? 30 : 10, dt)
    g.current.scale.y = d(g.current.scale.y, pressed ? 0.88 : 1, pressed ? 30 : 10, dt)
    rim.current.intensity = d(rim.current.intensity, pressed ? 40 : 10, 12, dt)
  })
  return (
    <group ref={g}>
      <RoundedBox args={[1.6, 0.7, 1.6]} radius={0.22} smoothness={6}>
        <meshPhysicalMaterial color="#27272a" roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>
      <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.15, 1.15]} />
        <meshStandardMaterial map={tex.current} roughness={0.4} />
      </mesh>
      <pointLight ref={rim} position={[0, -0.6, 0]} color="#8b5cf6" distance={3} intensity={10} />
    </group>
  )
}

export default function Keycap3D({ ch = 'K' }: { ch?: string }) {
  const [pressed, setPressed] = useState(false)
  useEffect(() => {
    const down = (e: KeyboardEvent) => e.key.toLowerCase() === ch.toLowerCase() && setPressed(true)
    const up = (e: KeyboardEvent) => e.key.toLowerCase() === ch.toLowerCase() && setPressed(false)
    addEventListener('keydown', down)
    addEventListener('keyup', up)
    return () => {
      removeEventListener('keydown', down)
      removeEventListener('keyup', up)
    }
  }, [ch])
  return (
    <div className="relative">
      <button
        aria-label={`3D key ${ch}. Press to test`}
        aria-pressed={pressed}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setPressed(true)}
        onKeyUp={() => setPressed(false)}
        className="block h-80 w-full"
      >
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 2.2, 4], fov: 38 }}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[2, 5, 3]} intensity={1.6} />
          <Key ch={ch} pressed={pressed} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
            <circleGeometry args={[2.2, 64]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.25} transparent opacity={0.15} />
          </mesh>
        </Canvas>
      </button>
      <p className="text-center font-mono text-xs text-fg-muted">click it, or type "{ch}"</p>
    </div>
  )
}
