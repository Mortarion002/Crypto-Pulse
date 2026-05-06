'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import Card from '@/shared/components/Card'
import SkeletonLoader from '@/shared/components/SkeletonLoader'
import { getCoinBadgeClass } from '@/shared/utils/coinColors'
import useInsights from '@/features/insights/hooks/useInsights'
import type { InsightsData } from '@/features/market/types'

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

function moodColor(mood: InsightsData['marketMood']): string {
  if (mood === 'Bullish') return '#00FF85'
  if (mood === 'Bearish') return '#FF4D4D'
  return '#9B6DFF'
}

function volatilityPosition(v: InsightsData['volatility']): string {
  if (v === 'Low') return 'left-[15%]'
  if (v === 'High') return 'left-[86%]'
  return 'left-[54%]'
}

function volatilityColor(v: InsightsData['volatility']): string {
  if (v === 'Low') return 'text-[#00FF85]'
  if (v === 'High') return 'text-[#FF4D4D]'
  return 'text-[#F5B13D]'
}

function volatilityDotColor(v: InsightsData['volatility']): string {
  if (v === 'Low') return 'bg-[#00FF85] shadow-[0_0_12px_rgba(0,255,133,0.45)]'
  if (v === 'High') return 'bg-[#FF4D4D] shadow-[0_0_12px_rgba(255,77,77,0.45)]'
  return 'bg-[#F5B13D] shadow-[0_0_12px_rgba(245,177,61,0.45)]'
}

function alertBorderColor(mood: InsightsData['marketMood']): string {
  if (mood === 'Bullish') return 'border-l-[#00FF85] bg-[linear-gradient(90deg,rgba(0,255,133,0.08),transparent_40%)]'
  if (mood === 'Bearish') return 'border-l-[#FF4D4D] bg-[linear-gradient(90deg,rgba(255,77,77,0.08),transparent_40%)]'
  return 'border-l-[#9B6DFF] bg-[linear-gradient(90deg,rgba(155,109,255,0.08),transparent_40%)]'
}

function alertIconBg(mood: InsightsData['marketMood']): string {
  if (mood === 'Bullish') return 'bg-[rgba(0,255,133,0.12)] text-[#00FF85]'
  if (mood === 'Bearish') return 'bg-[rgba(255,77,77,0.12)] text-[#FF4D4D]'
  return 'bg-[rgba(155,109,255,0.12)] text-[#9B6DFF]'
}

export default function InsightsPage() {
  const { insights, loading, error } = useInsights()

  const [updatedText, setUpdatedText] = useState('Just now')

  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const s = Math.round((Date.now() - start) / 1000)
      if (s < 60) setUpdatedText(`Updated ${s}s ago`)
      else setUpdatedText(`Updated ${Math.floor(s / 60)}m ago`)
    }, 1000)
    return () => clearInterval(timer)
  }, [insights])

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
        <SkeletonLoader variant="card" count={3} />
      </div>
    )
  }

  if (error !== null || insights === null) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Card>
          <p className="text-[#8A8A9A] text-sm">Failed to load insights. Try refreshing.</p>
        </Card>
      </div>
    )
  }

  const accent = moodColor(insights.marketMood)
  const gainersLosersPct = insights.gainersPercent

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-white">Insights</h1>
            <p className="text-[#8A8A9A]">Live market intelligence</p>
          </div>
          <div className="inline-flex items-center gap-2 text-[12px] text-[#8A8A9A]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF85]" />
            {updatedText}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]"
        >
          <Card className="flex flex-col gap-5">
            <p className="text-[13px] uppercase tracking-[0.22em] text-[#8A8A9A]">
              Overall Market
            </p>

            <div className="flex flex-col gap-4">
              <h2
                className="text-4xl font-extrabold uppercase sm:text-5xl"
                style={{ color: accent, textShadow: `0 0 14px ${accent}59` }}
              >
                {insights.marketMood}
              </h2>

              <div className="flex flex-wrap items-center gap-5 text-sm">
                <p className="text-[#00FF85]">Gainers: {insights.gainers}</p>
                <p className="text-[#FF4D4D]">Losers: {insights.losers}</p>
                <p className="text-[#8A8A9A]">Unchanged: 0</p>
              </div>

              <div className="overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                <div className="flex h-[10px]">
                  <div
                    className="bg-[#00FF85]"
                    style={{ width: `${gainersLosersPct}%` }}
                  />
                  <div
                    className="bg-[#FF4D4D]"
                    style={{ width: `${100 - gainersLosersPct}%` }}
                  />
                </div>
              </div>

              <p className="text-[13px] text-[#8A8A9A]">
                {gainersLosersPct}% of coins trending up
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
                <div
                  className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0B0B0F] ${volatilityDotColor(insights.volatility)} ${volatilityPosition(insights.volatility)}`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className={`text-xl font-bold ${volatilityColor(insights.volatility)}`}>
                {insights.volatility}
              </p>
              <p className="text-[13px] text-[#8A8A9A]">
                Market is {insights.volatility === 'Low' ? 'stable' : insights.volatility === 'High' ? 'highly volatile' : 'moderately active'} — based on 24H price swings
              </p>
            </div>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
        >
          <Card className="flex flex-col gap-6">
            <p className="text-[13px] uppercase tracking-[0.22em] text-[#8A8A9A]">
              Top Movers Today
            </p>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col">
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[#00FF85]">
                  Gainers
                </p>
                {insights.topGainers.map((coin, index) => (
                  <Link
                    key={coin.displaySymbol}
                    href={`/coin/${coin.displaySymbol}`}
                    className={`flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                      index < insights.topGainers.length - 1
                        ? 'border-b border-[rgba(255,255,255,0.06)]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${getCoinBadgeClass(
                          coin.displaySymbol
                        )}`}
                      >
                        {coin.displaySymbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{coin.name}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8A8A9A]">
                          {coin.displaySymbol}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#00FF85]">
                      {formatMoverChange(coin.priceChange)} ↑
                    </p>
                  </Link>
                ))}
              </div>

              <div className="flex flex-col">
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[#FF4D4D]">
                  Losers
                </p>
                {insights.topLosers.map((coin, index) => (
                  <Link
                    key={coin.displaySymbol}
                    href={`/coin/${coin.displaySymbol}`}
                    className={`flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                      index < insights.topLosers.length - 1
                        ? 'border-b border-[rgba(255,255,255,0.06)]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${getCoinBadgeClass(
                          coin.displaySymbol
                        )}`}
                      >
                        {coin.displaySymbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{coin.name}</p>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#8A8A9A]">
                          {coin.displaySymbol}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-[#FF4D4D]">
                      {formatMoverChange(coin.priceChange)} ↓
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className={`border-l-4 ${alertBorderColor(insights.marketMood)}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${alertIconBg(insights.marketMood)}`}>
                  <BoltIcon />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{insights.insightHeadline}</p>
                  <p className="text-sm text-[#8A8A9A]">{insights.insightSubtext}</p>
                </div>
              </div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                Just now
              </p>
            </div>
          </Card>
        </motion.section>
      </main>
    </motion.div>
  )
}
