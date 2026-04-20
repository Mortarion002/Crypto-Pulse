'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import type { CoinData } from '@/features/market/types'
import Card from '@/shared/components/Card'
import TrendBadge from '@/shared/components/TrendBadge'
import { getCoinBadgeClass } from '@/shared/utils/coinColors'
import { formatChange, formatPrice } from '@/shared/utils/format'

const MOCK_COINS: CoinData[] = [
  {
    symbol: 'BTCUSDT',
    displaySymbol: 'BTC',
    name: 'Bitcoin',
    color: '#F7931A',
    price: 67420.5,
    priceChange: 3.24,
    high24h: 68100,
    low24h: 65200,
    volume: 2100000000,
    sentiment: 'Bullish',
  },
  {
    symbol: 'ETHUSDT',
    displaySymbol: 'ETH',
    name: 'Ethereum',
    color: '#627EEA',
    price: 3842.18,
    priceChange: 2.17,
    high24h: 3925,
    low24h: 3710,
    volume: 1320000000,
    sentiment: 'Bullish',
  },
  {
    symbol: 'SOLUSDT',
    displaySymbol: 'SOL',
    name: 'Solana',
    color: '#14F195',
    price: 178.65,
    priceChange: 5.48,
    high24h: 182.2,
    low24h: 166.7,
    volume: 820000000,
    sentiment: 'Bullish',
  },
  {
    symbol: 'BNBUSDT',
    displaySymbol: 'BNB',
    name: 'BNB',
    color: '#F3BA2F',
    price: 612.4,
    priceChange: 0.14,
    high24h: 618.4,
    low24h: 606.1,
    volume: 475000000,
    sentiment: 'Neutral',
  },
  {
    symbol: 'ADAUSDT',
    displaySymbol: 'ADA',
    name: 'Cardano',
    color: '#0033AD',
    price: 0.6782,
    priceChange: -1.82,
    high24h: 0.7041,
    low24h: 0.6642,
    volume: 190000000,
    sentiment: 'Bearish',
  },
  {
    symbol: 'XRPUSDT',
    displaySymbol: 'XRP',
    name: 'XRP',
    color: '#00AAE4',
    price: 0.5421,
    priceChange: 4.11,
    high24h: 0.5562,
    low24h: 0.5218,
    volume: 265000000,
    sentiment: 'Bullish',
  },
]

const MOCK_MOOD = { mood: 'Bullish' as const, gainers: 14, losers: 6, total: 20 }

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

export default function MarketPulsePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-8">
        <Card className="overflow-hidden bg-[radial-gradient(900px_300px_at_0%_50%,rgba(0,255,133,0.14),transparent_70%)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-2xl flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF85]" />
                Live
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold uppercase tracking-tight text-[#00FF85] sm:text-5xl">
                  {MOCK_MOOD.mood} Market
                </h1>
                <p className="text-base text-[#8A8A9A]">
                  {MOCK_MOOD.gainers} of {MOCK_MOOD.total} coins trending up
                </p>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                  Gainers
                </p>
                <p className="mt-2 text-2xl font-bold text-[#00FF85]">
                  {MOCK_MOOD.gainers}
                </p>
              </div>
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#8A8A9A]">
                  Losers
                </p>
                <p className="mt-2 text-2xl font-bold text-[#FF4D4D]">
                  {MOCK_MOOD.losers}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <div className="h-3 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
              <div className="h-full w-[70%] rounded-full bg-[#00FF85]" />
            </div>
            <p className="text-sm text-[#8A8A9A]">
              70% breadth - broad participation
            </p>
          </div>
        </Card>

        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[20px] font-semibold text-white">Top Coins</h2>
          <div className="inline-flex items-center gap-2 text-[12px] text-[#8A8A9A]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF85]" />
            Updated 30s ago
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_COINS.map((coin) => (
            <Link key={coin.displaySymbol} href={`/coin/${coin.displaySymbol}`}>
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
          ))}
        </section>
      </main>
    </motion.div>
  )
}
