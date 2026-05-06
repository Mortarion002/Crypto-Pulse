'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type LandingSentiment = 'Bullish' | 'Bearish' | 'Neutral'

interface LandingCoin {
  sym: string
  name: string
  price: number
  change: number
  sent: LandingSentiment
  color: string
}

const initialCoins: LandingCoin[] = [
  { sym: 'BTC', name: 'Bitcoin', price: 96420.5, change: 2.34, sent: 'Bullish', color: '#F7931A' },
  { sym: 'ETH', name: 'Ethereum', price: 3812.18, change: 1.87, sent: 'Bullish', color: '#627EEA' },
  { sym: 'SOL', name: 'Solana', price: 182.44, change: -0.93, sent: 'Bearish', color: '#9945FF' },
  { sym: 'BNB', name: 'BNB', price: 618.2, change: 0.61, sent: 'Neutral', color: '#F3BA2F' },
  { sym: 'XRP', name: 'XRP', price: 0.624, change: -2.11, sent: 'Bearish', color: '#00AAE4' },
  { sym: 'ADA', name: 'Cardano', price: 0.481, change: 3.22, sent: 'Bullish', color: '#0033AD' },
]

const sparkPaths = {
  Bullish: 'M0 30 C18 28,30 16,45 14 S70 8,90 9 S110 5,130 6',
  Bearish: 'M0 8 C18 10,30 24,45 22 S70 30,90 28 S110 33,130 35',
  Neutral: 'M0 20 C18 18,30 22,45 20 S70 19,90 21 S110 20,130 20',
} as const

function formatPrice(price: number) {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  if (price >= 1) return `$${price.toFixed(3)}`
  return `$${price.toFixed(4)}`
}

function sentimentTone(sentiment: LandingCoin['sent']) {
  if (sentiment === 'Bullish') return 'text-[#00FF85] border-[#00FF85]/30 bg-[#00FF85]/10'
  if (sentiment === 'Bearish') return 'text-[#FF4D4D] border-[#FF4D4D]/30 bg-[#FF4D4D]/10'
  return 'text-[#9B6DFF] border-[#9B6DFF]/30 bg-[#9B6DFF]/10'
}

function sentimentStroke(sentiment: LandingCoin['sent']) {
  if (sentiment === 'Bullish') return '#00FF85'
  if (sentiment === 'Bearish') return '#FF4D4D'
  return '#9B6DFF'
}

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b px-5 transition-all duration-300 ${
        scrolled
          ? 'border-[rgba(255,255,255,0.08)] bg-[#0B0B0F]/90 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#00FF85,#9B6DFF)] text-sm font-black text-[#0B0B0F]">
            CP
          </span>
          <span className="text-[15px] font-bold tracking-tight">
            Crypto<span className="text-[#00FF85]">Pulse</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {['Features', 'Markets', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-[#8A8A9A] transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2 text-sm font-semibold text-[#A7A7B5] transition-colors hover:border-[rgba(255,255,255,0.22)] hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-[#00FF85] px-4 py-2 text-sm font-black text-[#0B0B0F] transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}

function Ticker({ coins }: { coins: LandingCoin[] }) {
  const items = [...coins, ...coins]

  return (
    <div className="overflow-hidden border-y border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)]">
      <div className="flex w-max whitespace-nowrap [animation:ticker_28s_linear_infinite]">
        {items.map((coin, index) => (
          <div
            key={`${coin.sym}-${index}`}
            className="inline-flex items-center gap-3 border-r border-[rgba(255,255,255,0.07)] px-8 py-2.5 font-mono text-xs"
          >
            <span className="font-bold uppercase tracking-[0.16em] text-[#8A8A9A]">{coin.sym}</span>
            <span className="font-semibold text-white">{formatPrice(coin.price)}</span>
            <span className={coin.change >= 0 ? 'font-bold text-[#00FF85]' : 'font-bold text-[#FF4D4D]'}>
              {coin.change >= 0 ? '+' : ''}
              {coin.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Sparkline({ sentiment }: { sentiment: LandingCoin['sent'] }) {
  const stroke = sentimentStroke(sentiment)

  return (
    <svg viewBox="0 0 130 40" className="h-10 w-full" fill="none" aria-hidden="true">
      <path d={`${sparkPaths[sentiment]} L130 40 L0 40 Z`} fill={`${stroke}18`} />
      <path d={sparkPaths[sentiment]} stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function CoinCard({ coin }: { coin: LandingCoin }) {
  return (
    <div className="group flex min-h-[190px] flex-col gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111118] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(0,255,133,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white"
            style={{ backgroundColor: coin.color }}
          >
            {coin.sym.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-bold">{coin.name}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A8A9A]">{coin.sym}</p>
          </div>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${sentimentTone(coin.sent)}`}>
          {coin.sent}
        </span>
      </div>

      <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-2">
        <Sparkline sentiment={coin.sent} />
      </div>

      <div className="mt-auto">
        <p className="font-mono text-2xl font-black">{formatPrice(coin.price)}</p>
        <p className={coin.change >= 0 ? 'mt-1 text-sm font-bold text-[#00FF85]' : 'mt-1 text-sm font-bold text-[#FF4D4D]'}>
          {coin.change >= 0 ? '+' : ''}
          {coin.change.toFixed(2)}%
        </p>
      </div>
    </div>
  )
}

function ProductPreview({ coins }: { coins: LandingCoin[] }) {
  const gainers = coins.filter((coin) => coin.change > 0).length
  const breadth = Math.round((gainers / coins.length) * 100)

  return (
    <div className="relative mx-auto w-full max-w-[560px] [animation:float-panel_6s_ease-in-out_infinite]">
      <div className="absolute -inset-6 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,133,0.18),transparent_64%)] blur-xl" />
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0f0f16] shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
        <div className="relative border-b border-[rgba(255,255,255,0.08)] p-5">
          <span className="absolute left-0 h-2 w-full bg-[linear-gradient(90deg,transparent,rgba(0,255,133,0.65),transparent)] [animation:scanline_5s_linear_infinite]" />
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#00FF85]">Live market</p>
              <h2 className="mt-2 text-3xl font-black">Bullish Market</h2>
            </div>
            <span className="rounded-full border border-[#00FF85]/25 bg-[#00FF85]/10 px-3 py-1 text-xs font-bold text-[#00FF85]">
              {breadth}% breadth
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.07)]">
            <div className="h-full rounded-full bg-[#00FF85]" style={{ width: `${breadth}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
          {coins.slice(0, 6).map((coin) => (
            <div key={coin.sym} className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.035)] p-3">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-sm font-black">{coin.sym}</span>
                <span className={coin.change >= 0 ? 'text-xs font-bold text-[#00FF85]' : 'text-xs font-bold text-[#FF4D4D]'}>
                  {coin.change >= 0 ? '+' : ''}
                  {coin.change.toFixed(1)}%
                </span>
              </div>
              <Sparkline sentiment={coin.sent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [coins, setCoins] = useState(initialCoins)

  useEffect(() => {
    const timer = setInterval(() => {
      setCoins((current) =>
        current.map((coin) => ({
          ...coin,
          price: Number((coin.price * (1 + (Math.random() - 0.5) * 0.004)).toFixed(coin.price > 100 ? 2 : 4)),
        }))
      )
    }, 1800)

    return () => clearInterval(timer)
  }, [])

  const stats = useMemo(
    () => [
      ['24/7', 'Market pulse'],
      ['6', 'Tracked majors'],
      ['30s', 'Live refresh'],
      ['Cloud', 'Synced watchlist'],
    ],
    []
  )

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0B0B0F] text-white">
      <LandingNav />

      <main>
        <section className="relative min-h-[calc(100vh-42px)] overflow-hidden px-5 pt-28">
          <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_16%_14%,rgba(0,255,133,0.16),transparent_62%),radial-gradient(760px_420px_at_86%_18%,rgba(155,109,255,0.14),transparent_66%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,#0B0B0F)]" />

          <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 pb-12 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-3xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#CFCFD8]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF85]" />
                Real-time sentiment
              </div>

              <h1 className="text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
                Crypto Pulse
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A7A7B5]">
                Track the market mood, spot top movers, and keep a Supabase-synced watchlist across the web and mobile app.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-[#00FF85] px-6 py-3 text-sm font-black text-[#0B0B0F] transition-opacity hover:opacity-90"
                >
                  Get started
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg border border-[rgba(255,255,255,0.12)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                >
                  View markets
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <ProductPreview coins={coins} />
            </motion.div>
          </div>

          <div className="relative mx-auto grid max-w-[1200px] grid-cols-2 gap-px overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)] md:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="bg-[#101018] px-5 py-5">
                <p className="font-mono text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8A8A9A]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <Ticker coins={coins} />

        <section id="features" className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#00FF85]">Features</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Built for fast market reads.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Live market mood', 'A dashboard hero distills gainers, losers, volatility, and breadth into one clear signal.'],
              ['Coin detail charts', 'Inspect each supported asset with price history, 24H levels, and sentiment context.'],
              ['Shared watchlist', 'Supabase keeps saved coins tied to your account, matching the Flutter app database.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111118] p-6">
                <div className="mb-8 h-1.5 w-12 rounded-full bg-[#00FF85]" />
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#9C9CAA]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="markets" className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#00FF85]">Markets</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">A live-feeling market wall.</h2>
            </div>
            <Link href="/auth/signup" className="text-sm font-bold text-[#00FF85] hover:text-white">
              Sign up to open dashboard
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coins.map((coin) => (
              <CoinCard key={coin.sym} coin={coin} />
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-[1200px] px-5 py-20">
          <div className="grid gap-6 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#101018] p-6 md:grid-cols-[1fr_0.9fr] md:p-10">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#00FF85]">Pricing</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">Free to start tracking.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#9C9CAA]">
                Create an account, sync your watchlist, and use the live market dashboard with the same Supabase backend as the mobile app.
              </p>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0F] p-6">
              <p className="font-mono text-4xl font-black">$0</p>
              <p className="mt-2 text-sm text-[#8A8A9A]">Current web access</p>
              <Link
                href="/auth/signup"
                className="mt-6 inline-flex w-full justify-center rounded-lg bg-[#00FF85] px-5 py-3 text-sm font-black text-[#0B0B0F] transition-opacity hover:opacity-90"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
