/*
 * Pure-logic tests for the parts of UI Lab that are real code, not just markup: the Snake engine, the tide model, the
 * forecast generator and the colour maths. Run with `npm test` (Node 22.6 or newer, which strips TypeScript types).
 */
import assert from 'node:assert/strict'
import { newGame, step, turn, COLS } from '../../src/patterns/sites/arcade/snake.ts'
import { tideAt, extremes, hhmm, seabed, sample, N } from '../../src/patterns/sites/tidewater/chart.ts'
import { day, shade, toF } from '../../src/patterns/sites/plain-forecast/data.ts'
import { nice, scale, convert, INGREDIENTS } from '../../src/patterns/sites/hearth/recipe.ts'

let passed = 0
const test = (name, fn) => {
  try {
    fn()
    passed++
  } catch (e) {
    console.error(`FAIL ${name}\n  ${e.message}`)
    process.exitCode = 1
  }
}

const r = () => 0.5

test('snake: starts alive with three cells', () => {
  const s = newGame(r)
  assert.equal(s.alive, true)
  assert.equal(s.snake.length, 3)
})
test('snake: moves one cell and keeps its length', () => {
  const s = step(newGame(r), 'right', r)
  assert.equal(s.snake[0][0], 7)
  assert.equal(s.snake.length, 3)
})
test('snake: cannot reverse into itself, can turn sideways', () => {
  const s = step(newGame(r), 'right', r)
  assert.equal(turn(s, 'left', 'right'), 'right')
  assert.equal(turn(s, 'up', 'right'), 'up')
})
test('snake: a wall ends the game', () => {
  const s = { ...newGame(r), snake: [[COLS - 1, 5], [COLS - 2, 5], [COLS - 3, 5]] }
  assert.equal(step(s, 'right', r).alive, false)
})
test('snake: eating grows by one and scores ten', () => {
  const s = { ...newGame(r), snake: [[5, 5], [4, 5], [3, 5]], food: [6, 5] }
  const n = step(s, 'right', r)
  assert.equal(n.snake.length, 4)
  assert.equal(n.score, 10)
})
test('snake: running into the body ends the game', () => {
  const s = { ...newGame(r), snake: [[5, 5], [5, 6], [6, 6], [6, 5], [6, 4]], dir: 'up' }
  assert.equal(step(s, 'right', r).alive, false)
})

test('tide: high near 03:24 and 15:50, low about six hours later, within 0.6 to 4.5 m', () => {
  assert.ok(Math.abs(tideAt(3.4) - 4.5) < 0.01)
  assert.ok(tideAt(9.6) < 0.7)
  for (let t = 0; t < 24; t += 0.25) assert.ok(tideAt(t) >= 0.59 && tideAt(t) <= 4.51)
})
test('tide: three to four extremes a day, alternating', () => {
  const e = extremes()
  assert.ok(e.length >= 3 && e.length <= 5, `got ${e.length}`)
  for (let i = 1; i < e.length; i++) assert.notEqual(e[i].kind, e[i - 1].kind)
})
test('tide: clock formatting', () => {
  assert.equal(hhmm(9.5), '09:30')
  assert.equal(hhmm(0.25), '00:15')
})
test('tide: the seabed has a bar across the channel that makes it shallow at low water', () => {
  const f = seabed()
  const bar = sample(f, 0.62 * (N - 1), (0.42 + 0.26 * 0.62) * (N - 1))
  assert.ok(bar > 2.5 && bar < 4.5, `bar depth ${bar}`)
})

test('forecast: the same place and day always give the same numbers', () => {
  assert.deepEqual(day('Leeds', 2), day('Leeds', 2))
  assert.notDeepEqual(day('Leeds', 2).hours.map((h) => h.t), day('Leeds', 3).hours.map((h) => h.t))
})
test('forecast: hours are 0 to 23 and rain is a fraction', () => {
  const d = day('Margate', 0)
  assert.equal(d.hours.length, 24)
  assert.ok(d.hours.every((h, i) => h.h === i && h.rain >= 0 && h.rain <= 1))
})
test('forecast: shading is monotonic and Fahrenheit is right', () => {
  assert.equal(shade(0), '·')
  assert.equal(shade(0.9), '█')
  assert.equal(toF(100), 212)
  assert.equal(toF(0), 32)
})

test('recipe: amounts are written the way cooks say them', () => {
  assert.equal(nice(0.5), '½')
  assert.equal(nice(1.5), '1½')
  assert.equal(nice(0.75), '¾')
  assert.equal(nice(2), '2')
  assert.equal(nice(250), '250')
  assert.equal(nice(12.4), '12')
})
test('recipe: scaling is linear and units convert', () => {
  assert.equal(scale(800, 8), 1600)
  assert.equal(scale(3, 2), 1.5)
  const oil = INGREDIENTS.find((i) => i.name === 'olive oil')
  assert.deepEqual(convert(oil, 4, false), { amount: '3', unit: 'tbsp' })
  const stock = INGREDIENTS.find((i) => i.name === 'vegetable stock')
  assert.equal(convert(stock, 4, true).unit, 'cups')
  const tomatoes = INGREDIENTS.find((i) => i.name === 'tinned tomatoes')
  assert.equal(convert(tomatoes, 4, true).unit, 'oz')
})

console.log(`${passed} passed${process.exitCode ? ', some failed' : ''}`)
