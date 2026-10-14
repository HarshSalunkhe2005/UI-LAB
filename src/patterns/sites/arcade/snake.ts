/* A tiny, testable Snake: pure state and a step function. The canvas drawing lives in the component. */

export const COLS = 20
export const ROWS = 15

export type Dir = 'up' | 'down' | 'left' | 'right'
export type Cell = [number, number]
export type State = { snake: Cell[]; dir: Dir; food: Cell; alive: boolean; score: number }

const DELTA: Record<Dir, Cell> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }

export function newGame(rand: () => number = Math.random): State {
  const snake: Cell[] = [[6, 7], [5, 7], [4, 7]]
  return { snake, dir: 'right', food: place(snake, rand), alive: true, score: 0 }
}

function place(snake: Cell[], rand: () => number): Cell {
  for (let i = 0; i < 200; i++) {
    const c: Cell = [Math.floor(rand() * COLS), Math.floor(rand() * ROWS)]
    if (!snake.some(([x, y]) => x === c[0] && y === c[1])) return c
  }
  return [0, 0]
}

export function turn(s: State, want: Dir, last: Dir): Dir {
  // Never reverse into yourself, judged against the direction actually moved last step.
  return OPPOSITE[want] === last ? s.dir : want
}

export function step(s: State, dir: Dir, rand: () => number = Math.random): State {
  if (!s.alive) return s
  const [dx, dy] = DELTA[dir]
  const head: Cell = [s.snake[0][0] + dx, s.snake[0][1] + dy]
  const hitWall = head[0] < 0 || head[0] >= COLS || head[1] < 0 || head[1] >= ROWS
  const eats = head[0] === s.food[0] && head[1] === s.food[1]
  const body = eats ? s.snake : s.snake.slice(0, -1)
  const hitSelf = body.some(([x, y]) => x === head[0] && y === head[1])
  if (hitWall || hitSelf) return { ...s, dir, alive: false }
  const snake = [head, ...body]
  return { snake, dir, food: eats ? place(snake, rand) : s.food, alive: true, score: s.score + (eats ? 10 : 0) }
}
