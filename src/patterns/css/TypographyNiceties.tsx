/*
 * Modern CSS: four small features that remove JavaScript or hacks. `text-wrap: balance` evens out headline lines;
 * `text-wrap: pretty` avoids one-word last lines; `field-sizing: content` makes a textarea grow with its text;
 * `:has()` styles a field group from the state of its input. All degrade to normal behaviour if unsupported.
 */

const CSS = `
.tn h3 { text-wrap: balance; font-size: 1.5rem; line-height: 1.15; font-weight: 600; }
.tn p { text-wrap: pretty; color: var(--color-fg-muted); }
.tn textarea { field-sizing: content; min-height: 3rem; max-height: 10rem; width: 100%; padding: .6rem .75rem; border-radius: .5rem; border: 1px solid var(--color-border); background: var(--color-surface); resize: none; }
.tn .grp { padding: .5rem; border-radius: .75rem; border: 1px solid var(--color-border); }
.tn .grp:has(textarea:focus-visible) { border-color: var(--color-accent); }
.tn .grp:has(textarea:not(:placeholder-shown)) .hint { opacity: .4; }
.tn .hint { font-size: .75rem; transition: opacity .2s ease; }
@media (prefers-reduced-motion: reduce) { .tn .hint { transition: none; } }
`

export default function TypographyNiceties() {
  return (
    <div className="tn grid gap-5 p-6 sm:grid-cols-2">
      <style>{CSS}</style>
      <div>
        <h3>A headline that breaks into even lines instead of leaving a lonely word</h3>
        <p className="mt-3">Body copy uses pretty wrapping so the final line is never a single orphaned word sitting alone on the line.</p>
      </div>
      <label className="grp block">
        <span className="mb-1 block text-sm font-medium">Your note</span>
        <textarea placeholder="Type, and the box grows. No resize script." rows={1} />
        <span className="hint mt-1 block">The hint dims when there is text, using :has().</span>
      </label>
    </div>
  )
}
