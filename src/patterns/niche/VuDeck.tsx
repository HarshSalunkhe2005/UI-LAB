import { useEffect, useRef, useState } from 'react'

/*
 * Niche world: Hi-Fi Deck. Analogue audio hardware on a screen: two VU meters with ballistic needles, a transport
 * with a real (generated) sound, a rotary level knob. Sound is a small WebAudio arpeggio created only after you press
 * play (browsers require a gesture) at a low default level; the meters read the real signal through an
 * AnalyserNode, so the needles are honest. Stop silences and closes the audio. Reduced motion: needles still
 * move (they are data), but nothing else animates.
 */

const NOTES = [220, 277.2, 329.6, 440, 329.6, 277.2, 246.9, 311.1]

function Needle({ value, label }: { value: number; label: string }) {
  const angle = -50 + value * 100
  return (
    <figure className="relative h-28 w-44 overflow-hidden rounded-md border border-black/40 bg-[#e8d9a6]" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}>
      <svg viewBox="0 0 176 112" className="absolute inset-0 h-full w-full" aria-hidden>
        {Array.from({ length: 11 }, (_, i) => {
          const a = ((-50 + i * 10) * Math.PI) / 180
          const r1 = 78, r2 = i > 7 ? 62 : 68
          return <line key={i} x1={88 + Math.sin(a) * r1} y1={104 - Math.cos(a) * r1} x2={88 + Math.sin(a) * r2} y2={104 - Math.cos(a) * r2} stroke={i > 7 ? '#a8402a' : '#2a2418'} strokeWidth="2" />
        })}
        <text x="14" y="26" fontSize="11" fill="#2a2418" style={{ fontFamily: 'var(--font-mono)' }}>VU</text>
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: '88px 104px', transition: 'transform 90ms linear' }}>
          <line x1="88" y1="104" x2="88" y2="30" stroke="#a8402a" strokeWidth="2" />
        </g>
        <circle cx="88" cy="104" r="6" fill="#2a2418" />
      </svg>
    </figure>
  )
}

export default function VuDeck() {
  const [playing, setPlaying] = useState(false)
  const [level, setLevel] = useState([0, 0])
  const [vol, setVol] = useState(4)
  const ctx = useRef<AudioContext | null>(null)
  const gain = useRef<GainNode | null>(null)
  const raf = useRef(0)
  const step = useRef(0)
  const timer = useRef(0)

  const stop = () => {
    window.clearInterval(timer.current)
    cancelAnimationFrame(raf.current)
    ctx.current?.close()
    ctx.current = null
    setPlaying(false)
    setLevel([0, 0])
  }
  useEffect(() => () => stop(), [])
  useEffect(() => {
    if (gain.current) gain.current.gain.value = (vol / 10) * 0.18
  }, [vol])

  const play = () => {
    const ac = new AudioContext()
    ctx.current = ac
    const g = ac.createGain()
    g.gain.value = (vol / 10) * 0.18
    gain.current = g
    const an = ac.createAnalyser()
    an.fftSize = 512
    g.connect(an)
    an.connect(ac.destination)
    const buf = new Uint8Array(an.fftSize)
    const tone = () => {
      const o = ac.createOscillator()
      const e = ac.createGain()
      o.type = 'triangle'
      o.frequency.value = NOTES[step.current++ % NOTES.length]
      e.gain.setValueAtTime(0.0001, ac.currentTime)
      e.gain.exponentialRampToValueAtTime(1, ac.currentTime + 0.02)
      e.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.42)
      o.connect(e)
      e.connect(g)
      o.start()
      o.stop(ac.currentTime + 0.45)
    }
    tone()
    timer.current = window.setInterval(tone, 280)
    let smooth = 0
    const read = () => {
      an.getByteTimeDomainData(buf)
      let peak = 0
      for (const v of buf) peak = Math.max(peak, Math.abs(v - 128) / 128)
      smooth = Math.max(peak * 4.2, smooth * 0.9)
      const v = Math.min(1, smooth)
      setLevel([v, Math.min(1, v * (0.9 + Math.random() * 0.15))])
      raf.current = requestAnimationFrame(read)
    }
    read()
    setPlaying(true)
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-black/50 p-5 text-[#e8d9a6]" style={{ background: 'linear-gradient(180deg, #34312b, #1d1b17)' }}>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Needle value={level[0]} label="Left channel level" />
        <Needle value={level[1]} label="Right channel level" />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={playing ? stop : play} aria-pressed={playing} className={`min-h-11 min-w-24 rounded border-b-4 px-4 font-mono text-sm tracking-wider ${playing ? 'translate-y-0.5 border-b-0 bg-[#a8402a] text-white' : 'border-black/60 bg-[#e8d9a6] text-[#2a2418]'}`}>
            {playing ? '■ STOP' : '▶ PLAY'}
          </button>
        </div>
        <label className="flex items-center gap-3 font-mono text-xs tracking-wider">
          LEVEL
          <input type="range" min={0} max={10} value={vol} onChange={(e) => setVol(Number(e.target.value))} className="h-8 w-40 accent-[#a8402a]" aria-valuetext={`${vol} of 10`} />
          <span className="w-5 tabular-nums">{vol}</span>
        </label>
      </div>
      <p className="mt-3 text-center font-mono text-[11px] opacity-60">Press play: a generated arpeggio, kept quiet by default</p>
    </div>
  )
}
