import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { reducedMotion, useWindowPointer } from './_pointer'

/*
 * Real rigged character (RobotExpressive.glb, CC0, from the three.js
 * examples) that plays its baked Idle animation while its Head bone and body
 * turn toward the cursor ON TOP of the animation. Order matters: the mixer
 * writes bone rotations first each frame (useAnimations' useFrame), then our
 * useFrame adds the look-at offset, so the two layers blend instead of
 * fighting. Emote buttons (or clicking the robot) play one-shot clips that
 * crossfade back to Idle.
 *
 * Swap in any rigged GLB: change the URL, the bone name and the clip names.
 */

const URL = '/models/robot.glb'
const EMOTES = ['Wave', 'Yes', 'No', 'ThumbsUp', 'Jump', 'Dance'] as const

function Robot({ emote, onDone }: { emote: string | null; onDone: () => void }) {
  const group = useRef<THREE.Group>(null!)
  const { scene, animations } = useGLTF(URL)
  const { actions, mixer } = useAnimations(animations, group)
  const pointer = useWindowPointer()
  const look = useRef({ x: 0, y: 0 })
  const head = useMemo(() => {
    let h: THREE.Object3D | undefined
    scene.traverse((o) => {
      if ((o as THREE.Bone).isBone && o.name === 'Head') h = o
    })
    return h
  }, [scene])

  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true
    })
    actions.Idle?.reset().fadeIn(0.3).play()
  }, [actions, scene])

  useEffect(() => {
    if (!emote) return
    const a = actions[emote]
    if (!a) return onDone()
    const loopForever = emote === 'Dance'
    actions.Idle?.fadeOut(0.25)
    a.reset().setLoop(loopForever ? THREE.LoopRepeat : THREE.LoopOnce, loopForever ? Infinity : 1)
    a.clampWhenFinished = true
    a.fadeIn(0.25).play()
    const back = () => {
      a.fadeOut(0.3)
      actions.Idle?.reset().fadeIn(0.3).play()
      onDone()
    }
    const t = loopForever ? window.setTimeout(back, 4000) : 0
    const fin = (e: { action: THREE.AnimationAction }) => e.action === a && back()
    if (!loopForever) mixer.addEventListener('finished', fin)
    return () => {
      clearTimeout(t)
      mixer.removeEventListener('finished', fin)
    }
  }, [emote, actions, mixer, onDone])

  const tmp = useMemo(() => ({ parent: new THREE.Quaternion(), offset: new THREE.Quaternion(), euler: new THREE.Euler(0, 0, 0, 'YXZ') }), [])

  useFrame((_, dt) => {
    const d = THREE.MathUtils.damp
    look.current.x = d(look.current.x, pointer.current.x, 5, dt)
    look.current.y = d(look.current.y, pointer.current.y, 5, dt)
    group.current.rotation.y = d(group.current.rotation.y, look.current.x * 0.35, 3, dt)
    if (head?.parent) {
      // Build the look offset in WORLD space (yaw about world-up, pitch about world-right)
      // then convert to the bone's local frame: local = parentWorld⁻¹ · worldOffset · parentWorld.
      // Works for any rig, whatever direction its bones' local axes point.
      head.parent.updateWorldMatrix(true, false)
      head.parent.getWorldQuaternion(tmp.parent)
      tmp.offset.setFromEuler(tmp.euler.set(-look.current.y * 0.45, look.current.x * 0.75 - group.current.rotation.y, 0))
      tmp.offset.premultiply(tmp.parent.clone().invert()).multiply(tmp.parent)
      head.quaternion.premultiply(tmp.offset)
    }
  })

  return (
    <group ref={group} position={[0, -1.85, 0]} scale={0.68}>
      <primitive object={scene} />
    </group>
  )
}

export function RobotMascot({ className = 'h-96' }: { className?: string }) {
  const [emote, setEmote] = useState<string | null>(null)
  const [queued, setQueued] = useState<string | null>(null)
  useEffect(() => {
    if (queued && !emote) {
      setEmote(queued)
      setQueued(null)
    }
  }, [queued, emote])
  return (
    <div className="relative">
      <div className={`${className} cursor-pointer`} role="img" aria-label="Animated 3D robot that looks at your cursor" onClick={() => !emote && setEmote('Wave')}>
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 0.2, 6], fov: 35 }} shadows>
          <hemisphereLight args={['#ffffff', '#44403c', 1.2]} />
          <directionalLight position={[3, 5, 4]} intensity={2.2} castShadow />
          <Suspense fallback={null}>
            <Robot emote={emote} onDone={() => setEmote(null)} />
          </Suspense>
          <ContactShadows position={[0, -1.85, 0]} opacity={0.5} scale={6} blur={2.2} far={3} />
        </Canvas>
      </div>
      <div className="absolute inset-x-0 bottom-3 flex flex-wrap justify-center gap-1.5">
        {EMOTES.map((e) => (
          <button
            key={e}
            disabled={reducedMotion() && e === 'Dance'}
            onClick={() => (emote ? setQueued(e) : setEmote(e))}
            aria-pressed={emote === e}
            className={`rounded-full px-2.5 py-1 text-xs backdrop-blur ${emote === e ? 'bg-fg text-bg' : 'bg-surface/80 text-fg-muted hover:text-fg'}`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  )
}

useGLTF.preload(URL)

export default function RobotMascotDemo() {
  return <RobotMascot />
}
