// Clean-install test: unpack each skill zip into a throwaway HOME as ~/.claude/skills/ui-lab and check it works with no
// access to this repo. Run after `npm run skill`.   Usage: node tools/test-skill-install.mjs
//
// Checks per zip:
//  1. extraction with our reader AND with the system `tar` gives identical files (the zip is a normal zip)
//  2. SKILL.md is at <HOME>/.claude/skills/ui-lab/SKILL.md and its frontmatter is loadable
//  3. every packaged path that SKILL.md and README.md mention exists in the installed tree
//  4. no installed file mentions this repo's location or the author's machine
//  5. the shipped script runs from a different working directory under Node's permission model with read access to the
//     installed folder only (so it reads nothing else, spawns nothing, writes nothing)
// Not covered: whether a particular agent actually chooses to load the skill (needs a live agent session).
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readZip } from './zip.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let failures = 0
const check = (ok, msg) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) failures++ }

const walk = (d, base = d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n)
  return statSync(p).isDirectory() ? walk(p, base) : [relative(base, p).split(sep).join('/')]
}).sort()

for (const zipName of ['ui-lab.zip', 'ui-lab-lite.zip']) {
  console.log(`\n${zipName}`)
  const zipPath = join(ROOT, 'release', zipName)
  const home = mkdtempSync(join(tmpdir(), 'uilab-home-'))
  const project = mkdtempSync(join(tmpdir(), 'uilab-project-'))
  try {
    const skills = join(home, '.claude', 'skills')
    mkdirSync(skills, { recursive: true })

    // 1. two independent extractions
    const entries = readZip(readFileSync(zipPath)).filter((e) => !e.isDir)
    for (const e of entries) {
      const dest = join(skills, ...e.name.split('/'))
      mkdirSync(dirname(dest), { recursive: true })
      writeFileSync(dest, e.data)
    }
    const other = mkdtempSync(join(tmpdir(), 'uilab-tar-'))
    // Windows: use the bundled bsdtar; a GNU tar earlier on PATH reads "C:" as a remote host
    const tar = process.platform === 'win32' ? join(process.env.SystemRoot || 'C:\Windows', 'System32', 'tar.exe') : 'tar'
    execFileSync(tar, ['-xf', zipPath, '-C', other])
    const a = walk(join(skills, 'ui-lab')), b = walk(join(other, 'ui-lab'))
    const same = a.length === b.length && a.every((f, i) => f === b[i] && readFileSync(join(skills, 'ui-lab', f)).equals(readFileSync(join(other, 'ui-lab', f))))
    check(same, `own reader and system tar extract the same ${a.length} files`)
    rmSync(other, { recursive: true, force: true })

    // 2. SKILL.md at the right place with loadable frontmatter
    const root = join(skills, 'ui-lab')
    const skill = readFileSync(join(root, 'SKILL.md'), 'utf8')
    const fm = skill.match(/^---\n([\s\S]*?)\n---\n/)
    const name = fm?.[1].match(/^name:\s*(.+)$/m)?.[1].trim()
    const desc = fm?.[1].match(/^description:\s*(.+)$/m)?.[1].trim()
    check(name === 'ui-lab' && !!desc && desc.length < 1024, `~/.claude/skills/ui-lab/SKILL.md loads (name=${name}, description ${desc?.length} chars)`)

    // 3. referenced paths resolve
    const missing = []
    let refs = 0
    for (const f of ['SKILL.md', 'README.md']) {
      const text = readFileSync(join(root, f), 'utf8')
      for (const m of text.matchAll(/`((?:references|templates|scripts|examples)\/[\w./-]+)/g)) {
        refs++
        try { statSync(join(root, m[1])) } catch { missing.push(`${f} -> ${m[1]}`) }
      }
    }
    check(missing.length === 0 && refs > 0, `${refs} packaged paths mentioned in SKILL.md/README.md all exist${missing.length ? `; missing: ${missing.join(', ')}` : ''}`)

    // 4. nothing points back at the repo or the author's machine
    const leaks = []
    const needles = [ROOT, ROOT.replace(/\\/g, '/'), 'C:\\Users\\', '/Users/', 'ui-lab-weld', 'onrender.com'].filter(Boolean)
    for (const f of a) {
      const t = readFileSync(join(root, f), 'utf8')
      for (const n of needles) if (t.includes(n)) leaks.push(`${f} contains ${n}`)
    }
    check(leaks.length === 0, `installed tree has no repo path, author path or live-site host${leaks.length ? `: ${leaks.join('; ')}` : ''}`)

    // 5. shipped script under the permission model, from an unrelated cwd
    if (a.includes('scripts/contrast.mjs')) {
      let out = ''
      try {
        out = execFileSync(process.execPath, ['--permission', `--allow-fs-read=${root}`, join(root, 'scripts', 'contrast.mjs'), '#111111', '#ffffff'], { cwd: project, env: { PATH: process.env.PATH, HOME: home, USERPROFILE: home }, encoding: 'utf8' })
      } catch (e) { out = `ERROR ${e.message}` }
      check(/^18\.\d\d:1/.test(out), `scripts/contrast.mjs runs with read access to the skill folder only: ${out.trim().slice(0, 60)}`)
      // the audit reads one project folder and nothing else: grant read access to the skill folder and that folder only
      writeFileSync(join(project, 'index.html'), '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>t</title><style>body{font-family:Georgia,serif}</style></head><body><main><h1>Hi</h1><img src="a.png"></main></body></html>')
      let audit = ''
      try {
        audit = execFileSync(process.execPath, ['--permission', `--allow-fs-read=${root}`, `--allow-fs-read=${project}`, join(root, 'scripts', 'audit-ui.mjs'), project, '--json'], { cwd: tmpdir(), env: { PATH: process.env.PATH, HOME: home, USERPROFILE: home }, encoding: 'utf8' })
      } catch (e) { audit = e.stdout ? String(e.stdout) : `ERROR ${e.message}` } // exit 1 (a critical finding) still prints the report
      let rules = []
      try { rules = JSON.parse(audit).findings.map((x) => x.rule) } catch {}
      check(rules.includes('img-alt'), `scripts/audit-ui.mjs runs with read access to the skill folder and one project folder only and finds the missing alt (${rules.join(', ') || audit.slice(0, 80)})`)
    } else {
      check(true, 'no scripts in this variant (nothing to run)')
    }
  } finally {
    rmSync(home, { recursive: true, force: true })
    rmSync(project, { recursive: true, force: true })
  }
}
console.log(failures ? `\n${failures} check(s) FAILED` : '\nClean-install test passed.')
process.exit(failures ? 1 : 0)
