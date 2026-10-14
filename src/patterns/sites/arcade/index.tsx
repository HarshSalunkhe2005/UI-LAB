import { useCallback, useEffect, useRef, useState } from 'react'
import '@fontsource/vt323/400.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles.css'
import { useSiteScroll } from '../_shared'
import { COLS, ROWS, newGame, step, turn, type Dir, type State } from './snake'

/*
 * PHOSPHOR ARCADE: a cabinet in the browser with a game you can really play. World 13 (CRT Terminal).
 * Signature: the screen is alive. A canvas Snake runs on a fixed timestep with arrow keys, WASD or on-screen buttons,
 * under a phosphor glow, scanlines and a gentle flicker (all CSS, all off for reduced motion). The effect is cosmetic: the
 * instructions, the score and the leaderboard are plain text, and the game is optional.
 */

const CELL = 24
const SCORES: [string, number][] = [['MIRA', 420], ['DEV', 310], ['ANI', 250], ['KOFI', 180], ['SAM', 90]]

export default function ArcadeSite() {
  const root = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const game = useRef<State>(newGame())
  const dir = useRef<Dir>('right')
  const last = useRef<Dir>('right')
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<'idle' | 'playing' | 'over'>('idle')
  const [best, setBest] = useState(0)
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [board, setBoard] = useState(SCORES)

  useSiteScroll(root, { smooth: false })

  const draw = useCallback(() => {
    const c = cv.current
    if (!c) return
    const g = c.getContext('2d')!
    const s = game.current
    g.fillStyle = '#04100a'
    g.fillRect(0, 0, c.width, c.height)
    g.strokeStyle = 'rgba(80,255,150,0.06)'
    for (let x = 0; x <= COLS; x++) { g.beginPath(); g.moveTo(x * CELL, 0); g.lineTo(x * CELL, ROWS * CELL); g.stroke() }
    for (let y = 0; y <= ROWS; y++) { g.beginPath(); g.moveTo(0, y * CELL); g.lineTo(COLS * CELL, y * CELL); g.stroke() }
    g.fillStyle = '#ffcf5a'
    g.fillRect(s.food[0] * CELL + 6, s.food[1] * CELL + 6, CELL - 12, CELL - 12)
    s.snake.forEach(([x, y], i) => {
      g.fillStyle = i === 0 ? '#c7ffd8' : '#4dff91'
      g.fillRect(x * CELL + 2, y * CELL + 2, CELL - 4, CELL - 4)
    })
  }, [])

  const start = useCallback(() => {
    game.current = newGame()
    dir.current = 'right'
    last.current = 'right'
    setScore(0)
    setSaved(false)
    setStatus('playing')
    draw()
  }, [draw])

  const want = useCallback((d: Dir) => {
    dir.current = turn(game.current, d, last.current)
  }, [])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    if (status !== 'playing') return
    const speed = () => Math.max(70, 150 - game.current.score * 0.8)
    let t: number
    const tick = () => {
      const next = step(game.current, dir.current)
      last.current = dir.current
      game.current = next
      setScore(next.score)
      draw()
      if (!next.alive) {
        setStatus('over')
        setBest((b) => Math.max(b, next.score))
        return
      }
      t = window.setTimeout(tick, speed())
    }
    t = window.setTimeout(tick, speed())
    return () => window.clearTimeout(t)
  }, [status, draw])

  useEffect(() => {
    const keys: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' }
    const key = (e: KeyboardEvent) => {
      const d = keys[e.key]
      if (!d || status !== 'playing') return
      e.preventDefault()
      want(d)
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [status, want])

  const qualifies = status === 'over' && score > 0 && (board.length < 5 || score > board[board.length - 1][1])

  return (
    <div className="site-arcade" ref={root}>
      <header className="top">
        <a href="#top" className="logo">PHOSPHOR ARCADE</a>
        <nav aria-label="Sections"><a href="#play">Play</a><a href="#scores">High scores</a><a href="#about">About</a></nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="h1">
          <p className="tag">Insert coin</p>
          <h1 id="h1">One cabinet.<br />One game.<br />Still the best.</h1>
          <p className="lede">A tiny arcade in your browser. Eat the amber squares, avoid the walls and yourself. The glow is for atmosphere; every number on this page is also plain text.</p>
          <a className="cta" href="#play">Play now</a>
        </section>

        <section className="cab" id="play" aria-labelledby="h2p">
          <h2 id="h2p" className="sr-only">Play Snake</h2>
          <div className="bezel">
            <div className="screen">
              <canvas ref={cv} width={COLS * CELL} height={ROWS * CELL} role="img" aria-label={`Snake game. Score ${score}. ${status === 'playing' ? 'Playing.' : status === 'over' ? 'Game over.' : 'Press Start.'}`} />
              <div className="hud" aria-hidden><span>SCORE {String(score).padStart(4, '0')}</span><span>BEST {String(best).padStart(4, '0')}</span></div>
              {status !== 'playing' && (
                <div className="overlay">
                  <p>{status === 'over' ? 'GAME OVER' : 'READY'}</p>
                  <button onClick={start}>{status === 'over' ? 'Play again' : 'Start'}</button>
                </div>
              )}
              <div className="scan" aria-hidden />
            </div>
          </div>
          <div className="pad" role="group" aria-label="Direction buttons">
            <button aria-label="Up" onClick={() => want('up')} className="u">▲</button>
            <button aria-label="Left" onClick={() => want('left')} className="l">◀</button>
            <button aria-label="Right" onClick={() => want('right')} className="r">▶</button>
            <button aria-label="Down" onClick={() => want('down')} className="d">▼</button>
          </div>
          <p className="keys">Keys: arrow keys or W A S D. Score is {score}. {status === 'over' ? 'Game over.' : ''}</p>
          <p className="sr-only" role="status">{status === 'over' ? `Game over. Final score ${score}.` : ''}</p>
          {qualifies && !saved && (
            <form
              className="entry"
              onSubmit={(e) => {
                e.preventDefault()
                if (name.trim().length < 1) return
                setBoard([...board, [name.trim().toUpperCase().slice(0, 6), score] as [string, number]].sort((a, b) => b[1] - a[1]).slice(0, 5))
                setSaved(true)
              }}
            >
              <label htmlFor="nm">New high score! Your initials</label>
              <div className="row">
                <input id="nm" value={name} maxLength={6} onChange={(e) => setName(e.target.value)} autoComplete="off" />
                <button>Save</button>
              </div>
            </form>
          )}
        </section>

        <section className="scores" id="scores" aria-labelledby="h2s">
          <h2 id="h2s">High scores</h2>
          <table>
            <caption className="sr-only">Top five scores</caption>
            <thead><tr><th scope="col">Rank</th><th scope="col">Player</th><th scope="col" className="n">Score</th></tr></thead>
            <tbody>{board.map(([n, s], i) => <tr key={n + s + i}><td>{i + 1}</td><th scope="row">{n}</th><td className="n">{s}</td></tr>)}</tbody>
          </table>
        </section>

        <section className="about" id="about" aria-labelledby="h2a">
          <h2 id="h2a">About the screen</h2>
          <p>The look is made of three cheap effects: a glow around bright pixels, a fine pattern of scanlines, and a slow flicker. All three are CSS. If your system asks for reduced motion the flicker is switched off, and the scanlines stay because they do not move.</p>
          <p>This is a fictional arcade. Nothing is saved to a server; the leaderboard resets when you reload.</p>
        </section>
      </main>
      <footer className="foot">Phosphor Arcade is a demonstration for UI Lab.</footer>
    </div>
  )
}
