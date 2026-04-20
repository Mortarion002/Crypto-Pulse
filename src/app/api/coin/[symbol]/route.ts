import type { KlineData } from '@/features/market/types'
import type { NextRequest } from 'next/server'

const SYMBOL_MAP: Record<string, string> = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  SOL: 'SOLUSDT',
  BNB: 'BNBUSDT',
  ADA: 'ADAUSDT',
  XRP: 'XRPUSDT',
}

const INTERVAL_MAP: Record<string, { binanceInterval: string; limit: number }> = {
  '1h': { binanceInterval: '1h', limit: 48 },
  '4h': { binanceInterval: '4h', limit: 42 },
  '1d': { binanceInterval: '1d', limit: 30 },
  '1w': { binanceInterval: '1w', limit: 52 },
}

function formatTime(ts: number, interval: string): string {
  const date = new Date(ts)
  if (interval === '1h' || interval === '4h') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  if (interval === '1w') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params
  const upperSymbol = symbol.toUpperCase()
  const binanceSymbol = SYMBOL_MAP[upperSymbol]

  if (!binanceSymbol) {
    return Response.json({ error: 'Unknown symbol' }, { status: 404 })
  }

  const searchParams = request.nextUrl.searchParams
  const interval = searchParams.get('interval') ?? '1d'
  const intervalConfig = INTERVAL_MAP[interval] ?? INTERVAL_MAP['1d']

  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${intervalConfig.binanceInterval}&limit=${intervalConfig.limit}`
    const res = await fetch(url, { next: { revalidate: 60 } })

    if (!res.ok) {
      return Response.json({ error: 'Binance API error' }, { status: 502 })
    }

    const raw: [number, string, string, string, string, string][] = await res.json()

    const klines: KlineData[] = raw.map((k) => ({
      time: formatTime(k[0], interval),
      price: parseFloat(k[4]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      volume: parseFloat(k[5]),
    }))

    return Response.json(klines)
  } catch {
    return Response.json({ error: 'Failed to fetch kline data' }, { status: 500 })
  }
}
