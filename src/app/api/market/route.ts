import { NextResponse } from 'next/server'

import type { CoinData } from '@/features/market/types'
import { getSentiment } from '@/shared/utils/sentiment'

interface BinanceTicker24hr {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  quoteVolume: string
}

const COIN_METADATA = {
  BTCUSDT: { displaySymbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  ETHUSDT: { displaySymbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  SOLUSDT: { displaySymbol: 'SOL', name: 'Solana', color: '#14F195' },
  BNBUSDT: { displaySymbol: 'BNB', name: 'BNB', color: '#F3BA2F' },
  ADAUSDT: { displaySymbol: 'ADA', name: 'Cardano', color: '#0033AD' },
  XRPUSDT: { displaySymbol: 'XRP', name: 'XRP', color: '#00AAE4' },
} as const

type SupportedSymbol = keyof typeof COIN_METADATA

const SUPPORTED_SYMBOLS = Object.keys(COIN_METADATA) as SupportedSymbol[]

function isSupportedSymbol(symbol: string): symbol is SupportedSymbol {
  return symbol in COIN_METADATA
}

export async function GET() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Binance market request failed with status ${response.status}`)
    }

    const payload: unknown = await response.json()

    if (!Array.isArray(payload)) {
      throw new Error('Unexpected market response format from Binance')
    }

    const tickers = payload as BinanceTicker24hr[]

    const tickerBySymbol = new Map(
      tickers
        .filter((ticker) => isSupportedSymbol(ticker.symbol))
        .map((ticker) => [ticker.symbol, ticker] as const)
    )

    const data: CoinData[] = SUPPORTED_SYMBOLS.flatMap((symbol) => {
      const ticker = tickerBySymbol.get(symbol)

      if (ticker === undefined) return []

      const metadata = COIN_METADATA[symbol]
      const priceChange = Number.parseFloat(ticker.priceChangePercent)

      return {
        symbol: ticker.symbol,
        displaySymbol: metadata.displaySymbol,
        name: metadata.name,
        price: Number.parseFloat(ticker.lastPrice),
        priceChange,
        high24h: Number.parseFloat(ticker.highPrice),
        low24h: Number.parseFloat(ticker.lowPrice),
        volume: Number.parseFloat(ticker.quoteVolume),
        sentiment: getSentiment(priceChange),
        color: metadata.color,
      }
    })

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=30',
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load market data'

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
