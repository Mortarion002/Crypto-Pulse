'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import Card from '@/shared/components/Card'
import { getCoinBadgeClass } from '@/shared/utils/coinColors'

const MOCK_INSIGHTS = {
  mood: 'Bullish' as const,
  gainers: 14,
  losers: 6,
  bullPercent: 70,
  volatility: 'Moderate' as const,
  volPct: 54,
  headline: 'Altcoins outperforming BTC today',
  subtext: 'BTC dominance dropped 2.3% in 24H',
}

const MOCK_GAINERS = [
  { symbol: 'SOL', name: 'Solana', color: '#14F195', change: 5.48 },
  { symbol: 'XRP', name: 'XRP', color: '#00AAE4', change: 4.11 },
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A', change: 3.24 },
]

const MOCK_LOSERS = [
  { symbol: 'ADA', name: 'Cardano', color: '#0033AD', change: -1.82 },
  { symbol: 'DOT', name: 'Polkadot', color: '#E6007A', change: -2.94 },
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142', change: -3.67 },
]

function formatMoverChange(change: number): string {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M13.5 2 6 13h4.7L9.8 22 18 10.8h-4.6L13.5 2Z" />
    </svg>
  )
}

export default function InsightsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-8">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-white">Insights</h1>
            <p className="text-[#8A8A9A]">Live market intelligence</p>
          </div>
          <div className="inline-flex items-center gap-2 text-[12px] text-[#8A8A9A]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF85]" />
            Updated 1m ago
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Card className="flex flex-col gap-5">
            <p className="text-[13px] uppercase tracking-[0.22em] text-[#8A8A9A]">
              Overall Market
            </p>

            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-extrabold uppercase text-[#00FF85] drop-shadow-[0_0_14px_rgba(0,255,133,0.35)] sm:text-5xl">
                {MOCK_INSIGHTS.mood}
              </h2>

              <div className="flex flex-wrap items-center gap-5 text-sm">
                <p className="text-[#00FF85]">Gainers: {MOCK_INSIGHTS.gainers}</p>
                <p className="text-[#FF4D4D]">Losers: {MOCK_INSIGHTS.losers}</p>
                <p className="text-[#8A8A9A]">Unchanged: 0</p>
              </div>

              <div className="overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                <div className="flex h-[10px]">
                  <div className="w-[70%] bg-[#00FF85]" />
                  <div className="w-[30%] bg-[#FF4D4D]" />
                </div>
              </div>

              <p className="text-[13px] text-[#8A8A9A]">
                70% of coins trending up
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-5">
            <p className="text-[13px] uppercase tracking-[0.22em] text-[#8A8A9A]">
              Market Volatility
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <div className="relative">
                <div className="h-2 rounded-full bg-[linear-gradient(90deg,#00FF85_0%,#F5B13D_50%,#FF4D4D_100%)]" />
                <div className="absolute left-[54%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0B0B0F] bg-[#F5B13D] shadow-[0_0_12px_rgba(245,177,61,0.45)]" />
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-[#F5B13D]">
                {MOCK_INSIGHTS.volatility}
              </p>
              <p className="text-[13px] text-[#8A8A9A]">
                Market is stable - based on 24H price swings
              </p>
            </div>
          </Card>
        </section>

        <Card className="flex flex-col gap-6">
          <p className="text-[13px] uppercase tracking-[0.22em] text-[#8A8A9A]">
            Top Movers Today
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[#00FF85]">
                Gainers
              </p>
              {MOCK_GAINERS.map((coin, index) => (
                <Link
                  key={coin.symbol}
                  href={`/coin/${coin.symbol}`}
                  className={`flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                    index < MOCK_GAINERS.length - 1
                      ? 'border-b border-[rgba(255,255,255,0.06)]'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${getCoinBadgeClass(
                        coin.symbol
                      )}`}
                    >
                      {coin.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{coin.name}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8A8A9A]">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#00FF85]">
                    {formatMoverChange(coin.change)} ↑
                  </p>
                </Link>
              ))}
            </div>

            <div className="flex flex-col">
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[#FF4D4D]">
                Losers
              </p>
              {MOCK_LOSERS.map((coin, index) => (
                <Link
                  key={coin.symbol}
                  href={`/coin/${coin.symbol}`}
                  className={`flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                    index < MOCK_LOSERS.length - 1
                      ? 'border-b border-[rgba(255,255,255,0.06)]'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${getCoinBadgeClass(
                        coin.symbol
                      )}`}
                    >
                      {coin.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{coin.name}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8A8A9A]">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#FF4D4D]">
                    {formatMoverChange(coin.change)} ↓
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-[#00FF85] bg-[linear-gradient(90deg,rgba(0,255,133,0.08),transparent_40%)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(0,255,133,0.12)] text-[#00FF85]">
                <BoltIcon />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{MOCK_INSIGHTS.headline}</p>
                <p className="text-sm text-[#8A8A9A]">{MOCK_INSIGHTS.subtext}</p>
              </div>
            </div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
              Just now
            </p>
          </div>
        </Card>
      </main>
    </motion.div>
  )
}
