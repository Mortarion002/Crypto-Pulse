import type { KlineData } from '@/features/market/types'
import type { NextRequest } from 'next/server'

const SYMBOL_TO_GECKO: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  ADA: 'cardano',
  XRP: 'ripple',
}

// CoinGecko free tier auto-granularity: 1 day = hourly, 2–90 days = daily, 90+ = weekly
const INTERVAL_TO_DAYS: Record<string, number> = {
  '1h': 1,
  '4h': 7,
  '1d': 30,
  '1w': 365,
}

function formatTime(ts: number, interval: string): string {
  const date = new Date(ts)
  if (interval === '1h') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  if (interval === '4h') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface GeckoChart {
  prices: [number, number][]
  total_volumes: [number, number][]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params
  const upperSymbol = symbol.toUpperCase()
  const geckoId = SYMBOL_TO_GECKO[upperSymbol]

  if (!geckoId) {
    return Response.json({ error: 'Unknown symbol' }, { status: 404 })
  }

  const interval = request.nextUrl.searchParams.get('interval') ?? '1d'
  const days = INTERVAL_TO_DAYS[interval] ?? 30

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}&precision=2`
    const res = await fetch(url, { next: { revalidate: 60 } })

    if (!res.ok) {
      return Response.json({ error: 'CoinGecko API error' }, { status: 502 })
    }

    const data: GeckoChart = await res.json()

    const klines: KlineData[] = data.prices.map(([ts, price], i) => ({
      time: formatTime(ts, interval),
      price,
      high: price,
      low: price,
      volume: data.total_volumes[i]?.[1] ?? 0,
    }))

    return Response.json(klines)
  } catch {
    return Response.json({ error: 'Failed to fetch chart data' }, { status: 500 })
  }
}
