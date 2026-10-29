// Mechanical pass/fail gates from the report.json files that shoot.mjs writes (see evals/RUBRIC.md and context/UPGRADE_PLAN.md 5b).
// Usage: node evals/gates.mjs <run-dir> [more run dirs...]   Exit code 1 if any run fails a gate.
// Gates: console clean, no horizontal overflow at 375, no target under 44px at 375 (inline links exempt),
// one h1 + main landmark, reduced-motion rule present, focus rule present, no text-box collisions at either width.
// A collision flagged here is a candidate: open the screenshot before treating it as a defect.
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

let anyFail = false
for (const dir of process.argv.slice(2)) {
  const r = JSON.parse(readFileSync(join(resolve(dir), 'report.json'), 'utf8'))
  const d = r[1440], m = r[375]
  const gates = {
    'console clean (both widths)': d.consoleErrors === 0 && m.consoleErrors === 0,
    'no horizontal overflow at 375': !m.hOverflow,
    'targets >= 44px at 375': m.smallTargets === 0,
    'one h1 and a main landmark': d.h1Count === 1 && d.landmarks[2],
    'reduced-motion rule present': d.hasReducedMotion,
    'focus style present': d.focusStyle,
    'no text collisions (1440 and 375)': d.collisions === 0 && m.collisions === 0,
  }
  const failed = Object.entries(gates).filter(([, ok]) => !ok).map(([k]) => k)
  if (failed.length) anyFail = true
  console.log(`${failed.length ? 'FAIL' : 'PASS'}  ${resolve(dir).split(/[\\/]/).slice(-2).join('/')}  ${7 - failed.length}/7`)
  for (const k of failed) {
    const extra = k.startsWith('targets') ? ` (${m.smallTargets} small)` : k.includes('collisions') ? ` (1440: ${(d.collisionSamples || []).join('; ')} | 375: ${(m.collisionSamples || []).join('; ')})` : ''
    console.log(`        - ${k}${extra}`)
  }
}
process.exit(anyFail ? 1 : 0)
