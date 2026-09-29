import { useMemo, useState } from 'react'
import { highlight } from 'sugar-high'

export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text })
      document.body.append(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      className={`rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] transition-colors hover:text-fg ${
        copied ? 'text-success' : 'text-fg-muted'
      } ${className}`}
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

export function CodeBlock({ code }: { code: string }) {
  const html = useMemo(() => highlight(code), [code])
  const lines = code.split('\n').length
  return (
    <pre className="code max-h-[36rem] overflow-auto p-5 font-mono text-[12.5px] leading-relaxed">
      <code
        style={{ ['--gutter' as string]: `${String(lines).length + 1}ch` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  )
}
