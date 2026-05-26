import Link from 'next/link'
import type { ReactNode } from 'react'

export const marketingLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/status', label: 'Status' },
  { href: '/docs', label: 'Docs' },
] as const

interface MarketingPageShellProps {
  children: ReactNode
  currentHref: string
  description: string
  eyebrow: string
  title: string
  updated: string
}

interface MarketingCardProps {
  children: ReactNode
  className?: string
  eyebrow?: string
  title: string
}

interface StatusPillProps {
  label: string
  tone?: 'green' | 'gold' | 'purple' | 'red'
}

const toneClasses = {
  green: 'border-[rgba(0,255,133,0.24)] bg-[rgba(0,255,133,0.08)] text-[#00FF85]',
  gold: 'border-[rgba(245,177,61,0.24)] bg-[rgba(245,177,61,0.08)] text-[#F5B13D]',
  purple: 'border-[rgba(155,109,255,0.24)] bg-[rgba(155,109,255,0.08)] text-[#9B6DFF]',
  red: 'border-[rgba(255,77,77,0.24)] bg-[rgba(255,77,77,0.08)] text-[#FF4D4D]',
} as const

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3 text-white">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#00FF85,#9B6DFF)] text-sm font-extrabold text-black">
        CP
      </span>
      <span className="text-[15px] font-bold tracking-[0.02em]">
        Crypto<span className="text-[#00FF85]">Pulse</span>
      </span>
    </Link>
  )
}

export function StatusPill({ label, tone = 'green' }: StatusPillProps) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${toneClasses[tone]}`}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      {label}
    </span>
  )
}

export function MarketingCard({
  children,
  className,
  eyebrow,
  title,
}: MarketingCardProps) {
  return (
    <section
      className={`rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#111118] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ${className ?? ''}`.trim()}
    >
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8A8A9A]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-[#B8B8C6]">{children}</div>
    </section>
  )
}

export function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00FF85]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 font-mono text-[12px] text-[#00FF85]">
      {children}
    </code>
  )
}

export default function MarketingPageShell({
  children,
  currentHref,
  description,
  eyebrow,
  title,
  updated,
}: MarketingPageShellProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0B0B0F] text-white">
      <header className="border-b border-[rgba(255,255,255,0.07)] bg-[#0B0B0F]/92 backdrop-blur-xl">
        <div className="landing-section flex min-h-20 flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <nav className="flex flex-wrap items-center gap-2 sm:justify-end">
            {marketingLinks.map((link) => {
              const active = currentHref === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[rgba(0,255,133,0.08)] text-[#00FF85]'
                      : 'text-[#8A8A9A] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="relative">
        <div className="absolute inset-x-0 top-0 -z-0 h-[420px] bg-[radial-gradient(900px_320px_at_50%_0%,rgba(0,255,133,0.08),transparent_70%)]" />

        <section className="landing-section relative z-10 py-16 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <StatusPill label={eyebrow} />
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#8A8A9A] sm:text-lg">
                {description}
              </p>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#555566]">
              {updated}
            </p>
          </div>
        </section>

        <div className="landing-section relative z-10 pb-20">{children}</div>
      </main>

      <footer className="landing-section border-t border-[rgba(255,255,255,0.07)] py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <div className="flex flex-wrap gap-5">
            {marketingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#8A8A9A] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#555566]">
            (c) 2026 CryptoPulse. Real-time data, no guarantees.
          </p>
        </div>
      </footer>
    </div>
  )
}
