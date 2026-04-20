'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    href: '/',
    label: 'Market',
    isActive: (pathname: string) =>
      pathname === '/' || pathname.startsWith('/coin/'),
  },
  {
    href: '/insights',
    label: 'Insights',
    isActive: (pathname: string) => pathname === '/insights',
  },
  {
    href: '/watchlist',
    label: 'Watchlist',
    isActive: (pathname: string) => pathname === '/watchlist',
  },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.06)] bg-[#13131A]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-3 w-3 animate-pulse rounded-full bg-[#00FF85] shadow-[0_0_16px_rgba(0,255,133,0.75)]" />
          <span className="text-[20px] font-bold tracking-tight text-white">
            Crypto Pulse
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {navigation.map((item) => {
            const active = item.isActive(pathname)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'rounded-lg bg-[rgba(255,255,255,0.06)] text-white'
                    : 'text-[#8A8A9A] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
