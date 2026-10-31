// Local replica of the marketplace scan for a skill zip: the 8 published checks plus a dead-reference check.
// Usage: node tools/validate-skill.mjs release/ui-lab.zip [more.zip ...]
// Exit code 1 if any check fails. Warnings never fail the run.
// Node built-ins only. Reads the zip; writes nothing.
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { readZip } from './zip.mjs'

const TEXT_EXT = new Set(['.md', '.mjs', '.js', '.json', '.txt', '.yaml', '.yml', '.css', '.html', '.svg'])
const JUNK = /(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini|__MACOSX|\.git|\.gitignore|node_modules)(\/|$)/
const ext = (n) => (n.match(/\.[^./]+$/) || [''])[0].toLowerCase()
const isScript = (n) => /\.(mjs|js|sh|ps1|py|html)$/.test(n) // html patterns carry inline scripts, so they get the script checks
const MAX_TOTAL = 5 * 1024 * 1024
const MAX_FILE = 1024 * 1024

// Each rule: [label, regex]. Applied per line so findings can name the line.
const INJECTION = [
  ['override-instructions', /\b(ignore|disregard|forget|override)\b.{0,30}\b(previous|prior|above|earlier|system|all)\b.{0,20}\b(instructions?|rules?|prompts?|messages?)\b/i],
  ['persona-switch', /\byou are now\b.{0,30}\b(dan|developer mode|unrestricted|jailbroken)\b/i],
  ['reveal-prompt', /\b(reveal|print|show|output|repeat)\b.{0,20}\b(your|the)\b.{0,15}\b(system prompt|hidden instructions)\b/i],
  ['conceal-from-user', /\b(do not|don't|never)\s+(tell|inform|mention|show)\b.{0,20}\bthe user\b/i],
  ['act-without-user', /\bwithout (telling|informing|asking|notifying) the user\b/i],
]
const EXFIL = [
  ['sensitive-path', /(~|\$HOME|%USERPROFILE%)?[\\/]\.(ssh|aws|gnupg|kube|docker|npmrc|netrc)\b|id_rsa|\.env\b(?!\w)|credentials\.json|keychain|\/etc\/(passwd|shadow)|Login Data|Cookies\b.*sqlite/i],
  ['send-data-out', /\b(curl|wget|Invoke-WebRequest|Invoke-RestMethod|iwr|irm|nc|ncat|netcat|scp|sftp)\b.{0,80}(https?:\/\/|@|\s-d\s|--data|--upload|-T\s)/i],
  ['env-dump', /\b(printenv|env\s*\|\s*|process\.env\s*\)|JSON\.stringify\(process\.env)/],
]
const DANGEROUS = [
  ['rm-rf', /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r|\brm\s+--recursive/i],
  ['sudo', /\bsudo\b/],
  ['chmod-open', /\bchmod\s+(-R\s+)?[0-7]?77[0-7]?\b|\bchmod\s+\+x\s+\/|\bchmod\s+-R\b/],
  ['pipe-to-shell', /\b(curl|wget|iwr|irm)\b[^\n|]*\|\s*(ba|z|da)?sh\b|\|\s*(iex|Invoke-Expression)\b/i],
  ['eval-exec', /\b(eval|Invoke-Expression|iex)\s*[( ]|new\s+Function\s*\(|\bexec(Sync|File)?\s*\(/],
  ['windows-destructive', /\bdel\s+\/[sqf]|\brmdir\s+\/s|\bformat\s+[a-z]:|Remove-Item\b.{0,40}-Recurse|\bdiskpart\b|\breg\s+(add|delete)\b/i],
  ['git-force', /\bgit\s+push\b.{0,30}(-f\b|--force)|\bgit\s+reset\s+--hard\b|\bgit\s+clean\s+-[a-z]*f/i],
  ['global-install', /\b(npm|pnpm|yarn)\s+(i|install|add)\b.{0,20}(-g\b|--global)|\bpip\s+install\b|\bnpm\s+(i|install)\b/i],
  ['spawn-process', /\b(child_process|spawnSync?|execFileSync?|execSync)\b/],
  ['fs-delete', /\bfs\.(rm|rmSync|rmdir|rmdirSync|unlink|unlinkSync)\b|\b(rmSync|unlinkSync)\s*\(/],
]
const SECRETS = [
  ['aws-key', /\bAKIA[0-9A-Z]{16}\b/],
  ['github-token', /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{20,}/],
  ['openai-style-key', /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{10,}/],
  ['google-key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['private-key', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY/],
  ['jwt', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['assigned-secret', /\b(api[_-]?key|secret|token|passw(or)?d|auth)\b\s*[:=]\s*['"][^'"\s]{12,}['"]/i],
]
const OBFUSCATION = [
  ['base64-blob', /[A-Za-z0-9+/]{100,}={0,2}/],
  ['hex-escapes', /(\\x[0-9a-fA-F]{2}){4,}/],
  ['unicode-escapes', /(\\u[0-9a-fA-F]{4}){4,}/],
  ['decode-call', /\b(atob|btoa|unescape|String\.fromCharCode)\s*\(|Buffer\.from\([^)]*['"](base64|hex)['"]/],
  ['data-uri', /data:[a-z]+\/[a-z0-9.+-]+;base64,/i],
]
const NET_SCRIPT = [
  ['network-import', /\b(import|require)\b.{0,40}['"](node:)?(https?|net|tls|dgram|dns|http2|ws|undici|node-fetch|axios|got)['"]/],
  ['fetch-call', /\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|navigator\.sendBeacon|\bEventSource\b/],
  ['url-literal', /https?:\/\/[^\s'"`)]+/],
]
const NET_DOC_VERB = /\b(fetch|download|curl|wget|GET|POST|visit|browse|open the (site|url|page)|load from|pull from)\b/i
const URL_RE = /https?:\/\/[^\s'"`)>\]]+/g
const LEAK = [
  ['windows-path', /\b[A-Za-z]:\\[\w .\\-]+/],
  ['home-path', /(\/Users\/|\/home\/)[\w.-]+/],
  ['repo-path', /(^|[\s`(])(src|tools|playbook|public|dist)\/[\w.-]+/],
  ['hash-route', /(^|[\s`(])#\/[\w-]*/],
  ['live-site-path', /(^|[\s`(])\/(docs|raw|playbook)\/|\/(llms(-full)?\.txt|patterns\.json|references\.(md|json)|resources\.md|for-claude\.md)\b/],
  ['live-site-host', /(vercel\.app|onrender\.com|localhost:\d+|127\.0\.0\.1)/],
  ['relative-link', /\]\((\.\.?\/|\/)[^)]*\)/],
  ['author-machine', /\bHarsh\b|\bnightfury|HarshSalunkhe/i],
]
const PKG_REF = /^(references|templates|scripts|examples|patterns)\/[\w./-]+$/
const STALE_MARKER = /\{\{\/?(pro|lite)(-line)?\}\}/

function scanLines(text, rules, onHit) {
  text.split(/\r?\n/).forEach((line, i) => {
    for (const [label, re] of rules) if (re.test(line)) onHit(label, i + 1, line.trim().slice(0, 110))
  })
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { error: 'SKILL.md does not start with a --- frontmatter block' }
  const fm = {}
  const errors = []
  for (const [i, raw] of m[1].split(/\r?\n/).entries()) {
    if (!raw.trim()) continue
    const kv = raw.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!kv) { errors.push(`frontmatter line ${i + 1} is not "key: value" (multi-line or indented YAML is not supported by the scan)`); continue }
    let v = kv[2].trim()
    const quoted = /^(["']).*\1$/.test(v)
    if (!quoted && (/:\s/.test(v) || /\s#/.test(v) || /^[\[{&*!|>%@`]/.test(v))) errors.push(`"${kv[1]}" is an unquoted YAML scalar containing ": ", " #" or a reserved leading character; quote it or reword`)
    if (quoted) v = v.slice(1, -1)
    fm[kv[1]] = v
  }
  return { fm, errors, bodyStart: m[0].length, raw: m[0] }
}

export function validate(zipBuf, label = 'zip') {
  const results = []
  const add = (id, name, findings, warnings = []) => results.push({ id, name, ok: findings.length === 0, findings, warnings })
  let entries
  try { entries = readZip(zipBuf) } catch (e) {
    add(7, 'zip structure', [`cannot read zip: ${e.message}`])
    return results
  }
  const files = entries.filter((e) => !e.isDir)
  const names = new Set(files.map((f) => f.name))
  const textOf = (f) => f.data.toString('utf8')
  const isText = (f) => TEXT_EXT.has(ext(f.name)) && !f.data.subarray(0, 8000).includes(0)

  // 7. zip structure ---------------------------------------------------------
  {
    const f = []
    const tops = new Set(entries.map((e) => e.name.split('/')[0]))
    if (tops.size !== 1) f.push(`must have exactly one top-level folder, found: ${[...tops].join(', ') || '(none)'}`)
    const top = [...tops][0]
    if (!names.has(`${top}/SKILL.md`)) f.push(`SKILL.md must be at ${top}/SKILL.md`)
    for (const e of files) {
      if (!e.name.startsWith(`${top}/`)) f.push(`file outside top folder: ${e.name}`)
      if (e.name.split('/').slice(0, 2).join('/') === `${top}/${top}`) f.push(`double nesting: ${e.name}`)
      if (e.name.includes('..') || e.name.startsWith('/') || /^[A-Za-z]:/.test(e.name) || e.name.includes('\\')) f.push(`unsafe path: ${e.name}`)
      if (JUNK.test(e.name)) f.push(`junk file: ${e.name}`)
      if ((e.unixMode & 0o170000) === 0o120000) f.push(`symlink: ${e.name}`)
      if (!TEXT_EXT.has(ext(e.name))) f.push(`non-text file type (no binaries): ${e.name}`)
      else if (e.data.subarray(0, 8000).includes(0)) f.push(`binary content: ${e.name}`)
      if (e.data.length > MAX_FILE) f.push(`file over 1 MB: ${e.name}`)
    }
    const total = files.reduce((n, e) => n + e.data.length, 0)
    if (total > MAX_TOTAL) f.push(`unpacked size ${(total / 1048576).toFixed(1)} MB exceeds 5 MB`)
    if (/ /.test(basename(label)) ) f.push('zip filename contains spaces')
    add(7, 'zip structure', f)
  }

  const top = files[0]?.name.split('/')[0] || 'ui-lab'
  const scan = (id, name, rules, { scriptsOnly = false, docsOnly = false } = {}) => {
    const f = []
    for (const e of files) {
      if (!isText(e)) continue
      const script = isScript(e.name)
      if ((scriptsOnly && !script) || (docsOnly && script)) continue
      scanLines(textOf(e), rules, (r, line, snip) => {
        // The one allowed process start: the verify script runs the user's own local browser on their own page.
        if (r === 'spawn-process' && e.name === `${top}/scripts/verify.mjs`) return
        f.push(`${e.name}:${line} [${r}] ${snip}`)
      })
    }
    add(id, name, f)
  }

  // 1. prompt injection ------------------------------------------------------
  {
    const f = []
    for (const e of files) {
      if (!isText(e)) continue
      const t = textOf(e)
      scanLines(t, INJECTION, (r, line, snip) => f.push(`${e.name}:${line} [${r}] ${snip}`))
      const hidden = t.match(/[​-‏‪-‮⁠-⁤﻿]/)
      if (hidden) f.push(`${e.name} contains invisible/bidi character U+${hidden[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
      if (ext(e.name) === '.md' && /<!--/.test(t)) f.push(`${e.name} contains an HTML comment (hidden text)`)
      if (/<\s*(system|assistant|instructions?)\s*>/i.test(t)) f.push(`${e.name} contains a fake role/instruction tag`)
    }
    add(1, 'prompt injection', f)
  }
  // 2. exfiltration, 3. dangerous commands, 4. secrets, 5. obfuscation ------------
  scan(2, 'exfiltration', EXFIL)
  scan(3, 'dangerous commands', DANGEROUS)
  scan(4, 'secrets', SECRETS)
  {
    const f = []
    for (const e of files) {
      if (!isText(e)) continue
      const t = textOf(e)
      scanLines(t, OBFUSCATION, (r, line, snip) => f.push(`${e.name}:${line} [${r}] ${snip.slice(0, 60)}...`))
      t.split(/\r?\n/).forEach((l, i) => {
        if (isScript(e.name) && l.length > 400) f.push(`${e.name}:${i + 1} [minified-looking] line is ${l.length} chars`)
      })
    }
    add(5, 'obfuscation', f)
  }
  // 6. network access ----------------------------------------------------------
  {
    const f = []
    const warn = []
    for (const e of files) {
      if (!isText(e)) continue
      const t = textOf(e)
      if (isScript(e.name)) {
        scanLines(t, NET_SCRIPT, (r, line, snip) => f.push(`${e.name}:${line} [${r}] ${snip}`))
      } else {
        const strict = /(^|\/)(SKILL\.md|templates\/)/.test(e.name)
        t.split(/\r?\n/).forEach((l, i) => {
          const urls = l.match(URL_RE)
          if (!urls) return
          if (strict) f.push(`${e.name}:${i + 1} [url-in-instructions] ${l.trim().slice(0, 100)}`)
          else if (NET_DOC_VERB.test(l)) f.push(`${e.name}:${i + 1} [runtime-fetch-instruction] ${l.trim().slice(0, 100)}`)
          else warn.push(`${e.name}:${i + 1} URL cited: ${urls[0]}`)
        })
        scanLines(t, [['fetch-tool-instruction', /\b(WebFetch|WebSearch|curl|wget)\b/]], (r, line, snip) => f.push(`${e.name}:${line} [${r}] ${snip}`))
      }
    }
    add(6, 'network access', f, warn)
  }
  // 8. SKILL.md validity ---------------------------------------------------------
  {
    const f = []
    const sk = files.find((e) => e.name === `${top}/SKILL.md`)
    if (!sk) f.push('SKILL.md missing')
    else {
      const t = textOf(sk)
      const p = parseFrontmatter(t)
      if (p.error) f.push(p.error)
      else {
        f.push(...p.errors)
        const { fm } = p
        const extra = Object.keys(fm).filter((k) => !['name', 'description', 'license', 'allowed-tools', 'metadata'].includes(k))
        if (extra.length) f.push(`unexpected frontmatter keys: ${extra.join(', ')}`)
        if (!fm.name) f.push('frontmatter "name" missing')
        else {
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name)) f.push(`name "${fm.name}" is not a lowercase slug`)
          if (fm.name !== top) f.push(`name "${fm.name}" does not match the folder "${top}"`)
          if (fm.name.length > 64) f.push('name longer than 64 characters')
        }
        const d = fm.description
        if (!d) f.push('frontmatter "description" missing')
        else {
          if (d.length > 1024) f.push(`description is ${d.length} chars (max 1024)`)
          if (!/^Use (when|this skill when|whenever)\b/i.test(d)) f.push('description must be trigger-based and start with "Use when ..."')
          const phrases = (d.match(/"[^"]{3,60}"/g) || []).length
          if (phrases < 3 || phrases > 5) f.push(`description needs 3 to 5 quoted trigger phrases, found ${phrases}`)
        }
        const body = t.slice(p.bodyStart)
        const lines = t.split(/\r?\n/).length
        if (lines > 250) f.push(`SKILL.md is ${lines} lines (max 250)`)
        if (!/^#\s+\S/m.test(body)) f.push('SKILL.md body has no top-level heading')
        if (body.trim().length < 400) f.push('SKILL.md body is too short to be a workflow')
      }
    }
    add(8, 'SKILL.md validity', f)
  }
  // 9. dead references (our own check: the package must be self-contained) ----------
  {
    const f = []
    for (const e of files) {
      if (!isText(e) || ext(e.name) !== '.md') continue
      const t = textOf(e)
      scanLines(t, LEAK, (r, line, snip) => f.push(`${e.name}:${line} [${r}] ${snip}`))
      if (STALE_MARKER.test(t)) f.push(`${e.name} still contains a {{pro}} or {{lite}} build marker`)
      const dir = e.name.split('/').slice(0, -1).join('/')
      for (const m of t.matchAll(/`([^`\n]+)`/g)) {
        const tok = m[1].trim().split(/\s/)[0]
        if (PKG_REF.test(tok)) {
          const ok = tok.endsWith('/') ? [...names].some((n) => n.startsWith(`${top}/${tok}`)) : names.has(`${top}/${tok}`) || names.has(`${dir}/${tok}`)
          if (!ok) f.push(`${e.name} references missing file ${tok}`)
        }
      }
    }
    add(9, 'dead references (self-contained)', f)
  }
  return results
}

export function report(results, label) {
  console.log(`\n${label}`)
  let ok = true
  for (const r of results.sort((a, b) => a.id - b.id)) {
    console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.id}. ${r.name}`)
    for (const x of r.findings.slice(0, 12)) console.log(`        ${x}`)
    if (r.findings.length > 12) console.log(`        ... and ${r.findings.length - 12} more`)
    for (const w of r.warnings.slice(0, 3)) console.log(`        warn: ${w}`)
    if (!r.ok) ok = false
  }
  return ok
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('tools/validate-skill.mjs')) {
  const args = process.argv.slice(2)
  if (!args.length) { console.error('Usage: node tools/validate-skill.mjs <skill.zip> [...]'); process.exit(2) }
  let all = true
  for (const a of args) all = report(validate(readFileSync(a), a), a) && all
  console.log(all ? '\nAll checks passed.' : '\nValidation FAILED.')
  process.exit(all ? 0 : 1)
}
