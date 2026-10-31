import { readFileSync } from 'node:fs'
const T = 'C:/Users/Harsh/.claude/projects/C--Users-Harsh/60f8ec20-694c-4b80-90e5-caa23fdb76b1/subagents'
const ag = JSON.parse(readFileSync('agents.json', 'utf8'))
const runs = { ...Object.fromEntries(Object.entries(ag.skill).map(([k, v]) => ['skill/' + k, v])), ...Object.fromEntries(Object.entries(ag.div).map(([k, v]) => ['div/' + k, v])) }
const norm = (p) => p.replace(/\/g, '/').replace(/^.*skill-install\/ui-lab\//, '')
const out = {}
for (const [name, id] of Object.entries(runs)) {
  const opened = new Set()
  for (const line of readFileSync(`${T}/agent-${id}.jsonl`, 'utf8').split('\n')) {
    if (!line.trim()) continue
    let o; try { o = JSON.parse(line) } catch { continue }
    const c = o.message?.content
    if (!Array.isArray(c)) continue
    for (const b of c) if (b.type === 'tool_use') {
      const t = b.input?.file_path || b.input?.path || b.input?.command || ''
      const s = String(t).replace(/\/g, '/')
      if (/skill-install\/ui-lab/.test(s)) {
        if (b.name === 'Bash') { const m = s.match(/skill-install\/ui-lab\/([\w./-]+)/g) || []; for (const x of m) opened.add('(bash) ' + norm(x.replace(/^.*skill-install\/ui-lab\//, ''))) }
        else opened.add(norm(s))
      }
    }
  }
  out[name] = [...opened].sort()
}
const files = new Set(Object.values(out).flat())
console.log(JSON.stringify(out, null, 1))
