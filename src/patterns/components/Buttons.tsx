import { useState, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:brightness-110 shadow-sm',
  secondary: 'bg-surface text-fg border border-border hover:bg-surface-2',
  ghost: 'text-fg hover:bg-surface-2',
  danger: 'bg-danger text-white hover:brightness-110 shadow-sm',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-sm gap-1.5',
  md: 'h-10 px-4 text-sm rounded-md gap-2',
  lg: 'h-12 px-6 text-base rounded-md gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex select-none items-center justify-center font-medium transition-[transform,filter,background-color] duration-150 ease-standard active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
      )}
      {children}
    </button>
  )
}

export default function Buttons() {
  const [loading, setLoading] = useState(false)
  const fakeSave = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        {(Object.keys(VARIANTS) as Variant[]).map((v) => (
          <Button key={v} variant={v}>
            {v[0].toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {(Object.keys(SIZES) as Size[]).map((s) => (
          <Button key={s} size={s} variant="secondary">
            Size {s}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button loading={loading} onClick={fakeSave}>
          {loading ? 'Saving…' : 'Click to save'}
        </Button>
        <Button disabled variant="secondary">
          Disabled
        </Button>
      </div>
    </div>
  )
}
