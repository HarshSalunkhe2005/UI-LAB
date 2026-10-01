import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
 * Audio-reactive 3D: a ring of 64 bars driven by a real AnalyserNode. The
 * sound is synthesised in the browser (a little arpeggio + bass + hi-hat
 * noise via Web Audio), so there's no file to load and no microphone
 * permission. Nothing plays until the user presses Play (autoplay rules and
 * good manners). Bars scale and glow with their frequency bin; the ring
 * slowly rotates.
 */

const BINS = 64

function useSynth() {
  const ctx = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const timer = useRef(0)
  const stop = () => {
    clearInterval(timer.current)
    ctx.current?.close()
    ctx.current = null
    analyser.current = null
  }
  const start = () => {
    const ac = new AudioContext()
    const an = ac.createAnalyser()
    an.fftSize = 256
    const gain = ac.createGain()
    gain.gain.value = 0.18
    gain.connect(an).connect(ac.destination)
    const notes = [220, 277.2, 329.6, 440, 329.6, 277.2]
    let step = 0
    const tick = () => {
      const t = ac.currentTime
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.type = 'sawtooth'
      o.frequency.value = notes[step % notes.length] * (step % 12 < 6 ? 1 : 1.5)
      g.gain.setValueAtTime(0.5, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      o.connect(g).connect(gain)
      o.start(t)
      o.stop(t + 0.3)
      if (step % 4 === 0) {
        const b = ac.createOscillator()
        const bg = ac.createGain()
        b.frequency.setValueAtTime(110, t)
        b.frequency.exponentialRampToValueAtTime(40, t + 0.25)
        bg.gain.setValueAtTime(1, t)
        bg.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
        b.connect(bg).connect(gain)
        b.start(t)
        b.stop(t + 0.3)
      }
      const buf = ac.createBuffer(1, 2205, ac.sampleRate)
      buf.getChannelData(0).forEach((_, i, a) => (a[i] = (Math.random() * 2 - 1) * (1 - i / a.length)))
      const n = ac.createBufferSource()
      const ng = ac.createGain()
      ng.gain.value = 0.15
      n.buffer = buf
      n.connect(ng).connect(gain)
      n.start(t)
      step++
    }
    tick()
    timer.current = window.setInterval(tick, 180)
    ctx.current = ac
    analyser.current = an
  }
  useEffect(() => stop, [])
  return { analyser, start, stop }
}

function Bars({ analyser }: { analyser: React.MutableRefObject<AnalyserNode | null> }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const data = useMemo(() => new Uint8Array(128), [])
  const levels = useMemo(() => new Float32Array(BINS), [])
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), c: new THREE.Color() }), [])
  useFrame((s, dt) => {
    if (analyser.current) analyser.current.getByteFrequencyData(data)
    else data.fill(0)
    for (let i = 0; i < BINS; i++) {
      const v = analyser.current ? data[Math.floor(i * 1.6)] / 255 : 0.05 + 0.04 * Math.sin(s.clock.elapsedTime * 2 + i * 0.4)
      levels[i] = THREE.MathUtils.damp(levels[i], v, 14, dt)
      const a = (i / BINS) * Math.PI * 2
      const h = 0.1 + levels[i] * 2.4
      tmp.q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a)
      tmp.m.compose(new THREE.Vector3(Math.cos(a) * 2, h / 2, Math.sin(a) * 2), tmp.q, new THREE.Vector3(1, h, 1))
      mesh.current.setMatrixAt(i, tmp.m)
      mesh.current.setColorAt(i, tmp.c.setHSL(0.75 - levels[i] * 0.35, 0.85, 0.35 + levels[i] * 0.35))
    }
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.rotation.y += dt * 0.15
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BINS]}>
      <boxGeometry args={[0.12, 1, 0.12]} />
      <meshStandardMaterial roughness={0.3} metalness={0.2} emissive="#1e1b4b" />
    </instancedMesh>
  )
}

export default function AudioBars() {
  const { analyser, start, stop } = useSynth()
  const [playing, setPlaying] = useState(false)
  return (
    <div className="relative">
      <div className="h-96 overflow-hidden rounded-xl bg-[#05050a]" role="img" aria-label="Ring of 3D bars that dance to synthesised music">
        <Canvas resize={{ offsetSize: true }} dpr={[1, 1.5]} camera={{ position: [0, 3.2, 5.5], fov: 45 }} onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 4, 0]} intensity={30} color="#a78bfa" />
          <Bars analyser={analyser} />
        </Canvas>
      </div>
      <button
        onClick={() => {
          if (playing) stop()
          else start()
          setPlaying(!playing)
        }}
        aria-pressed={playing}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
      >
        {playing ? '■ Stop' : '▶ Play (sound)'}
      </button>
    </div>
  )
}
