'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

import type { Sentiment } from '@/features/market/types'
import { getCoinBadgeClass } from '@/shared/utils/coinColors'
import { formatChange, formatPrice } from '@/shared/utils/format'

const MOCK_WATCHLIST = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    color: '#F7931A',
    price: 67420.5,
    priceChange: 3.24,
    sentiment: 'Bullish' as const,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    color: '#627EEA',
    price: 3842.18,
    priceChange: 2.17,
    sentiment: 'Bullish' as const,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    color: '#14F195',
    price: 178.65,
    priceChange: 5.48,
    sentiment: 'Bullish' as const,
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    color: '#0033AD',
    price: 0.6782,
    priceChange: -1.82,
    sentiment: 'Bearish' as const,
  },
]

function getSentimentTone(sentiment: Sentiment): string {
  if (sentiment === 'Bullish') return 'text-[#00FF85]'
  if (sentiment === 'Bearish') return 'text-[#FF4D4D]'
  return 'text-[#9B6DFF]'
}

function getArrow(value: number): string {
  return value >= 0 ? '↑' : '↓'
}

export default function WatchlistPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="mx-auto flex max-w-[900px] flex-col gap-8 px-6 py-12">
        <section className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-white">Watchlist</h1>
          <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] px-3 py-1.5 text-[12px] font-semibold text-[#8A8A9A]">
            4 coins
          </span>
        </section>

        <div className="flex flex-col">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_0.7fr] gap-5 px-6 pb-4 text-[12px] uppercase tracking-[0.22em] text-[#8A8A9A]">
            <span>Coin</span>
            <span className="text-right">Price</span>
            <span className="text-right">24H Change</span>
            <span className="text-right">Action</span>
          </div>
          <div className="border-b border-[rgba(255,255,255,0.06)]" />

          {MOCK_WATCHLIST.map((coin) => (
            <Link
              key={coin.symbol}
              href={`/coin/${coin.symbol}`}
              className="grid h-[72px] grid-cols-[1.6fr_1fr_1fr_0.7fr] items-center gap-5 border-b border-[rgba(255,255,255,0.06)] px-6 transition-colors hover:bg-[rgba(255,255,255,0.03)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${getCoinBadgeClass(
                    coin.symbol
                  )}`}
                >
                  {coin.symbol.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{coin.name}</p>
                  <p className="text-xs text-[#8A8A9A]">{coin.symbol}</p>
                </div>
              </div>

              <div className="text-right font-mono text-lg font-bold text-white">
                {formatPrice(coin.price)}
              </div>

              <div
                className={`text-right text-sm font-semibold ${getSentimentTone(coin.sentiment)}`}
              >
                {formatChange(coin.priceChange)} {getArrow(coin.priceChange)}
              </div>

              <div className="text-right text-sm text-[#8A8A9A] transition-colors hover:text-[#FF4D4D]">
                Remove
              </div>
            </Link>
          ))}

          {/*
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#8A8A9A]">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" aria-hidden="true">
                <path d="M7 4h10a2 2 0 0 1 2 2v14l-7-4-7 4V6a2 2 0 0 1 2-2Z" strokeWidth="1.6" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white">No coins added yet</p>
              <p className="text-sm text-[#8A8A9A]">Browse the Market to add coins</p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-[rgba(255,255,255,0.12)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[rgba(255,255,255,0.04)]"
            >
              Go to Market
            </Link>
          </div>
          */}
        </div>
      </main>
    </motion.div>
  )
}
