'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import type { Sentiment } from '@/features/market/types'
import Card from '@/shared/components/Card'
import SkeletonLoader from '@/shared/components/SkeletonLoader'
import TrendBadge from '@/shared/components/TrendBadge'
import { getCoinBadgeClass } from '@/shared/utils/coinColors'
import { formatChange, formatPrice } from '@/shared/utils/format'
import useCoinDetail from '@/features/coin/hooks/useCoinDetail'
import useWatchlist from '@/features/watchlist/hooks/useWatchlist'
import useMarketData from '@/features/market/hooks/useMarketData'

function getTone(sentiment: Sentiment): string {
  if (sentiment === 'Bullish') return 'text-[#00FF85]'
  if (sentiment === 'Bearish') return 'text-[#FF4D4D]'
  return 'text-[#9B6DFF]'
}

function getArrow(value: number): string {
  return value >= 0 ? '↑' : '↓'
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M13.5 2 6 13h4.7L9.8 22 18 10.8h-4.6L13.5 2Z" />
    </svg>
  )
}

const INTERVALS = ['1h', '4h', '1d', '1w'] as const
type Interval = (typeof INTERVALS)[number]

const COIN_INSIGHTS: Record<string, string> = {
  BTC: 'Strong buying pressure in last 4H',
  ETH: 'Breakout continuation holding above key support',
  SOL: 'Momentum accelerating after strong session close',
  BNB: 'Price compressing into a neutral consolidation band',
  ADA: 'Buyers fading as sellers defend intraday rallies',
  XRP: 'Fresh inflows supporting a clean upside reversal',
}

export default function CoinDetailPage() {
  const params = useParams<{ symbol: string }>()
  const symbol = (params.symbol ?? 'BTC').toUpperCase()

  const [interval, setActiveInterval] = useState<Interval>('1d')

  const { klines, loading: chartLoading, error: chartError } = useCoinDetail(symbol, interval)
  const { coins } = useMarketData()
  const { isWatchlisted, addCoin, removeCoin } = useWatchlist()

  const coin = coins.find((c) => c.displaySymbol === symbol)
  const watched = isWatchlisted(symbol)

  const accentColor =
    coin?.sentiment === 'Bullish'
      ? '#00FF85'
      : coin?.sentiment === 'Bearish'
        ? '#FF4D4D'
        : '#9B6DFF'

  const bullPercent = 50 + Math.round((coin?.priceChange ?? 0) * 2)
  const bearPercent = 100 - Math.max(0, Math.min(100, bullPercent))
  const clampedBull = Math.max(0, Math.min(100, bullPercent))

  const insightText = COIN_INSIGHTS[symbol] ?? 'Monitor key support and resistance levels'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="text-sm text-[#8A8A9A]"
        >
          <Link href="/" className="transition-colors hover:text-white">
            ← Market
          </Link>{' '}
          / <span className="text-white">{coin?.name ?? symbol}</span> ({symbol})
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl bg-[radial-gradient(650px_220px_at_0%_30%,rgba(0,255,133,0.12),transparent_72%)]"
        >
          <Card className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-2xl flex-col gap-5">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white ${getCoinBadgeClass(symbol)}`}
                >
                  {symbol.charAt(0)}
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{coin?.name ?? symbol}</h1>
                  <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-[#8A8A9A]">
                    {symbol}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {coin ? (
                  <>
                    <p className="font-mono text-4xl font-extrabold text-white sm:text-5xl">
                      {formatPrice(coin.price)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-xl font-semibold ${getTone(coin.sentiment)}`}>
                        {formatChange(coin.priceChange)} {getArrow(coin.priceChange)}
                      </span>
                      <TrendBadge sentiment={coin.sentiment} />
                    </div>
                  </>
                ) : (
                  <SkeletonLoader variant="text" count={2} />
                )}
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-[420px]">
              {coin ? (
                [
                  { label: '24H High', value: formatPrice(coin.high24h) },
                  { label: '24H Low', value: formatPrice(coin.low24h) },
                  { label: 'Volume', value: `$${(coin.volume / 1e9).toFixed(1)}B` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-[#8A8A9A]">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3">
                  <SkeletonLoader variant="card" count={1} />
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                Price Chart
              </p>
              <p className="text-sm text-[#8A8A9A]">{interval.toUpperCase()} range</p>
            </div>

            {chartLoading ? (
              <SkeletonLoader variant="card" count={1} />
            ) : chartError ? (
              <Card>
                <p className="text-[#8A8A9A] text-sm">Failed to load chart data.</p>
              </Card>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={klines} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accentColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#8A8A9A"
                    tick={{ fontSize: 11, fill: '#8A8A9A' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#8A8A9A"
                    tick={{ fontSize: 11, fill: '#8A8A9A' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => '$' + v.toLocaleString()}
                    width={75}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#13131A',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#8A8A9A' }}
                    itemStyle={{ color: accentColor }}
                    formatter={(value) => [typeof value === 'number' ? formatPrice(value) : String(value), 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={accentColor}
                    strokeWidth={2}
                    fill="url(#chartGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: accentColor, stroke: '#0B0B0F', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            <div className="flex flex-wrap gap-2">
              {INTERVALS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setActiveInterval(r)}
                  className={
                    interval === r
                      ? 'px-4 py-1.5 rounded-full text-xs font-semibold text-[#0B0B0F]'
                      : 'px-4 py-1.5 rounded-full text-xs font-semibold border border-[rgba(255,255,255,0.12)] text-[#8A8A9A] hover:text-white transition-colors'
                  }
                  style={interval === r ? { backgroundColor: accentColor } : undefined}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]"
        >
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                Sentiment Analysis
              </p>
              <p className="text-sm text-[#8A8A9A]">24h window</p>
            </div>

            <div className="overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
              <div className="flex h-[10px]">
                <div className="bg-[#00FF85]" style={{ width: `${clampedBull}%` }} />
                <div className="bg-[#FF4D4D]" style={{ width: `${bearPercent}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm font-semibold">
              <p className="text-[#00FF85]">{clampedBull}% Bullish</p>
              <p className="text-[#FF4D4D]">{bearPercent}% Bearish</p>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(0,255,133,0.1)] text-[#00FF85]">
                <BoltIcon />
              </div>
              <p className="text-sm text-white">{insightText}</p>
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center gap-4 text-center">
            <button
              type="button"
              onClick={() => (watched ? removeCoin(symbol) : addCoin(symbol))}
              className={
                watched
                  ? 'w-full py-4 rounded-xl text-sm font-semibold bg-[rgba(255,255,255,0.06)] text-[#8A8A9A] border border-[rgba(255,255,255,0.08)] transition-all'
                  : 'w-full py-4 rounded-xl text-sm font-semibold border text-[#00FF85] border-[#00FF85] hover:bg-[rgba(0,255,133,0.08)] transition-all'
              }
            >
              {watched ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
            <p className="text-[12px] text-[#8A8A9A]">
              Get alerts when sentiment flips
            </p>
          </Card>
        </motion.section>
      </main>
    </motion.div>
  )
}
