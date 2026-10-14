import { useMemo, useState } from 'react'

/*
 * A small shop: product cards with an add button, a cart with quantity steppers that never go below one (remove is a
 * separate, labelled button), a subtotal and shipping line that update in a live region, and an empty state that
 * points back. Prices are formatted with Intl. Everything is a real button or link; nothing relies on hover.
 */

const PRODUCTS = [
  { id: 'mug', name: 'Stoneware mug', price: 18, note: 'Holds 350 ml. Dishwasher safe.' },
  { id: 'tote', name: 'Canvas tote', price: 24, note: 'Heavy cotton, inside pocket.' },
  { id: 'print', name: 'Risograph print', price: 35, note: 'A3, two-colour, numbered.' },
] as const
const money = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)

export default function ShopCart() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const lines = PRODUCTS.filter((p) => cart[p.id])
  const sub = useMemo(() => lines.reduce((n, p) => n + p.price * cart[p.id], 0), [lines, cart])
  const ship = sub === 0 ? 0 : sub >= 50 ? 0 : 4.5
  const count = Object.values(cart).reduce((a, b) => a + b, 0)
  const set = (id: string, q: number) => setCart((c) => { const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n })

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
      <section aria-labelledby="shop-h">
        <h3 id="shop-h" className="text-lg font-semibold">Shop</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3 md:grid-cols-1">
          {PRODUCTS.map((p) => (
            <li key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-3">
              <div aria-hidden className="size-16 shrink-0 rounded-lg bg-surface-2" style={{ background: `color-mix(in srgb, var(--accent) ${p.price}%, var(--surface-2))` }} />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-fg-muted">{p.note}</p>
                <p className="mt-1 text-sm tabular-nums">{money(p.price)}</p>
              </div>
              <button onClick={() => set(p.id, (cart[p.id] ?? 0) + 1)} className="min-h-11 shrink-0 rounded-md bg-fg px-4 text-sm font-medium text-bg" aria-label={`Add ${p.name} to basket`}>Add</button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cart-h" className="rounded-xl border border-border bg-surface p-4">
        <h3 id="cart-h" className="text-lg font-semibold">Basket <span className="text-sm font-normal text-fg-muted">({count})</span></h3>
        {lines.length === 0 ? (
          <p className="mt-3 text-sm text-fg-muted">Your basket is empty. Add something from the shop and it will appear here.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {lines.map((p) => (
              <li key={p.id} className="py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm tabular-nums">{money(p.price * cart[p.id])}</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => set(p.id, Math.max(1, cart[p.id] - 1))} disabled={cart[p.id] === 1} aria-label={`One fewer ${p.name}`} className="grid size-11 place-items-center rounded-md border border-border disabled:opacity-40">−</button>
                  <span className="w-8 text-center tabular-nums" aria-label={`Quantity ${cart[p.id]}`}>{cart[p.id]}</span>
                  <button onClick={() => set(p.id, cart[p.id] + 1)} aria-label={`One more ${p.name}`} className="grid size-11 place-items-center rounded-md border border-border">+</button>
                  <button onClick={() => set(p.id, 0)} className="ml-auto min-h-11 px-2 text-sm text-fg-muted underline underline-offset-2 hover:text-fg">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div role="status" aria-live="polite" className="mt-3 border-t border-border pt-3 text-sm">
        <dl className="space-y-1">
          <div className="flex justify-between"><dt className="text-fg-muted">Subtotal</dt><dd className="tabular-nums">{money(sub)}</dd></div>
          <div className="flex justify-between"><dt className="text-fg-muted">Delivery</dt><dd className="tabular-nums">{sub === 0 ? '—' : ship === 0 ? 'Free' : money(ship)}</dd></div>
          <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{money(sub + ship)}</dd></div>
        </dl>
        </div>
        {sub > 0 && sub < 50 && <p className="mt-2 text-xs text-fg-muted">Add {money(50 - sub)} more for free delivery.</p>}
        <button disabled={lines.length === 0} className="mt-4 min-h-12 w-full rounded-md bg-accent text-sm font-medium text-accent-fg disabled:opacity-40">Checkout</button>
      </section>
    </div>
  )
}
