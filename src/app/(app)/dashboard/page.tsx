'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import type { CoinData, Sentiment } from '@/features/market/types'
import Card from '@/shared/components/Card'
import SkeletonLoader from '@/shared/components/SkeletonLoader'
import TrendBadge from '@/shared/components/TrendBadge'
import { getCoinBadgeClass } from '@/shared/utils/coinColors'
import { formatChange, formatPrice } from '@/shared/utils/format'
import { getMarketSentiment, getSentimentColor } from '@/shared/utils/sentiment'
import useMarketData from '@/features/market/hooks/useMarketData'
import useWatchlist from '@/features/watchlist/hooks/useWatchlist'

const sparklinePaths = {
  Bullish: 'M0 29 C15 29, 24 14, 39 16 S67 8, 85 11 S107 6, 120 7',
  Bearish: 'M0 9 C14 10, 24 23, 38 21 S66 28, 84 26 S104 31, 120 33',
  Neutral: 'M0 20 C14 18, 24 22, 38 20 S67 19, 84 20 S104 22, 120 20',
} as const

function getChangeTone(sentiment: CoinData['sentiment']): string {
  if (sentiment === 'Bullish') return 'text-[#00FF85]'
  if (sentiment === 'Bearish') return 'text-[#FF4D4D]'
  return 'text-[#9B6DFF]'
}

function getHoverBorder(sentiment: CoinData['sentiment']): string {
  if (sentiment === 'Bullish') return 'hover:border-[rgba(0,255,133,0.28)]'
  if (sentiment === 'Bearish') return 'hover:border-[rgba(255,77,77,0.28)]'
  return 'hover:border-[rgba(155,109,255,0.28)]'
}

function getSparklineFill(sentiment: CoinData['sentiment']): string {
  if (sentiment === 'Bullish') return 'fill-[rgba(0,255,133,0.08)]'
  if (sentiment === 'Bearish') return 'fill-[rgba(255,77,77,0.08)]'
  return 'fill-[rgba(155,109,255,0.08)]'
}

function getSparklineStroke(sentiment: CoinData['sentiment']): string {
  if (sentiment === 'Bullish') return 'stroke-[#00FF85]'
  if (sentiment === 'Bearish') return 'stroke-[#FF4D4D]'
  return 'stroke-[#9B6DFF]'
}

function getArrow(value: number): string {
  return value >= 0 ? '↑' : '↓'
}

function deriveVolatility(coins: CoinData[]): 'Low' | 'Moderate' | 'High' {
  if (!coins.length) return 'Moderate'
  const avg = coins.reduce((s, c) => s + Math.abs(c.priceChange), 0) / coins.length
  if (avg < 2) return 'Low'
  if (avg < 5) return 'Moderate'
  return 'High'
}

function volatilityColor(v: 'Low' | 'Moderate' | 'High'): string {
  if (v === 'Low') return 'text-[#00FF85]'
  if (v === 'High') return 'text-[#FF4D4D]'
  return 'text-[#F5B13D]'
}

function moodGradient(mood: Sentiment): string {
  if (mood === 'Bullish') return 'bg-[radial-gradient(900px_300px_at_0%_50%,rgba(0,255,133,0.14),transparent_70%)]'
  if (mood === 'Bearish') return 'bg-[radial-gradient(900px_300px_at_0%_50%,rgba(255,77,77,0.14),transparent_70%)]'
  return 'bg-[radial-gradient(900px_300px_at_0%_50%,rgba(155,109,255,0.14),transparent_70%)]'
}

export default function MarketPulsePage() {
  const { coins, loading, error, lastUpdated } = useMarketData()
  const { savedCoins } = useWatchlist()

  const [updatedText, setUpdatedText] = useState('Just now')

  const gainers = coins.filter((c) => c.priceChange > 0).length
  const losers = coins.filter((c) => c.priceChange < 0).length
  const total = coins.length
  const mood = getMarketSentiment(gainers, losers)
  const moodColor = getSentimentColor(mood)
  const gainersPercent = total > 0 ? Math.round((gainers / total) * 100) : 70
  const volatility = deriveVolatility(coins)
  const topGainer = [...coins].sort((a, b) => b.priceChange - a.priceChange)[0]

  useEffect(() => {
    if (!lastUpdated) return
    const timer = setInterval(() => {
      const s = Math.round((Date.now() - lastUpdated.getTime()) / 1000)
      if (s < 60) setUpdatedText(`${s}s ago`)
      else setUpdatedText(`${Math.floor(s / 60)}m ago`)
    }, 1000)
    return () => clearInterval(timer)
  }, [lastUpdated])

  if (error !== null) {
    return (
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-8">
        <Card>
          <p className="text-[#8A8A9A] text-sm">Failed to load market data. Try refreshing.</p>
        </Card>
      </main>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-8">

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          {loading ? (
            <SkeletonLoader variant="card" count={1} />
          ) : (
            <Card className={`overflow-hidden ${moodGradient(mood)}`}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex max-w-2xl flex-col gap-4">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF85]" />
                    Live
                  </div>

                  <div className="flex flex-col gap-2">
                    <h1
                      className="text-4xl font-extrabold uppercase tracking-tight sm:text-5xl"
                      style={{ color: moodColor }}
                    >
                      {mood} Market
                    </h1>
                    <p className="text-base text-[#8A8A9A]">
                      {gainers} of {total} coins trending up
                    </p>
                  </div>
                </div>

                <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                      Gainers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#00FF85]">{gainers}</p>
                  </div>
                  <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                      Losers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#FF4D4D]">{losers}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <div className="h-3 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                  <div
                    className="h-full rounded-full bg-[#00FF85]"
                    style={{ width: `${gainersPercent}%` }}
                  />
                </div>
                <p className="text-sm text-[#8A8A9A]">
                  {gainersPercent}% breadth — broad participation
                </p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* ── Dashboard stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.07 }}
          className="flex flex-wrap gap-3"
        >
          {/* Mood pill */}
          <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[12px] font-semibold">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: loading ? '#8A8A9A' : moodColor }}
            />
            <span className="text-[#8A8A9A]">Mood</span>
            <span style={{ color: loading ? '#8A8A9A' : moodColor }}>
              {loading ? '—' : mood}
            </span>
          </div>

          {/* Volatility pill */}
          <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[12px] font-semibold">
            <span className="text-[#8A8A9A]">Volatility</span>
            <span className={loading ? 'text-[#8A8A9A]' : volatilityColor(volatility)}>
              {loading ? '—' : volatility}
            </span>
          </div>

          {/* Watchlist pill */}
          <Link
            href="/watchlist"
            className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[12px] font-semibold text-[#8A8A9A] transition-colors hover:border-[rgba(255,255,255,0.18)] hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
              <path d="M7 4h10a2 2 0 0 1 2 2v14l-7-4-7 4V6a2 2 0 0 1 2-2Z" />
            </svg>
            Watching {savedCoins.length} coin{savedCoins.length === 1 ? '' : 's'}
          </Link>

          {/* Top gainer pill */}
          {!loading && topGainer && (
            <Link
              href={`/coin/${topGainer.displaySymbol}`}
              className="flex items-center gap-2 rounded-full border border-[rgba(0,255,133,0.2)] bg-[rgba(0,255,133,0.06)] px-4 py-2 text-[12px] font-semibold text-[#00FF85] transition-colors hover:border-[rgba(0,255,133,0.35)] hover:bg-[rgba(0,255,133,0.1)]"
            >
              ↑ {topGainer.displaySymbol} {topGainer.priceChange > 0 ? '+' : ''}{topGainer.priceChange.toFixed(2)}% top gainer
            </Link>
          )}

          {/* Updated timestamp — pushed to the right */}
          <div className="ml-auto flex items-center gap-2 text-[12px] text-[#8A8A9A]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF85]" />
            Updated {lastUpdated ? updatedText : '—'}
          </div>
        </motion.div>

        {/* ── Top Coins section label ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <h2 className="text-[20px] font-semibold text-white">Top Coins</h2>
          <Link
            href="/insights"
            className="text-[12px] text-[#8A8A9A] transition-colors hover:text-white"
          >
            View full insights →
          </Link>
        </motion.section>

        {/* ── Coin grid ── */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <SkeletonLoader key={i} variant="card" count={1} />
              ))
            : coins.map((coin, index) => (
                <motion.div
                  key={coin.displaySymbol}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.14 + index * 0.04 }}
                >
                  <Link href={`/coin/${coin.displaySymbol}`}>
                    <Card
                      className={`flex h-full flex-col gap-5 transition-all duration-200 hover:scale-[1.02] ${getHoverBorder(
                        coin.sentiment
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${getCoinBadgeClass(
                              coin.displaySymbol
                            )}`}
                          >
                            {coin.displaySymbol.charAt(0)}
                          </div>
                          <div>
                            <p className="text-base font-bold text-white">{coin.name}</p>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A9A]">
                              {coin.displaySymbol}
                            </p>
                          </div>
                        </div>
                        <TrendBadge sentiment={coin.sentiment} />
                      </div>

                      <div className="flex h-10 items-center rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3">
                        <svg
                          viewBox="0 0 120 40"
                          className="h-10 w-full"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M0 40 L0 29 C15 29, 24 14, 39 16 S67 8, 85 11 S107 6, 120 7 L120 40 Z"
                            className={getSparklineFill(coin.sentiment)}
                          />
                          <path
                            d={sparklinePaths[coin.sentiment]}
                            className={getSparklineStroke(coin.sentiment)}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="mt-auto flex flex-col gap-1">
                        <p className="font-mono text-2xl font-bold text-white">
                          {formatPrice(coin.price)}
                        </p>
                        <p className={`text-sm font-semibold ${getChangeTone(coin.sentiment)}`}>
                          {formatChange(coin.priceChange)} {getArrow(coin.priceChange)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
        </section>
      </main>
    </motion.div>
  )
}
