/*
 * A tiny drum-and-bass loop made with WebAudio, plus a "tape" stage: soft saturation, a low-pass roll-off and a
 * slow pitch wobble. Created only after a user gesture. Everything is generated; there are no audio files.
 */

export interface Engine {
  analyser: AnalyserNode
  start(): void
  stop(): void
  setLevel(v: number): void
  setTone(v: number): void
  setTape(on: boolean): void
  close(): void
  playing(): boolean
}

const BASS = [55, 55, 65.41, 55, 49, 49, 55, 73.42]

function curve(amount: number): Float32Array<ArrayBuffer> {
  const n = 1024
  const c = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1
    c[i] = amount === 0 ? x : Math.tanh(x * (1 + amount * 4)) / Math.tanh(1 + amount * 4)
  }
  return c
}

export function createEngine(): Engine {
  const ac = new AudioContext()
  const bus = ac.createGain()
  const sat = ac.createWaveShaper()
  const lp = ac.createBiquadFilter()
  const master = ac.createGain()
  const analyser = ac.createAnalyser()
  analyser.fftSize = 512
  lp.type = 'lowpass'
  lp.frequency.value = 18000
  master.gain.value = 0.35
  sat.curve = curve(0)
  bus.connect(sat).connect(lp).connect(master).connect(analyser).connect(ac.destination)

  // slow pitch wobble, only audible when the tape stage is on
  const wow = ac.createOscillator()
  const wowDepth = ac.createGain()
  wow.frequency.value = 0.55
  wowDepth.gain.value = 0
  wow.connect(wowDepth)
  wow.start()

  const noise = ac.createBuffer(1, ac.sampleRate * 0.2, ac.sampleRate)
  const nd = noise.getChannelData(0)
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

  let on = false
  let step = 0
  let next = 0
  let timer = 0
  let tapeOn = false
  let toneV = 0.75
  const BPM = 92
  const sixteenth = 60 / BPM / 4

  const applyTone = () => {
    lp.frequency.value = tapeOn ? 1800 + toneV * 5200 : 18000
  }

  const kick = (t: number) => {
    const o = ac.createOscillator()
    const g = ac.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(130, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14)
    g.gain.setValueAtTime(1, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    o.connect(g).connect(bus)
    o.start(t)
    o.stop(t + 0.32)
  }
  const hat = (t: number, open: boolean) => {
    const s = ac.createBufferSource()
    const hp = ac.createBiquadFilter()
    const g = ac.createGain()
    s.buffer = noise
    hp.type = 'highpass'
    hp.frequency.value = 7000
    g.gain.setValueAtTime(open ? 0.35 : 0.22, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.14 : 0.04))
    s.connect(hp).connect(g).connect(bus)
    s.start(t)
    s.stop(t + 0.16)
  }
  const bass = (t: number, f: number) => {
    const o = ac.createOscillator()
    const flt = ac.createBiquadFilter()
    const g = ac.createGain()
    o.type = 'sawtooth'
    o.frequency.value = f
    wowDepth.connect(o.detune)
    flt.type = 'lowpass'
    flt.frequency.setValueAtTime(900, t)
    flt.frequency.exponentialRampToValueAtTime(160, t + 0.22)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, t + sixteenth * 3)
    o.connect(flt).connect(g).connect(bus)
    o.start(t)
    o.stop(t + sixteenth * 3.2)
  }

  const schedule = () => {
    while (next < ac.currentTime + 0.12) {
      const s = step % 16
      if ([0, 6, 10].includes(s)) kick(next)
      if (s % 2 === 1) hat(next, s % 8 === 7)
      if (s % 2 === 0) bass(next, BASS[(s / 2) % BASS.length] * (step % 64 >= 32 ? 1.122 : 1))
      next += sixteenth
      step += 1
    }
  }

  return {
    analyser,
    start() {
      if (on) return
      on = true
      void ac.resume()
      next = ac.currentTime + 0.05
      step = 0
      timer = window.setInterval(schedule, 25)
    },
    stop() {
      on = false
      window.clearInterval(timer)
    },
    setLevel(v) {
      master.gain.value = v * 0.55
    },
    setTone(v) {
      toneV = v
      applyTone()
    },
    setTape(t) {
      tapeOn = t
      sat.curve = curve(t ? 1 : 0)
      wowDepth.gain.value = t ? 14 : 0
      applyTone()
    },
    close() {
      window.clearInterval(timer)
      on = false
      void ac.close()
    },
    playing: () => on,
  }
}
