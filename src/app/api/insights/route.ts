import { NextResponse } from 'next/server'

import type { CoinData, InsightsData } from '@/features/market/types'
import { getMarketSentiment } from '@/shared/utils/sentiment'

function getVolatility(coins: CoinData[]): InsightsData['volatility'] {
  if (coins.length === 0) return 'Low'

  const averageRange =
    coins.reduce(
      (sum, coin) =>
        sum + (coin.price === 0 ? 0 : (coin.high24h - coin.low24h) / coin.price),
      0
    ) /
    coins.length

  if (averageRange < 0.02) return 'Low'
  if (averageRange < 0.05) return 'Moderate'
  return 'High'
}

function getInsightCopy(marketMood: InsightsData['marketMood']): Pick<
  InsightsData,
  'insightHeadline' | 'insightSubtext'
> {
  if (marketMood === 'Bullish') {
    return {
      insightHeadline: 'Broad participation is lifting majors higher',
      insightSubtext: 'Momentum is favoring upside continuation across the tracked market.',
    }
  }

  if (marketMood === 'Bearish') {
    return {
      insightHeadline: 'Selling pressure is dominating the market tape',
      insightSubtext: 'Losses are spreading faster than recoveries across key majors.',
    }
  }

  return {
    insightHeadline: 'The market is range-bound with mixed conviction',
    insightSubtext: 'Buyers and sellers are balanced as traders wait for a stronger catalyst.',
  }
}

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const marketUrl = new URL('/api/market', base).toString()

    const response = await fetch(marketUrl, { cache: 'no-store' })

    if (!response.ok) {
      throw new Error(`Market insights request failed with status ${response.status}`)
    }

    const payload: unknown = await response.json()

    if (!Array.isArray(payload)) {
      throw new Error('Unexpected market payload format for insights')
    }

    const marketData = payload as CoinData[]
    const gainers = marketData.filter((coin) => coin.priceChange > 0).length
    const losers = marketData.filter((coin) => coin.priceChange < 0).length
    const gainersPercent =
      marketData.length === 0 ? 0 : (gainers / marketData.length) * 100
    const marketMood = getMarketSentiment(gainers, losers)
    const topGainers = [...marketData]
      .sort((left, right) => right.priceChange - left.priceChange)
      .slice(0, 3)
    const topLosers = [...marketData]
      .sort((left, right) => left.priceChange - right.priceChange)
      .slice(0, 3)
    const volatility = getVolatility(marketData)
    const { insightHeadline, insightSubtext } = getInsightCopy(marketMood)

    const data: InsightsData = {
      marketMood,
      gainers,
      losers,
      gainersPercent,
      topGainers,
      topLosers,
      volatility,
      insightHeadline,
      insightSubtext,
    }

    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load insights data'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
