/*
 * Organic morphing blob with no JS: a gradient circle whose border-radius
 * cycles between eight-value shapes while it slowly rotates. Great behind
 * avatars, product shots or a hero word. Static under reduced motion.
 */

const CSS = `
.blob { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; animation: morph 9s ease-in-out infinite, turn 24s linear infinite; }
@keyframes morph {
  0%,100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
  33% { border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%; }
  66% { border-radius: 28% 72% 40% 60% / 60% 38% 62% 40%; }
}
@keyframes turn { to { rotate: 360deg; } }
@media (prefers-reduced-motion: reduce) { .blob { animation: none; } }
`

export default function MorphBlob() {
  return (
    <div className="relative grid h-80 place-items-center overflow-hidden rounded-xl bg-bg">
      <style>{CSS}</style>
      <div aria-hidden className="blob absolute h-64 w-64 bg-gradient-to-br from-accent via-fuchsia-500 to-orange-400 opacity-80 blur-sm" />
      <div aria-hidden className="blob absolute h-52 w-52 bg-gradient-to-tr from-cyan-400 to-accent opacity-60 mix-blend-screen [animation-delay:-4s]" />
      <p className="relative font-display text-5xl text-white italic">fluid</p>
    </div>
  )
}
