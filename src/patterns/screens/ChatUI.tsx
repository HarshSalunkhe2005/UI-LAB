import { useEffect, useRef, useState } from 'react'

/*
 * AI chat screen: message list (role="log" so new messages are announced),
 * user/assistant bubbles, typing indicator, auto-scroll to the latest,
 * suggestion chips, and a composer that grows with content. Enter sends,
 * Shift+Enter adds a line. The reply here is canned for the demo.
 */

type Msg = { who: 'me' | 'ai'; text: string }

export default function ChatUI() {
  const [msgs, setMsgs] = useState<Msg[]>([{ who: 'ai', text: 'Hi! Ask me for a UI pattern, e.g. "a 3D carousel".' }])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Braces matter: newer browsers return a Promise from scrollIntoView, and
    // React treats any non-function effect return value as an error.
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [msgs, typing])

  const send = (t: string) => {
    if (!t.trim()) return
    setMsgs((m) => [...m, { who: 'me', text: t.trim() }])
    setText('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { who: 'ai', text: `Try "3D ring carousel" or "helix gallery". Both are in /llms.txt with full source.` }])
    }, 1100)
  }

  return (
    <div className="flex h-[26rem] flex-col overflow-hidden rounded-2xl border border-border bg-bg">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-accent-fg" aria-hidden>✦</span>
        <div><p className="text-sm font-medium">Pattern assistant</p><p className="text-xs text-success">online</p></div>
      </header>
      <div role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.who === 'me' ? 'justify-end' : ''}`}>
            <p className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.who === 'me' ? 'rounded-br-sm bg-accent text-accent-fg' : 'rounded-bl-sm bg-surface-2'}`}>
              <span className="sr-only">{m.who === 'me' ? 'You: ' : 'Assistant: '}</span>{m.text}
            </p>
          </div>
        ))}
        {typing && (
          <div className="flex w-fit gap-1 rounded-2xl bg-surface-2 px-4 py-3" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-muted" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
        )}
        <div ref={end} />
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-2">
        {['3D carousel', 'Shader hero', 'Pricing section'].map((s) => (
          <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-fg-muted hover:text-fg">{s}</button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text) }} className="flex items-end gap-2 border-t border-border p-3">
        <label htmlFor="chat-in" className="sr-only">Message</label>
        <textarea
          id="chat-in"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(text) } }}
          placeholder="Message…"
          className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none [field-sizing:content] focus:border-accent"
        />
        <button aria-label="Send" disabled={!text.trim()} className="grid h-9 w-9 place-items-center rounded-full bg-fg text-bg disabled:opacity-30">↑</button>
      </form>
    </div>
  )
}
