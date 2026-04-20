import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import type { KlineData } from '@/features/market/types'

type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
]

function normalizeSymbol(symbol: string): string {
  const uppercased = symbol.toUpperCase()
  return uppercased.endsWith('USDT') ? uppercased : `${uppercased}USDT`
}

function parseLimit(limitValue: string | null): number {
  if (limitValue === null) return 100

  const parsed = Number.parseInt(limitValue, 10)

  if (Number.isNaN(parsed)) return 100

  return Math.min(Math.max(parsed, 1), 1000)
}

function formatKlineTime(timestamp: number, interval: string): string {
  const date = new Date(timestamp)

  if (interval.endsWith('m') || interval.endsWith('h')) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  if (interval.endsWith('d') || interval.endsWith('w')) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol: routeSymbol } = await params
    const interval = request.nextUrl.searchParams.get('interval') ?? '1h'
    const limit = parseLimit(request.nextUrl.searchParams.get('limit'))
    const symbol = normalizeSymbol(routeSymbol)

    const searchParams = new URLSearchParams({
      symbol,
      interval,
      limit: String(limit),
    })

    const response = await fetch(
      `https://api.binance.com/api/v3/klines?${searchParams.toString()}`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`Binance coin request failed with status ${response.status}`)
    }

    const payload: unknown = await response.json()

    if (!Array.isArray(payload)) {
      throw new Error('Unexpected kline response format from Binance')
    }

    const klines = payload as BinanceKline[]

    const data: KlineData[] = klines.map((kline) => ({
      time: formatKlineTime(kline[0], interval),
      price: Number.parseFloat(kline[4]),
      high: Number.parseFloat(kline[2]),
      low: Number.parseFloat(kline[3]),
      volume: Number.parseFloat(kline[5]),
    }))

    return NextResponse.json(data)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load coin data'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
